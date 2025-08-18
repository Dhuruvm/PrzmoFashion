import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { 
  adminLogin, 
  adminLogout, 
  requireAdminAuth, 
  getAdminInfo, 
  getAdminStats,
  adminSessionStore
} from './admin-auth';

const router = Router();

// Strict rate limiting for admin login
const adminLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per IP per window
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful logins toward limit
});

// General admin API rate limiting
const adminApiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per window for authenticated admin
  message: {
    success: false,
    message: 'API rate limit exceeded',
    code: 'API_RATE_LIMIT'
  }
});

// Validation middleware
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 1 })
    .withMessage('Password is required')
];

const handleValidationErrors = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }
  next();
};

/**
 * POST /api/admin/login
 * Admin login endpoint
 */
router.post('/login', 
  adminLoginRateLimit,
  validateLogin,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      const result = await adminLogin(email, password, ipAddress, userAgent);

      if (result.success && result.token) {
        // Set secure HTTP-only cookie
        res.cookie('adminToken', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Log successful admin login
        console.log(`🔐 Admin login successful: ${email} from ${ipAddress}`);

        res.status(200).json({
          success: true,
          message: result.message,
          token: result.token,
          admin: {
            email: email,
            domain: 'przmo.official',
            role: 'admin'
          }
        });
      } else {
        // Log failed admin login attempt
        console.warn(`🚨 Admin login failed: ${email} from ${ipAddress} - ${result.message}`);

        res.status(401).json({
          success: false,
          message: result.message,
          code: 'LOGIN_FAILED',
          remainingAttempts: result.remainingAttempts
        });
      }
    } catch (error) {
      console.error('Admin login endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during login',
        code: 'SERVER_ERROR'
      });
    }
  }
);

/**
 * POST /api/admin/logout
 * Admin logout endpoint
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.cookies?.adminToken ||
                  req.headers['x-admin-token'] as string;

    if (token) {
      await adminLogout(token);
    }

    // Clear cookie
    res.clearCookie('adminToken');

    console.log('🔓 Admin logout successful');

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Admin logout endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

/**
 * GET /api/admin/me
 * Get current admin session info
 */
router.get('/me', 
  requireAdminAuth,
  adminApiRateLimit,
  async (req: Request, res: Response) => {
    try {
      const token = (req as any).admin.token;
      const result = await getAdminInfo(token);

      if (result.success) {
        res.status(200).json({
          success: true,
          admin: result.admin,
          message: result.message
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.message,
          code: 'SESSION_INVALID'
        });
      }
    } catch (error) {
      console.error('Admin info endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin info',
        code: 'SERVER_ERROR'
      });
    }
  }
);

/**
 * GET /api/admin/stats
 * Get admin statistics and system info
 */
router.get('/stats',
  requireAdminAuth,
  adminApiRateLimit,
  async (req: Request, res: Response) => {
    try {
      const result = await getAdminStats();

      if (result.success) {
        // Add additional system stats
        const systemStats = {
          ...result.stats,
          nodeVersion: process.version,
          platform: process.platform,
          memoryUsage: process.memoryUsage(),
          timestamp: new Date().toISOString()
        };

        res.status(200).json({
          success: true,
          stats: systemStats,
          message: result.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: result.message,
          code: 'STATS_ERROR'
        });
      }
    } catch (error) {
      console.error('Admin stats endpoint error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin statistics',
        code: 'SERVER_ERROR'
      });
    }
  }
);

/**
 * POST /api/admin/verify-token
 * Verify admin token validity
 */
router.post('/verify-token',
  adminApiRateLimit,
  async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '') || 
                    req.cookies?.adminToken ||
                    req.headers['x-admin-token'] as string ||
                    req.body.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided',
          code: 'NO_TOKEN'
        });
      }

      const isValid = await adminSessionStore.isSessionValid(token);

      if (isValid) {
        const result = await getAdminInfo(token);
        res.status(200).json({
          success: true,
          valid: true,
          admin: result.admin,
          message: 'Token is valid'
        });
      } else {
        res.status(401).json({
          success: false,
          valid: false,
          message: 'Token is invalid or expired',
          code: 'INVALID_TOKEN'
        });
      }
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(500).json({
        success: false,
        valid: false,
        message: 'Token verification failed',
        code: 'VERIFICATION_ERROR'
      });
    }
  }
);

/**
 * GET /api/admin/health
 * Admin health check (requires authentication)
 */
router.get('/health',
  requireAdminAuth,
  (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: 'Admin system is healthy',
      timestamp: new Date().toISOString(),
      admin: (req as any).admin.email,
      uptime: process.uptime()
    });
  }
);

export { router as adminRouter };
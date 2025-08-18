import { Router, Request, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { secureSMTPServer, SMTPConfig, EmailOptions, AuthCredentials } from './smtp-server';
import { requireAdminAuth } from './admin-auth';

const router = Router();

// Rate limiting for SMTP API endpoints
const smtpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many SMTP requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin rate limiting (more restrictive)
const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 admin requests per windowMs
  message: 'Too many admin requests from this IP, please try again later',
});

// Validation middleware
const validateSMTPConfig = [
  body('host').isString().notEmpty().withMessage('SMTP host is required'),
  body('port').isInt({ min: 1, max: 65535 }).withMessage('Port must be between 1-65535'),
  body('secure').isBoolean().withMessage('Secure must be boolean'),
  body('auth.user').isEmail().withMessage('SMTP user must be valid email'),
  body('auth.pass').isString().isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('pool').optional().isBoolean(),
  body('maxConnections').optional().isInt({ min: 1, max: 50 }),
  body('maxMessages').optional().isInt({ min: 1, max: 1000 })
];

const validateEmail = [
  body('to').custom((value) => {
    if (typeof value === 'string') {
      if (!value.includes('@')) throw new Error('Invalid recipient email');
      return true;
    }
    if (Array.isArray(value)) {
      if (value.length === 0) throw new Error('At least one recipient required');
      value.forEach(email => {
        if (!email.includes('@')) throw new Error(`Invalid recipient email: ${email}`);
      });
      return true;
    }
    throw new Error('Recipients must be string or array of strings');
  }),
  body('from').isEmail().withMessage('From must be valid email'),
  body('subject').isString().isLength({ min: 1, max: 200 }).withMessage('Subject required (1-200 chars)'),
  body('text').optional().isString(),
  body('html').optional().isString(),
  body('cc').optional().custom((value) => {
    if (typeof value === 'string' && !value.includes('@')) {
      throw new Error('Invalid CC email');
    }
    if (Array.isArray(value)) {
      value.forEach(email => {
        if (!email.includes('@')) throw new Error(`Invalid CC email: ${email}`);
      });
    }
    return true;
  }),
  body('bcc').optional().custom((value) => {
    if (typeof value === 'string' && !value.includes('@')) {
      throw new Error('Invalid BCC email');
    }
    if (Array.isArray(value)) {
      value.forEach(email => {
        if (!email.includes('@')) throw new Error(`Invalid BCC email: ${email}`);
      });
    }
    return true;
  })
];

const validateAuth = [
  body('apiKey').isString().isLength({ min: 32 }).withMessage('API key must be at least 32 characters'),
  body('domain').isString().notEmpty().withMessage('Domain is required')
];

// Middleware to check validation errors
const handleValidationErrors = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * POST /api/smtp/configure
 * Configure SMTP server settings
 */
router.post('/configure', 
  requireAdminAuth,
  adminRateLimit,
  validateSMTPConfig,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const config: SMTPConfig = req.body;
      const result = await secureSMTPServer.configure(config);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('SMTP configuration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during SMTP configuration'
      });
    }
  }
);

/**
 * POST /api/smtp/send
 * Send email through secure SMTP server
 */
router.post('/send',
  smtpRateLimit,
  [...validateEmail, ...validateAuth],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { apiKey, domain, ...emailData } = req.body;
      
      // Ensure either text or html is provided
      if (!emailData.text && !emailData.html) {
        return res.status(400).json({
          success: false,
          message: 'Either text or html content is required'
        });
      }

      const credentials: AuthCredentials = { apiKey, domain };
      const email: EmailOptions = emailData;
      
      const result = await secureSMTPServer.sendEmail(email, credentials);
      
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      console.error('Email sending error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during email sending'
      });
    }
  }
);

/**
 * POST /api/smtp/generate-key
 * Generate new API key for domain
 */
router.post('/generate-key',
  requireAdminAuth,
  adminRateLimit,
  [body('domain').isString().notEmpty().withMessage('Domain is required')],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { domain } = req.body;
      const result = await secureSMTPServer.generateAPIKey(domain);
      
      res.status(200).json({
        success: true,
        message: 'API key generated successfully',
        data: result
      });
    } catch (error) {
      console.error('API key generation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate API key'
      });
    }
  }
);

/**
 * GET /api/smtp/status
 * Get SMTP server status and statistics
 */
router.get('/status', (req, res) => {
  try {
    const status = secureSMTPServer.getStatus();
    res.status(200).json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Status retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve status'
    });
  }
});

/**
 * GET /api/smtp/keys
 * List all API keys (admin only)
 */
router.get('/keys',
  requireAdminAuth,
  adminRateLimit,
  (req: Request, res: Response) => {
    try {
      const keys = secureSMTPServer.listAPIKeys();
      res.status(200).json({
        success: true,
        data: keys
      });
    } catch (error) {
      console.error('Keys listing error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to list API keys'
      });
    }
  }
);

/**
 * DELETE /api/smtp/keys/:keyId
 * Revoke API key
 */
router.delete('/keys/:keyId',
  requireAdminAuth,
  adminRateLimit,
  (req: Request, res: Response) => {
    try {
      const { keyId } = req.params;
      const success = secureSMTPServer.revokeAPIKey(keyId);
      
      res.status(success ? 200 : 404).json({
        success,
        message: success ? 'API key revoked successfully' : 'API key not found'
      });
    } catch (error) {
      console.error('Key revocation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to revoke API key'
      });
    }
  }
);

/**
 * POST /api/smtp/test
 * Test SMTP configuration with a test email
 */
router.post('/test',
  requireAdminAuth,
  adminRateLimit,
  [
    body('testEmail').isEmail().withMessage('Test email must be valid'),
    ...validateAuth
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { testEmail, apiKey, domain } = req.body;
      
      const testEmailData: EmailOptions = {
        to: testEmail,
        from: testEmail, // Using same email for testing
        subject: 'PRZMO SMTP Server Test',
        text: 'This is a test email from PRZMO Secure SMTP Server. If you receive this, the configuration is working correctly.',
        html: `
          <h2>PRZMO SMTP Server Test</h2>
          <p>This is a test email from <strong>PRZMO Secure SMTP Server</strong>.</p>
          <p>If you receive this email, your SMTP configuration is working correctly!</p>
          <hr>
          <p><small>Sent at: ${new Date().toISOString()}</small></p>
        `
      };

      const credentials: AuthCredentials = { apiKey, domain };
      const result = await secureSMTPServer.sendEmail(testEmailData, credentials);
      
      res.status(result.success ? 200 : 400).json({
        ...result,
        message: result.success ? 'Test email sent successfully' : result.message
      });
    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test email'
      });
    }
  }
);

export { router as smtpRouter };
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Admin credentials configuration
const ADMIN_CONFIG = {
  email: 'przmo.official@gmail.com',
  password: 'Dhuruv099', // This will be hashed
  domain: 'przmo.official'
};

// In-memory admin session store (in production, use Redis or database)
class AdminSessionStore {
  private sessions = new Map<string, {
    email: string;
    loginTime: Date;
    lastActivity: Date;
    ipAddress: string;
    userAgent: string;
  }>();

  private loginAttempts = new Map<string, {
    attempts: number;
    lastAttempt: Date;
    blocked: boolean;
  }>();

  private readonly MAX_ATTEMPTS = 5;
  private readonly BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  async addSession(token: string, email: string, ipAddress: string, userAgent: string) {
    this.sessions.set(token, {
      email,
      loginTime: new Date(),
      lastActivity: new Date(),
      ipAddress,
      userAgent
    });
  }

  async getSession(token: string) {
    return this.sessions.get(token);
  }

  async updateActivity(token: string) {
    const session = this.sessions.get(token);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  async removeSession(token: string) {
    return this.sessions.delete(token);
  }

  async isSessionValid(token: string): Promise<boolean> {
    const session = this.sessions.get(token);
    if (!session) return false;

    // Check session timeout
    const now = new Date().getTime();
    const lastActivity = session.lastActivity.getTime();
    
    if (now - lastActivity > this.SESSION_TIMEOUT) {
      this.sessions.delete(token);
      return false;
    }

    return true;
  }

  async recordFailedAttempt(identifier: string) {
    const now = new Date();
    let attemptRecord = this.loginAttempts.get(identifier);

    if (!attemptRecord) {
      attemptRecord = { attempts: 0, lastAttempt: now, blocked: false };
      this.loginAttempts.set(identifier, attemptRecord);
    }

    // Reset attempts if last attempt was more than block duration ago
    if (now.getTime() - attemptRecord.lastAttempt.getTime() > this.BLOCK_DURATION) {
      attemptRecord.attempts = 0;
      attemptRecord.blocked = false;
    }

    attemptRecord.attempts++;
    attemptRecord.lastAttempt = now;

    if (attemptRecord.attempts >= this.MAX_ATTEMPTS) {
      attemptRecord.blocked = true;
    }
  }

  async isBlocked(identifier: string): Promise<boolean> {
    const attemptRecord = this.loginAttempts.get(identifier);
    if (!attemptRecord) return false;

    if (attemptRecord.blocked) {
      const now = new Date();
      // Check if block period has expired
      if (now.getTime() - attemptRecord.lastAttempt.getTime() > this.BLOCK_DURATION) {
        attemptRecord.blocked = false;
        attemptRecord.attempts = 0;
        return false;
      }
      return true;
    }

    return false;
  }

  async clearFailedAttempts(identifier: string) {
    this.loginAttempts.delete(identifier);
  }

  async getActiveSessions() {
    const now = new Date();
    const activeSessions: Array<{
      token: string;
      email: string;
      loginTime: Date;
      lastActivity: Date;
      ipAddress: string;
      isExpired: boolean;
    }> = [];

    for (const [token, session] of Array.from(this.sessions.entries())) {
      const isExpired = now.getTime() - session.lastActivity.getTime() > this.SESSION_TIMEOUT;
      activeSessions.push({
        token: token.substring(0, 10) + '...', // Partial token for security
        email: session.email,
        loginTime: session.loginTime,
        lastActivity: session.lastActivity,
        ipAddress: session.ipAddress,
        isExpired
      });

      // Clean up expired sessions
      if (isExpired) {
        this.sessions.delete(token);
      }
    }

    return activeSessions;
  }
}

// Global admin session store
export const adminSessionStore = new AdminSessionStore();

// Initialize admin password hash on startup
let adminPasswordHash: string;
(async () => {
  adminPasswordHash = await bcrypt.hash(ADMIN_CONFIG.password, 12);
})();

/**
 * Admin login endpoint
 */
export async function adminLogin(email: string, password: string, ipAddress: string, userAgent: string): Promise<{
  success: boolean;
  token?: string;
  message: string;
  remainingAttempts?: number;
}> {
  try {
    const identifier = ipAddress; // Use IP for rate limiting

    // Check if IP is blocked
    if (await adminSessionStore.isBlocked(identifier)) {
      return {
        success: false,
        message: 'Too many failed login attempts. Please try again in 15 minutes.'
      };
    }

    // Validate credentials
    if (email !== ADMIN_CONFIG.email) {
      await adminSessionStore.recordFailedAttempt(identifier);
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    if (!isValidPassword) {
      await adminSessionStore.recordFailedAttempt(identifier);
      return {
        success: false,
        message: 'Invalid credentials'
      };
    }

    // Clear failed attempts on successful login
    await adminSessionStore.clearFailedAttempts(identifier);

    // Generate JWT token
    const token = jwt.sign(
      {
        email: ADMIN_CONFIG.email,
        domain: ADMIN_CONFIG.domain,
        role: 'admin',
        timestamp: Date.now()
      },
      process.env.JWT_SECRET || 'fallback_secret_change_in_production',
      { expiresIn: '24h' }
    );

    // Store session
    await adminSessionStore.addSession(token, email, ipAddress, userAgent);

    return {
      success: true,
      token,
      message: 'Login successful'
    };

  } catch (error) {
    console.error('Admin login error:', error);
    return {
      success: false,
      message: 'Login failed due to server error'
    };
  }
}

/**
 * Admin logout endpoint
 */
export async function adminLogout(token: string): Promise<{ success: boolean; message: string }> {
  try {
    await adminSessionStore.removeSession(token);
    return {
      success: true,
      message: 'Logout successful'
    };
  } catch (error) {
    console.error('Admin logout error:', error);
    return {
      success: false,
      message: 'Logout failed'
    };
  }
}

/**
 * Middleware to verify admin authentication
 */
export const requireAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.cookies?.adminToken ||
                  req.headers['x-admin-token'] as string;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required',
        code: 'NO_TOKEN'
      });
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_change_in_production');
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired admin token',
        code: 'INVALID_TOKEN'
      });
    }

    // Check if session is still valid
    if (!(await adminSessionStore.isSessionValid(token))) {
      return res.status(401).json({
        success: false,
        message: 'Admin session expired',
        code: 'SESSION_EXPIRED'
      });
    }

    // Verify admin credentials
    if (decoded.email !== ADMIN_CONFIG.email || decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Insufficient admin privileges',
        code: 'INSUFFICIENT_PRIVILEGES'
      });
    }

    // Update session activity
    await adminSessionStore.updateActivity(token);

    // Add admin info to request
    (req as any).admin = {
      email: decoded.email,
      domain: decoded.domain,
      role: decoded.role,
      token
    };

    next();
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication verification failed',
      code: 'AUTH_ERROR'
    });
  }
};

/**
 * Get admin session info
 */
export async function getAdminInfo(token: string): Promise<{
  success: boolean;
  admin?: {
    email: string;
    domain: string;
    loginTime: Date;
    lastActivity: Date;
    ipAddress: string;
  };
  message: string;
}> {
  try {
    const session = await adminSessionStore.getSession(token);
    if (!session) {
      return {
        success: false,
        message: 'Session not found'
      };
    }

    if (!(await adminSessionStore.isSessionValid(token))) {
      return {
        success: false,
        message: 'Session expired'
      };
    }

    return {
      success: true,
      admin: {
        email: session.email,
        domain: ADMIN_CONFIG.domain,
        loginTime: session.loginTime,
        lastActivity: session.lastActivity,
        ipAddress: session.ipAddress
      },
      message: 'Admin info retrieved successfully'
    };
  } catch (error) {
    console.error('Get admin info error:', error);
    return {
      success: false,
      message: 'Failed to retrieve admin info'
    };
  }
}

/**
 * Get admin statistics
 */
export async function getAdminStats(): Promise<{
  success: boolean;
  stats?: {
    totalSessions: number;
    activeSessions: Array<any>;
    loginAttempts: number;
    serverUptime: number;
  };
  message: string;
}> {
  try {
    const activeSessions = await adminSessionStore.getActiveSessions();
    
    return {
      success: true,
      stats: {
        totalSessions: activeSessions.length,
        activeSessions,
        loginAttempts: 0, // Could be enhanced to track this
        serverUptime: process.uptime()
      },
      message: 'Admin statistics retrieved successfully'
    };
  } catch (error) {
    console.error('Get admin stats error:', error);
    return {
      success: false,
      message: 'Failed to retrieve admin statistics'
    };
  }
}
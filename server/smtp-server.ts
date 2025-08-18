import nodemailer from 'nodemailer';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

// Configuration schema for SMTP settings
const SMTPConfigSchema = z.object({
  host: z.string().min(1, 'SMTP host is required'),
  port: z.number().min(1).max(65535),
  secure: z.boolean(),
  auth: z.object({
    user: z.string().email('Invalid email format for SMTP user'),
    pass: z.string().min(8, 'SMTP password must be at least 8 characters')
  }),
  pool: z.boolean().optional().default(true),
  maxConnections: z.number().min(1).max(50).optional().default(5),
  maxMessages: z.number().min(1).max(1000).optional().default(100)
});

// Email schema with comprehensive validation
const EmailSchema = z.object({
  to: z.union([
    z.string().email('Invalid recipient email'),
    z.array(z.string().email('Invalid recipient email')).min(1)
  ]),
  from: z.string().email('Invalid sender email'),
  subject: z.string().min(1).max(200, 'Subject must be between 1-200 characters'),
  text: z.string().optional(),
  html: z.string().optional(),
  cc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
  bcc: z.union([z.string().email(), z.array(z.string().email())]).optional(),
  attachments: z.array(z.object({
    filename: z.string(),
    path: z.string().optional(),
    content: z.any().optional()
  })).optional()
}).refine(data => data.text || data.html, {
  message: 'Either text or html content is required'
});

// Authentication schema
const AuthSchema = z.object({
  apiKey: z.string().min(32, 'API key must be at least 32 characters'),
  domain: z.string().min(1, 'Domain is required')
});

export interface SMTPConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  pool?: boolean;
  maxConnections?: number;
  maxMessages?: number;
}

export interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: any;
  }>;
}

export interface AuthCredentials {
  apiKey: string;
  domain: string;
}

class SecureSMTPServer {
  private transporter: nodemailer.Transporter | null = null;
  private config: SMTPConfig | null = null;
  private isConnected = false;
  
  // Rate limiting: 100 emails per hour per API key
  private rateLimiter = new RateLimiterMemory({
    keyPrefix: 'smtp_rate_limit',
    points: 100, // Number of emails
    duration: 3600, // Per hour
  });
  
  // Burst protection: max 10 emails per minute
  private burstLimiter = new RateLimiterMemory({
    keyPrefix: 'smtp_burst_limit',
    points: 10, // Number of emails
    duration: 60, // Per minute
  });
  
  // Store authorized API keys (in production, use database)
  private authorizedKeys = new Map<string, {
    domain: string;
    hashedKey: string;
    createdAt: Date;
    lastUsed: Date;
    emailCount: number;
  }>();

  constructor() {
    this.initializeDefaultConfig();
  }

  private initializeDefaultConfig(): void {
    // Default configuration for common SMTP providers
    const defaultConfigs = {
      gmail: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: '', pass: '' }
      },
      outlook: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: { user: '', pass: '' }
      },
      yahoo: {
        host: 'smtp.mail.yahoo.com',
        port: 587,
        secure: false,
        auth: { user: '', pass: '' }
      }
    };
  }

  /**
   * Configure SMTP server with validation
   */
  async configure(config: SMTPConfig): Promise<{ success: boolean; message: string }> {
    try {
      // Validate configuration
      const validatedConfig = SMTPConfigSchema.parse(config);
      
      // Create transporter with security features
      this.transporter = nodemailer.createTransport({
        host: validatedConfig.host,
        port: validatedConfig.port,
        secure: validatedConfig.secure,
        auth: validatedConfig.auth,
        pool: validatedConfig.pool,
        maxConnections: validatedConfig.maxConnections,
        maxMessages: validatedConfig.maxMessages,
        // Security options
        requireTLS: true,
        tls: {
          rejectUnauthorized: true
        },
        // Connection timeout
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 30000
      } as any);

      // Test connection
      await this.testConnection();
      
      this.config = validatedConfig;
      this.isConnected = true;
      
      return { success: true, message: 'SMTP server configured successfully' };
    } catch (error) {
      console.error('SMTP Configuration Error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Configuration failed' 
      };
    }
  }

  /**
   * Test SMTP connection
   */
  private async testConnection(): Promise<void> {
    if (!this.transporter) {
      throw new Error('SMTP transporter not configured');
    }

    try {
      await this.transporter.verify();
    } catch (error) {
      throw new Error(`SMTP connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate secure API key for authentication
   */
  async generateAPIKey(domain: string): Promise<{ apiKey: string; keyId: string }> {
    const keyId = `smtp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const apiKey = jwt.sign({ keyId, domain, timestamp: Date.now() }, 
      process.env.JWT_SECRET || 'fallback_secret_change_in_production', 
      { expiresIn: '1y' }
    );
    
    const hashedKey = await bcrypt.hash(apiKey, 12);
    
    this.authorizedKeys.set(keyId, {
      domain,
      hashedKey,
      createdAt: new Date(),
      lastUsed: new Date(),
      emailCount: 0
    });

    return { apiKey, keyId };
  }

  /**
   * Authenticate API request
   */
  private async authenticateRequest(credentials: AuthCredentials): Promise<{ valid: boolean; keyId?: string }> {
    try {
      const validatedCreds = AuthSchema.parse(credentials);
      
      // Verify JWT token structure
      const decoded = jwt.verify(
        validatedCreds.apiKey, 
        process.env.JWT_SECRET || 'fallback_secret_change_in_production'
      ) as any;
      
      const keyData = this.authorizedKeys.get(decoded.keyId);
      if (!keyData) {
        return { valid: false };
      }

      // Verify domain matches
      if (keyData.domain !== validatedCreds.domain) {
        return { valid: false };
      }

      // Update last used timestamp
      keyData.lastUsed = new Date();
      
      return { valid: true, keyId: decoded.keyId };
    } catch (error) {
      console.error('Authentication failed:', error);
      return { valid: false };
    }
  }

  /**
   * Sanitize and validate email content
   */
  private sanitizeEmail(email: EmailOptions): EmailOptions {
    const sanitized = { ...email };
    
    // Sanitize HTML content
    if (sanitized.html) {
      // Remove potentially dangerous HTML tags and attributes
      sanitized.html = sanitized.html
        .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
        .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/javascript:/gi, '');
    }

    // Sanitize subject line
    sanitized.subject = sanitized.subject
      .replace(/[\r\n]/g, '')
      .trim()
      .substring(0, 200);

    return sanitized;
  }

  /**
   * Send email with comprehensive security and validation
   */
  async sendEmail(
    email: EmailOptions, 
    credentials: AuthCredentials
  ): Promise<{ success: boolean; messageId?: string; message: string }> {
    try {
      // Check if server is configured
      if (!this.isConnected || !this.transporter) {
        return { success: false, message: 'SMTP server not configured' };
      }

      // Authenticate request
      const auth = await this.authenticateRequest(credentials);
      if (!auth.valid) {
        return { success: false, message: 'Authentication failed' };
      }

      // Apply rate limiting
      try {
        await this.rateLimiter.consume(credentials.apiKey);
        await this.burstLimiter.consume(credentials.apiKey);
      } catch (rateLimitError) {
        return { success: false, message: 'Rate limit exceeded. Please try again later.' };
      }

      // Validate email data
      const validatedEmail = EmailSchema.parse(email);
      
      // Sanitize email content
      const sanitizedEmail = this.sanitizeEmail(validatedEmail);

      // Additional security checks
      const recipients = Array.isArray(sanitizedEmail.to) ? sanitizedEmail.to : [sanitizedEmail.to];
      for (const recipient of recipients) {
        if (!validator.isEmail(recipient)) {
          return { success: false, message: `Invalid recipient email: ${recipient}` };
        }
      }

      // Send email
      const info = await this.transporter.sendMail({
        from: sanitizedEmail.from,
        to: sanitizedEmail.to,
        cc: sanitizedEmail.cc,
        bcc: sanitizedEmail.bcc,
        subject: sanitizedEmail.subject,
        text: sanitizedEmail.text,
        html: sanitizedEmail.html,
        attachments: sanitizedEmail.attachments,
        // Security headers
        headers: {
          'X-Mailer': 'PRZMO Secure SMTP v1.0',
          'X-Priority': '3',
        }
      });

      // Update statistics
      if (auth.keyId) {
        const keyData = this.authorizedKeys.get(auth.keyId);
        if (keyData) {
          keyData.emailCount++;
        }
      }

      return { 
        success: true, 
        messageId: info.messageId,
        message: 'Email sent successfully' 
      };

    } catch (error) {
      console.error('Email sending error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to send email' 
      };
    }
  }

  /**
   * Get server status and statistics
   */
  getStatus(): {
    isConnected: boolean;
    config: Partial<SMTPConfig> | null;
    stats: {
      totalKeys: number;
      totalEmailsSent: number;
    };
  } {
    const stats = {
      totalKeys: this.authorizedKeys.size,
      totalEmailsSent: Array.from(this.authorizedKeys.values())
        .reduce((total, key) => total + key.emailCount, 0)
    };

    return {
      isConnected: this.isConnected,
      config: this.config ? {
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure
      } : null,
      stats
    };
  }

  /**
   * Disconnect from SMTP server
   */
  async disconnect(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.transporter = null;
    }
    this.isConnected = false;
  }

  /**
   * Revoke API key
   */
  revokeAPIKey(keyId: string): boolean {
    return this.authorizedKeys.delete(keyId);
  }

  /**
   * List all API keys (admin function)
   */
  listAPIKeys(): Array<{
    keyId: string;
    domain: string;
    createdAt: Date;
    lastUsed: Date;
    emailCount: number;
  }> {
    return Array.from(this.authorizedKeys.entries()).map(([keyId, data]) => ({
      keyId,
      domain: data.domain,
      createdAt: data.createdAt,
      lastUsed: data.lastUsed,
      emailCount: data.emailCount
    }));
  }
}

// Export singleton instance
export const secureSMTPServer = new SecureSMTPServer();
export { SecureSMTPServer };
import crypto from 'crypto';

/**
 * Secure email credentials management
 * This module handles encryption and storage of email credentials
 */

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production';
const ALGORITHM = 'aes-256-gcm';

interface EmailCredentials {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  domain?: string;
  displayName?: string;
}

/**
 * Encrypt email credentials
 */
export function encryptCredentials(credentials: EmailCredentials): string {
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
    
    let encrypted = cipher.update(JSON.stringify(credentials), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Credential encryption error:', error);
    throw new Error('Failed to encrypt credentials');
  }
}

/**
 * Decrypt email credentials
 */
export function decryptCredentials(encryptedData: string): EmailCredentials {
  try {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Credential decryption error:', error);
    throw new Error('Failed to decrypt credentials');
  }
}

/**
 * Default admin email configuration
 * Note: For Gmail, you need to use App Password instead of regular password
 */
export const getDefaultAdminCredentials = (): EmailCredentials => {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  
  if (!appPassword) {
    console.warn('GMAIL_APP_PASSWORD not configured. Gmail SMTP will not work with regular password.');
  }

  return {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    username: 'przmo.official@gmail.com',
    password: appPassword || 'APP_PASSWORD_REQUIRED', // Gmail App Password
    domain: 'przmo.official',
    displayName: 'PRZMO Athletic Support'
  };
};

/**
 * Validate email credentials format
 */
export function validateCredentials(credentials: EmailCredentials): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!credentials.host) {
    errors.push('SMTP host is required');
  }

  if (!credentials.port || credentials.port < 1 || credentials.port > 65535) {
    errors.push('Valid SMTP port is required (1-65535)');
  }

  if (!credentials.username) {
    errors.push('Email username is required');
  }

  if (!credentials.password) {
    errors.push('Email password is required');
  }

  // Gmail specific validation
  if (credentials.host === 'smtp.gmail.com') {
    if (credentials.password === 'APP_PASSWORD_REQUIRED') {
      errors.push('Gmail App Password is required for Gmail SMTP');
    }
    
    if (![465, 587].includes(credentials.port)) {
      errors.push('Gmail SMTP requires port 465 (SSL) or 587 (TLS)');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get secure email configuration with fallbacks
 */
export function getEmailConfig(): EmailCredentials {
  // Try to get configuration from environment variables first
  if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      username: process.env.SMTP_USER,
      password: process.env.SMTP_PASS,
      domain: process.env.SMTP_DOMAIN || 'przmo.app',
      displayName: process.env.SMTP_DISPLAY_NAME || 'PRZMO Support'
    };
  }

  // Fallback to admin credentials
  return getDefaultAdminCredentials();
}

/**
 * Generate Gmail App Password setup instructions
 */
export function getGmailSetupInstructions(): string {
  return `
🔐 Gmail App Password Setup Instructions:

1. Go to your Google Account settings (myaccount.google.com)
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled
4. Go to Security → App passwords
5. Generate a new App Password for "Mail"
6. Use this 16-character App Password instead of your regular password

For PRZMO admin (przmo.official@gmail.com):
- SMTP Host: smtp.gmail.com
- SMTP Port: 587 (TLS) or 465 (SSL)
- Username: przmo.official@gmail.com
- Password: [Your Generated App Password]

Set the environment variable:
GMAIL_APP_PASSWORD=your_app_password_here

Or configure through the admin panel.
  `;
}
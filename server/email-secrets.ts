/**
 * Email Secrets Management
 * Secure handling of email credentials and API keys
 */

import { createHash } from 'crypto';

// Admin credentials configuration
export const ADMIN_CONFIG = {
  email: 'przmo.official@gmail.com',
  password: 'Dhuruv099',
  domain: 'przmo.official',
  displayName: 'PRZMO Athletic Support'
};

/**
 * Generate a secure hash for admin password validation
 */
export function generateAdminHash(): string {
  const secret = process.env.JWT_SECRET || 'fallback_secret_change_in_production';
  const combined = `${ADMIN_CONFIG.email}:${ADMIN_CONFIG.password}:${secret}`;
  return createHash('sha256').update(combined).digest('hex');
}

/**
 * Validate admin credentials
 */
export function validateAdminCredentials(email: string, password: string): boolean {
  return email === ADMIN_CONFIG.email && password === ADMIN_CONFIG.password;
}

/**
 * Get Gmail configuration with app password requirements
 */
export function getGmailConfig(): {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  requiresAppPassword: boolean;
  setupInstructions: string;
} {
  return {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    username: ADMIN_CONFIG.email,
    requiresAppPassword: true,
    setupInstructions: `
Gmail App Password Setup for ${ADMIN_CONFIG.email}:

1. Go to Google Account Settings (myaccount.google.com)
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled
4. Go to Security → App passwords
5. Generate a new App Password for "Mail"
6. Set environment variable: GMAIL_APP_PASSWORD=your_16_character_app_password

This is required because Gmail blocks basic authentication for security.
    `
  };
}
import { secureSMTPServer } from './smtp-server';

/**
 * SMTP Service - Drop-in replacement for SendGrid
 * This service provides the same interface as the SendGrid service
 * but uses our secure SMTP server instead
 */

export interface EmailData {
  to: string | string[];
  from: string;
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
}

/**
 * Send email using our secure SMTP server
 * This function replaces the SendGrid sendEmail function
 */
export async function sendEmailSMTP(emailData: EmailData): Promise<boolean> {
  try {
    // Get default API key from environment or use a generated one
    const defaultApiKey = process.env.SMTP_API_KEY;
    const defaultDomain = process.env.SMTP_DOMAIN || 'przmo.app';

    if (!defaultApiKey) {
      console.warn('⚠️  SMTP_API_KEY not set. Using fallback configuration.');
      
      // Generate a temporary API key for this request
      const keyData = await secureSMTPServer.generateAPIKey(defaultDomain);
      
      const result = await secureSMTPServer.sendEmail(emailData, {
        apiKey: keyData.apiKey,
        domain: defaultDomain
      });

      if (result.success) {
        console.log('✅ Email sent successfully via SMTP:', result.messageId);
        return true;
      } else {
        console.error('❌ SMTP Email failed:', result.message);
        return false;
      }
    } else {
      // Use configured API key
      const result = await secureSMTPServer.sendEmail(emailData, {
        apiKey: defaultApiKey,
        domain: defaultDomain
      });

      if (result.success) {
        console.log('✅ Email sent successfully via SMTP:', result.messageId);
        return true;
      } else {
        console.error('❌ SMTP Email failed:', result.message);
        return false;
      }
    }
  } catch (error) {
    console.error('❌ SMTP Service error:', error);
    return false;
  }
}

/**
 * Legacy function name for backward compatibility
 */
export const sendEmail = sendEmailSMTP;
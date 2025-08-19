/**
 * Email Integration Diagnostics
 * Comprehensive testing and validation for SMTP integration using nodemailer
 */

export interface EmailDiagnostics {
  smtpStatus: 'missing' | 'partial' | 'configured' | 'valid';
  smtpHost?: string;
  smtpUser?: string;
  hasAppPassword: boolean;
  environmentLoaded: boolean;
  lastError?: string;
  testResults: {
    connectionTest: boolean;
    authenticationTest: boolean;
    sendTest: boolean;
  };
}

export function validateSMTPConfig(): EmailDiagnostics['smtpStatus'] {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  
  if (!smtpUser) return 'missing';
  if (!appPassword) return 'partial';
  if (smtpHost && smtpUser && appPassword) return 'configured';
  
  return 'missing';
}

export function getEmailDiagnostics(): EmailDiagnostics {
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  const smtpStatus = validateSMTPConfig();
  
  return {
    smtpStatus,
    smtpHost,
    smtpUser,
    hasAppPassword: !!appPassword,
    environmentLoaded: !!smtpUser,
    testResults: {
      connectionTest: false,
      authenticationTest: false,
      sendTest: false
    }
  };
}

export async function runEmailDiagnostics(): Promise<EmailDiagnostics> {
  const diagnostics = getEmailDiagnostics();
  
  // Only run connection tests if SMTP is configured
  if (diagnostics.smtpStatus === 'configured') {
    try {
      // Import nodemailer for testing
      const nodemailer = await import('nodemailer');
      
      // Create test transporter
      const transporter = nodemailer.default.createTransport({
        host: diagnostics.smtpHost,
        port: 587,
        secure: false,
        auth: {
          user: diagnostics.smtpUser,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      
      // Test connection
      await transporter.verify();
      
      diagnostics.testResults.connectionTest = true;
      diagnostics.testResults.authenticationTest = true;
      diagnostics.smtpStatus = 'valid';
      
    } catch (error) {
      diagnostics.lastError = `SMTP connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      diagnostics.smtpStatus = 'partial';
    }
  }
  
  return diagnostics;
}
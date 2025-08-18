import { secureSMTPServer } from './smtp-server';
import { getEmailConfig, getGmailSetupInstructions, validateCredentials } from './email-credentials';

/**
 * SMTP Manager - Handles initialization and configuration
 */
export class SMTPManager {
  private static instance: SMTPManager;
  
  private constructor() {}
  
  static getInstance(): SMTPManager {
    if (!SMTPManager.instance) {
      SMTPManager.instance = new SMTPManager();
    }
    return SMTPManager.instance;
  }

  /**
   * Initialize SMTP server with environment variables or admin email
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if SMTP environment variables are set
      let smtpHost = process.env.SMTP_HOST;
      let smtpPort = process.env.SMTP_PORT;
      let smtpUser = process.env.SMTP_USER;
      let smtpPass = process.env.SMTP_PASS;
      let smtpSecure = process.env.SMTP_SECURE === 'true';

      // If not configured, use secure email configuration
      if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
        console.log('Using secure email configuration...');
        const emailConfig = getEmailConfig();
        
        // Validate the configuration
        const validation = validateCredentials(emailConfig);
        if (!validation.valid) {
          console.error('Email configuration validation failed:');
          validation.errors.forEach(error => console.error(`- ${error}`));
          console.log(getGmailSetupInstructions());
          return false;
        }
        
        smtpHost = emailConfig.host;
        smtpPort = emailConfig.port.toString();
        smtpUser = emailConfig.username;
        smtpPass = emailConfig.password;
        smtpSecure = emailConfig.secure;
      }

      const config = {
        host: smtpHost,
        port: parseInt(smtpPort as string),
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100
      };

      const result = await secureSMTPServer.configure(config);
      
      if (result.success) {
        console.log('✅ SMTP Server initialized successfully');
        
        // Generate default API key for the application
        const defaultKey = await secureSMTPServer.generateAPIKey('przmo.app');
        console.log(`🔑 Default API Key generated: ${defaultKey.keyId}`);
        
        return true;
      } else {
        console.error('❌ SMTP Server initialization failed:', result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ SMTP Manager initialization error:', error);
      return false;
    }
  }

  /**
   * Get server status
   */
  getStatus() {
    return secureSMTPServer.getStatus();
  }
}

export const smtpManager = SMTPManager.getInstance();
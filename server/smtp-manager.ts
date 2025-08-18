import { secureSMTPServer } from './smtp-server';

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
   * Initialize SMTP server with environment variables
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if SMTP environment variables are set
      const smtpHost = process.env.SMTP_HOST;
      const smtpPort = process.env.SMTP_PORT;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const smtpSecure = process.env.SMTP_SECURE === 'true';

      if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
        console.log('SMTP environment variables not configured. SMTP server will need manual configuration.');
        return false;
      }

      const config = {
        host: smtpHost,
        port: parseInt(smtpPort),
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
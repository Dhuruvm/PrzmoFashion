/**
 * Email Authentication & Anti-Spam System
 * Professional email delivery for PRZMO Athletic
 */

export interface EmailAuthConfig {
  fromEmail: string;
  fromName: string;
  replyTo: string;
  domainKey?: string;
  dkimPrivateKey?: string;
}

/**
 * Generate professional email headers to prevent spam filtering
 */
export function generateAntiSpamHeaders(config: EmailAuthConfig, messageType: string, entityId: string): Record<string, string> {
  return {
    // Priority headers
    'X-Priority': messageType === 'order-confirmation' || messageType === 'order-cancellation' ? '1' : '3',
    'X-MSMail-Priority': messageType === 'order-confirmation' || messageType === 'order-cancellation' ? 'High' : 'Normal',
    'Importance': messageType === 'order-confirmation' || messageType === 'order-cancellation' ? 'High' : 'Normal',
    
    // Authentication headers
    'X-Mailer': 'PRZMO Athletic Email System v1.0',
    'X-Entity-Ref-ID': entityId,
    'X-Message-Type': messageType,
    
    // Brand authentication
    'Organization': 'PRZMO Athletic Lifestyle',
    'X-Business-Type': 'Premium Athletic Apparel',
    
    // List management (required for commercial emails)
    'List-Unsubscribe': '<mailto:unsubscribe@przmo.com?subject=Unsubscribe>',
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    
    // Message categorization
    'X-MS-Exchange-Organization-Classification': 'transactional',
    'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply',
    
    // Security headers
    'X-Spam-Status': 'No',
    'X-Spam-Flag': 'NO',
    'X-Spam-Level': '0'
  };
}

/**
 * Generate Message-ID for email tracking
 */
export function generateMessageId(messageType: string, entityId: string, domain: string = 'przmo.com'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${messageType}-${entityId}-${timestamp}-${random}@${domain}`;
}

/**
 * Validate email deliverability settings
 */
export function validateEmailDeliverability(config: EmailAuthConfig): {
  valid: boolean;
  warnings: string[];
  recommendations: string[];
} {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check sender reputation factors
  if (!config.replyTo || config.replyTo === config.fromEmail) {
    warnings.push('Reply-To should be different from From address for better deliverability');
  }

  if (!config.fromName || config.fromName.length < 3) {
    warnings.push('From name should be descriptive for brand recognition');
  }

  // Check for Gmail App Password requirement
  if (config.fromEmail.includes('@gmail.com')) {
    recommendations.push('Gmail requires App Password for SMTP authentication');
    recommendations.push('Enable 2-Step Verification and generate App Password');
    recommendations.push('Set GMAIL_APP_PASSWORD environment variable');
  }

  // Domain authentication recommendations
  if (!config.dkimPrivateKey) {
    recommendations.push('Configure DKIM signing for better email authentication');
  }

  recommendations.push('Set up SPF record: "v=spf1 include:_spf.google.com ~all"');
  recommendations.push('Configure DMARC policy for domain protection');
  recommendations.push('Monitor email reputation with postmaster tools');

  return {
    valid: warnings.length === 0,
    warnings,
    recommendations
  };
}

/**
 * Professional email configuration for PRZMO
 */
export const PRZMO_EMAIL_CONFIG: EmailAuthConfig = {
  fromEmail: 'przmo.official@gmail.com',
  fromName: 'PRZMO Athletic Lifestyle',
  replyTo: 'support@przmo.com'
};

/**
 * Email templates with proper authentication
 */
export function enhanceEmailWithAuth(emailData: {
  to: string;
  subject: string;
  html: string;
  text: string;
}, messageType: string, entityId: string): any {
  return {
    ...emailData,
    from: `${PRZMO_EMAIL_CONFIG.fromName} <${PRZMO_EMAIL_CONFIG.fromEmail}>`,
    replyTo: PRZMO_EMAIL_CONFIG.replyTo,
    headers: generateAntiSpamHeaders(PRZMO_EMAIL_CONFIG, messageType, entityId),
    messageId: generateMessageId(messageType, entityId),
    
    // Additional anti-spam measures
    envelope: {
      from: PRZMO_EMAIL_CONFIG.fromEmail,
      to: emailData.to
    },
    
    // Email categories for better organization
    category: messageType,
    customArgs: {
      message_type: messageType,
      entity_id: entityId,
      brand: 'PRZMO'
    }
  };
}
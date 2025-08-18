/**
 * Professional Email Service for PRZMO Athletic
 * Handles order confirmations, cancellations, and customer notifications
 */

import { sendEmail } from './smtp-service';
import { 
  generateOrderConfirmationEmail, 
  generateOrderCancellationEmail, 
  generateShippingNotificationEmail,
  OrderDetails 
} from './email-templates';
import { enhanceEmailWithAuth, PRZMO_EMAIL_CONFIG, validateEmailDeliverability } from './email-authentication';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email service class for handling all customer communications
 */
export class ProfessionalEmailService {
  constructor() {
    // Validate email deliverability on startup
    const validation = validateEmailDeliverability(PRZMO_EMAIL_CONFIG);
    if (validation.warnings.length > 0) {
      console.warn('📧 Email deliverability warnings:');
      validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    if (validation.recommendations.length > 0) {
      console.log('💡 Email deliverability recommendations:');
      validation.recommendations.forEach(rec => console.log(`  - ${rec}`));
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(order: OrderDetails): Promise<EmailSendResult> {
    try {
      const { subject, html, text } = generateOrderConfirmationEmail(order);
      
      const enhancedEmail = enhanceEmailWithAuth(
        {
          to: order.customerEmail,
          subject,
          html,
          text
        },
        'order-confirmation',
        `order-${order.orderNumber}`
      );
      
      const result = await sendEmail(enhancedEmail);

      if (result) {
        console.log(`✅ Order confirmation sent to ${order.customerEmail} for order #${order.orderNumber}`);
        return {
          success: true,
          messageId: 'email-sent'
        };
      } else {
        console.error(`❌ Failed to send order confirmation`);
        return {
          success: false,
          error: 'Email send failed'
        };
      }
    } catch (error) {
      console.error('Order confirmation email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send order cancellation email
   */
  async sendOrderCancellation(order: OrderDetails): Promise<EmailSendResult> {
    try {
      const { subject, html, text } = generateOrderCancellationEmail(order);
      
      const enhancedEmail = enhanceEmailWithAuth(
        {
          to: order.customerEmail,
          subject,
          html,
          text
        },
        'order-cancellation',
        `cancel-${order.orderNumber}`
      );
      
      const result = await sendEmail(enhancedEmail);

      if (result) {
        console.log(`✅ Order cancellation sent to ${order.customerEmail} for order #${order.orderNumber}`);
        return {
          success: true,
          messageId: 'email-sent'
        };
      } else {
        console.error(`❌ Failed to send order cancellation`);
        return {
          success: false,
          error: 'Email send failed'
        };
      }
    } catch (error) {
      console.error('Order cancellation email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send shipping notification email
   */
  async sendShippingNotification(order: OrderDetails & { trackingNumber: string }): Promise<EmailSendResult> {
    try {
      const { subject, html, text } = generateShippingNotificationEmail(order);
      
      const enhancedEmail = enhanceEmailWithAuth(
        {
          to: order.customerEmail,
          subject,
          html,
          text
        },
        'shipping-notification',
        `shipping-${order.orderNumber}`
      );
      
      const result = await sendEmail(enhancedEmail);

      if (result) {
        console.log(`✅ Shipping notification sent to ${order.customerEmail} for order #${order.orderNumber}`);
        return {
          success: true,
          messageId: 'email-sent'
        };
      } else {
        console.error(`❌ Failed to send shipping notification`);
        return {
          success: false,
          error: 'Email send failed'
        };
      }
    } catch (error) {
      console.error('Shipping notification email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send welcome email to new customers
   */
  async sendWelcomeEmail(customerEmail: string, customerName: string): Promise<EmailSendResult> {
    try {
      const subject = `Welcome to PRZMO Athletic Lifestyle, ${customerName}!`;
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to PRZMO</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Helvetica Neue', Arial, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a;
            background-color: #f8f9fa;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
        }
        .header { 
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); 
            color: white; 
            padding: 40px;
            text-align: center;
        }
        .logo { 
            font-size: 32px; 
            font-weight: 900; 
            letter-spacing: 2px; 
            margin-bottom: 15px;
        }
        .tagline { 
            font-size: 16px; 
            color: #cccccc; 
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .content { 
            padding: 50px 40px;
        }
        .welcome-message {
            text-align: center;
            margin-bottom: 40px;
        }
        .welcome-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #1a1a1a;
        }
        .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin: 40px 0;
        }
        .feature {
            text-align: center;
            padding: 25px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 15px;
        }
        .feature-title {
            font-weight: 600;
            margin-bottom: 10px;
            color: #1a1a1a;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            background: #1a1a1a;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 20px 10px;
        }
        
        @media only screen and (max-width: 600px) {
            .features { grid-template-columns: 1fr; }
            .content { padding: 30px 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PRZMO</div>
            <div class="tagline">Athletic Lifestyle</div>
        </div>

        <div class="content">
            <div class="welcome-message">
                <h1 class="welcome-title">Welcome, ${customerName}!</h1>
                <p style="font-size: 18px; color: #6b7280; line-height: 1.6;">
                    You've joined an exclusive community of athletes and fitness enthusiasts who demand premium quality and cutting-edge design.
                </p>
            </div>

            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🏆</div>
                    <div class="feature-title">Premium Quality</div>
                    <p style="color: #6b7280; font-size: 14px;">
                        Engineered with the finest materials for peak performance
                    </p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🚚</div>
                    <div class="feature-title">Fast Delivery</div>
                    <p style="color: #6b7280; font-size: 14px;">
                        Express shipping on all orders with tracking included
                    </p>
                </div>
                <div class="feature">
                    <div class="feature-icon">↩️</div>
                    <div class="feature-title">Easy Returns</div>
                    <p style="color: #6b7280; font-size: 14px;">
                        30-day hassle-free returns and exchanges
                    </p>
                </div>
                <div class="feature">
                    <div class="feature-icon">👥</div>
                    <div class="feature-title">VIP Support</div>
                    <p style="color: #6b7280; font-size: 14px;">
                        Priority customer service from our expert team
                    </p>
                </div>
            </div>

            <div style="text-align: center; margin: 40px 0;">
                <a href="https://przmo.com/shop" class="button">Start Shopping</a>
                <a href="https://przmo.com/account" class="button" style="background: white; color: #1a1a1a; border: 2px solid #1a1a1a;">
                    My Account
                </a>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; text-align: center; margin-top: 40px;">
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                    Follow us on social media for the latest releases, athlete spotlights, and exclusive offers.
                </p>
            </div>
        </div>
    </div>
</body>
</html>`;

      const text = `
Welcome to PRZMO Athletic Lifestyle, ${customerName}!

You've joined an exclusive community of athletes and fitness enthusiasts who demand premium quality and cutting-edge design.

What makes PRZMO special:
• Premium Quality - Engineered with the finest materials
• Fast Delivery - Express shipping with tracking
• Easy Returns - 30-day hassle-free policy  
• VIP Support - Priority customer service

Start shopping: https://przmo.com/shop
My Account: https://przmo.com/account

Welcome to the PRZMO family!
      `;
      
      const enhancedEmail = enhanceEmailWithAuth(
        {
          to: customerEmail,
          subject,
          html,
          text
        },
        'welcome-email',
        `welcome-${Date.now()}`
      );
      
      const result = await sendEmail(enhancedEmail);

      return {
        success: result ? true : false,
        messageId: result ? 'welcome-email-sent' : undefined,
        error: result ? undefined : 'Failed to send welcome email'
      };
    } catch (error) {
      console.error('Welcome email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const emailService = new ProfessionalEmailService();
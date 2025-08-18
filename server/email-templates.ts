/**
 * Premium Email Templates for PRZMO Athletic Lifestyle
 * Professional order confirmations, cancellations, and customer notifications
 */

export interface OrderDetails {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  estimatedDelivery: string;
  trackingNumber?: string;
}

/**
 * Professional order confirmation email template
 */
export function generateOrderConfirmationEmail(order: OrderDetails): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Order Confirmed #${order.orderNumber} - PRZMO Athletic`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - PRZMO</title>
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
            padding: 30px 40px;
            text-align: center;
        }
        .logo { 
            font-size: 28px; 
            font-weight: 900; 
            letter-spacing: 2px; 
            margin-bottom: 10px;
        }
        .tagline { 
            font-size: 14px; 
            color: #cccccc; 
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .content { 
            padding: 40px;
        }
        .order-header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid #f0f0f0;
        }
        .order-number { 
            font-size: 24px; 
            font-weight: 700; 
            color: #1a1a1a;
            margin-bottom: 10px;
        }
        .order-status {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .section { 
            margin-bottom: 30px;
        }
        .section-title { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 15px;
            color: #1a1a1a;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .item {
            display: flex;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .item:last-child { border-bottom: none; }
        .item-image {
            width: 80px;
            height: 80px;
            background: #f8f9fa;
            border-radius: 8px;
            margin-right: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #6b7280;
        }
        .item-details { 
            flex: 1;
        }
        .item-name { 
            font-weight: 600; 
            font-size: 16px;
            margin-bottom: 4px;
            color: #1a1a1a;
        }
        .item-specs { 
            font-size: 14px; 
            color: #6b7280;
            margin-bottom: 6px;
        }
        .item-price { 
            font-weight: 600; 
            font-size: 16px;
            color: #1a1a1a;
        }
        .totals {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 15px;
        }
        .total-row:last-child {
            margin-bottom: 0;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            font-weight: 700;
            font-size: 18px;
            color: #1a1a1a;
        }
        .shipping-info {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        .address {
            color: #4b5563;
            font-size: 15px;
            line-height: 1.5;
        }
        .delivery-estimate {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
        }
        .delivery-date {
            font-size: 18px;
            font-weight: 600;
            color: #1d4ed8;
            margin-bottom: 5px;
        }
        .actions {
            text-align: center;
            margin: 40px 0;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            margin: 0 10px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }
        .button-primary {
            background: #1a1a1a;
            color: white;
        }
        .button-secondary {
            background: white;
            color: #1a1a1a;
            border: 2px solid #1a1a1a;
        }
        .footer {
            background: #1a1a1a;
            color: #cccccc;
            padding: 40px;
            text-align: center;
        }
        .footer-links {
            margin-bottom: 20px;
        }
        .footer-link {
            color: #cccccc;
            text-decoration: none;
            margin: 0 15px;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #cccccc;
            text-decoration: none;
        }
        .copyright {
            font-size: 12px;
            color: #888888;
            margin-top: 20px;
        }
        
        @media only screen and (max-width: 600px) {
            .content { padding: 20px; }
            .header { padding: 20px; }
            .item { flex-direction: column; text-align: center; }
            .item-image { margin: 0 0 15px 0; }
            .button { display: block; margin: 10px 0; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">PRZMO</div>
            <div class="tagline">Athletic Lifestyle</div>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Order Header -->
            <div class="order-header">
                <div class="order-number">Order #${order.orderNumber}</div>
                <div class="order-status">Confirmed</div>
                <p style="margin-top: 15px; color: #6b7280; font-size: 16px;">
                    Thank you for your order, ${order.customerName}. We're preparing your premium athletic gear with care.
                </p>
            </div>

            <!-- Order Items -->
            <div class="section">
                <div class="section-title">Order Details</div>
                ${order.items.map(item => `
                    <div class="item">
                        <div class="item-image">
                            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="max-width: 100%; border-radius: 4px;">` : 'IMAGE'}
                        </div>
                        <div class="item-details">
                            <div class="item-name">${item.name}</div>
                            <div class="item-specs">
                                ${item.size ? `Size: ${item.size}` : ''}
                                ${item.color ? ` • Color: ${item.color}` : ''}
                                • Qty: ${item.quantity}
                            </div>
                            <div class="item-price">$${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <!-- Order Totals -->
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>$${order.subtotal.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Shipping</span>
                    <span>$${order.shipping.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Tax</span>
                    <span>$${order.tax.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Total</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
            </div>

            <!-- Shipping Information -->
            <div class="section">
                <div class="section-title">Shipping Address</div>
                <div class="shipping-info">
                    <div class="address">
                        ${order.customerName}<br>
                        ${order.shippingAddress.street}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
                        ${order.shippingAddress.country}
                    </div>
                </div>
            </div>

            <!-- Delivery Estimate -->
            <div class="delivery-estimate">
                <div class="delivery-date">Estimated Delivery: ${order.estimatedDelivery}</div>
                <div style="color: #1d4ed8; font-size: 14px;">
                    We'll send tracking information once your order ships
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="actions">
                <a href="https://przmo.com/orders/${order.orderNumber}" class="button button-primary">
                    Track Order
                </a>
                <a href="https://przmo.com/orders/${order.orderNumber}/cancel" class="button button-secondary">
                    Modify Order
                </a>
            </div>

            <!-- Additional Information -->
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h4 style="color: #92400e; margin-bottom: 10px; font-size: 16px;">Order Information</h4>
                <ul style="color: #92400e; font-size: 14px; line-height: 1.6; margin-left: 20px;">
                    <li>You can modify or cancel your order within 2 hours of placing it</li>
                    <li>Once shipped, you'll receive tracking information via email</li>
                    <li>Free returns within 30 days for all premium items</li>
                    <li>Questions? Contact our premium support team</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="footer-links">
                <a href="https://przmo.com/account" class="footer-link">My Account</a>
                <a href="https://przmo.com/support" class="footer-link">Support</a>
                <a href="https://przmo.com/returns" class="footer-link">Returns</a>
                <a href="https://przmo.com/sizing" class="footer-link">Size Guide</a>
            </div>
            
            <div class="social-links">
                <a href="#" class="social-link">Instagram</a>
                <a href="#" class="social-link">Twitter</a>
                <a href="#" class="social-link">Facebook</a>
            </div>
            
            <div class="copyright">
                © ${new Date().getFullYear()} PRZMO Athletic Lifestyle. All rights reserved.<br>
                This email was sent to ${order.customerEmail}
            </div>
        </div>
    </div>
</body>
</html>`;

  const text = `
PRZMO Athletic Lifestyle - Order Confirmation

Order #${order.orderNumber} - CONFIRMED

Dear ${order.customerName},

Thank you for your order! We're preparing your premium athletic gear with care.

ORDER DETAILS:
${order.items.map(item => 
  `- ${item.name} (${item.size ? `Size: ${item.size}` : ''}${item.color ? `, Color: ${item.color}` : ''}) - Qty: ${item.quantity} - $${item.price.toFixed(2)}`
).join('\n')}

TOTAL SUMMARY:
Subtotal: $${order.subtotal.toFixed(2)}
Shipping: $${order.shipping.toFixed(2)}
Tax: $${order.tax.toFixed(2)}
Total: $${order.total.toFixed(2)}

SHIPPING ADDRESS:
${order.customerName}
${order.shippingAddress.street}
${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}
${order.shippingAddress.country}

ESTIMATED DELIVERY: ${order.estimatedDelivery}

Track your order: https://przmo.com/orders/${order.orderNumber}
Modify order: https://przmo.com/orders/${order.orderNumber}/cancel

Questions? Contact our premium support team.

PRZMO Athletic Lifestyle
© ${new Date().getFullYear()} PRZMO. All rights reserved.
  `;

  return { subject, html, text };
}

/**
 * Order cancellation confirmation email
 */
export function generateOrderCancellationEmail(order: OrderDetails): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Order Cancelled #${order.orderNumber} - PRZMO Athletic`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancelled - PRZMO</title>
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
            padding: 30px 40px;
            text-align: center;
        }
        .logo { 
            font-size: 28px; 
            font-weight: 900; 
            letter-spacing: 2px; 
            margin-bottom: 10px;
        }
        .content { 
            padding: 40px;
        }
        .cancellation-notice {
            background: #fee2e2;
            border: 1px solid #fecaca;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .cancellation-status {
            font-size: 20px;
            font-weight: 700;
            color: #dc2626;
            margin-bottom: 10px;
        }
        .refund-info {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }
        .actions {
            text-align: center;
            margin: 40px 0;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            margin: 0 10px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #1a1a1a;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PRZMO</div>
        </div>

        <div class="content">
            <div class="cancellation-notice">
                <div class="cancellation-status">Order Cancelled</div>
                <p style="color: #dc2626; font-size: 16px;">
                    Order #${order.orderNumber} has been successfully cancelled
                </p>
            </div>

            <p style="font-size: 16px; margin-bottom: 30px;">
                Dear ${order.customerName},
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Your order has been cancelled as requested. We understand plans change, and we're here to help you find the perfect athletic gear when you're ready.
            </p>

            <div class="refund-info">
                <h3 style="color: #1d4ed8; margin-bottom: 15px;">Refund Information</h3>
                <p style="color: #1d4ed8; font-size: 15px; line-height: 1.5;">
                    • Full refund of $${order.total.toFixed(2)} will be processed<br>
                    • Refunds typically appear within 3-5 business days<br>
                    • You'll receive a confirmation email once processed
                </p>
            </div>

            <div class="actions">
                <a href="https://przmo.com/shop" class="button">Continue Shopping</a>
            </div>
        </div>
    </div>
</body>
</html>`;

  const text = `
PRZMO Athletic Lifestyle - Order Cancelled

Order #${order.orderNumber} - CANCELLED

Dear ${order.customerName},

Your order has been cancelled as requested.

Refund Information:
- Full refund of $${order.total.toFixed(2)} will be processed
- Refunds typically appear within 3-5 business days
- You'll receive confirmation once processed

Continue shopping: https://przmo.com/shop

PRZMO Athletic Lifestyle
  `;

  return { subject, html, text };
}

/**
 * Shipping notification email
 */
export function generateShippingNotificationEmail(order: OrderDetails & { trackingNumber: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Your PRZMO Order is on the Way! #${order.orderNumber}`;
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Shipped - PRZMO</title>
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
            background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
            color: white; 
            padding: 30px 40px;
            text-align: center;
        }
        .logo { 
            font-size: 28px; 
            font-weight: 900; 
            letter-spacing: 2px; 
            margin-bottom: 10px;
        }
        .content { 
            padding: 40px;
        }
        .shipping-notice {
            background: #d1fae5;
            border: 1px solid #10b981;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .tracking-info {
            background: #1a1a1a;
            color: white;
            padding: 25px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
        }
        .tracking-number {
            font-size: 20px;
            font-weight: 700;
            margin: 10px 0;
            letter-spacing: 1px;
        }
        .button {
            display: inline-block;
            padding: 15px 30px;
            margin: 10px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            background: #10b981;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PRZMO</div>
            <div style="font-size: 16px; margin-top: 10px;">Your order is on the way!</div>
        </div>

        <div class="content">
            <div class="shipping-notice">
                <h2 style="color: #059669; margin-bottom: 15px;">📦 Order Shipped!</h2>
                <p style="color: #059669; font-size: 16px;">
                    Order #${order.orderNumber} is now on its way to you
                </p>
            </div>

            <p style="font-size: 16px; margin-bottom: 30px;">
                Dear ${order.customerName},
            </p>

            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Great news! Your premium athletic gear has been carefully packaged and is now on its way to you. Track your package using the information below.
            </p>

            <div class="tracking-info">
                <h3>Tracking Information</h3>
                <div class="tracking-number">${order.trackingNumber}</div>
                <p style="font-size: 14px; opacity: 0.9;">
                    Estimated delivery: ${order.estimatedDelivery}
                </p>
            </div>

            <div style="text-align: center;">
                <a href="https://przmo.com/track/${order.trackingNumber}" class="button">
                    Track Your Package
                </a>
            </div>
        </div>
    </div>
</body>
</html>`;

  const text = `
PRZMO Athletic Lifestyle - Order Shipped!

Order #${order.orderNumber} is on the way!

Dear ${order.customerName},

Your premium athletic gear has been shipped!

Tracking Number: ${order.trackingNumber}
Estimated Delivery: ${order.estimatedDelivery}

Track your package: https://przmo.com/track/${order.trackingNumber}

PRZMO Athletic Lifestyle
  `;

  return { subject, html, text };
}
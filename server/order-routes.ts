/**
 * Order Management Routes with Email Notifications
 * Professional order handling with PRZMO branding
 */

import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { emailService } from './email-service';
import { OrderDetails } from './email-templates';

const router = Router();

// Rate limiting for order operations
const orderRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 order operations per window
  message: {
    success: false,
    message: 'Too many order requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// In-memory order storage (in production, use database)
const orders = new Map<string, OrderDetails>();

// Validation middleware
const validateOrder = [
  body('customerName').isString().trim().isLength({ min: 2, max: 100 }).withMessage('Customer name is required'),
  body('customerEmail').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.name').isString().trim().isLength({ min: 1 }).withMessage('Item name is required'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Item price must be positive'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be positive'),
  body('shippingAddress.street').isString().trim().isLength({ min: 5 }).withMessage('Street address is required'),
  body('shippingAddress.city').isString().trim().isLength({ min: 2 }).withMessage('City is required'),
  body('shippingAddress.state').isString().trim().isLength({ min: 2 }).withMessage('State is required'),
  body('shippingAddress.zip').isString().trim().isLength({ min: 5 }).withMessage('ZIP code is required'),
  body('shippingAddress.country').isString().trim().isLength({ min: 2 }).withMessage('Country is required')
];

const handleValidationErrors = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Order validation failed',
      errors: errors.array(),
      code: 'VALIDATION_ERROR'
    });
  }
  next();
};

/**
 * POST /api/orders/create
 * Create a new order and send confirmation email
 */
router.post('/create',
  orderRateLimit,
  validateOrder,
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      // Generate order details
      const orderNumber = `PRZMO${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const orderDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      // Calculate order totals
      const subtotal = req.body.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 100 ? 0 : 15.99; // Free shipping over $100
      const tax = subtotal * 0.08; // 8% tax rate
      const total = subtotal + shipping + tax;
      
      // Create order object
      const order: OrderDetails = {
        orderNumber,
        customerName: req.body.customerName,
        customerEmail: req.body.customerEmail,
        orderDate,
        items: req.body.items,
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: req.body.shippingAddress,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      // Store order
      orders.set(orderNumber, order);

      // Send confirmation email
      const emailResult = await emailService.sendOrderConfirmation(order);

      if (emailResult.success) {
        console.log(`📧 Order confirmation email sent for order #${orderNumber}`);
      } else {
        console.warn(`⚠️ Failed to send confirmation email: ${emailResult.error}`);
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: {
          orderNumber: order.orderNumber,
          total: order.total,
          estimatedDelivery: order.estimatedDelivery
        },
        emailSent: emailResult.success,
        emailError: emailResult.error
      });

    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create order',
        code: 'ORDER_CREATION_ERROR'
      });
    }
  }
);

/**
 * POST /api/orders/:orderNumber/cancel
 * Cancel an order and send cancellation email
 */
router.post('/:orderNumber/cancel',
  orderRateLimit,
  async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const order = orders.get(orderNumber);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        });
      }

      // Check if order can be cancelled (within 2 hours)
      const orderTime = new Date(order.orderDate).getTime();
      const now = Date.now();
      const hoursDiff = (now - orderTime) / (1000 * 60 * 60);

      if (hoursDiff > 2) {
        return res.status(400).json({
          success: false,
          message: 'Order cannot be cancelled after 2 hours',
          code: 'CANCELLATION_WINDOW_EXPIRED'
        });
      }

      // Send cancellation email
      const emailResult = await emailService.sendOrderCancellation(order);

      // Remove order from storage
      orders.delete(orderNumber);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        refundAmount: order.total,
        emailSent: emailResult.success,
        emailError: emailResult.error
      });

    } catch (error) {
      console.error('Order cancellation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to cancel order',
        code: 'CANCELLATION_ERROR'
      });
    }
  }
);

/**
 * GET /api/orders/:orderNumber
 * Get order details
 */
router.get('/:orderNumber',
  orderRateLimit,
  (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const order = orders.get(orderNumber);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        });
      }

      res.status(200).json({
        success: true,
        order
      });

    } catch (error) {
      console.error('Order retrieval error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve order',
        code: 'ORDER_RETRIEVAL_ERROR'
      });
    }
  }
);

/**
 * POST /api/orders/:orderNumber/ship
 * Mark order as shipped and send notification
 */
router.post('/:orderNumber/ship',
  orderRateLimit,
  [body('trackingNumber').isString().trim().isLength({ min: 8 }).withMessage('Tracking number is required')],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { orderNumber } = req.params;
      const { trackingNumber } = req.body;
      const order = orders.get(orderNumber);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
          code: 'ORDER_NOT_FOUND'
        });
      }

      // Update order with tracking
      const shippedOrder = { ...order, trackingNumber };
      orders.set(orderNumber, shippedOrder);

      // Send shipping notification
      const emailResult = await emailService.sendShippingNotification(shippedOrder);

      res.status(200).json({
        success: true,
        message: 'Order marked as shipped',
        trackingNumber,
        emailSent: emailResult.success,
        emailError: emailResult.error
      });

    } catch (error) {
      console.error('Order shipping error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark order as shipped',
        code: 'SHIPPING_ERROR'
      });
    }
  }
);

/**
 * POST /api/orders/test-email
 * Send test order confirmation email
 */
router.post('/test-email',
  orderRateLimit,
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('name').isString().trim().isLength({ min: 2 }).withMessage('Name is required')
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { email, name } = req.body;
      
      // Create test order
      const testOrder: OrderDetails = {
        orderNumber: `TEST${Date.now()}`,
        customerName: name,
        customerEmail: email,
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long', 
          day: 'numeric'
        }),
        items: [
          {
            name: 'PRZMO Performance Tee',
            price: 85.00,
            quantity: 1,
            size: 'L',
            color: 'Midnight Black'
          },
          {
            name: 'Elite Training Shorts',
            price: 120.00,
            quantity: 1,
            size: 'L',
            color: 'Graphite'
          }
        ],
        subtotal: 205.00,
        shipping: 0,
        tax: 16.40,
        total: 221.40,
        shippingAddress: {
          street: '123 Athletic Drive',
          city: 'Performance City',
          state: 'CA',
          zip: '90210',
          country: 'United States'
        },
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      // Send test email
      const emailResult = await emailService.sendOrderConfirmation(testOrder);

      res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        emailSent: emailResult.success,
        emailError: emailResult.error,
        testOrder: {
          orderNumber: testOrder.orderNumber,
          customerName: testOrder.customerName,
          total: testOrder.total
        }
      });

    } catch (error) {
      console.error('Test email error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        code: 'TEST_EMAIL_ERROR'
      });
    }
  }
);

export { router as orderRouter };
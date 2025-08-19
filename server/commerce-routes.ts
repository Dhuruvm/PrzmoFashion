/**
 * Headless Commerce API Routes
 * Provides REST API endpoints for e-commerce functionality
 */

import type { Express } from "express";
import { commerceService } from './commerce-service';
import { currencyService } from './currency-service';
import { jobQueue } from './job-queue';

export function registerCommerceRoutes(app: Express): void {
  console.log('🛒 Registering commerce API routes...');

  // Product endpoints
  app.get('/api/products', async (req, res) => {
    try {
      const { currency, category, limit, offset } = req.query;
      
      const products = await commerceService.getProducts({
        currency: currency as string,
        category: category as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined
      });

      res.json({
        success: true,
        data: products,
        meta: {
          total: products.length,
          currency: currency || 'USD'
        }
      });
    } catch (error) {
      console.error('Products API error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { currency } = req.query;
      
      const product = await commerceService.getProduct(id, currency as string);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Product API error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      });
    }
  });

  // Cart endpoints
  app.post('/api/cart', async (req, res) => {
    try {
      const { customerId } = req.body;
      
      const cart = await commerceService.createCart(customerId);
      
      res.json({
        success: true,
        data: cart
      });
    } catch (error) {
      console.error('Create cart error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create cart'
      });
    }
  });

  app.post('/api/cart/:cartId/items', async (req, res) => {
    try {
      const { cartId } = req.params;
      const { productId, quantity, variantId } = req.body;
      
      if (!productId || !quantity) {
        return res.status(400).json({
          success: false,
          error: 'Product ID and quantity are required'
        });
      }

      const cart = await commerceService.addToCart(
        cartId, 
        productId, 
        parseInt(quantity), 
        variantId
      );
      
      res.json({
        success: true,
        data: cart,
        message: 'Item added to cart'
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add item to cart'
      });
    }
  });

  // Order endpoints
  app.post('/api/orders', async (req, res) => {
    try {
      const { cartId, customerEmail, shippingAddress, billingAddress } = req.body;
      
      if (!cartId || !customerEmail || !shippingAddress) {
        return res.status(400).json({
          success: false,
          error: 'Cart ID, customer email, and shipping address are required'
        });
      }

      const order = await commerceService.createOrder(cartId, {
        email: customerEmail,
        shippingAddress,
        billingAddress
      });
      
      res.json({
        success: true,
        data: order,
        message: 'Order created successfully'
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order'
      });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { currency } = req.query;
      
      const order = await commerceService.getOrder(id, currency as string);
      
      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found'
        });
      }

      res.json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Order API error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch order'
      });
    }
  });

  // Currency endpoints
  app.get('/api/currencies', async (req, res) => {
    try {
      const currencies = await commerceService.getSupportedCurrencies();
      const status = currencyService.getStatus();
      
      res.json({
        success: true,
        data: {
          supported: currencies,
          status: status
        }
      });
    } catch (error) {
      console.error('Currencies API error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch currencies'
      });
    }
  });

  app.post('/api/currencies/convert', async (req, res) => {
    try {
      const { amount, from, to } = req.body;
      
      if (!amount || !from || !to) {
        return res.status(400).json({
          success: false,
          error: 'Amount, from currency, and to currency are required'
        });
      }

      const conversion = await commerceService.convertPrice(
        parseFloat(amount),
        from,
        to
      );
      
      res.json({
        success: true,
        data: conversion
      });
    } catch (error) {
      console.error('Currency conversion error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to convert currency'
      });
    }
  });

  // Job queue endpoints
  app.get('/api/jobs/stats', async (req, res) => {
    try {
      const stats = jobQueue.getStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Job stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch job statistics'
      });
    }
  });

  // Commerce analytics
  app.get('/api/commerce/stats', async (req, res) => {
    try {
      const stats = await commerceService.getStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Commerce stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch commerce statistics'
      });
    }
  });

  // Test endpoints for demonstration
  app.post('/api/test/process-order', async (req, res) => {
    try {
      const { orderId, customerEmail } = req.body;
      
      const jobId = await jobQueue.add('order:process', {
        orderId: orderId || `test_${Date.now()}`,
        customerEmail: customerEmail || 'test@example.com',
        items: [{ productId: 'test-product', quantity: 1 }],
        total: 99.99
      }, { priority: 5 });
      
      res.json({
        success: true,
        data: { jobId },
        message: 'Order processing job queued'
      });
    } catch (error) {
      console.error('Test order processing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to queue order processing'
      });
    }
  });

  console.log('✅ Commerce API routes registered successfully');
}
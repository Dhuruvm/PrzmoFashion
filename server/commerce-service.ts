/**
 * Headless Commerce Service - Medusa Style Implementation
 * Provides complete e-commerce functionality with background processing
 */

import { jobQueue } from './job-queue';
import { currencyService } from './currency-service';
import { storage } from './storage';
import type {
  Product,
  ProductVariant,
  Order,
  OrderItem,
  Address,
  Customer,
  Cart,
  CartItem
} from './commerce-types';

class CommerceService {
  constructor() {
    console.log('🛒 Initializing Headless Commerce Service...');
    this.initializeDefaults();
  }

  /**
   * Initialize default data and settings
   */
  private async initializeDefaults(): Promise<void> {
    console.log('📦 Setting up default commerce data...');
    
    // Create default products if none exist
    const existingProducts = await this.getProducts();
    if (existingProducts.length === 0) {
      await this.createSampleProducts();
    }
  }

  /**
   * Create sample products for demo
   */
  private async createSampleProducts(): Promise<void> {
    const sampleProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        title: "PRZMO Performance Hoodie",
        description: "Premium athletic hoodie with moisture-wicking technology",
        price: 89.99,
        currency: "USD",
        images: ["/assets/hoodie-1.jpg"],
        categories: ["Hoodies", "Athletic Wear"],
        tags: ["performance", "premium", "athletic"],
        inventory: { quantity: 50, sku: "PRZMO-HOODIE-001", trackInventory: true },
        status: "active"
      },
      {
        title: "PRZMO Elite Training Shorts",
        description: "Lightweight shorts designed for peak performance",
        price: 54.99,
        currency: "USD", 
        images: ["/assets/shorts-1.jpg"],
        categories: ["Shorts", "Athletic Wear"],
        tags: ["training", "lightweight", "performance"],
        inventory: { quantity: 75, sku: "PRZMO-SHORTS-001", trackInventory: true },
        status: "active"
      },
      {
        title: "PRZMO Pro Running Shoes",
        description: "Advanced running shoes with responsive cushioning",
        price: 159.99,
        currency: "USD",
        images: ["/assets/shoes-1.jpg"],
        categories: ["Shoes", "Running"],
        tags: ["running", "professional", "cushioning"],
        inventory: { quantity: 30, sku: "PRZMO-SHOES-001", trackInventory: true },
        status: "active"
      }
    ];

    for (const productData of sampleProducts) {
      await this.createProduct(productData);
    }

    console.log(`✅ Created ${sampleProducts.length} sample products`);
  }

  /**
   * Product Management
   */
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const product: Product = {
      ...productData,
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await storage.createProduct(product);
    console.log(`📦 Product created: ${product.title} (${product.id})`);
    
    return product;
  }

  async getProducts(options: {
    currency?: string;
    category?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<Product[]> {
    let products = await storage.getProducts();

    // Filter by category if specified
    if (options.category) {
      products = products.filter(p => p.categories.includes(options.category!));
    }

    // Convert currency if needed
    if (options.currency && options.currency !== 'USD') {
      products = await this.convertProductPrices(products, options.currency);
    }

    // Apply pagination
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    
    return products.slice(offset, offset + limit);
  }

  async getProduct(id: string, currency?: string): Promise<Product | null> {
    let product = await storage.getProduct(id);
    
    if (!product) return null;

    // Convert currency if needed
    if (currency && currency !== product.currency) {
      const converted = await currencyService.convert(product.price, product.currency, currency);
      product = {
        ...product,
        price: converted.convertedAmount,
        currency,
        metadata: {
          ...product.metadata,
          originalPrice: converted.originalAmount,
          originalCurrency: converted.fromCurrency,
          exchangeRate: converted.exchangeRate
        }
      };
    }

    return product;
  }

  /**
   * Convert product prices to different currency
   */
  private async convertProductPrices(products: Product[], targetCurrency: string): Promise<Product[]> {
    return await currencyService.convertProductPrices(products, targetCurrency, 'price');
  }

  /**
   * Cart Management
   */
  async createCart(customerId?: string): Promise<Cart> {
    const cart: Cart = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      items: [],
      subtotal: 0,
      total: 0,
      currency: 'USD',
      region: 'US',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await storage.createCart(cart);
    console.log(`🛒 Cart created: ${cart.id}`);
    
    return cart;
  }

  async addToCart(cartId: string, productId: string, quantity: number, variantId?: string): Promise<Cart> {
    const cart = await storage.getCart(cartId);
    if (!cart) throw new Error('Cart not found');

    const product = await this.getProduct(productId);
    if (!product) throw new Error('Product not found');

    // Check inventory
    if (product.inventory.trackInventory && product.inventory.quantity < quantity) {
      throw new Error('Insufficient inventory');
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId === productId && item.variantId === variantId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].total = cart.items[existingItemIndex].quantity * cart.items[existingItemIndex].price;
    } else {
      // Add new item
      const cartItem: CartItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        productId,
        variantId,
        title: product.title,
        price: product.price,
        quantity,
        total: product.price * quantity
      };
      cart.items.push(cartItem);
    }

    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    cart.total = cart.subtotal; // Add tax/shipping calculation here
    cart.updatedAt = new Date();

    await storage.updateCart(cart);
    console.log(`🛒 Added to cart: ${product.title} x${quantity}`);

    return cart;
  }

  /**
   * Order Management
   */
  async createOrder(cartId: string, customerData: {
    email: string;
    shippingAddress: Address;
    billingAddress?: Address;
  }): Promise<Order> {
    const cart = await storage.getCart(cartId);
    if (!cart) throw new Error('Cart not found');

    if (cart.items.length === 0) {
      throw new Error('Cannot create order from empty cart');
    }

    // Create order
    const order: Order = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId: cart.customerId || '',
      customerEmail: customerData.email,
      items: cart.items.map(item => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        total: item.total
      })),
      subtotal: cart.subtotal,
      tax: cart.subtotal * 0.08, // 8% tax rate
      shipping: cart.subtotal > 100 ? 0 : 9.99, // Free shipping over $100
      total: 0, // Will be calculated
      currency: cart.currency,
      status: 'pending',
      paymentStatus: 'pending',
      shippingAddress: customerData.shippingAddress,
      billingAddress: customerData.billingAddress || customerData.shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Calculate total
    order.total = order.subtotal + order.tax + order.shipping;

    await storage.createOrder(order);
    console.log(`📋 Order created: ${order.id} for ${customerData.email}`);

    // Queue background processing
    await jobQueue.add('order:process', {
      orderId: order.id,
      customerEmail: order.customerEmail,
      items: order.items,
      total: order.total
    }, { priority: 8 });

    return order;
  }

  async getOrder(id: string, currency?: string): Promise<Order | null> {
    let order = await storage.getOrder(id);
    
    if (!order) return null;

    // Convert currency if needed
    if (currency && currency !== order.currency) {
      const conversion = await currencyService.convert(order.total, order.currency, currency);
      order = {
        ...order,
        subtotal: (await currencyService.convert(order.subtotal, order.currency, currency)).convertedAmount,
        tax: (await currencyService.convert(order.tax, order.currency, currency)).convertedAmount,
        shipping: (await currencyService.convert(order.shipping, order.currency, currency)).convertedAmount,
        total: conversion.convertedAmount,
        currency,
        metadata: {
          ...order.metadata,
          originalCurrency: order.currency,
          exchangeRate: conversion.exchangeRate
        }
      };
    }

    return order;
  }

  /**
   * Currency Operations
   */
  async getSupportedCurrencies(): Promise<string[]> {
    return currencyService.getSupportedCurrencies();
  }

  async convertPrice(amount: number, from: string, to: string): Promise<any> {
    return await currencyService.convert(amount, from, to);
  }

  /**
   * Analytics and Stats
   */
  async getStats(): Promise<{
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    jobQueueStats: any;
    currencyStatus: any;
  }> {
    const products = await storage.getProducts();
    const orders = await storage.getOrders();
    
    return {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      jobQueueStats: jobQueue.getStats(),
      currencyStatus: currencyService.getStatus()
    };
  }
}

// Export singleton instance
export const commerceService = new CommerceService();
export { CommerceService };
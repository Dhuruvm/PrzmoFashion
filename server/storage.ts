import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";
import type { Product, Order, Cart, Customer } from "./commerce-types";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: Product): Promise<Product>;
  updateProduct(product: Product): Promise<Product>;
  
  // Cart methods
  getCart(id: string): Promise<Cart | undefined>;
  createCart(cart: Cart): Promise<Cart>;
  updateCart(cart: Cart): Promise<Cart>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: Order): Promise<Order>;
  updateOrder(order: Order): Promise<Order>;
  
  // Customer methods
  getCustomer(id: string): Promise<Customer | undefined>;
  createCustomer(customer: Customer): Promise<Customer>;
  updateCustomer(customer: Customer): Promise<Customer>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private carts: Map<string, Cart>;
  private orders: Map<string, Order>;
  private customers: Map<string, Customer>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.carts = new Map();
    this.orders = new Map();
    this.customers = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(product: Product): Promise<Product> {
    this.products.set(product.id, product);
    return product;
  }

  // Cart methods
  async getCart(id: string): Promise<Cart | undefined> {
    return this.carts.get(id);
  }

  async createCart(cart: Cart): Promise<Cart> {
    this.carts.set(cart.id, cart);
    return cart;
  }

  async updateCart(cart: Cart): Promise<Cart> {
    this.carts.set(cart.id, cart);
    return cart;
  }

  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }

  async updateOrder(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }

  // Customer methods
  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customer: Customer): Promise<Customer> {
    this.customers.set(customer.id, customer);
    return customer;
  }

  async updateCustomer(customer: Customer): Promise<Customer> {
    this.customers.set(customer.id, customer);
    return customer;
  }
}

export const storage = new MemStorage();

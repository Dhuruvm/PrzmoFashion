/**
 * Custom test utilities for PRZMO app
 * Provides common testing setup and helpers
 */
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/components/cart-context';

// Custom render function with all providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        {children}
      </CartProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock product data for tests
export const mockProduct = {
  id: 1,
  name: 'PRZMO Test Product',
  description: 'Test Product Description',
  price: '₹ 2,995.00',
  originalPrice: '₹ 3,495.00',
  colors: 2,
  image: 'https://example.com/test-image.jpg',
  alt: 'Test Product Image',
  inStock: true,
  sizes: ['XS', 'S', 'M', 'L', 'XL']
};

// Mock user data
export const mockUser = {
  id: '1',
  username: 'testuser',
  password: 'hashedpassword'
};

// Helper to create mock fetch responses
export const createMockFetchResponse = (data: any, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
  statusText: ok ? 'OK' : 'Error'
});

// Helper to mock API responses
export const mockApiResponse = (data: any, delay = 0) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createMockFetchResponse(data));
    }, delay);
  });
};

// Helper to simulate user interactions with delays
export const userInteractionDelay = (ms = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Export everything
export * from '@testing-library/react';
export { customRender as render };
export { default as userEvent } from '@testing-library/user-event';
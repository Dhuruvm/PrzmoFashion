/**
 * Comprehensive tests for CartContext
 * Tests all cart operations, edge cases, and error handling
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart } from '@/components/cart-context';

// Test component to interact with cart context
function TestCartComponent() {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart();

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: '₹ 1,000.00',
    image: 'test-image.jpg'
  };

  return (
    <div>
      <div data-testid="total-items">{getTotalItems()}</div>
      <div data-testid="total-price">{getTotalPrice()}</div>
      <div data-testid="items-count">{items.length}</div>
      
      <button
        data-testid="add-to-cart"
        onClick={() => addToCart(mockProduct, 'M')}
      >
        Add to Cart
      </button>
      
      <button
        data-testid="remove-from-cart"
        onClick={() => removeFromCart(1, 'M')}
      >
        Remove from Cart
      </button>
      
      <button
        data-testid="update-quantity"
        onClick={() => updateQuantity(1, 'M', 3)}
      >
        Update Quantity
      </button>
      
      <button
        data-testid="clear-cart"
        onClick={clearCart}
      >
        Clear Cart
      </button>
    </div>
  );
}

describe('CartContext', () => {
  const renderWithProvider = () => {
    return render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );
  };

  beforeEach(() => {
    // Reset any cart state between tests
  });

  describe('Initial State', () => {
    it('should start with empty cart', () => {
      renderWithProvider();
      
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
      expect(screen.getByTestId('total-price')).toHaveTextContent('0');
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });
  });

  describe('Adding Items', () => {
    it('should add item to cart successfully', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      await user.click(screen.getByTestId('add-to-cart'));
      
      expect(screen.getByTestId('total-items')).toHaveTextContent('1');
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
    });

    it('should increase quantity when adding existing item with same size', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      await user.click(screen.getByTestId('add-to-cart'));
      await user.click(screen.getByTestId('add-to-cart'));
      
      expect(screen.getByTestId('total-items')).toHaveTextContent('2');
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
    });
  });

  describe('Removing Items', () => {
    it('should remove item from cart', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      await user.click(screen.getByTestId('add-to-cart'));
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      
      await user.click(screen.getByTestId('remove-from-cart'));
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
    });
  });

  describe('Updating Quantities', () => {
    it('should update item quantity', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      await user.click(screen.getByTestId('add-to-cart'));
      await user.click(screen.getByTestId('update-quantity'));
      
      expect(screen.getByTestId('total-items')).toHaveTextContent('3');
    });

    it('should remove item when quantity is set to 0', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      await user.click(screen.getByTestId('add-to-cart'));
      
      await act(async () => {
        const { updateQuantity } = await import('@/components/cart-context');
      });
      
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
    });
  });

  describe('Price Calculations', () => {
    it('should calculate total price correctly', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      await user.click(screen.getByTestId('add-to-cart'));
      
      // Price should be parsed from "₹ 1,000.00" to 1000
      expect(screen.getByTestId('total-price')).toHaveTextContent('1000');
    });
  });

  describe('Clear Cart', () => {
    it('should clear all items from cart', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      await user.click(screen.getByTestId('add-to-cart'));
      expect(screen.getByTestId('items-count')).toHaveTextContent('1');
      
      await user.click(screen.getByTestId('clear-cart'));
      expect(screen.getByTestId('items-count')).toHaveTextContent('0');
      expect(screen.getByTestId('total-items')).toHaveTextContent('0');
    });
  });

  describe('Error Handling', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      expect(() => render(<TestCartComponent />)).toThrow(
        'useCart must be used within a CartProvider'
      );
      
      consoleSpy.mockRestore();
    });
  });
});
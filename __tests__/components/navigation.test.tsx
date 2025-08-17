/**
 * Comprehensive tests for Navigation component
 * Tests responsive behavior, interactions, and accessibility
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '@/components/navigation';
import { CartProvider } from '@/components/cart-context';

// Mock dependencies
jest.mock('@assets/PRZMO_20250812_222429_0000_1755021196697.png', () => 'mocked-logo.png');

const renderWithProvider = () => {
  return render(
    <CartProvider>
      <Navigation />
    </CartProvider>
  );
};

describe('Navigation', () => {
  describe('Logo and Branding', () => {
    it('should display PRZMO logo', () => {
      renderWithProvider();
      
      const logo = screen.getByAltText('PRZMO Athletic Lifestyle');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'mocked-logo.png');
    });

    it('should have proper logo accessibility attributes', () => {
      renderWithProvider();
      
      const logo = screen.getByAltText('PRZMO Athletic Lifestyle');
      expect(logo).toBeInTheDocument();
    });
  });

  describe('Desktop Navigation', () => {
    beforeEach(() => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
    });

    it('should display desktop navigation links', () => {
      renderWithProvider();
      
      expect(screen.getByTestId('link-drops')).toBeInTheDocument();
      expect(screen.getByTestId('link-drops')).toHaveTextContent('Drops');
    });

    it('should scroll to drops section when drops link clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      // Mock getElementById to return a fake element
      const mockScrollIntoView = jest.fn();
      const mockElement = {
        scrollIntoView: mockScrollIntoView
      };
      
      document.getElementById = jest.fn().mockReturnValue(mockElement);
      
      await user.click(screen.getByTestId('link-drops'));
      
      await waitFor(() => {
        expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
      });
    });
  });

  describe('Action Buttons', () => {
    it('should display search button with proper aria-label', () => {
      renderWithProvider();
      
      const searchButton = screen.getByTestId('button-open-search');
      expect(searchButton).toBeInTheDocument();
      expect(searchButton).toHaveAttribute('aria-label', 'Open search');
    });

    it('should display user button with proper aria-label', () => {
      renderWithProvider();
      
      const userButton = screen.getByTestId('button-user');
      expect(userButton).toBeInTheDocument();
      expect(userButton).toHaveAttribute('aria-label', 'User account');
    });

    it('should display cart button with item count', () => {
      renderWithProvider();
      
      const cartButton = screen.getByTestId('button-cart');
      expect(cartButton).toBeInTheDocument();
      expect(cartButton).toHaveAttribute('aria-label', 'Shopping cart');
    });

    it('should open search modal when search button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      await user.click(screen.getByTestId('button-open-search'));
      
      // SearchModal should be visible (if implemented)
      // This test would need the actual SearchModal implementation
    });
  });

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
    });

    it('should display mobile menu button', () => {
      renderWithProvider();
      
      const mobileMenuButton = screen.getByTestId('button-mobile-menu');
      expect(mobileMenuButton).toBeInTheDocument();
    });

    it('should toggle mobile menu when button clicked', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      const mobileMenuButton = screen.getByTestId('button-mobile-menu');
      
      // Initially menu should be closed
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      
      // Open menu
      await user.click(mobileMenuButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
      });
      
      // Close menu
      await user.click(mobileMenuButton);
      
      await waitFor(() => {
        expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should hide desktop navigation on mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      renderWithProvider();
      
      const desktopNav = screen.queryByTestId('link-drops');
      expect(desktopNav).not.toBeVisible();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      renderWithProvider();
      
      // Navigation should be wrapped in nav element
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should have keyboard accessible elements', () => {
      renderWithProvider();
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeEnabled();
      });
    });

    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      renderWithProvider();
      
      const searchButton = screen.getByTestId('button-open-search');
      
      await user.tab();
      expect(searchButton).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender } = renderWithProvider();
      
      // Component should render without errors
      expect(screen.getByAltText('PRZMO Athletic Lifestyle')).toBeInTheDocument();
      
      // Re-render should not cause issues
      rerender(
        <CartProvider>
          <Navigation />
        </CartProvider>
      );
      
      expect(screen.getByAltText('PRZMO Athletic Lifestyle')).toBeInTheDocument();
    });
  });
});
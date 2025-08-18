/**
 * Performance Optimization Utilities
 * Advanced intelligent optimizations for the PRZMO app
 */

import { useMemo, useCallback, useEffect, useRef } from 'react';
import React from 'react';

// Debounce utility for search and input operations
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

// Optimized cart calculation with memoization
export const useOptimizedCartCalculations = (items: any[]) => {
  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[₹,\s]/g, ''));
      return sum + (price * item.quantity);
    }, 0);
    
    const shipping = subtotal > 2500 ? 0 : 150; // Free shipping over ₹2500
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }, [items]);
};

// Optimized search functionality
export const useOptimizedSearch = (items: any[], searchTerm: string) => {
  const debouncedSearch = useMemo(
    () => debounce((term: string) => term, 300),
    []
  );

  return useMemo(() => {
    if (!searchTerm) return items;
    
    const normalizedTerm = searchTerm.toLowerCase().trim();
    return items.filter(item => 
      item.name.toLowerCase().includes(normalizedTerm) ||
      item.description.toLowerCase().includes(normalizedTerm) ||
      item.category?.toLowerCase().includes(normalizedTerm)
    );
  }, [items, searchTerm]);
};

// Image lazy loading optimizer
export const useImageLazyLoad = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observerRef.current?.unobserve(img);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    return () => observerRef.current?.disconnect();
  }, []);
  
  const registerImage = useCallback((img: HTMLImageElement | null) => {
    if (img && observerRef.current) {
      observerRef.current.observe(img);
    }
  }, []);
  
  return registerImage;
};

// Form validation optimizer
export const useOptimizedValidation = (initialData: Record<string, any>) => {
  const errors = useRef<Record<string, string>>({});
  
  const validate = useCallback((field: string, value: any) => {
    switch (field) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.current[field] = 'Please enter a valid email address';
        } else {
          delete errors.current[field];
        }
        break;
      case 'phone':
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value)) {
          errors.current[field] = 'Please enter a valid 10-digit mobile number';
        } else {
          delete errors.current[field];
        }
        break;
      case 'pincode':
        const pincodeRegex = /^\d{6}$/;
        if (!pincodeRegex.test(value)) {
          errors.current[field] = 'Please enter a valid 6-digit pincode';
        } else {
          delete errors.current[field];
        }
        break;
      default:
        if (!value || value.trim() === '') {
          errors.current[field] = 'This field is required';
        } else {
          delete errors.current[field];
        }
    }
    return errors.current;
  }, []);
  
  const validateAll = useCallback((data: Record<string, any>) => {
    Object.keys(data).forEach(key => validate(key, data[key]));
    return Object.keys(errors.current).length === 0;
  }, [validate]);
  
  return { validate, validateAll, errors: errors.current };
};

// Error boundary utility
export const withErrorBoundary = <T extends object>(
  Component: React.ComponentType<T>
) => {
  return (props: T) => {
    try {
      return React.createElement(Component, props);
    } catch (error) {
      console.error('Component error:', error);
      return React.createElement(
        'div', 
        { className: "p-4 bg-red-50 border border-red-200 rounded-lg" },
        React.createElement('h3', { className: "text-red-800 font-medium" }, 'Something went wrong'),
        React.createElement('p', { className: "text-red-600 text-sm mt-1" }, 'Please refresh the page or try again later.')
      );
    }
  };
};

// Analytics tracking utility
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    // In production, integrate with analytics services
    console.log('Analytics Event:', eventName, properties);
  }
};
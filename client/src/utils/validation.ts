/**
 * Input validation utilities for PRZMO Athletic Lifestyle App
 * Production-ready validation with comprehensive error messages
 */
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password is too long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number');

export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters long')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// Product validation schemas
export const productNameSchema = z
  .string()
  .min(1, 'Product name is required')
  .min(3, 'Product name must be at least 3 characters long')
  .max(100, 'Product name is too long');

export const priceSchema = z
  .string()
  .regex(/^₹\s?[\d,]+\.?\d{0,2}$/, 'Please enter a valid price format (e.g., ₹ 2,995.00)')
  .transform((val) => {
    const numericValue = parseFloat(val.replace(/[₹,\s]/g, ''));
    return numericValue;
  })
  .refine((val) => val > 0, 'Price must be greater than 0')
  .refine((val) => val <= 999999, 'Price is too high');

export const sizeSchema = z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'], {
  errorMap: () => ({ message: 'Please select a valid size' })
});

export const quantitySchema = z
  .number()
  .int('Quantity must be a whole number')
  .min(1, 'Quantity must be at least 1')
  .max(99, 'Quantity cannot exceed 99');

// Form validation schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const registerFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const newsletterSchema = z.object({
  email: emailSchema,
  consent: z.boolean().refine((val) => val === true, {
    message: 'Please agree to receive newsletter emails'
  })
});

export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required').max(100, 'Subject is too long'),
  message: z.string().min(1, 'Message is required').min(10, 'Message must be at least 10 characters long').max(1000, 'Message is too long')
});

export const addressSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  addressLine1: z.string().min(1, 'Address is required').max(100, 'Address is too long'),
  addressLine2: z.string().max(100, 'Address is too long').optional(),
  city: z.string().min(1, 'City is required').max(50, 'City name is too long'),
  state: z.string().min(1, 'State is required').max(50, 'State name is too long'),
  postalCode: z.string().min(1, 'Postal code is required').regex(/^[0-9]{6}$/, 'Please enter a valid 6-digit postal code'),
  country: z.string().min(1, 'Country is required').default('India'),
  phone: phoneSchema.optional()
});

// Utility functions for validation
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown): { success: boolean; error?: string; data?: T } => {
  try {
    const data = schema.parse(value);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || 'Validation failed' 
      };
    }
    return { 
      success: false, 
      error: 'Validation failed' 
    };
  }
};

export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; errors?: Record<string, string>; data?: T } => {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

// Sanitization utilities
export const sanitizeUtils = {
  // Remove HTML tags and potentially harmful content
  sanitizeText: (text: string): string => {
    return text.replace(/<[^>]*>?/gm, '').trim();
  },

  // Sanitize and format phone numbers
  sanitizePhone: (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  },

  // Sanitize and format email
  sanitizeEmail: (email: string): string => {
    return email.toLowerCase().trim();
  },

  // Remove extra whitespace
  sanitizeWhitespace: (text: string): string => {
    return text.replace(/\s+/g, ' ').trim();
  }
};

// Custom validation hooks for React components
export const useFormValidation = <T extends Record<string, any>>(
  schema: z.ZodSchema<T>
) => {
  const validate = (data: Partial<T>): { isValid: boolean; errors: Record<string, string> } => {
    const result = validateForm(schema, data);
    return {
      isValid: result.success,
      errors: result.errors || {}
    };
  };

  const validateField = (fieldName: keyof T, value: any): string | undefined => {
    try {
      const fieldSchema = schema.shape[fieldName as string];
      if (fieldSchema) {
        fieldSchema.parse(value);
      }
      return undefined;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0]?.message;
      }
      return 'Validation failed';
    }
  };

  return { validate, validateField };
};
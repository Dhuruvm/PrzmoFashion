import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { trackEvent } from "@/utils/performance-optimizer";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: any, size: string) => void;
  removeFromCart: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isItemInCart: (id: number, size: string) => boolean;
  getItemQuantity: (id: number, size: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Optimized add to cart with analytics tracking
  const addToCart = useCallback((product: any, size: string) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.size === size);
      
      if (existingItem) {
        trackEvent('cart_item_updated', { 
          product_id: product.id, 
          size, 
          old_quantity: existingItem.quantity,
          new_quantity: existingItem.quantity + 1 
        });
        
        return prev.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      trackEvent('cart_item_added', { 
        product_id: product.id, 
        product_name: product.name,
        size, 
        price: product.price 
      });
      
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity: 1
      }];
    });
  }, []);

  // Optimized remove with analytics
  const removeFromCart = useCallback((id: number, size: string) => {
    setItems(prev => {
      const itemToRemove = prev.find(item => item.id === id && item.size === size);
      if (itemToRemove) {
        trackEvent('cart_item_removed', { 
          product_id: id, 
          size, 
          quantity_removed: itemToRemove.quantity 
        });
      }
      return prev.filter(item => !(item.id === id && item.size === size));
    });
  }, []);

  // Optimized quantity update
  const updateQuantity = useCallback((id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear cart with analytics
  const clearCart = useCallback(() => {
    trackEvent('cart_cleared', { items_count: items.length });
    setItems([]);
  }, [items.length]);

  // Memoized calculations for better performance
  const getTotalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  }, [items]);

  // Additional optimized helpers
  const isItemInCart = useCallback((id: number, size: string) => {
    return items.some(item => item.id === id && item.size === size);
  }, [items]);

  const getItemQuantity = useCallback((id: number, size: string) => {
    const item = items.find(item => item.id === id && item.size === size);
    return item?.quantity || 0;
  }, [items]);

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems: () => getTotalItems,
    getTotalPrice: () => getTotalPrice,
    isItemInCart,
    getItemQuantity
  }), [items, addToCart, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice, isItemInCart, getItemQuantity]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
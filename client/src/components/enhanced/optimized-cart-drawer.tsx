import { memo } from "react";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../cart-context";
import { useOptimizedCartCalculations } from "@/utils/performance-optimizer";

interface OptimizedCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Memoized cart item component for better performance
const CartItemComponent = memo(({ item, updateQuantity }: { 
  item: any; 
  updateQuantity: (id: number, size: string, quantity: number) => void;
}) => (
  <div key={`${item.id}-${item.size}`} className="flex gap-4 py-4 border-b border-gray-100">
    <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
      <img 
        src={item.image} 
        alt={item.name}
        className="w-full h-full object-cover rounded"
        loading="lazy"
      />
    </div>
    
    <div className="flex-1">
      <h4 className="font-medium text-black mb-1" data-testid={`text-item-name-${item.id}`}>
        {item.name}
      </h4>
      <div className="text-sm text-gray-500 mb-2">
        <span>Size: {item.size}</span>
        <span className="mx-2">•</span>
        <span className="font-medium text-black">{item.price}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
          className="h-8 w-8 p-0"
          data-testid={`button-decrease-${item.id}`}
        >
          <Minus className="w-3 h-3" />
        </Button>
        
        <span className="w-8 text-center font-medium" data-testid={`text-quantity-${item.id}`}>
          {item.quantity}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
          className="h-8 w-8 p-0"
          data-testid={`button-increase-${item.id}`}
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  </div>
));

CartItemComponent.displayName = 'CartItemComponent';

const OptimizedCartDrawer = memo(({ isOpen, onClose }: OptimizedCartDrawerProps) => {
  const { items: cartItems, updateQuantity } = useCart();
  
  // Use optimized calculations
  const { subtotal, shipping, tax, total, itemCount } = useOptimizedCartCalculations(cartItems);

  const handleCheckout = () => {
    console.log("Proceeding to optimized checkout with items:", cartItems);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col" aria-describedby="cart-description">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold text-black flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Cart ({itemCount})
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              data-testid="button-close-cart"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <SheetDescription id="cart-description">
            Review and manage items in your shopping cart
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some items to get started!</p>
              <Button
                onClick={onClose}
                className="bg-przmo-red hover:bg-red-600 text-white px-8"
                data-testid="button-continue-shopping"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <CartItemComponent 
                  key={`${item.id}-${item.size}`}
                  item={item}
                  updateQuantity={updateQuantity}
                />
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t bg-white p-6">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-black">₹ {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-black">
                  {parseFloat(shipping) === 0 ? 'Free' : `₹ ${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (GST 18%)</span>
                <span className="text-black">₹ {tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span className="text-black">Total</span>
                <span className="text-black">₹ {total}</span>
              </div>
              {parseFloat(shipping) === 0 && (
                <p className="text-xs text-green-600 text-center">
                  🎉 You qualify for free shipping!
                </p>
              )}
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full h-12 bg-przmo-red hover:bg-red-600 text-white font-bold uppercase tracking-wider"
              data-testid="button-checkout"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
});

OptimizedCartDrawer.displayName = 'OptimizedCartDrawer';

export default OptimizedCartDrawer;
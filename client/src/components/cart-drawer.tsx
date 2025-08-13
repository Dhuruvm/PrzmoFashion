import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "./cart-context";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items: cartItems, updateQuantity, getTotalPrice } = useCart();

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    console.log("Proceeding to checkout with items:", cartItems);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold text-black flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              Cart ({cartItems.length})
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
                <div key={`${item.id}-${item.size}`} className="flex gap-4 py-4 border-b border-gray-100">
                  <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-black mb-1" data-testid={`text-item-name-${item.id}`}>
                      {item.name}
                    </h4>
                    <div className="text-sm text-gray-500 mb-2">
                      Size {item.size}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 p-0 rounded-none border-gray-300"
                          data-testid={`button-decrease-quantity-${item.id}`}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-medium min-w-[2ch] text-center" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 p-0 rounded-none border-gray-300"
                          data-testid={`button-increase-quantity-${item.id}`}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="font-bold text-black" data-testid={`text-item-price-${item.id}`}>
                        {item.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-6">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium" data-testid="text-subtotal">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping (COD)</span>
                <span className="font-medium" data-testid="text-shipping">
                  {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span data-testid="text-total">₹{total.toFixed(2)}</span>
              </div>
              {subtotal < 100 && (
                <p className="text-xs text-gray-500 text-center">
                  Free shipping on orders over ₹2500
                </p>
              )}
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full h-12 bg-przmo-red hover:bg-red-600 text-white font-bold uppercase tracking-wider rounded-none transition-colors"
              data-testid="button-checkout"
            >
              Checkout - ₹{total.toFixed(2)}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
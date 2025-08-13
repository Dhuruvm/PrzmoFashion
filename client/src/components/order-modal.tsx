import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Package, Truck, MapPin } from "lucide-react";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
  } | null;
}

export default function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    size: "",
    quantity: 1,
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleSubmit = async () => {
    if (!product) return;
    
    setIsSubmitting(true);
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setOrderComplete(true);
  };

  const resetModal = () => {
    setStep(1);
    setOrderComplete(false);
    setOrderData({
      size: "",
      quantity: 1,
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      notes: ""
    });
    onClose();
  };

  if (!product) return null;

  if (orderComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={resetModal}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">Your order has been placed successfully. You'll receive a confirmation email shortly.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span>Processing</span>
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Shipped</span>
                </div>
                <div className="flex-1 h-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            <Button onClick={resetModal} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Fill in your details to place an order with Cash on Delivery
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Summary */}
          <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
            <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
            <div className="flex-1">
              <h3 className="font-medium text-black">{product.name}</h3>
              <p className="text-sm text-gray-600">Price: {product.price}</p>
              <p className="text-xs text-green-600 font-medium mt-1">✓ Cash on Delivery Available</p>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-medium text-black">Product Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Select value={orderData.size} onValueChange={(value) => setOrderData({...orderData, size: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Select value={orderData.quantity.toString()} onValueChange={(value) => setOrderData({...orderData, quantity: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                className="w-full"
                disabled={!orderData.size}
              >
                Continue to Delivery Details
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium text-black">Delivery Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={orderData.name}
                    onChange={(e) => setOrderData({...orderData, name: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={orderData.phone}
                    onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={orderData.email}
                  onChange={(e) => setOrderData({...orderData, email: e.target.value})}
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="address">Complete Address *</Label>
                <Textarea
                  id="address"
                  value={orderData.address}
                  onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                  placeholder="House number, building, street, area"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={orderData.city}
                    onChange={(e) => setOrderData({...orderData, city: e.target.value})}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={orderData.state}
                    onChange={(e) => setOrderData({...orderData, state: e.target.value})}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={orderData.pincode}
                    onChange={(e) => setOrderData({...orderData, pincode: e.target.value})}
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Special Instructions (Optional)</Label>
                <Textarea
                  id="notes"
                  value={orderData.notes}
                  onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                  placeholder="Any special delivery instructions"
                  rows={2}
                />
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1"
                  disabled={!orderData.name || !orderData.phone || !orderData.address || !orderData.city || !orderData.state || !orderData.pincode || isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order (COD)"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Mail, 
  Package, 
  CheckCircle, 
  XCircle, 
  Truck,
  User,
  MapPin,
  DollarSign
} from 'lucide-react';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export function OrderManagement() {
  const { toast } = useToast();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  
  const [orderForm, setOrderForm] = useState({
    customerName: '',
    customerEmail: '',
    items: [
      {
        name: 'PRZMO Performance Tee',
        price: 85.00,
        quantity: 1,
        size: 'L',
        color: 'Midnight Black'
      }
    ] as OrderItem[],
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'United States'
    }
  });

  const [testEmailForm, setTestEmailForm] = useState({
    email: '',
    name: ''
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingOrder(true);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderForm)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Order Created Successfully!",
          description: `Order #${data.order.orderNumber} has been created and confirmation email sent`,
        });

        // Reset form
        setOrderForm({
          ...orderForm,
          customerName: '',
          customerEmail: '',
          shippingAddress: {
            street: '',
            city: '',
            state: '',
            zip: '',
            country: 'United States'
          }
        });
      } else {
        toast({
          title: "Order Creation Failed",
          description: data.message || "Failed to create order",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Order creation error:', error);
      toast({
        title: "Error",
        description: "An error occurred while creating the order",
        variant: "destructive"
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);

    try {
      const response = await fetch('/api/orders/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testEmailForm)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Test Email Sent!",
          description: `Professional order confirmation sent to ${testEmailForm.email}`,
        });

        setTestEmailForm({ email: '', name: '' });
      } else {
        toast({
          title: "Test Email Failed",
          description: data.message || "Failed to send test email",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending test email",
        variant: "destructive"
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const addOrderItem = () => {
    setOrderForm({
      ...orderForm,
      items: [
        ...orderForm.items,
        {
          name: '',
          price: 0,
          quantity: 1,
          size: '',
          color: ''
        }
      ]
    });
  };

  const removeOrderItem = (index: number) => {
    setOrderForm({
      ...orderForm,
      items: orderForm.items.filter((_, i) => i !== index)
    });
  };

  const updateOrderItem = (index: number, field: string, value: any) => {
    const updatedItems = orderForm.items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setOrderForm({ ...orderForm, items: updatedItems });
  };

  const calculateTotal = () => {
    const subtotal = orderForm.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15.99;
    const tax = subtotal * 0.08;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax };
  };

  const totals = calculateTotal();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <ShoppingCart className="h-8 w-8" />
          <span>PRZMO Order Management</span>
        </h1>
        <p className="text-gray-600">Professional order processing with premium email notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Order */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Create New Order</span>
            </CardTitle>
            <CardDescription>
              Create a professional order with automated email confirmation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-4">
              {/* Customer Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={orderForm.customerEmail}
                    onChange={(e) => setOrderForm({ ...orderForm, customerEmail: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <Label>Order Items</Label>
                {orderForm.items.map((item, index) => (
                  <div key={index} className="border p-4 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {orderForm.items.length > 1 && (
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOrderItem(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Product name"
                        value={item.name}
                        onChange={(e) => updateOrderItem(index, 'name', e.target.value)}
                        required
                      />
                      <Input
                        type="number"
                        placeholder="Price"
                        value={item.price}
                        onChange={(e) => updateOrderItem(index, 'price', parseFloat(e.target.value) || 0)}
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        min="1"
                        required
                      />
                      <Input
                        placeholder="Size"
                        value={item.size || ''}
                        onChange={(e) => updateOrderItem(index, 'size', e.target.value)}
                      />
                      <Input
                        placeholder="Color"
                        value={item.color || ''}
                        onChange={(e) => updateOrderItem(index, 'color', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addOrderItem} className="w-full">
                  Add Item
                </Button>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <Label>Shipping Address</Label>
                <Input
                  placeholder="Street Address"
                  value={orderForm.shippingAddress.street}
                  onChange={(e) => setOrderForm({
                    ...orderForm,
                    shippingAddress: { ...orderForm.shippingAddress, street: e.target.value }
                  })}
                  required
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    placeholder="City"
                    value={orderForm.shippingAddress.city}
                    onChange={(e) => setOrderForm({
                      ...orderForm,
                      shippingAddress: { ...orderForm.shippingAddress, city: e.target.value }
                    })}
                    required
                  />
                  <Input
                    placeholder="State"
                    value={orderForm.shippingAddress.state}
                    onChange={(e) => setOrderForm({
                      ...orderForm,
                      shippingAddress: { ...orderForm.shippingAddress, state: e.target.value }
                    })}
                    required
                  />
                  <Input
                    placeholder="ZIP Code"
                    value={orderForm.shippingAddress.zip}
                    onChange={(e) => setOrderForm({
                      ...orderForm,
                      shippingAddress: { ...orderForm.shippingAddress, zip: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <h4 className="font-medium">Order Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${totals.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${totals.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>Total:</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isCreatingOrder} className="w-full">
                {isCreatingOrder ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Order...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Create Order & Send Email</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Test Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <span>Test Email System</span>
            </CardTitle>
            <CardDescription>
              Send a test order confirmation email to verify the professional design
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <Label htmlFor="testName">Recipient Name</Label>
                <Input
                  id="testName"
                  value={testEmailForm.name}
                  onChange={(e) => setTestEmailForm({ ...testEmailForm, name: e.target.value })}
                  placeholder="Test Customer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="testEmail">Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  value={testEmailForm.email}
                  onChange={(e) => setTestEmailForm({ ...testEmailForm, email: e.target.value })}
                  placeholder="test@example.com"
                  required
                />
              </div>

              <Button type="submit" disabled={isSendingTest} className="w-full">
                {isSendingTest ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending Test Email...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>Send Test Email</span>
                  </div>
                )}
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Test Email Features:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Professional PRZMO branding</li>
                  <li>• Premium product details</li>
                  <li>• Order tracking buttons</li>
                  <li>• Mobile-responsive design</li>
                  <li>• Anti-spam optimizations</li>
                </ul>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Email Features */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Email Features</CardTitle>
          <CardDescription>
            PRZMO email system includes premium features to ensure professional delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium mb-2">Inbox Delivery</h4>
              <p className="text-sm text-gray-600">
                Proper authentication headers to avoid spam folders
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium mb-2">Order Tracking</h4>
              <p className="text-sm text-gray-600">
                Interactive buttons for order tracking and management
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium mb-2">Premium Branding</h4>
              <p className="text-sm text-gray-600">
                Luxury brand aesthetics matching PRZMO's premium positioning
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
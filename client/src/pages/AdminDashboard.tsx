/**
 * Headless Commerce Admin Dashboard
 * Demonstrates the complete transformation to Shopify-like functionality
 */

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  ShoppingCart, 
  Zap, 
  DollarSign, 
  TrendingUp, 
  Package, 
  Users,
  Activity,
  Settings,
  Mail,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobStats {
  processing: number;
  completed: number;
  failed: number;
  waiting: number;
  active: number;
}

interface CommerceStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  conversionRate: number;
  averageOrderValue: number;
}

interface CurrencyData {
  supported: string[];
  status: {
    isOnline: boolean;
    lastUpdated: string;
    baseCurrency: string;
  };
}

export function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [conversionAmount, setConversionAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  // Job queue statistics
  const { data: jobStats, isLoading: jobStatsLoading } = useQuery<JobStats>({
    queryKey: ['/api/jobs/stats'],
    refetchInterval: 2000, // Real-time updates every 2 seconds
  });

  // Commerce statistics
  const { data: commerceStats, isLoading: commerceStatsLoading } = useQuery<CommerceStats>({
    queryKey: ['/api/commerce/stats'],
    refetchInterval: 5000, // Update every 5 seconds
  });

  // Currency information
  const { data: currencyData, isLoading: currencyLoading } = useQuery<CurrencyData>({
    queryKey: ['/api/currencies'],
  });

  // Order processing mutation
  const processOrderMutation = useMutation({
    mutationFn: async (data: { orderId?: string; customerEmail?: string }) => {
      const response = await fetch('/api/test/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to process order');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Order Processing Queued",
        description: `Job ID: ${data.data.jobId}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs/stats'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Currency conversion mutation
  const convertCurrencyMutation = useMutation({
    mutationFn: async (data: { amount: number; from: string; to: string }) => {
      const response = await fetch('/api/currencies/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to convert currency');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Currency Converted",
        description: `${conversionAmount} ${fromCurrency} = ${data.data.convertedAmount.toFixed(2)} ${toCurrency}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Conversion Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleProcessOrder = () => {
    processOrderMutation.mutate({
      orderId: `order_${Date.now()}`,
      customerEmail: 'customer@example.com',
    });
  };

  const handleCurrencyConversion = () => {
    convertCurrencyMutation.mutate({
      amount: conversionAmount,
      from: fromCurrency,
      to: toCurrency,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Headless Commerce Dashboard</h1>
            <p className="text-gray-600 mt-1">
              PRZMO transformed into a powerful Shopify-like platform with BullMQ, Cashify & Medusa capabilities
            </p>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="h-4 w-4 mr-1" />
            System Online
          </Badge>
        </div>

        {/* Real-time Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {jobStatsLoading ? '...' : jobStats?.active || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Background processing active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${commerceStatsLoading ? '...' : (commerceStats?.totalRevenue || 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Multi-currency enabled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {commerceStatsLoading ? '...' : commerceStats?.totalProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Headless commerce ready
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {commerceStatsLoading ? '...' : commerceStats?.totalCustomers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Customer management
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jobs">Job Queue</TabsTrigger>
            <TabsTrigger value="commerce">Commerce</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="test">Testing</TabsTrigger>
          </TabsList>

          {/* Job Queue Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  BullMQ-Style Job Processing
                </CardTitle>
                <CardDescription>
                  Real-time background job processing for orders, emails, and commerce operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {jobStatsLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{jobStats?.active || 0}</div>
                      <div className="text-sm text-gray-600">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{jobStats?.waiting || 0}</div>
                      <div className="text-sm text-gray-600">Waiting</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{jobStats?.processing || 0}</div>
                      <div className="text-sm text-gray-600">Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{jobStats?.completed || 0}</div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{jobStats?.failed || 0}</div>
                      <div className="text-sm text-gray-600">Failed</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commerce Tab */}
          <TabsContent value="commerce" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Medusa-Style Headless Commerce
                </CardTitle>
                <CardDescription>
                  Complete e-commerce functionality with products, orders, and customer management
                </CardDescription>
              </CardHeader>
              <CardContent>
                {commerceStatsLoading ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Total Orders</Label>
                      <div className="text-3xl font-bold">{commerceStats?.totalOrders || 0}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Conversion Rate</Label>
                      <div className="text-3xl font-bold">{commerceStats?.conversionRate || 0}%</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Avg Order Value</Label>
                      <div className="text-3xl font-bold">${commerceStats?.averageOrderValue || 0}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Currency Tab */}
          <TabsContent value="currency" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Cashify-Style Currency Conversion
                </CardTitle>
                <CardDescription>
                  Real-time multi-currency support with live exchange rates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Currency Status */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Currency Service Status</div>
                      <div className="text-sm text-gray-600">
                        {currencyLoading ? 'Loading...' : 
                          currencyData?.status?.isOnline ? 'Online' : 'Offline'}
                      </div>
                    </div>
                    <Badge variant={currencyData?.status?.isOnline ? "default" : "destructive"}>
                      {currencyLoading ? '...' : 
                        currencyData?.status?.isOnline ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {/* Currency Converter */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={conversionAmount}
                        onChange={(e) => setConversionAmount(Number(e.target.value))}
                        placeholder="100"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="from">From Currency</Label>
                      <Input
                        id="from"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
                        placeholder="USD"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to">To Currency</Label>
                      <Input
                        id="to"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
                        placeholder="EUR"
                      />
                    </div>
                    <Button 
                      onClick={handleCurrencyConversion}
                      disabled={convertCurrencyMutation.isPending}
                    >
                      {convertCurrencyMutation.isPending ? 'Converting...' : 'Convert'}
                    </Button>
                  </div>

                  {/* Supported Currencies */}
                  <div>
                    <Label>Supported Currencies</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {currencyLoading ? (
                        <div className="text-sm text-gray-600">Loading currencies...</div>
                      ) : (
                        currencyData?.supported?.map((currency) => (
                          <Badge key={currency} variant="outline">
                            {currency}
                          </Badge>
                        )) || (
                          <div className="text-sm text-gray-600">No currencies loaded</div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="test" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Testing & Demonstration
                </CardTitle>
                <CardDescription>
                  Test the complete headless commerce transformation functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Processing Test */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Order Processing Test</h3>
                    <p className="text-sm text-gray-600">
                      Queue a background job to process an order with email notifications
                    </p>
                  </div>
                  <Button 
                    onClick={handleProcessOrder}
                    disabled={processOrderMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {processOrderMutation.isPending ? 'Processing...' : 'Process Test Order'}
                  </Button>
                </div>

                {/* System Capabilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">✅ Implemented Features</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• BullMQ-style job processing</li>
                      <li>• Cashify-style currency conversion</li>
                      <li>• Medusa-style headless commerce</li>
                      <li>• Real-time background processing</li>
                      <li>• Multi-currency support</li>
                      <li>• Email notification system</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">🚀 Enterprise Capabilities</h4>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• Scalable job queue system</li>
                      <li>• Real-time currency rates</li>
                      <li>• Complete order management</li>
                      <li>• Customer data handling</li>
                      <li>• Product inventory tracking</li>
                      <li>• Analytics & reporting</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
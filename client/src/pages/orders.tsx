import React from 'react';
import { OrderManagement } from '@/components/order-management';

export function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <OrderManagement />
    </div>
  );
}
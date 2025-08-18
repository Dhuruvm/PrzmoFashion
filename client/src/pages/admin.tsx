import React from 'react';
import { SMTPAdminPanel } from '@/components/smtp-admin-panel';

export function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SMTPAdminPanel />
    </div>
  );
}
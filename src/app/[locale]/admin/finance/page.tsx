'use client';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { DollarSign, CreditCard, ArrowDownCircle, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AdminFinancePage() {
  // Auth via HttpOnly cookie
  const [stats, setStats] = useState<Record<string, unknown>>({});

  useEffect(() => {
    fetch('/api/admin/finance', { })
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.data); });
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">财务管理</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="总收入" value={formatCurrency(Number(stats.totalRevenue || 0))} icon={DollarSign} iconColor="text-green-600 bg-green-100" />
          <StatsCard title="待处理支付" value={String(stats.pendingPayments || 0)} icon={CreditCard} iconColor="text-orange-600 bg-orange-100" />
          <StatsCard title="待处理提现" value={String(stats.pendingWithdrawals || 0)} icon={ArrowDownCircle} iconColor="text-red-600 bg-red-100" />
          <StatsCard title="已开发票" value={String(stats.issuedInvoices || 0)} icon={FileText} iconColor="text-blue-600 bg-blue-100" />
        </div>
        <Card padding="lg">
          <h2 className="font-semibold text-gray-900 mb-4">交易记录</h2>
          <p className="text-gray-500 text-sm">详细的财务报表和交易记录即将上线</p>
        </Card>
      </div>
    </AdminLayout>
  );
}

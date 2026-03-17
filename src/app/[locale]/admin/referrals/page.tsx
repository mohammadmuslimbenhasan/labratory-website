'use client';
import { AdminLayout } from '@/components/layout/admin-layout';
import { StatsCard } from '@/components/ui/stats-card';
import { Card } from '@/components/ui/card';
import { Users, Gift, DollarSign } from 'lucide-react';

export default function AdminReferralsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">推荐管理</h1>
        <div className="grid sm:grid-cols-3 gap-4">
          <StatsCard title="总推荐数" value="0" icon={Users} iconColor="text-blue-600 bg-blue-100" />
          <StatsCard title="已发佣金" value="¥0" icon={Gift} iconColor="text-green-600 bg-green-100" />
          <StatsCard title="活跃推荐码" value="0" icon={DollarSign} iconColor="text-orange-600 bg-orange-100" />
        </div>
        <Card padding="lg">
          <h2 className="font-semibold text-gray-900 mb-4">推荐配置</h2>
          <p className="text-gray-500 text-sm">佣金比例和提现设置即将上线</p>
        </Card>
      </div>
    </AdminLayout>
  );
}

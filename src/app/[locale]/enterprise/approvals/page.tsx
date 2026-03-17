'use client';
import { EnterpriseLayout } from '@/components/layout/enterprise-layout';
import { EmptyState } from '@/components/ui/empty-state';
import { CheckCircle2 } from 'lucide-react';

export default function EnterpriseApprovalsPage() {
  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">审批管理</h1>
        <EmptyState icon={CheckCircle2} title="暂无待审批事项" description="当团队成员提交订单需要审批时，将在此显示" />
      </div>
    </EnterpriseLayout>
  );
}

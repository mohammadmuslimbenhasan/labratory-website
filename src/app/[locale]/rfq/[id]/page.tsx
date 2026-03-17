'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Timeline } from '@/components/ui/timeline';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { formatDateTime } from '@/lib/utils';

export default function RFQDetailPage() {
  const params = useParams();
  // Auth via HttpOnly cookie
  const [rfq, setRfq] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/rfq?id=${params.id}`, { })
      .then(r => r.json())
      .then(data => { if (data.success && data.data) setRfq(Array.isArray(data.data) ? data.data[0] : data.data); })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <DashboardLayout><div className="space-y-4"><Skeleton className="h-8 w-1/3" /><Skeleton className="h-48 w-full" /></div></DashboardLayout>;

  if (!rfq) return <DashboardLayout><div className="text-center py-16"><p className="text-gray-500">需求未找到</p><Link href="/rfq" className="text-blue-600 mt-4 inline-block">返回列表</Link></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Link href="/rfq" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"><ArrowLeft className="h-4 w-4" />返回列表</Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{rfq.title as string}</h1>
            <p className="text-sm text-gray-500 mt-1">编号: {rfq.requestNo as string}</p>
          </div>
          <Badge variant="info">{rfq.status as string}</Badge>
        </div>

        <Card padding="lg">
          <h2 className="font-semibold text-gray-900 mb-4">需求详情</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {rfq.materialDesc && <div><span className="text-gray-500">材料描述:</span><p className="text-gray-900 mt-1">{rfq.materialDesc as string}</p></div>}
            {rfq.productType && <div><span className="text-gray-500">产品类型:</span><p className="text-gray-900 mt-1">{rfq.productType as string}</p></div>}
            {rfq.testingTarget && <div><span className="text-gray-500">检测目标:</span><p className="text-gray-900 mt-1">{rfq.testingTarget as string}</p></div>}
            {rfq.standardReq && <div><span className="text-gray-500">标准要求:</span><p className="text-gray-900 mt-1">{rfq.standardReq as string}</p></div>}
            {rfq.quantity && <div><span className="text-gray-500">样品数量:</span><p className="text-gray-900 mt-1">{rfq.quantity as string}</p></div>}
            {rfq.budget && <div><span className="text-gray-500">预算:</span><p className="text-gray-900 mt-1">{rfq.budget as string}</p></div>}
            {rfq.deadline && <div><span className="text-gray-500">期望交期:</span><p className="text-gray-900 mt-1">{formatDateTime(rfq.deadline as string)}</p></div>}
            {rfq.notes && <div className="sm:col-span-2"><span className="text-gray-500">补充说明:</span><p className="text-gray-900 mt-1">{rfq.notes as string}</p></div>}
          </div>
        </Card>

        <Card padding="lg">
          <h2 className="font-semibold text-gray-900 mb-4">状态追踪</h2>
          <Timeline items={[
            { title: '需求已提交', time: formatDateTime(rfq.createdAt as string), status: 'completed' },
            { title: '审核中', status: rfq.status === 'SUBMITTED' ? 'current' : 'completed' },
            { title: '报价中', status: ['QUOTING', 'QUOTED'].includes(rfq.status as string) ? 'current' : (rfq.status === 'SUBMITTED' ? 'pending' : 'completed') },
            { title: '已完成', status: ['ACCEPTED', 'CONVERTED'].includes(rfq.status as string) ? 'completed' : 'pending' },
          ]} />
        </Card>
      </div>
    </DashboardLayout>
  );
}

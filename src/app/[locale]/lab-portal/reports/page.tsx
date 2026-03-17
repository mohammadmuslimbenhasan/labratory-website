'use client';
import { useState } from 'react';
import { LabPortalLayout } from '@/components/layout/lab-portal-layout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { FileText, CheckCircle2 } from 'lucide-react';

export default function LabPortalReportsPage() {
  // Auth via HttpOnly cookie
  const [form, setForm] = useState({ orderId: '', title: '', summaryZh: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/lab/reports', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (d.success) { setSuccess(true); setForm({ orderId: '', title: '', summaryZh: '' }); }
    setLoading(false);
  };

  return (
    <LabPortalLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">上传报告</h1>
        <Card padding="lg" className="max-w-2xl">
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
              <CheckCircle2 className="h-4 w-4" />报告已提交
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="订单ID" required value={form.orderId} onChange={e => setForm(p => ({ ...p, orderId: e.target.value }))} />
            <Input label="报告标题" required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            <Textarea label="报告摘要" value={form.summaryZh} onChange={e => setForm(p => ({ ...p, summaryZh: e.target.value }))} />
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
              <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              文件上传功能即将上线
            </div>
            <Button type="submit" loading={loading}>提交报告</Button>
          </form>
        </Card>
      </div>
    </LabPortalLayout>
  );
}

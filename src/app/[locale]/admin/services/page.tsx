'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { SearchInput } from '@/components/ui/search-input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { TableSkeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuthStore } from '@/store/auth-store';
import { formatCurrency } from '@/lib/utils';

export default function AdminServicesPage() {
  // Auth via HttpOnly cookie
  const [services, setServices] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState({ nameZh: '', nameEn: '', shortDescZh: '', categoryId: '', priceMin: '', turnaroundDays: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), pageSize: '15' });
    if (search) params.set('q', search);
    fetch(`/api/services?${params}`)
      .then(r => r.json())
      .then(d => { setServices(d.data || []); setTotalPages(d.totalPages || 1); })
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAdd = async () => {
    if (!form.nameZh) return;
    setSaving(true);
    await fetch('/api/admin/services', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        priceMin: form.priceMin ? parseFloat(form.priceMin) : undefined,
        turnaroundDays: form.turnaroundDays ? parseInt(form.turnaroundDays) : undefined,
      }),
    });
    setAddModal(false);
    setForm({ nameZh: '', nameEn: '', shortDescZh: '', categoryId: '', priceMin: '', turnaroundDays: '' });
    setSaving(false);
    fetchData();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/services/${id}`, {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/services/${id}`, {
      credentials: 'include',
      method: 'DELETE',
    });
    fetchData();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">服务管理</h1>
          <Button onClick={() => setAddModal(true)}><Plus className="h-4 w-4" />添加服务</Button>
        </div>
        <SearchInput placeholder="搜索服务..." onSearch={v => { setSearch(v); setPage(1); }} className="max-w-xs" size="sm" />
        {loading ? <TableSkeleton rows={8} /> : (
          <Card padding="none">
            <Table>
              <TableHeader><TableRow>
                <TableHead>名称</TableHead><TableHead>分类</TableHead><TableHead>价格</TableHead>
                <TableHead>周期</TableHead><TableHead>状态</TableHead><TableHead>操作</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {services.map(s => {
                  const cat = s.category as Record<string, string> | undefined;
                  return (
                    <TableRow key={s.id as string}>
                      <TableCell className="font-medium">{s.nameZh as string}</TableCell>
                      <TableCell className="text-sm">{cat?.nameZh || '-'}</TableCell>
                      <TableCell className="text-sm">{s.priceMin ? formatCurrency(Number(s.priceMin)) : '询价'}</TableCell>
                      <TableCell className="text-sm">{s.turnaroundDays ? `${s.turnaroundDays}天` : '-'}</TableCell>
                      <TableCell>
                        <button onClick={() => toggleActive(s.id as string, s.isActive as boolean)}>
                          {s.isActive ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5 text-gray-400" />}
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost"><Edit className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id as string)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="添加服务" size="lg">
        <div className="space-y-3">
          <Input label="服务名称 (中文)" required value={form.nameZh} onChange={e => setForm(p => ({ ...p, nameZh: e.target.value }))} />
          <Input label="服务名称 (English)" value={form.nameEn} onChange={e => setForm(p => ({ ...p, nameEn: e.target.value }))} />
          <Input label="简短描述" value={form.shortDescZh} onChange={e => setForm(p => ({ ...p, shortDescZh: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="最低价格" type="number" value={form.priceMin} onChange={e => setForm(p => ({ ...p, priceMin: e.target.value }))} />
            <Input label="检测周期 (天)" type="number" value={form.turnaroundDays} onChange={e => setForm(p => ({ ...p, turnaroundDays: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleAdd} loading={saving}>保存</Button>
            <Button variant="outline" onClick={() => setAddModal(false)}>取消</Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}

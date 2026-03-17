'use client';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card } from '@/components/ui/card';
import { Globe } from 'lucide-react';

export default function AdminTranslationsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">翻译管理</h1>
        <Card padding="lg">
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">翻译管理系统</h2>
            <p className="text-gray-500">在线翻译编辑功能即将上线，当前请直接编辑 messages/zh-CN.json 和 messages/en.json 文件。</p>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

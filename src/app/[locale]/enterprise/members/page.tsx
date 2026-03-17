'use client';
import { EnterpriseLayout } from '@/components/layout/enterprise-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/auth-store';
import { Plus } from 'lucide-react';

export default function EnterpriseMembersPage() {
  const { user } = useAuthStore();
  return (
    <EnterpriseLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">成员管理</h1>
          <Button><Plus className="h-4 w-4" />邀请成员</Button>
        </div>
        <Card padding="none">
          <Table>
            <TableHeader><TableRow>
              <TableHead>姓名</TableHead><TableHead>邮箱</TableHead><TableHead>角色</TableHead><TableHead>操作</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{user?.name || '当前用户'}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell><Badge variant="success">所有者</Badge></TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </EnterpriseLayout>
  );
}

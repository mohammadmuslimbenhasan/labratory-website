import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, getAuthUser } from '@/lib/api-helpers';
import { isAdmin } from '@/lib/auth';
import { orderUpdateSchema, isValidTransition } from '@/lib/validations';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request);
  if (!user) return errorResponse('未授权', 401);
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { service: { select: { nameZh: true, slug: true } } } },
        samples: { include: { timeline: { orderBy: { createdAt: 'desc' } } } },
        timeline: { orderBy: { createdAt: 'desc' } },
        reports: true,
        payments: true,
        address: true,
        lab: { select: { nameZh: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) return errorResponse('订单不存在', 404);

    // Ownership check: owner, admin, or assigned lab partner
    const isOwner = order.userId === user.userId;
    const isAssignedLab = user.role === 'LAB_PARTNER' && order.assignedLabId !== null;
    if (!isOwner && !isAdmin(user.role) && !isAssignedLab) {
      return errorResponse('无权访问', 403);
    }

    return successResponse(order);
  } catch {
    return errorResponse('获取失败', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(request);
  if (!user) return errorResponse('未授权', 401);
  const { id } = await params;

  try {
    const body = await request.json();
    const data = orderUpdateSchema.parse(body);

    // Fetch current order
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return errorResponse('订单不存在', 404);

    // Authorization: who can update this order?
    const isOwner = order.userId === user.userId;
    const isAssignedLab = user.role === 'LAB_PARTNER' && order.assignedLabId !== null;

    if (!isOwner && !isAdmin(user.role) && !isAssignedLab) {
      return errorResponse('无权修改此订单', 403);
    }

    // Validate state transition
    if (data.status) {
      if (!isValidTransition(user.role, order.status, data.status)) {
        return errorResponse(`当前角色不允许从 ${order.status} 转为 ${data.status}`, 403);
      }
    }

    // Only admins can assign labs
    if (data.assignedLabId && !isAdmin(user.role)) {
      return errorResponse('只有管理员可以分配实验室', 403);
    }

    const updateData: Record<string, unknown> = {};
    if (data.status) updateData.status = data.status;
    if (data.assignedLabId) updateData.assignedLabId = data.assignedLabId;

    const updated = await prisma.order.update({ where: { id }, data: updateData });

    if (data.status) {
      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status: data.status,
          title: `状态更新为 ${data.status}`,
          operator: user.email,
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'UPDATE_ORDER',
        entity: 'Order',
        entityId: id,
        details: data as Record<string, unknown>,
      },
    });

    return successResponse(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0]?.message || '参数无效', 400);
    }
    return errorResponse('更新失败', 500);
  }
}

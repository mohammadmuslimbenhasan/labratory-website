import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-helpers';
import { withAuth } from '@/lib/api-helpers';

const handler = async (request: NextRequest) => {
  try {
    const [totalOrders, totalRevenue, totalUsers, totalLabs, pendingOrders, activeServices] = await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true }, where: { paymentStatus: 'PAID' } }),
      prisma.user.count(),
      prisma.laboratory.count({ where: { status: 'ACTIVE' } }),
      prisma.order.count({ where: { status: { in: ['PENDING_PAYMENT', 'PAID', 'SAMPLE_PENDING'] } } }),
      prisma.testingService.count({ where: { isActive: true } }),
    ]);

    return successResponse({
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalUsers,
      totalLabs,
      pendingOrders,
      activeServices,
    });
  } catch {
    return errorResponse('获取失败', 500);
  }
};

export const GET = withAuth(handler, ['SUPER_ADMIN', 'FINANCE_ADMIN']);

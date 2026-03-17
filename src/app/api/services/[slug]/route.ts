import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const service = await prisma.testingService.findUnique({
      where: { slug },
      include: {
        category: true,
        materials: { include: { material: true } },
        industries: { include: { industry: true } },
        standards: { include: { standard: true } },
        labServices: { include: { lab: { select: { nameZh: true, slug: true, city: true, rating: true } } }, where: { isActive: true } },
      },
    });

    if (!service) return errorResponse('服务未找到', 404);

    // Increment view count
    await prisma.testingService.update({ where: { slug }, data: { viewCount: { increment: 1 } } });

    return successResponse(service);
  } catch {
    return errorResponse('获取失败', 500);
  }
}

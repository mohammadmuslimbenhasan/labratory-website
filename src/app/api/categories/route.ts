import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.serviceCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        nameZh: true,
        nameEn: true,
        slug: true,
        descZh: true,
        icon: true,
        _count: {
          select: { services: true },
        },
      },
    });

    const mapped = categories.map(cat => ({
      id: cat.id,
      name: cat.nameZh,
      nameEn: cat.nameEn,
      slug: cat.slug,
      description: cat.descZh,
      icon: cat.icon,
      count: cat._count.services,
    }));

    return successResponse({ data: mapped });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return errorResponse('获取分类失败', 500);
  }
}

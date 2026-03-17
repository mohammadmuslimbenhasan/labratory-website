import { Prisma } from '@prisma/client';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, paginatedResponse, getPaginationParams, getSearchParams } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = getPaginationParams(request);
    const { query, sort, order, category } = getSearchParams(request);
    const url = new URL(request.url);
    const materialId = url.searchParams.get('material');
    const industryId = url.searchParams.get('industry');
    const standardId = url.searchParams.get('standard');
    const featured = url.searchParams.get('featured');
    const hot = url.searchParams.get('hot');

    const where: Prisma.TestingServiceWhereInput = { isActive: true };

    if (query) {
      where.OR = [
        { nameZh: { contains: query, mode: 'insensitive' } },
        { nameEn: { contains: query, mode: 'insensitive' } },
        { shortDescZh: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (materialId) {
      where.materials = { some: { materialId } };
    }

    if (industryId) {
      where.industries = { some: { industryId } };
    }

    if (standardId) {
      where.standards = { some: { standardId } };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (hot === 'true') {
      where.isHot = true;
    }

    const orderBy: Prisma.TestingServiceOrderByWithRelationInput = {};
    if (sort === 'price') {
      orderBy.priceMin = order;
    } else if (sort === 'popular') {
      orderBy.orderCount = 'desc';
    } else {
      orderBy.createdAt = order;
    }

    const [services, total] = await Promise.all([
      prisma.testingService.findMany({
        where,
        include: {
          category: { select: { nameZh: true, nameEn: true, slug: true } },
          materials: { include: { material: { select: { nameZh: true, slug: true } } } },
          standards: { include: { standard: { select: { code: true, nameZh: true } } } },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.testingService.count({ where }),
    ]);

    return paginatedResponse(services, total, page, pageSize);
  } catch (error) {
    console.error('Services fetch error:', error);
    return errorResponse('获取服务列表失败', 500);
  }
}

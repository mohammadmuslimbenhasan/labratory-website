import { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, withAuth } from '@/lib/api-helpers';
import { adminServiceCreateSchema } from '@/lib/validations';
import { JWTPayload } from '@/lib/auth';

const handlePost = async (request: NextRequest, user: JWTPayload) => {
  try {
    const body = await request.json();
    const data = adminServiceCreateSchema.parse(body);

    const slug = data.slug || data.nameZh.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now().toString(36);

    const service = await prisma.testingService.create({
      data: {
        slug,
        categoryId: data.categoryId || '',
        nameZh: data.nameZh,
        nameEn: data.nameEn,
        shortDescZh: data.shortDescZh,
        shortDescEn: data.shortDescEn,
        fullDescZh: data.fullDescZh,
        pricingModel: data.pricingModel || 'FIXED',
        priceMin: data.priceMin,
        priceMax: data.priceMax,
        turnaroundDays: data.turnaroundDays,
        sampleRequirement: data.sampleRequirement,
        isActive: true,
        isFeatured: data.isFeatured || false,
        isHot: data.isHot || false,
      },
    });

    await prisma.auditLog.create({
      data: { userId: user.userId, action: 'ADMIN_CREATE_SERVICE', entity: 'TestingService', entityId: service.id },
    });

    return successResponse(service, 201);
  } catch (error) {
    if (error instanceof z.ZodError) return errorResponse(error.issues[0]?.message || '参数无效', 400);
    console.error('Create service error:', error);
    return errorResponse('创建失败', 500);
  }
};

export const POST = withAuth(handlePost, ['SUPER_ADMIN']);

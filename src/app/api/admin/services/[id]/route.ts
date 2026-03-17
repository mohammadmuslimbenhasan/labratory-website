import { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { successResponse, errorResponse, withAuth } from '@/lib/api-helpers';
import { adminServiceCreateSchema } from '@/lib/validations';
import { JWTPayload } from '@/lib/auth';

const handlePut = async (request: NextRequest, user: JWTPayload) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop()!;

  try {
    const body = await request.json();
    const data = adminServiceCreateSchema.partial().parse(body);

    const service = await prisma.testingService.update({
      where: { id },
      data,
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'ADMIN_UPDATE_SERVICE',
        entity: 'TestingService',
        entityId: id,
        details: data as Prisma.InputJsonValue,
      },
    });

    return successResponse(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0]?.message || '参数无效', 400);
    }
    return errorResponse('更新失败', 500);
  }
};

const handleDelete = async (request: NextRequest, user: JWTPayload) => {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop()!;

  try {
    await prisma.testingService.update({
      where: { id },
      data: { isActive: false },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.userId,
        action: 'ADMIN_DELETE_SERVICE',
        entity: 'TestingService',
        entityId: id,
      },
    });

    return successResponse({ message: '已删除' });
  } catch {
    return errorResponse('删除失败', 500);
  }
};

export const PUT = withAuth(handlePut, ['SUPER_ADMIN']);
export const DELETE = withAuth(handleDelete, ['SUPER_ADMIN']);
/**
 * Admin Payment Providers API
 * GET /api/admin/payment-providers - List all providers
 * POST /api/admin/payment-providers - Create new provider
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import {
  getAllPaymentProviders,
  createPaymentProvider
} from '@/lib/services/payment-config.service';
import { PaymentProviderType, ProviderMode } from '@prisma/client';
import { z } from 'zod';

// Validation schema
const createProviderSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(PaymentProviderType),
  appId: z.string().optional(),
  merchantId: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  privateKey: z.string().optional(),
  publicKey: z.string().optional(),
  certSerialNo: z.string().optional(),
  notifyUrl: z.string().url().optional(),
  mode: z.nativeEnum(ProviderMode),
  isEnabled: z.boolean().default(false),
  isDefault: z.boolean().default(false),
  config: z.record(z.unknown()).optional()
});

/**
 * GET - List all payment providers
 */
export async function GET() {
  try {
    const authCheck = await requireAdmin();
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    const providers = await getAllPaymentProviders();

    return NextResponse.json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('Get payment providers error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch providers'
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Create new payment provider
 */
export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireAdmin();
    if (authCheck instanceof NextResponse) {
      return authCheck;
    }

    const body = await request.json();

    // Validate request body
    const validation = createProviderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    const provider = await createPaymentProvider(
      validation.data,
      authCheck.user.userId
    );

    return NextResponse.json(
      {
        success: true,
        data: provider,
        message: 'Payment provider created successfully'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create payment provider error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create provider'
      },
      { status: 500 }
    );
  }
}

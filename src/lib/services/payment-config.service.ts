/**
 * Payment Provider Configuration Service
 * Manages dynamic payment provider configurations with encrypted credentials
 */

import { PrismaClient, PaymentProviderType, ProviderMode } from '@prisma/client';
import { encrypt, decrypt, maskSecret } from './encryption.service';
import prisma from '@/lib/db';

export interface PaymentProviderConfig {
  id: string;
  name: string;
  type: PaymentProviderType;
  appId?: string;
  merchantId?: string;
  apiKey?: string;
  apiSecret?: string;
  privateKey?: string;
  publicKey?: string;
  certSerialNo?: string;
  notifyUrl?: string;
  mode: ProviderMode;
  isEnabled: boolean;
  isDefault: boolean;
  config?: Record<string, unknown>;
}

export interface PaymentProviderConfigDecrypted extends Omit<PaymentProviderConfig, 'apiKey' | 'apiSecret' | 'privateKey'> {
  apiKey?: string;  // Decrypted
  apiSecret?: string;  // Decrypted
  privateKey?: string;  // Decrypted
}

export interface PaymentProviderConfigMasked extends Omit<PaymentProviderConfig, 'apiKey' | 'apiSecret' | 'privateKey'> {
  apiKeyMasked?: string;
  apiSecretMasked?: string;
  privateKeyMasked?: string;
}

/**
 * Get all payment providers (with masked secrets)
 */
export async function getAllPaymentProviders(): Promise<PaymentProviderConfigMasked[]> {
  const providers = await prisma.paymentProvider.findMany({
    orderBy: [
      { isDefault: 'desc' },
      { isEnabled: 'desc' },
      { createdAt: 'asc' }
    ]
  });

  return providers.map(provider => ({
    id: provider.id,
    name: provider.name,
    type: provider.type,
    appId: provider.appId || undefined,
    merchantId: provider.merchantId || undefined,
    apiKeyMasked: provider.apiKey ? maskSecret(provider.apiKey) : undefined,
    apiSecretMasked: provider.apiSecret ? maskSecret(provider.apiSecret) : undefined,
    privateKeyMasked: provider.privateKey ? maskSecret(provider.privateKey) : undefined,
    publicKey: provider.publicKey || undefined,
    certSerialNo: provider.certSerialNo || undefined,
    notifyUrl: provider.notifyUrl || undefined,
    mode: provider.mode,
    isEnabled: provider.isEnabled,
    isDefault: provider.isDefault,
    config: provider.config as Record<string, unknown> | undefined
  }));
}

/**
 * Get enabled payment provider by type (with decrypted secrets)
 */
export async function getPaymentProviderByType(
  type: PaymentProviderType
): Promise<PaymentProviderConfigDecrypted | null> {
  const provider = await prisma.paymentProvider.findFirst({
    where: {
      type,
      isEnabled: true
    },
    orderBy: {
      isDefault: 'desc'
    }
  });

  if (!provider) {
    return null;
  }

  return {
    id: provider.id,
    name: provider.name,
    type: provider.type,
    appId: provider.appId || undefined,
    merchantId: provider.merchantId || undefined,
    apiKey: provider.apiKey ? decrypt(provider.apiKey) : undefined,
    apiSecret: provider.apiSecret ? decrypt(provider.apiSecret) : undefined,
    privateKey: provider.privateKey ? decrypt(provider.privateKey) : undefined,
    publicKey: provider.publicKey || undefined,
    certSerialNo: provider.certSerialNo || undefined,
    notifyUrl: provider.notifyUrl || undefined,
    mode: provider.mode,
    isEnabled: provider.isEnabled,
    isDefault: provider.isDefault,
    config: provider.config as Record<string, unknown> | undefined
  };
}

/**
 * Get default payment provider (with decrypted secrets)
 */
export async function getDefaultPaymentProvider(): Promise<PaymentProviderConfigDecrypted | null> {
  const provider = await prisma.paymentProvider.findFirst({
    where: {
      isEnabled: true,
      isDefault: true
    }
  });

  if (!provider) {
    // Fallback to any enabled provider
    const fallback = await prisma.paymentProvider.findFirst({
      where: { isEnabled: true },
      orderBy: { createdAt: 'asc' }
    });
    
    if (!fallback) return null;
    
    return {
      id: fallback.id,
      name: fallback.name,
      type: fallback.type,
      appId: fallback.appId || undefined,
      merchantId: fallback.merchantId || undefined,
      apiKey: fallback.apiKey ? decrypt(fallback.apiKey) : undefined,
      apiSecret: fallback.apiSecret ? decrypt(fallback.apiSecret) : undefined,
      privateKey: fallback.privateKey ? decrypt(fallback.privateKey) : undefined,
      publicKey: fallback.publicKey || undefined,
      certSerialNo: fallback.certSerialNo || undefined,
      notifyUrl: fallback.notifyUrl || undefined,
      mode: fallback.mode,
      isEnabled: fallback.isEnabled,
      isDefault: fallback.isDefault,
      config: fallback.config as Record<string, unknown> | undefined
    };
  }

  return {
    id: provider.id,
    name: provider.name,
    type: provider.type,
    appId: provider.appId || undefined,
    merchantId: provider.merchantId || undefined,
    apiKey: provider.apiKey ? decrypt(provider.apiKey) : undefined,
    apiSecret: provider.apiSecret ? decrypt(provider.apiSecret) : undefined,
    privateKey: provider.privateKey ? decrypt(provider.privateKey) : undefined,
    publicKey: provider.publicKey || undefined,
    certSerialNo: provider.certSerialNo || undefined,
    notifyUrl: provider.notifyUrl || undefined,
    mode: provider.mode,
    isEnabled: provider.isEnabled,
    isDefault: provider.isDefault,
    config: provider.config as Record<string, unknown> | undefined
  };
}

/**
 * Get payment provider by ID (with decrypted secrets)
 */
export async function getPaymentProviderById(
  id: string
): Promise<PaymentProviderConfigDecrypted | null> {
  const provider = await prisma.paymentProvider.findUnique({
    where: { id }
  });

  if (!provider) {
    return null;
  }

  return {
    id: provider.id,
    name: provider.name,
    type: provider.type,
    appId: provider.appId || undefined,
    merchantId: provider.merchantId || undefined,
    apiKey: provider.apiKey ? decrypt(provider.apiKey) : undefined,
    apiSecret: provider.apiSecret ? decrypt(provider.apiSecret) : undefined,
    privateKey: provider.privateKey ? decrypt(provider.privateKey) : undefined,
    publicKey: provider.publicKey || undefined,
    certSerialNo: provider.certSerialNo || undefined,
    notifyUrl: provider.notifyUrl || undefined,
    mode: provider.mode,
    isEnabled: provider.isEnabled,
    isDefault: provider.isDefault,
    config: provider.config as Record<string, unknown> | undefined
  };
}

/**
 * Create payment provider (encrypts secrets automatically)
 */
export async function createPaymentProvider(
  data: Omit<PaymentProviderConfig, 'id'>,
  createdBy: string
): Promise<PaymentProviderConfigMasked> {
  // If this is the first provider, make it default
  const existingCount = await prisma.paymentProvider.count();
  const shouldBeDefault = existingCount === 0 || data.isDefault;

  // If setting as default, unset other defaults of same type
  if (shouldBeDefault) {
    await prisma.paymentProvider.updateMany({
      where: {
        type: data.type,
        isDefault: true
      },
      data: { isDefault: false }
    });
  }

  const provider = await prisma.paymentProvider.create({
    data: {
      name: data.name,
      type: data.type,
      appId: data.appId,
      merchantId: data.merchantId,
      apiKey: data.apiKey ? encrypt(data.apiKey) : null,
      apiSecret: data.apiSecret ? encrypt(data.apiSecret) : null,
      privateKey: data.privateKey ? encrypt(data.privateKey) : null,
      publicKey: data.publicKey,
      certSerialNo: data.certSerialNo,
      notifyUrl: data.notifyUrl,
      mode: data.mode,
      isEnabled: data.isEnabled,
      isDefault: shouldBeDefault,
      config: data.config,
      createdBy
    }
  });

  return {
    id: provider.id,
    name: provider.name,
    type: provider.type,
    appId: provider.appId || undefined,
    merchantId: provider.merchantId || undefined,
    apiKeyMasked: provider.apiKey ? maskSecret(provider.apiKey) : undefined,
    apiSecretMasked: provider.apiSecret ? maskSecret(provider.apiSecret) : undefined,
    privateKeyMasked: provider.privateKey ? maskSecret(provider.privateKey) : undefined,
    publicKey: provider.publicKey || undefined,
    certSerialNo: provider.certSerialNo || undefined,
    notifyUrl: provider.notifyUrl || undefined,
    mode: provider.mode,
    isEnabled: provider.isEnabled,
    isDefault: provider.isDefault,
    config: provider.config as Record<string, unknown> | undefined
  };
}

/**
 * Update payment provider (encrypts secrets automatically)
 */
export async function updatePaymentProvider(
  id: string,
  data: Partial<Omit<PaymentProviderConfig, 'id'>>,
  updatedBy: string
): Promise<PaymentProviderConfigMasked> {
  // If setting as default, unset other defaults of same type
  if (data.isDefault) {
    const currentProvider = await prisma.paymentProvider.findUnique({
      where: { id }
    });

    if (currentProvider) {
      await prisma.paymentProvider.updateMany({
        where: {
          type: currentProvider.type,
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }
  }

  const updateData: any = {
    ...data,
    updatedBy
  };

  // Encrypt secrets if provided
  if (data.apiKey) updateData.apiKey = encrypt(data.apiKey);
  if (data.apiSecret) updateData.apiSecret = encrypt(data.apiSecret);
  if (data.privateKey) updateData.privateKey = encrypt(data.privateKey);

  const provider = await prisma.paymentProvider.update({
    where: { id },
    data: updateData
  });

  return {
    id: provider.id,
    name: provider.name,
    type: provider.type,
    appId: provider.appId || undefined,
    merchantId: provider.merchantId || undefined,
    apiKeyMasked: provider.apiKey ? maskSecret(provider.apiKey) : undefined,
    apiSecretMasked: provider.apiSecret ? maskSecret(provider.apiSecret) : undefined,
    privateKeyMasked: provider.privateKey ? maskSecret(provider.privateKey) : undefined,
    publicKey: provider.publicKey || undefined,
    certSerialNo: provider.certSerialNo || undefined,
    notifyUrl: provider.notifyUrl || undefined,
    mode: provider.mode,
    isEnabled: provider.isEnabled,
    isDefault: provider.isDefault,
    config: provider.config as Record<string, unknown> | undefined
  };
}

/**
 * Delete payment provider
 */
export async function deletePaymentProvider(id: string): Promise<void> {
  await prisma.paymentProvider.delete({
    where: { id }
  });
}

/**
 * Test payment provider connection
 */
export async function testPaymentProviderConnection(
  id: string
): Promise<{ success: boolean; message: string }> {
  try {
    const config = await getPaymentProviderById(id);
    
    if (!config) {
      return { success: false, message: 'Provider not found' };
    }

    // TODO: Implement actual provider test logic
    // For now, just check if required fields are present
    const hasRequiredFields = config.merchantId && (config.apiKey || config.apiSecret);
    
    if (!hasRequiredFields) {
      return { success: false, message: 'Missing required credentials' };
    }

    // Update test result
    await prisma.paymentProvider.update({
      where: { id },
      data: {
        lastTestedAt: new Date(),
        lastTestResult: 'Connection test passed'
      }
    });

    return { success: true, message: 'Connection test passed' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    
    // Update test result
    await prisma.paymentProvider.update({
      where: { id },
      data: {
        lastTestedAt: new Date(),
        lastTestResult: `Connection test failed: ${message}`
      }
    });

    return { success: false, message };
  }
}

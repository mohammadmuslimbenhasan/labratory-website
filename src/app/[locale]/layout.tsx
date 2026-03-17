import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/routing';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: '精测实验 - 专业检测服务平台',
  description: '一站式检测服务平台，连接企业与优质实验室，提供高效、透明、可靠的检测解决方案',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="antialiased text-gray-900 bg-white min-h-screen">
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
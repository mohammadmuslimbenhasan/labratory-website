import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './config/i18n';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});

const protectedPrefixes = ['/dashboard', '/admin', '/lab-portal', '/enterprise'];

function getPathnameWithoutLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return pathname.slice(`/${locale}`.length) || '/';
    }
  }
  return pathname;
}

function getLocaleFromPathname(pathname: string): string {
  for (const locale of locales) {
    if (pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`) {
      return locale;
    }
  }
  return defaultLocale as string;
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    return NextResponse.next();
  }

  const cleanPath = getPathnameWithoutLocale(pathname);
  const isProtected = protectedPrefixes.some((prefix) =>
    cleanPath.startsWith(prefix)
  );

  if (isProtected) {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      const locale = getLocaleFromPathname(pathname);

      const loginPath =
        locale === defaultLocale ? '/auth/login' : `/${locale}/auth/login`;

      const loginUrl = new URL(loginPath, request.url);

      // Use locale-free callback path to avoid /en/en/... duplication
      loginUrl.searchParams.set('callbackUrl', cleanPath);

      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(zh-CN|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
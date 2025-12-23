'use client';

import type { ReactNode } from 'react';
import type { Session } from 'next-auth';
import { NextIntlClientProvider } from 'next-intl';
import { UserProvider } from '@orbitusdev/auth/context';
import OrbitusProvider from '@orbitusdev/core/orbitus-provider';
import { NavigationProvider } from '@orbitusdev/i18n';
import { Link, redirect, usePathname, useRouter } from '../i18n/routing';

interface LayoutProvidersProps {
  children: ReactNode;
  messages: Record<string, unknown>;
  locale: string;
  session?: Session | null;
  timeZone?: string;
}

/**
 * Client-side providers wrapper for layout
 * Wraps all client-side providers needed for the application
 */
export function LayoutProviders({
  children,
  messages,
  locale,
  session = null,
  timeZone = 'Europe/Istanbul',
}: LayoutProvidersProps) {
  const navigation = {
    Link,
    redirect,
    usePathname,
    useRouter,
  };
  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone={timeZone}>
      <UserProvider session={session}>
        <NavigationProvider value={navigation}>
          <OrbitusProvider>{children}</OrbitusProvider>
        </NavigationProvider>
      </UserProvider>
    </NextIntlClientProvider>
  );
}

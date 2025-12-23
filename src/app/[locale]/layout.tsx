import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getMessages, getTimeZone } from 'next-intl/server';
import { getLangDir } from 'rtl-detect';
import { auth } from '@orbitusdev/auth';
import { isValidLocale } from '@orbitusdev/i18n';
import { LayoutProviders } from '../providers';
import '@/styles/globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Orbitus - Modern Web Platform',
  description: 'Build amazing web applications with Orbitus',
};

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const direction = getLangDir(locale);
  const messages = await getMessages();
  const timeZone = await getTimeZone();
  const session = await auth();

  return (
    <html lang={locale} dir={direction} suppressHydrationWarning={true} className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LayoutProviders messages={messages} locale={locale} session={session} timeZone={timeZone}>
          {children}
        </LayoutProviders>
      </body>
    </html>
  );
}

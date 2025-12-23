import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { enMessages, isValidLocale, trMessages, type Locale } from '@orbitusdev/i18n';
import websiteEnMessages from './messages/en';
import websiteTrMessages from './messages/tr';

const coreMessages = {
  en: enMessages,
  tr: trMessages,
} as const;

const projectMessages = {
  en: websiteEnMessages,
  tr: websiteTrMessages,
} as const;

const messages = {
  en: { ...coreMessages.en, ...projectMessages.en },
  tr: { ...coreMessages.tr, ...projectMessages.tr },
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) as Locale;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return {
    locale,
    messages: messages[locale],
    timeZone: 'Europe/Istanbul',
    now: new Date(),
  };
});

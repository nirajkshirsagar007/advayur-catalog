import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

export const locales = ['en', 'hi', 'mr'];

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;
  console.log("Locale in getRequestConfig:", locale);
  if (!locale || !locales.includes(locale)) locale = 'en';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});

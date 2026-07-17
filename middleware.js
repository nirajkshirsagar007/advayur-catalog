import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'hi', 'mr'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export default function middleware(req) {
  return intlMiddleware(req);
}

export const config = {
  // Match only internationalized pathnames
  // Skip API routes, Next.js internals, and admin routes
  matcher: ['/((?!api|admin|_next|.*\\..*).*)']
};

import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages } from 'app/i18n/settings';
import { ROUTES } from 'global';

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};

const cookieName = 'i18next';

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    let lng = languages.find(lang =>
      req.nextUrl.pathname.startsWith(`/${lang}`),
    );
    if (!lng && req.cookies.has(cookieName))
      lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)!;
    if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))!;
    if (!lng) lng = fallbackLng;

    const PRIVATE_ROUTE = `/${lng}`;
    const PUBLIC_ROUTE = [
      `/${lng}/${ROUTES.LOGIN}`,
      `/${lng}/${ROUTES.REGISTER}`,
      `/${lng}/${ROUTES.FORGOT_PASSWORD}`,
      `/${lng}/${ROUTES.RESET_PASSWORD}`,
    ];
    // Redirect if lng in path is not supported
    if (
      !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
      !req.nextUrl.pathname.startsWith('/_next')
    ) {
      if (req.nextauth.token == null) {
        return NextResponse.redirect(new URL(`/${lng}/customer`, req.url));
      }
      return NextResponse.redirect(new URL(`/${lng}/login`, req.url));
    }

    if (req.nextauth.token == null) {
      if (PUBLIC_ROUTE.some(route => req.nextUrl.pathname.startsWith(route))) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL(`/${lng}/login`, req.url));
      }
    } else if (req.nextUrl.pathname.startsWith(`/${lng}/login`)) {
      return NextResponse.redirect(new URL(`/${lng}/customer`, req.url));
    }
    console.log(req.nextUrl.pathname);

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

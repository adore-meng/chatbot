import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  buildCompanySsoLoginUrl,
  COMPANY_AUTH_TOKEN_COOKIE,
  getCompanySsoLoginBaseUrl,
} from "@/lib/auth/sso-redirect";

const isAuthDisabledForTests =
  process.env.NODE_ENV === "test" ||
  Boolean(process.env.PLAYWRIGHT) ||
  Boolean(process.env.CI_PLAYWRIGHT) ||
  Boolean(process.env.PLAYWRIGHT_TEST_BASE_URL);

function hasCompanyAuthToken(request: NextRequest): boolean {
  const raw = request.cookies.get(COMPANY_AUTH_TOKEN_COOKIE)?.value?.trim();
  return Boolean(raw);
}

export function proxy(request: NextRequest) {
  if (isAuthDisabledForTests) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth/callback")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth/logout")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/ping")) {
    return NextResponse.next();
  }

  if (!hasCompanyAuthToken(request)) {
    const loginUrl = buildCompanySsoLoginUrl({
      requestOrigin: request.nextUrl.origin,
      ssoLoginBaseUrl: getCompanySsoLoginBaseUrl(),
    });
    return NextResponse.redirect(loginUrl, 302);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

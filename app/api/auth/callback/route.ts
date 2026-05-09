import { NextResponse } from "next/server";
import {
  getCompanyAuthCookieOptions,
  getTokenFromCallbackRequest,
} from "@/lib/auth/company-auth-cookie";
import { COMPANY_AUTH_TOKEN_COOKIE } from "@/lib/auth/sso-redirect";

/**
 * SSO redirect target: reads token from query, sets HTTP-only cookie, redirects home.
 */
export function GET(request: Request) {
  const token = getTokenFromCallbackRequest(request);
  if (!token) {
    return new NextResponse("Missing authentication token", { status: 400 });
  }

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path =
    basePath === "" || basePath === "/"
      ? "/"
      : `${basePath.replace(/\/$/, "")}/`;
  const destination = new URL(path, request.url);

  const response = NextResponse.redirect(destination, 302);
  response.cookies.set(
    COMPANY_AUTH_TOKEN_COOKIE,
    token,
    getCompanyAuthCookieOptions()
  );
  return response;
}

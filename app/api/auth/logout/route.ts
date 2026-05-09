import { NextResponse } from "next/server";
import { COMPANY_AUTH_TOKEN_COOKIE } from "@/lib/auth/sso-redirect";

/**
 * Clears company SSO cookie and returns to home (middleware will send to SSO if needed).
 */
export function GET(request: Request) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const path =
    basePath === "" || basePath === "/"
      ? "/"
      : `${basePath.replace(/\/$/, "")}/`;
  const destination = new URL(path, request.url);
  const response = NextResponse.redirect(destination, 302);
  response.cookies.set(COMPANY_AUTH_TOKEN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

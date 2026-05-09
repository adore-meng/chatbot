import "server-only";

import { createHash } from "node:crypto";

import { COMPANY_AUTH_TOKEN_COOKIE } from "./sso-redirect";

type CookieWithValue = { value: string };

type CookieStoreLike = {
  get: (name: string) => CookieWithValue | undefined;
};

export type CompanyAuthCookieOptions = {
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  path: string;
  maxAge: number;
};

export function getCompanyAuthCookieOptions(
  maxAgeSeconds = 60 * 60 * 24 * 7
): CompanyAuthCookieOptions {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

function normalizeTokenFromSearchParams(
  searchParams: URLSearchParams
): string | null {
  const raw =
    searchParams.get("token") ??
    searchParams.get("access_token") ??
    searchParams.get("accessToken");
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Reads the SSO token from the callback request URL (query string).
 */
export function getTokenFromCallbackRequest(request: Request): string | null {
  const url = new URL(request.url);
  return normalizeTokenFromSearchParams(url.searchParams);
}

function isLikelyUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

/**
 * Stable UUID-shaped user id for mock DB / entitlements when SSO returns an opaque token.
 */
export function userIdFromCompanyToken(seed: string): string {
  const h = createHash("sha256").update(seed, "utf8").digest();
  const b = Buffer.from(h.subarray(0, 16));
  const b6 = b[6] ?? 0;
  const b8 = b[8] ?? 0;
  b[6] = (b6 & 0x0f) | 0x40;
  b[8] = (b8 & 0x3f) | 0x80;
  const hex = b.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export type JwtPayloadClaims = {
  sub?: string;
  email?: string;
};

/**
 * Best-effort JWT payload parse for display / user id (does not verify signature).
 */
export function tryParseJwtPayload(token: string): JwtPayloadClaims | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  try {
    const payload = parts[1];
    const normalized = payload.replaceAll("-", "+").replaceAll("_", "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json = Buffer.from(padded, "base64").toString("utf8");
    const parsed = JSON.parse(json) as Record<string, unknown>;
    const sub = typeof parsed.sub === "string" ? parsed.sub : undefined;
    const email = typeof parsed.email === "string" ? parsed.email : undefined;
    return { sub, email };
  } catch {
    return null;
  }
}

export function resolveSessionUserFromToken(token: string): {
  id: string;
  email: string | null;
} {
  const claims = tryParseJwtPayload(token);
  let id: string;
  if (claims?.sub) {
    id = isLikelyUuid(claims.sub)
      ? claims.sub
      : userIdFromCompanyToken(claims.sub);
  } else {
    id = userIdFromCompanyToken(token);
  }
  return {
    id,
    email: claims?.email ?? null,
  };
}

function readCookieValue(cookie: CookieWithValue | undefined): string | null {
  if (!cookie?.value) {
    return null;
  }
  const trimmed = cookie.value.trim();
  return trimmed === "" ? null : trimmed;
}

/**
 * Server-only: read token from Next.js `cookies()` in RSC / Route Handlers / Server Actions.
 */
export async function getCompanyAuthToken(): Promise<string | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return readCookieValue(store.get(COMPANY_AUTH_TOKEN_COOKIE));
}

/**
 * Read token from a request cookie bag (e.g. `cookies()` in App Router).
 */
export function getCompanyAuthTokenFromCookies(
  cookieStore: CookieStoreLike
): string | null {
  return readCookieValue(cookieStore.get(COMPANY_AUTH_TOKEN_COOKIE));
}

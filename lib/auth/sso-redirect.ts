/** Cookie name agreed with company SSO integration (Edge-safe). */
export const COMPANY_AUTH_TOKEN_COOKIE = "company_auth_token";

/**
 * Build external SSO login URL with callback redirect_uri.
 */
export function buildCompanySsoLoginUrl(opts: {
  requestOrigin: string;
  ssoLoginBaseUrl: string;
}): string {
  const callbackUrl = `${opts.requestOrigin}/api/auth/callback`;
  const sso = new URL(opts.ssoLoginBaseUrl);
  sso.searchParams.set("redirect_uri", callbackUrl);
  return sso.toString();
}

/**
 * SSO login page URL (override with COMPANY_SSO_LOGIN_URL).
 */
export function getCompanySsoLoginBaseUrl(): string {
  return (
    process.env.COMPANY_SSO_LOGIN_URL?.trim() ||
    "https://sso.mycompany.com/login"
  );
}

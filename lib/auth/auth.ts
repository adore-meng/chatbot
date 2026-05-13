import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCompanyAuthToken,
  resolveSessionUserFromToken,
} from "@/lib/auth/company-auth-cookie";
import { COMPANY_AUTH_TOKEN_COOKIE } from "@/lib/auth/sso-redirect";

export type { UserType } from "@/lib/auth/user-type";

/** Server session derived from `company_auth_token` (no NextAuth, no local passwords). */
export type Session = {
  user: {
    id: string;
    email: string | null;
    type: import("@/lib/auth/user-type").UserType;
    name?: string | null;
    image?: string | null;
  };
};

export async function auth(): Promise<Session | null> {
  const token = await getCompanyAuthToken();
  if (!token) {
    return null;
  }
  const { id, email } = resolveSessionUserFromToken(token);
  return {
    user: {
      id,
      email,
      type: "regular",
      name: null,
      image: null,
    },
  };
}

/**
 * Clears company SSO cookie and redirects. Use from Server Actions / Route Handlers.
 */
export async function signOut(options?: { redirectTo?: string }) {
  const store = await cookies();
  store.delete(COMPANY_AUTH_TOKEN_COOKIE);
  redirect(options?.redirectTo ?? "/");
}

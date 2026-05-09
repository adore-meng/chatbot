import type { UserType } from "@/lib/auth/user-type";

/** Minimal user shape for sidebars and SSR-passed props (replaces next-auth `User`). */
export type AppUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  type?: UserType;
};

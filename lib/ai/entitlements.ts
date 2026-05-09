import type { UserType } from "@/lib/auth/user-type";

type Entitlements = {
  maxMessagesPerHour: number;
};

export const entitlementsByUserType: Record<UserType, Entitlements> = {
  guest: {
    maxMessagesPerHour: 10,
  },
  regular: {
    maxMessagesPerHour: 10,
  },
};

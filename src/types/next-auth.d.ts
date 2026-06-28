import "next-auth";
import type { RoleType, Plan } from "@/generated/prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: RoleType;
      plan: Plan;
      username?: string | null;
      displayName?: string | null;
      avatar?: string | null;
      profileComplete: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: RoleType;
    plan: Plan;
    username?: string | null;
    displayName?: string | null;
    avatar?: string | null;
    profileComplete?: boolean;
  }
}

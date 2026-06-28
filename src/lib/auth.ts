import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { RoleType, Plan } from "@/generated/prisma/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // sliding: refresh every 24h
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/onboarding",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM || "InterviewHub AI <noreply@interviewhub.ai>",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.password) return null;
        if (user.bannedAt) return null;
        if (user.deletedAt) return null;

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName || user.name,
          image: user.avatar || user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Check if user is banned or deleted
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        select: { bannedAt: true, deletedAt: true },
      });

      if (dbUser?.bannedAt) return "/auth/error?error=AccountBanned";
      if (dbUser?.deletedAt) return "/auth/error?error=AccountDeleted";

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: {
            id: true,
            role: true,
            plan: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.plan = dbUser.plan;
          token.username = dbUser.username;
          token.displayName = dbUser.displayName;
          token.avatar = dbUser.avatar;
          token.profileComplete = !!(dbUser.username && dbUser.displayName);
        }

        // Update last active
        await prisma.user.update({
          where: { id: dbUser?.id ?? "" },
          data: { lastActiveAt: new Date() },
        }).catch(() => {});
      }

      // Session update trigger (e.g., after profile completion)
      if (trigger === "update" && session) {
        if (session.username) token.username = session.username;
        if (session.displayName) token.displayName = session.displayName;
        if (session.avatar) token.avatar = session.avatar;
        if (session.profileComplete !== undefined) token.profileComplete = session.profileComplete;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as RoleType;
        session.user.plan = token.plan as Plan;
        session.user.username = token.username as string | null;
        session.user.displayName = token.displayName as string | null;
        session.user.avatar = token.avatar as string | null;
        session.user.profileComplete = token.profileComplete as boolean;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      // Audit log
      if (user.id) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            entityType: "user",
            entityId: user.id,
            newData: { provider: account?.provider ?? "credentials" },
          },
        }).catch(() => {});
      }
    },
    async signOut(message) {
      // NextAuth v5 signOut event has token or session
      const userId = ("token" in message && message.token?.id as string) ?? undefined;
      if (userId) {
        await prisma.auditLog.create({
          data: {
            userId,
            action: "LOGOUT",
            entityType: "user",
            entityId: userId,
          },
        }).catch(() => {});
      }
    },
  },
});

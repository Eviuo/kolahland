import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";
import { checkRateLimit, clientIpFromHeaders } from "@/lib/rate-limit";

const LOGIN_RATE_LIMIT = 10;
const LOGIN_RATE_WINDOW_MS = 5 * 60 * 1000;

// A real bcrypt hash of an arbitrary, unused string (not a password for any
// account) — cost factor 10, matching `registerUser`'s hash cost, so
// comparing against it takes the same time as a real lookup. Used only to
// keep `authorize()`'s response time constant when no matching user exists.
const DUMMY_HASH = "$2b$10$3cqN0E4yIkXi7JeeDBsg9OKdoNSQYv1WrE7TCiqtajsQ47WPzoGzC";

/**
 * Credentials-only setup, so no adapter is attached here (the Auth.js
 * Credentials provider isn't compatible with adapter-backed database
 * sessions — session strategy must be "jwt"). @auth/prisma-adapter stays a
 * dependency for when a social provider (Google, etc.) is added later.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "ایمیل یا شماره موبایل", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials, request) {
        const ip = clientIpFromHeaders((name) => request.headers.get(name));
        const { allowed } = checkRateLimit(`login:${ip}`, LOGIN_RATE_LIMIT, LOGIN_RATE_WINDOW_MS);
        if (!allowed) return null;

        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { identifier, password } = parsed.data;

        const user = await prisma.user.findFirst({
          where: { OR: [{ email: identifier }, { phone: identifier }] },
        });

        // Always run bcrypt.compare, even for a non-existent user or one with
        // no password set (e.g. social-only account) — comparing against a
        // fixed dummy hash keeps response time roughly constant either way,
        // instead of returning early and letting an attacker fingerprint
        // which identifiers belong to real accounts by request latency.
        const isValid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!user?.passwordHash || !isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

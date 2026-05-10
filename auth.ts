import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import type { Role } from "@/generated/prisma/client";
import { prisma } from "./lib/prisma";
import { LoginSchema } from "./lib/validations/user-validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          const parsed = LoginSchema.safeParse(credentials);
          if (!parsed.success) return null;

          const user = await prisma.user.findUnique({
            where: { email: parsed.data.email },
            include: {
              accounts: true,
            },
          });

          if (!user) return null;

          const ok = await bcrypt.compare(
            parsed.data.password,
            user.accounts[0].password!,
          );
          if (!ok) return null;

          return {
            id: String(user.id),
            email: user.email,
            name: user.fullName,
            image: null,
            role: user.role,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google") return true;

      const email =
        user.email ?? (profile && "email" in profile ? profile.email : null);
      if (!email || typeof email !== "string") return false;

      const name =
        user.name ??
        (profile && "name" in profile && typeof profile.name === "string"
          ? profile.name
          : email.split("@")[0]);

      await prisma.user.upsert({
        where: { email },
        create: {
          email,
          fullName: name,
          password: null,
        },
        update: {
          fullName: name,
        },
      });

      return true;
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.sub = String(dbUser.id);
          token.role = dbUser.role;
        }
      } else if (account?.provider === "credentials" && user) {
        token.sub = String(user.id);
        token.role = (user as { role: Role }).role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub != null) {
        session.user.id = token.sub;
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(token.sub) },
          select: { role: true },
        });
        session.user.role = dbUser?.role ?? (token.role as Role | undefined);
      }
      return session;
    },
  },
});

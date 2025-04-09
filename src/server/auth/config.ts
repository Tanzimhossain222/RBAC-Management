import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { db } from "~/server/db";

export const authConfig = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24, // 1 day
    updateAge: 60 * 30, // 30 minutes
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // If email or password is missing
        }

        // Find the user in the database
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null; // If user is not found
        }
        console.log("✅ Passed Check 1");
        // Check if password matches
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordValid) {
          return null;
        }

        console.log("✅ Passed Check 2");
        // Return user object on successful login
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],

  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.id = token.id;
        session.email = token.email;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getAllPermissionsForRoleHierarchy } from "~/lib/permission";
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
          include: {
            roles: {
              include: {
                permissions: true,
              },
            },
          },
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

        const permissions = new Set<string>();
        for (const role of user.roles) {
          const rolePerms = await getAllPermissionsForRoleHierarchy(role.id);

          for (const p of rolePerms) permissions.add(p);
        }

        return {
          id: user.id,
          email: user.email,
          roles: user.roles.map((role: string) => role.name),
          permissions: Array.from(permissions),
        };
      },
    }),
  ],

  adapter: PrismaAdapter(db),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.email = user.email!;
        token.name = user.name ?? null;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.roles = token.roles;
        session.user.permissions = token.permissions;
      }

      console.log(JSON.stringify(session, null, 2));

      return session;
    },
  },
} satisfies NextAuthConfig;

// types/next-auth.d.ts

import { type DefaultSession, type DefaultUser } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    roles: string[];
    permissions: string[];
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      roles: string[];
      permissions: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    roles: string[];
    permissions: string[];
  }
}

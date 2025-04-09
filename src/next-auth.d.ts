import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  // Extend the User type returned by authorize
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
  }

  // Extend the Session type to include custom properties in session.user
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  // Extend the JWT type to include custom properties in the token
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

// If you still need to fix the adapter type issue, add this:
declare module "@auth/core/adapters" {
  interface AdapterUser {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

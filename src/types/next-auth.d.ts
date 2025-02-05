import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      name: string;
      email: string;
      isVerified: boolean;
    };
  }
  interface User {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
  }
}

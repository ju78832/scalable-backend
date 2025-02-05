import { prisma } from "@/helper";
import NextAuth, { Account, User as AuthUser } from "next-auth";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: any = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user?.password || ""
        );

        if (isPasswordCorrect && user) {
          return user;
        } else {
          return new Error("User not found");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isVerified = token.isVerified;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/sign-in",
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

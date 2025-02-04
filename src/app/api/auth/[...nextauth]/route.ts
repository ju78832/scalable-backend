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
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account.provider == "credentials") {
        console.log(user);
        return true;
      }
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

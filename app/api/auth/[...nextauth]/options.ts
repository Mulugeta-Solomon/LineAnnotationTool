import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

const GOOGLE_ID = process.env.GOOGLE_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;


const prisma = new PrismaClient();
if (!GOOGLE_ID) throw Error("GOOGLE_ID is undefined");
if (!GOOGLE_SECRET) throw Error("GOOGLE_SECRET is undefined");

const Google = GoogleProvider({
  async profile(profile) {
    try {
      const userEmail = profile.email;
      const userData = await prisma.user.findFirst({
        where: { email: userEmail },
      });
      let userRole = "user";
      if (userData) {
        userRole = "annotator";
      }
      return {
        id: profile.sub,
        role: userRole,
        ...profile,
      };
    } catch (error) {
      return {
        id: "",
        role: "",
        aud: "",
        azp: "",
        email: "",
        email_verified: false,
        exp: 0,
        family_name: "",
        given_name: "",
        hd: "",
        iat: 0,
        iss: "",
        jti: "",
        name: "",
        nbf: 0,
        picture: "",
        sub: "",
      } as User;
    }
  },
  clientId: GOOGLE_ID,
  clientSecret: GOOGLE_SECRET,
  authorization: {
    params: {
      prompt: "consent",
      access_type: "offline",
      response_type: "code",
    },
  },
});

export const options = {
  providers: [Google],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        if (typeof token.role === "string" || token.role === undefined) {
          session.user.role = token.role;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

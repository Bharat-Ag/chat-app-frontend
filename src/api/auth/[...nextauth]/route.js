import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        userInfo: { label: "UserInfo", type: "text" },
      },
      async authorize(credentials) {
        const { email, password, userInfo } = credentials ?? {};
        if (!email || !password || !userInfo) return null;

        try {
          const parsedUser = JSON.parse(userInfo);
          return parsedUser || null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          _id: user._id,
          name: user.fullName,
          email: user.email,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  cookies: {
    sessionToken: {
      name: "chit-chat",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  experimental: {
    appDir: true,
    isrMemoryCacheSize: 0,
  },
});

export { handler as GET, handler as POST };
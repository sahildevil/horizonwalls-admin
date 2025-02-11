import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Hash the admin password at startup
const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const isValidUsername =
          credentials.username === process.env.ADMIN_USERNAME;
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          hashedPassword
        );

        if (isValidUsername && isValidPassword) {
          return {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };

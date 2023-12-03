import { OutgoingResponse, Session, User } from 'next-auth';
import NextAuth from 'next-auth/next';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { jwtDecode } from 'jwt-decode';

const cookies = {
  sessionToken: {
    name: `next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true,
    },
  },
  callbackUrl: {
    name: `next-auth.callback-url`,
    options: {
      sameSite: 'lax',
      path: '/',
      secure: true,
    },
  },
  csrfToken: {
    name: 'next-auth.csrf-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true,
    },
  },
};

const refreshAccessToken = async (token: string) => {
  const response = await fetch(
    `${process.env.BASE_API_URL}/api/v1/refreshToken`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token,
      }),
    },
  );
  const data = await response.json();

  if (response.ok) {
    const decodedToken = jwtDecode<{
      exp: number;
    }>(data.accessToken);

    return {
      accessToken: data.accessToken,
      expiredAt: decodedToken.exp,
    };
  }

  //TODO: Prompt session timeout to logout
  return Promise.reject(data);
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      id: 'credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        console.log(`${process.env.BASE_API_URL}`, { credentials });
        try {
          const response = await fetch(
            `${process.env.BASE_API_URL}/api/v1/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
              }),
            },
          );
          const data: any = await response.json();
          if (data.status) {
            return data.result;
          }
          return Promise.reject(data);
        } catch (error) {
          console.log({ error });
          return Promise.reject(error);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  cookies: cookies,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return true;
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    async jwt({ token, user, ...rest }) {
      console.log({ token, user, rest });
      if (user && (user as unknown as OutgoingResponse).user) {
        const decodedToken = jwtDecode<{
          exp: number;
        }>((user as unknown as OutgoingResponse).accessToken);

        return {
          accessToken: (user as unknown as OutgoingResponse).accessToken,
          expiredAt: decodedToken.exp,
          user: (user as unknown as OutgoingResponse).user,
        };
      }

      if ((token.exp as number) > new Date().getTime() / 1000) {
        return token;
      } else {
        return {};
      }
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as User;
      session.token = token.accessToken as string;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs
      return url;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };

import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User;
    token: string;
  }

  interface User {
    id: string;
    avatar?: string;
    name?: string | null;
    email: string;
    address?: string | null;
    role: ROLES;
    phoneNumber?: string;
    loginMethod: 'NORMAL' | 'GOOGLE';
    dob?: string; // dd/MM/yyyy
    gender?: 'MALE' | 'FEMALE';
  }

  interface OutgoingResponse {
    accessToken: string;
    user: User;
  }
}

import NextAuth, { DefaultSession } from 'next-auth';

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: User;
        token: string;
    }

    interface User {
        id: number;
        avatar?: string;
        name?: string | null;
        email?: string | null;
        phoneNumber?: string;
        dob?: string;
        gender?: 'MALE' | 'FEMALE' | 'OTHER';
    }

    interface OutgoingResponse {
        accessToken: string;
        refreshToken: string;
        userInfo: User
    }
}
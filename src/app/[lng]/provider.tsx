'use client';
import { SWRDevTools } from 'swr-devtools';
import { SessionProvider } from 'next-auth/react';

type Props = {
  children?: React.ReactNode;
};

export const NextAuthProvider = ({ children }: Props) => {
  return (
    <SWRDevTools>
      <SessionProvider>{children}</SessionProvider>
    </SWRDevTools>
  );
};

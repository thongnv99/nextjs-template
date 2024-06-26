import { ReactNode } from 'react';
import { dir } from 'i18next';
import { ToastContainer } from 'react-toastify';
import { languages } from 'app/i18n/settings';
import { Lexend } from 'next/font/google';
import { NextAuthProvider } from './provider';
import { ClientProvider } from './ClientProvider';
import SessionTimeout from 'components/SessionTimeout';

const lexend = Lexend({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-lexend',
});

export async function generateStaticParams() {
  return languages.map(lng => ({ lng }));
}

const Layout = ({ children, lng }: { children: ReactNode; lng: string }) => {
  // const { i18n } = useTranslation();

  return (
    <html
      className={`${lexend.className} ${lexend.variable}`}
      lang={lng}
      dir={dir(lng)}
    >
      <head />
      <body suppressHydrationWarning={true}>
        <ClientProvider lng={lng}>{children}</ClientProvider>
        <ToastContainer autoClose={2000} />
        <SessionTimeout />
      </body>
    </html>
  );
};
export default function RootLayout({
  children,
  params: { lng },
}: {
  children: ReactNode;
  params: {
    lng: string;
  };
}) {
  return (
    <NextAuthProvider>
      <Layout lng={lng}>{children}</Layout>
    </NextAuthProvider>
  );
}

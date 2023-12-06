import type { Metadata } from 'next';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globals.css';
import 'styles/index.scss';

export const metadata: Metadata = {
  title: 'Japanese exam',
  description: 'Japanese exam',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

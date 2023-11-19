import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Japanese exam',
  description: 'Japanese exam',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

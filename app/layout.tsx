import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { BoltBadge } from '@/components/bolt-badge';

export const metadata: Metadata = {
  title: 'Qlucent.ai - AI-Powered Tool Discovery Platform',
  description: 'Discover, deploy, and scale tools with AI-powered recommendations',
  icons: {
    icon: '/ql_logo.png',
    shortcut: '/ql_logo.png',
    apple: '/ql_logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/ql_logo.png" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <BoltBadge />
        </ThemeProvider>
      </body>
    </html>
  );
}
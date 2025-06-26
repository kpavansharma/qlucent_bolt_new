import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { BoltBadge } from '@/components/bolt-badge';

export const metadata: Metadata = {
  title: 'Qlucent.ai - AI-Powered Tool Discovery Platform',
  description: 'Discover, deploy, and scale tools with AI-powered recommendations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
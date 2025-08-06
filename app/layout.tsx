import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TRPCProvider } from '@/trpc/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Full Stack Next.js Template',
  description: 'A complete Next.js template with authentication, database integration, and tRPC API.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background-color`}
      >
        {/* wrap root layout with TRPCProvider. */}
        <TRPCProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </TRPCProvider>
        <Analytics />
      </body>
    </html>
  );
}

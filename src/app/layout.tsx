import { SessionProvider } from '@/features/auth/components/session-provider';
import { Providers } from '@/lib/providers';
import { getSession } from '@/lib/utils/auth-action';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Project Management',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 获取用户会话信息
  const session = await getSession({});

  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SessionProvider initialUser={session?.user ?? null}>
            {children}
          </SessionProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}

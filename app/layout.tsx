import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import Providers from "./components/Providers";
import { Toaster } from 'sonner';
import { authConfig } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Powered SAAS Project Manager",
  description: "Create and manage SAAS projects with AI assistance",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers session={session}>
          {session ? (
            <div className="flex h-screen bg-gray-80">
              <Sidebar />
              <main className="overflow-auto p-8 flex-1">
                {children}
              </main>
            </div>
          ) : (
            <main className="h-full">
              {children}
            </main>
          )}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

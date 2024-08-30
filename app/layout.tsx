"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <Toaster
            position="top-right"
            reverseOrder={false}
          />
          {children}
          <ProgressBar
            height="4px"
            color="#fffd00"
            options={{ showSpinner: true }}
            shallowRouting
          />
        </SessionProvider>
      </body>
    </html>
  );
}

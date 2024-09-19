import "../lib/wydr";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        defer
        src="https://umami-production-7615.up.railway.app/script.js"
        data-website-id="424bab8e-a504-4159-bd1d-ea4c9f75f3ca"
      />
      <body className={inter.className}>
        <div className="flex flex-col w-full max-w-md mx-auto stretch py-8">
          {children}
        </div>
        <Footer />
        <Toaster theme="light" toastOptions={{ duration: 2500 }} />
      </body>
    </html>
  );
}

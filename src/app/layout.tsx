import '../lib/wydr';

import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Script
        src='https://beamanalytics.b-cdn.net/beam.min.js'
        data-token='675cad43-f0ad-4eac-918d-e29733cbbe32'
        async
      />
      <body className={inter.className}>
        <div className='flex flex-col w-full max-w-md mx-auto stretch py-8'>
          {children}
        </div>
        <Toaster theme='light' toastOptions={{ duration: 2500 }} />
      </body>
    </html>
  );
}

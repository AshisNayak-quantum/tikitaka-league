import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TIKI TAKA | CBS FUTSAL LEAGUE',
  description: 'Official Web App for Tiki Taka CBS Futsal League',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen relative antialiased selection:bg-amber-500 selection:text-slate-950`}>
        {/* Blurred Stadium Background Overlay */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <Image
            src="/stadium-bg.png"
            alt="Stadium Background"
            fill
            priority
            quality={90}
            className="object-cover object-center scale-110 filter blur-md brightness-[0.4] contrast-110"
          />
          <div className="absolute inset-0 bg-slate-950/60" />
        </div>

        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {children}
        </main>
      </body>
    </html>
  );
}

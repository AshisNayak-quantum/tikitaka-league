import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tiki Taka Football League',
  description: 'Manage the Tiki Taka Football League',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-100 min-h-screen`}>
        <nav className="bg-slate-950 text-white shadow-lg border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  ⚽ TIKI TAKA
                </Link>
                <div className="ml-10 flex items-baseline space-x-2">
                  <Link href="/" className="hover:bg-slate-800 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">Home</Link>
                  <Link href="/standings" className="hover:bg-slate-800 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">Team Standings</Link>
                  <Link href="/stats" className="hover:bg-slate-800 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">Player Stats</Link>
                </div>
              </div>
              <div>
                <Link href="/admin" className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-2 rounded-md text-sm font-bold transition-colors">Admin</Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

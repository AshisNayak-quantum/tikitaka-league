'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Teams', href: '/teams' },
    { name: 'Standings', href: '/standings' },
    { name: 'Player Stats', href: '/stats' },
  ];

  return (
    <nav className="bg-slate-950/80 backdrop-blur-md text-white shadow-xl border-b border-amber-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Titles */}
          <Link href="/" className="flex flex-col group">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚽</span>
              <span className="font-black text-2xl sm:text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-100 group-hover:from-amber-300 group-hover:to-white transition-all">
                TIKI TAKA
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-emerald-400 uppercase ml-8 -mt-1">
              CBS FUTSAL LEAGUE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'text-slate-200 hover:bg-slate-800/80 hover:text-amber-400'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/admin"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-extrabold shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95 ml-4"
            >
              🔒 Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/admin"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md"
            >
              Admin
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-amber-500/30 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-amber-400'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

import { getDb } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = await getDb();
  const globalAnnouncements = (db.announcements || []).filter(
    (a) => a.target === 'all'
  );

  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-8">
      {/* Title & Subtitle Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-100 drop-shadow-md">
          TIKI TAKA
        </h1>
        <p className="text-xs sm:text-sm md:text-base font-extrabold tracking-[0.25em] sm:tracking-[0.3em] text-emerald-400 uppercase mt-1 sm:mt-2">
          CBS FUTSAL LEAGUE
        </p>
      </div>

      {/* Global Announcements Banner */}
      {globalAnnouncements.length > 0 && (
        <div className="w-full max-w-4xl mb-8 space-y-3 px-1">
          <h2 className="text-lg sm:text-xl font-bold text-amber-400 flex items-center gap-2">
            📢 League Announcements
          </h2>
          {globalAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-slate-900/80 backdrop-blur-md border-l-4 border-amber-400 p-4 rounded-r-xl shadow-lg border border-y-slate-800 border-r-slate-800 text-slate-100"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 gap-1">
                <h3 className="font-bold text-base sm:text-lg text-amber-300">{ann.title}</h3>
                <span className="text-[11px] text-slate-400">{ann.createdAt}</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Team Cards Grid (2 cols on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full max-w-5xl px-1">
        {db.teams.map((team) => (
          <div
            key={team.id}
            className="flex flex-col items-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-xl border border-slate-800 hover:border-amber-400/60 transition-all hover:-translate-y-1 group"
          >
            <div className="w-24 h-24 sm:w-40 sm:h-40 mb-3 sm:mb-6 relative drop-shadow-2xl group-hover:scale-105 transition-transform">
              <Image
                src={team.logo}
                alt={`${team.name} Logo`}
                fill
                className="object-contain"
              />
            </div>
            <Link
              href={`/teams/${team.id}`}
              className="w-full text-center bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-amber-400 font-bold py-2 sm:py-3 px-2 rounded-lg sm:rounded-xl border border-amber-500/50 transition-all text-xs sm:text-base active:scale-95"
            >
              {team.name}
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 sm:mt-14 flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto px-1">
        <Link
          href="/standings"
          className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl transition-all text-sm sm:text-lg flex items-center justify-center gap-2.5 hover:border-amber-400 hover:text-amber-400 active:scale-95"
        >
          🏆 View Standings
        </Link>
        <Link
          href="/stats"
          className="bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold py-3.5 sm:py-4 px-6 sm:px-8 rounded-xl shadow-xl transition-all text-sm sm:text-lg flex items-center justify-center gap-2.5 hover:border-amber-400 hover:text-amber-400 active:scale-95"
        >
          👟 Player Stats
        </Link>
      </div>
    </div>
  );
}

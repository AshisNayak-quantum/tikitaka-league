import { getDb } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function TeamsPage() {
  const db = await getDb();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-amber-400">Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {db.teams.map((team) => (
          <Link href={`/teams/${team.id}`} key={team.id} className="block group">
            <div className="bg-slate-800 rounded-xl shadow-lg p-6 border-l-4 border-amber-500 group-hover:border-amber-400 group-hover:bg-slate-750 transition-all border border-y-slate-700 border-r-slate-700 flex flex-col md:flex-row gap-6 items-center">
              <div className="w-32 h-32 relative flex-shrink-0 drop-shadow-lg group-hover:scale-105 transition-transform">
                <Image src={team.logo} alt={team.name} fill className="object-contain" />
              </div>
              <div className="flex-1 w-full">
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors text-center md:text-left">{team.name}</h2>
                <p className="text-slate-400 mb-4 text-center md:text-left">Budget: <span className="text-green-400">€{team.budget.toLocaleString()}</span></p>
                <div className="flex justify-between text-sm text-slate-300 font-semibold bg-slate-900 p-3 rounded-lg">
                  <span>Played: {team.played}</span>
                  <span>Won: <span className="text-green-400">{team.won}</span></span>
                  <span>Points: <span className="text-amber-400">{team.points}</span></span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

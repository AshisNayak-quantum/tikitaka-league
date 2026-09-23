import { getDb } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const db = await getDb();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <h1 className="text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200 text-center">
        Tiki Taka Football League
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl">
        {db.teams.map((team) => (
          <div key={team.id} className="flex flex-col items-center p-6 bg-slate-800 rounded-2xl shadow-xl border border-slate-700 hover:border-amber-400 transition-all hover:-translate-y-2 group">
            <div className="w-48 h-48 mb-6 relative drop-shadow-2xl group-hover:scale-105 transition-transform">
              <Image 
                src={team.logo} 
                alt={`${team.name} Logo`}
                fill
                className="object-contain"
              />
            </div>
            <Link 
              href={`/teams/${team.id}`} 
              className="w-full text-center bg-slate-900 hover:bg-amber-500 hover:text-slate-900 text-amber-400 font-bold py-3 px-4 rounded-xl border border-amber-500 transition-colors"
            >
              {team.name}
            </Link>
          </div>
        ))}
      </div>
      
      <div className="mt-16 flex gap-6">
        <Link href="/standings" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all text-lg flex items-center gap-2 hover:border-amber-400 hover:text-amber-400">
          🏆 View Standings
        </Link>
        <Link href="/stats" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all text-lg flex items-center gap-2 hover:border-amber-400 hover:text-amber-400">
          👟 Player Stats
        </Link>
      </div>
    </div>
  );
}

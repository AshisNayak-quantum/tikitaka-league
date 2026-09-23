import { getDb } from '@/lib/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Standings() {
  const db = await getDb();
  const sortedTeams = [...db.teams].sort((a, b) => b.points - a.points);

  return (
    <div className="py-2 sm:py-6">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-amber-400">
        Team Standings
      </h1>

      <div className="bg-slate-900/80 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-slate-950/80 text-slate-300 border-b border-slate-800 text-xs sm:text-sm">
                <th className="p-3 sm:p-4 font-bold text-center w-12">Pos</th>
                <th className="p-3 sm:p-4 font-bold">Team</th>
                <th className="p-3 sm:p-4 font-bold text-center">P</th>
                <th className="p-3 sm:p-4 font-bold text-center">W</th>
                <th className="p-3 sm:p-4 font-bold text-center">D</th>
                <th className="p-3 sm:p-4 font-bold text-center">L</th>
                <th className="p-3 sm:p-4 font-bold text-center text-amber-400">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-base">
              {sortedTeams.map((team, index) => (
                <tr key={team.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 sm:p-4 font-bold text-center text-slate-400">{index + 1}</td>
                  <td className="p-3 sm:p-4">
                    <Link href={`/teams/${team.id}`} className="font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-2">
                      <img src={team.logo} alt="" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                      <span>{team.name}</span>
                    </Link>
                  </td>
                  <td className="p-3 sm:p-4 text-center text-slate-300 font-semibold">{team.played}</td>
                  <td className="p-3 sm:p-4 text-center text-green-400 font-bold">{team.won}</td>
                  <td className="p-3 sm:p-4 text-center text-slate-400 font-semibold">{team.drawn}</td>
                  <td className="p-3 sm:p-4 text-center text-red-400 font-semibold">{team.lost}</td>
                  <td className="p-3 sm:p-4 text-center font-black text-sm sm:text-xl text-amber-400">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

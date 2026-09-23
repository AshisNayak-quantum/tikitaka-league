import { getDb } from '@/lib/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Standings() {
  const db = await getDb();
  const sortedTeams = [...db.teams].sort((a, b) => b.points - a.points);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-amber-400">Team Standings</h1>
      
      <div className="overflow-x-auto bg-slate-800 rounded-xl shadow-xl border border-slate-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-300 border-b border-slate-700">
              <th className="p-5 font-semibold">Pos</th>
              <th className="p-5 font-semibold">Team</th>
              <th className="p-5 font-semibold">Played</th>
              <th className="p-5 font-semibold">W</th>
              <th className="p-5 font-semibold">D</th>
              <th className="p-5 font-semibold">L</th>
              <th className="p-5 font-semibold text-amber-400">Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                <td className="p-5 font-medium text-slate-400">{index + 1}</td>
                <td className="p-5">
                  <Link href={`/teams/${team.id}`} className="font-bold text-white hover:text-amber-400 transition-colors">
                    {team.name}
                  </Link>
                </td>
                <td className="p-5 text-slate-300">{team.played}</td>
                <td className="p-5 text-green-400 font-semibold">{team.won}</td>
                <td className="p-5 text-slate-400 font-semibold">{team.drawn}</td>
                <td className="p-5 text-red-400 font-semibold">{team.lost}</td>
                <td className="p-5 font-bold text-xl text-amber-400">{team.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

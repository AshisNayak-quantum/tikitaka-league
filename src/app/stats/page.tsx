import { getDb } from '@/lib/data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function StatsPage() {
  const db = await getDb();
  
  // Sort players by different stats
  const topScorers = [...db.players].sort((a, b) => (b.goals || 0) - (a.goals || 0)).slice(0, 10);
  const topAssists = [...db.players].sort((a, b) => (b.assists || 0) - (a.assists || 0)).slice(0, 10);
  const mostYellows = [...db.players].sort((a, b) => (b.yellowCards || 0) - (a.yellowCards || 0)).slice(0, 10);
  const mostReds = [...db.players].sort((a, b) => (b.redCards || 0) - (a.redCards || 0)).slice(0, 10);

  const renderTable = (players: typeof db.players, title: string, statKey: keyof typeof players[0], icon: string) => (
    <div className="bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden">
      <div className="bg-slate-900 p-4 border-b border-slate-700 flex justify-between items-center">
        <h2 className="font-bold text-xl text-white flex items-center gap-2">{icon} {title}</h2>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-800/50 text-slate-400 text-sm">
            <th className="p-3 font-semibold">#</th>
            <th className="p-3 font-semibold">Player</th>
            <th className="p-3 font-semibold text-right">Stat</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, idx) => (
            <tr key={p.id} className="border-t border-slate-700 hover:bg-slate-700 transition-colors">
              <td className="p-3 text-slate-400">{idx + 1}</td>
              <td className="p-3 font-semibold text-slate-200">
                {p.name}
                <div className="text-xs text-amber-500 font-normal">{db.teams.find(t => t.id === p.teamId)?.name}</div>
              </td>
              <td className="p-3 text-right font-bold text-amber-400 text-lg">
                {p[statKey] || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-amber-400">Player Stats Leaderboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {renderTable(topScorers, 'Top Scorers', 'goals', '⚽')}
        {renderTable(topAssists, 'Top Assists', 'assists', '👟')}
        {renderTable(mostYellows, 'Most Yellow Cards', 'yellowCards', '🟨')}
        {renderTable(mostReds, 'Most Red Cards', 'redCards', '🟥')}
      </div>
    </div>
  );
}

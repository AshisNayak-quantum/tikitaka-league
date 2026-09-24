import { getDb } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const db = await getDb();
  const team = db.teams.find((t) => t.id === resolvedParams.id);
  
  if (!team) {
    notFound();
  }

  const players = db.players.filter((p) => p.teamId === team.id);
  const teamAnnouncements = (db.announcements || []).filter(
    (a) => a.target === team.id
  );

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/teams" className="text-amber-500 hover:text-amber-400 font-semibold flex items-center gap-2 transition-colors">
          &larr; Back to Teams
        </Link>
      </div>

      <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden mb-8 border border-slate-700">
        <div className="bg-slate-900 border-b border-slate-700 p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-48 h-48 relative flex-shrink-0 drop-shadow-xl">
            <Image src={team.logo} alt={team.name} fill className="object-contain" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{team.name}</h1>
            <p className="text-slate-400 text-lg font-semibold">Budget: <span className="text-green-400">€{team.budget.toLocaleString()}</span></p>
          </div>
        </div>
        
        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Matches</p>
            <p className="text-4xl font-bold text-white">{team.played}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-b-4 border-b-green-500">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Won</p>
            <p className="text-4xl font-bold text-white">{team.won}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-b-4 border-b-slate-400">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Drawn</p>
            <p className="text-4xl font-bold text-white">{team.drawn}</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 border-b-4 border-b-red-500">
            <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mb-1">Lost</p>
            <p className="text-4xl font-bold text-white">{team.lost}</p>
          </div>
        </div>
      </div>

      {teamAnnouncements.length > 0 && (
        <div className="mb-10 space-y-4">
          <h2 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
            📢 Team Announcements
          </h2>
          {teamAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-amber-500/10 border-l-4 border-amber-400 p-5 rounded-r-xl shadow-md text-slate-100"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xl text-amber-300">{ann.title}</h3>
                  <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded font-semibold border border-slate-600">
                    Team Notice
                  </span>
                </div>
                <span className="text-xs text-slate-400">{ann.createdAt}</span>
              </div>
              <p className="text-slate-300 text-sm whitespace-pre-wrap">{ann.content}</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-3xl font-bold mb-6 text-amber-400">Squad</h2>
      {players.length === 0 ? (
        <p className="text-slate-500">No players registered for this team yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map(player => (
            <div key={player.id} className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 flex flex-col hover:border-slate-500 transition-colors">
              <span className="font-bold text-2xl text-white mb-1">{player.name}</span>
              <span className="text-amber-500 font-semibold mb-4">{player.position}</span>
              
              <div className="grid grid-cols-4 gap-2 mb-4 text-center">
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-xs text-slate-500 font-bold">G</div>
                  <div className="font-bold text-white">{player.goals || 0}</div>
                </div>
                <div className="bg-slate-900 p-2 rounded">
                  <div className="text-xs text-slate-500 font-bold">A</div>
                  <div className="font-bold text-white">{player.assists || 0}</div>
                </div>
                <div className="bg-slate-900 p-2 rounded border-t-2 border-yellow-500">
                  <div className="text-xs text-slate-500 font-bold">YC</div>
                  <div className="font-bold text-white">{player.yellowCards || 0}</div>
                </div>
                <div className="bg-slate-900 p-2 rounded border-t-2 border-red-500">
                  <div className="text-xs text-slate-500 font-bold">RC</div>
                  <div className="font-bold text-white">{player.redCards || 0}</div>
                </div>
              </div>

              <span className="mt-auto font-bold text-green-400 bg-slate-900 p-2 text-center rounded-lg">
                Value: €{player.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

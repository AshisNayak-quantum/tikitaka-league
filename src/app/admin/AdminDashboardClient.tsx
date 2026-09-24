'use client';

import { useState } from 'react';
import { DB, Team, Player, Announcement } from '@/lib/data';
import { useRouter } from 'next/navigation';

export default function AdminDashboardClient({ initialDb }: { initialDb: DB }) {
  const [db, setDb] = useState<DB>({
    ...initialDb,
    announcements: initialDb.announcements || [],
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Announcement form state (Create)
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTarget, setNewTarget] = useState('all');

  // Announcement editing state
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTarget, setEditTarget] = useState('all');

  const handleTeamChange = (id: string, field: keyof Team, value: number | string) => {
    setDb(prev => ({
      ...prev,
      teams: prev.teams.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const handlePlayerChange = (id: string, field: keyof Player, value: number | string) => {
    setDb(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const addPlayer = (teamId: string) => {
    const newPlayer: Player = {
      id: 'p' + Date.now(),
      teamId,
      name: 'New Player',
      position: 'Midfielder',
      value: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    };
    setDb(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const removePlayer = (id: string) => {
    setDb(prev => ({
      ...prev,
      players: prev.players.filter(p => p.id !== id)
    }));
  };

  const addAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newAnn: Announcement = {
      id: 'ann_' + Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      target: newTarget,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setDb(prev => ({
      ...prev,
      announcements: [newAnn, ...(prev.announcements || [])],
    }));

    setNewTitle('');
    setNewContent('');
    setNewTarget('all');
  };

  const startEditAnnouncement = (ann: Announcement) => {
    setEditingAnnId(ann.id);
    setEditTitle(ann.title);
    setEditContent(ann.content);
    setEditTarget(ann.target);
  };

  const cancelEditAnnouncement = () => {
    setEditingAnnId(null);
    setEditTitle('');
    setEditContent('');
    setEditTarget('all');
  };

  const saveAnnouncementEdit = (id: string) => {
    if (!editTitle.trim() || !editContent.trim()) return;

    setDb(prev => ({
      ...prev,
      announcements: (prev.announcements || []).map(a =>
        a.id === id
          ? {
              ...a,
              title: editTitle.trim(),
              content: editContent.trim(),
              target: editTarget,
            }
          : a
      ),
    }));

    cancelEditAnnouncement();
  };

  const removeAnnouncement = (id: string) => {
    setDb(prev => ({
      ...prev,
      announcements: (prev.announcements || []).filter(a => a.id !== id),
    }));
  };

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db)
      });
      if (res.ok) {
        alert('Changes saved successfully!');
        router.refresh();
      } else {
        alert('Failed to save changes.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving changes.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 sticky top-4 z-10 shadow-2xl">
        <span className="text-amber-400 font-bold text-lg">Admin Actions</span>
        <button 
          onClick={saveChanges} 
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-xl shadow-lg transition-colors active:scale-95"
        >
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>

      {/* Announcements Manager Section */}
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-amber-500/30">
        <h2 className="text-3xl font-bold mb-6 text-amber-400 flex items-center gap-3">
          📢 Manage Announcements
        </h2>

        {/* Create Announcement Form */}
        <form onSubmit={addAnnouncement} className="bg-slate-900 p-6 rounded-xl border border-slate-700 space-y-4 mb-8">
          <h3 className="font-bold text-lg text-white">Create New Announcement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Next Match Schedule Update"
                className="w-full bg-slate-800 border border-slate-600 text-white p-2.5 rounded-lg focus:border-amber-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Target Location</label>
              <select
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white p-2.5 rounded-lg focus:border-amber-400 focus:outline-none"
              >
                <option value="all">Main Page (Global Announcement)</option>
                {db.teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name} Team Page</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Announcement Content</label>
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              rows={3}
              placeholder="Enter details..."
              className="w-full bg-slate-800 border border-slate-600 text-white p-2.5 rounded-lg focus:border-amber-400 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
          >
            + Add Announcement
          </button>
        </form>

        {/* Existing Announcements List */}
        <h3 className="font-bold text-xl mb-4 text-white">Active Announcements</h3>
        {(!db.announcements || db.announcements.length === 0) ? (
          <p className="text-slate-500 italic">No announcements posted yet.</p>
        ) : (
          <div className="space-y-4">
            {db.announcements.map(ann => (
              <div key={ann.id} className="bg-slate-900 p-5 rounded-xl border border-slate-700">
                {editingAnnId === ann.id ? (
                  /* Edit Mode */
                  <div className="space-y-4">
                    <h4 className="font-bold text-amber-400 text-sm uppercase">Editing Announcement</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-400 mb-1">Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded-lg focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Target Location</label>
                        <select
                          value={editTarget}
                          onChange={e => setEditTarget(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded-lg focus:border-amber-400 focus:outline-none"
                        >
                          <option value="all">Main Page (Global Announcement)</option>
                          {db.teams.map(t => (
                            <option key={t.id} value={t.id}>{t.name} Team Page</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Content</label>
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded-lg focus:border-amber-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => saveAnnouncementEdit(ann.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        ✓ Done Editing
                      </button>
                      <button
                        onClick={cancelEditAnnouncement}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-bold text-amber-300 text-lg">{ann.title}</h4>
                        <span className="bg-slate-800 text-amber-400 text-xs px-2 py-0.5 rounded border border-slate-600">
                          {ann.target === 'all' ? '🌐 Main Page' : `🛡️ ${db.teams.find(t => t.id === ann.target)?.name || ann.target}`}
                        </span>
                        <span className="text-xs text-slate-500">{ann.createdAt}</span>
                      </div>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">{ann.content}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditAnnouncement(ann)}
                        className="bg-amber-600/80 hover:bg-amber-500 text-white font-semibold px-3 py-1.5 rounded-lg border border-amber-500/50 text-sm transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => removeAnnouncement(ann.id)}
                        className="bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white px-3 py-1.5 rounded-lg border border-red-800 text-sm transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Team & Player Settings */}
      {db.teams.map(team => (
        <div key={team.id} className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-4">
            <img src={team.logo} alt="" className="w-12 h-12 object-contain bg-white rounded-full p-1" />
            {team.name} Settings
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8 bg-slate-900 p-6 rounded-xl border border-slate-700">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Budget (€)</label>
              <input type="number" value={team.budget} onChange={e => handleTeamChange(team.id, 'budget', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Played</label>
              <input type="number" value={team.played} onChange={e => handleTeamChange(team.id, 'played', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Won</label>
              <input type="number" value={team.won} onChange={e => handleTeamChange(team.id, 'won', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Drawn</label>
              <input type="number" value={team.drawn} onChange={e => handleTeamChange(team.id, 'drawn', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Lost</label>
              <input type="number" value={team.lost} onChange={e => handleTeamChange(team.id, 'lost', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Points</label>
              <input type="number" value={team.points} onChange={e => handleTeamChange(team.id, 'points', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" />
            </div>
          </div>

          <h3 className="font-bold text-2xl mb-4 text-amber-400">Players</h3>
          <div className="space-y-4 mb-6">
            {db.players.filter(p => p.teamId === team.id).map(player => (
              <div key={player.id} className="flex flex-wrap gap-4 items-end bg-slate-900 p-4 rounded-xl border border-slate-700">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
                  <input type="text" value={player.name} onChange={e => handlePlayerChange(player.id, 'name', e.target.value)} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" placeholder="Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Position</label>
                  <select value={player.position} onChange={e => handlePlayerChange(player.id, 'position', e.target.value)} className="bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none">
                    <option value="Goalkeeper">Goalkeeper</option>
                    <option value="Defender">Defender</option>
                    <option value="Midfielder">Midfielder</option>
                    <option value="Forward">Forward</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Value (€)</label>
                  <input type="number" value={player.value} onChange={e => handlePlayerChange(player.id, 'value', Number(e.target.value))} className="w-32 bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" placeholder="Value" />
                </div>
                <div className="w-16">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Goals</label>
                  <input type="number" value={player.goals || 0} onChange={e => handlePlayerChange(player.id, 'goals', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" />
                </div>
                <div className="w-16">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Asts</label>
                  <input type="number" value={player.assists || 0} onChange={e => handlePlayerChange(player.id, 'assists', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-white p-2 rounded focus:border-amber-400 focus:outline-none" />
                </div>
                <div className="w-16">
                  <label className="block text-xs font-bold text-slate-500 mb-1">YC</label>
                  <input type="number" value={player.yellowCards || 0} onChange={e => handlePlayerChange(player.id, 'yellowCards', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-yellow-500 font-bold p-2 rounded focus:border-amber-400 focus:outline-none" />
                </div>
                <div className="w-16">
                  <label className="block text-xs font-bold text-slate-500 mb-1">RC</label>
                  <input type="number" value={player.redCards || 0} onChange={e => handlePlayerChange(player.id, 'redCards', Number(e.target.value))} className="w-full bg-slate-800 border border-slate-600 text-red-500 font-bold p-2 rounded focus:border-amber-400 focus:outline-none" />
                </div>
                <div className="pb-1">
                  <button onClick={() => removePlayer(player.id)} className="bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white px-3 py-2 rounded border border-red-800 transition-colors">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => addPlayer(team.id)} className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-4 py-2 rounded-lg border border-slate-600 transition-colors">
            + Add New Player
          </button>
        </div>
      ))}
    </div>
  );
}

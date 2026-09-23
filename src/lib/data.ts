import { db } from './firebase';

export interface Team {
  id: string;
  name: string;
  logo: string;
  budget: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

export interface Player {
  id: string;
  teamId: string;
  name: string;
  position: string;
  value: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface DB {
  teams: Team[];
  players: Player[];
  admin: {
    password?: string;
  };
}

export async function getDb(): Promise<DB> {
  const [teamsSnap, playersSnap, adminSnap] = await Promise.all([
    db.collection('teams').get(),
    db.collection('players').get(),
    db.collection('config').doc('admin').get(),
  ]);

  const teams = teamsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Team));
  const players = playersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player));
  const admin = adminSnap.exists ? adminSnap.data() as { password: string } : { password: '' };

  return { teams, players, admin };
}

export async function saveDb(data: DB): Promise<void> {
  const batch = db.batch();

  // Save teams
  for (const team of data.teams) {
    const { id, ...rest } = team;
    const ref = db.collection('teams').doc(id);
    batch.set(ref, rest);
  }

  // Save players
  // First, delete players not in the new list
  const existingPlayersSnap = await db.collection('players').get();
  const newPlayerIds = new Set(data.players.map(p => p.id));
  existingPlayersSnap.docs.forEach(doc => {
    if (!newPlayerIds.has(doc.id)) {
      batch.delete(doc.ref);
    }
  });

  // Upsert all players in the new list
  for (const player of data.players) {
    const { id, ...rest } = player;
    const ref = db.collection('players').doc(id);
    batch.set(ref, rest);
  }

  await batch.commit();
}

// Run with: node --env-file=.env.local scripts/seed.mjs
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const teams = [
  { id: 't1', name: 'Apex FC', logo: '/logos/apex.png', budget: 50000000, played: 0, won: 0, drawn: 0, lost: 0, points: 0 },
  { id: 't2', name: 'FC Valhalla', logo: '/logos/valhalla.png', budget: 45000000, played: 0, won: 0, drawn: 0, lost: 0, points: 0 },
  { id: 't3', name: 'Stormhold United', logo: '/logos/stormhold.png', budget: 60000000, played: 0, won: 0, drawn: 0, lost: 0, points: 0 },
  { id: 't4', name: 'Vanguard Athletic', logo: '/logos/vanguard.png', budget: 55000000, played: 0, won: 0, drawn: 0, lost: 0, points: 0 },
];

const players = [
  { id: 'p1', teamId: 't1', name: 'Leonel Messy', position: 'Forward', value: 20000000, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'p2', teamId: 't1', name: 'Kevin De Brain', position: 'Midfielder', value: 15000000, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'p3', teamId: 't2', name: 'Cristiano Rolando', position: 'Forward', value: 18000000, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'p4', teamId: 't2', name: 'Virgil Van Dick', position: 'Defender', value: 12000000, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'p5', teamId: 't3', name: 'Harry Kane', position: 'Forward', value: 17000000, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'p6', teamId: 't3', name: 'Alisson Becker', position: 'Goalkeeper', value: 10000000, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'p7', teamId: 't4', name: 'Kylian Mboppe', position: 'Forward', value: 25000000, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'p8', teamId: 't4', name: "N'Golo Kante", position: 'Midfielder', value: 8000000, goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
];

async function seed() {
  console.log('🌱 Seeding Firestore...');
  const batch = db.batch();

  for (const team of teams) {
    const { id, ...rest } = team;
    batch.set(db.collection('teams').doc(id), rest);
  }

  for (const player of players) {
    const { id, ...rest } = player;
    batch.set(db.collection('players').doc(id), rest);
  }

  await batch.commit();
  console.log('✅ Firestore seeded successfully!');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});

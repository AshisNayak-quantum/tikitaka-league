import { getDb } from '@/lib/data';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session || session.value !== 'authenticated') {
    redirect('/admin/login');
  }

  const db = await getDb();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400">Admin Dashboard</h1>
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="bg-red-900/50 hover:bg-red-600 text-red-200 hover:text-white font-bold px-5 py-2 rounded-lg border border-red-800 transition-colors"
          >
            Logout
          </button>
        </form>
      </div>

      <AdminDashboardClient initialDb={db} />
    </div>
  );
}

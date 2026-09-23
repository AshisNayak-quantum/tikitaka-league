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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-emerald-900">Admin Dashboard</h1>
        <form action={async () => {
          'use server';
          const cookieStore = await cookies();
          cookieStore.delete('admin_session');
          redirect('/admin/login');
        }}>
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Logout
          </button>
        </form>
      </div>
      
      <AdminDashboardClient initialDb={db} />
    </div>
  );
}

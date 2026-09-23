'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-slate-800 p-8 rounded-2xl shadow-2xl border-t-4 border-amber-500">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-white">Admin Login</h1>
      {error && <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded text-center">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-6">
          <label className="block text-slate-400 text-sm font-bold mb-2 uppercase tracking-wider">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-white p-3 rounded-lg focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
            required
            autoFocus
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors shadow-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}

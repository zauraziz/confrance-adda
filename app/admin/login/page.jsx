'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Anchor, Lock, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(()=>({}));
        throw new Error(j.error || 'Giriş alınmadı');
      }
      router.push('/admin');
      router.refresh();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-navy-deep p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-navy ring-1 ring-gold/40 mb-4">
            <Anchor className="w-7 h-7 text-gold" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-3xl text-white">Admin paneli</h1>
          <p className="text-white/60 text-sm mt-2">ADDA Konfrans · İdarəetmə girişi</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5" /> {error}
            </div>
          )}
          <label className="block mb-5">
            <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">İstifadəçi adı və ya e-poçt</span>
            <input value={username} onChange={e=>setUsername(e.target.value)} required
                   className="w-full border-b border-navy/15 focus:border-gold outline-none py-2.5 text-[15px] text-navy" />
          </label>
          <label className="block mb-8">
            <span className="block text-[10.5px] tracking-[0.22em] uppercase text-ink/55 mb-2">Şifrə</span>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                   className="w-full border-b border-navy/15 focus:border-gold outline-none py-2.5 text-[15px] text-navy" />
          </label>
          <button type="submit" disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-deep text-white py-3 rounded-full font-semibold disabled:opacity-40">
            <Lock className="w-4 h-4" /> {loading ? 'Daxil olunur…' : 'Daxil ol'}
          </button>
        </form>
      </div>
    </div>
  );
}

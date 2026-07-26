'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true); setMsg('');
    const supabase = getSupabase();
    const fn = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });
    const { data, error } = await fn;
    setBusy(false);
    if (error) { setMsg(error.message); return; }
    if (mode === 'signup' && !data.session) {
      setMsg('Check your email to confirm your account, then log in.');
      setMode('login');
      return;
    }
    router.replace('/dashboard');
  }

  return (
    <main className="auth-wrap">
      <h1 style={{ fontSize: '1.1rem', marginBottom: 4 }}>
        STAT41120 <span style={{ color: 'var(--amber)' }}>·</span> Exam Sprint
      </h1>
      <p className="lead">Log in so your 오답노트 and drill history follow you across devices.</p>
      <div className="card">
        <label className="fl">Email</label>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        <label className="fl">Password</label>
        <input
          type="text" value={password} onChange={e => setPassword(e.target.value)}
          style={{ WebkitTextSecurity: 'disc' } as React.CSSProperties} autoComplete="current-password"
        />
        <div style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={submit} disabled={busy || !email || !password}>
            {busy ? '…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
          <button className="btn" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Create account' : 'Have an account? Log in'}
          </button>
        </div>
        {msg && <div className="notebox" style={{ marginTop: 10 }}>{msg}</div>}
      </div>
    </main>
  );
}

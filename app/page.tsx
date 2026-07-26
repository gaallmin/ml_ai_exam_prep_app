'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => {
      router.replace(data.session ? '/dashboard' : '/login');
    });
  }, [router]);
  return <main style={{ padding: 24, color: 'var(--dim)' }}>Loading…</main>;
}

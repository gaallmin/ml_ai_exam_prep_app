'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';
import { useSprintStore } from '@/lib/store';
import LayoutShell from '@/components/LayoutShell';

export default function DashboardPage() {
  const router = useRouter();
  const loadUserState = useSprintStore(s => s.loadUserState);
  const loaded = useSprintStore(s => s.loaded);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getSupabase().auth.getSession().then(({ data }) => {
      if (!data.session) { router.replace('/login'); return; }
      loadUserState(data.session.user.id).then(() => setReady(true));
    });
  }, [router, loadUserState]);

  if (!ready || !loaded) return <main style={{ padding: 24, color: 'var(--dim)' }}>Loading your progress…</main>;
  return <LayoutShell />;
}

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';
import { useSprintStore } from '@/lib/store';
import BottomNav, { PageId } from './BottomNav';
import BigPictureMap from './BigPictureMap';
import SprintPage from './SprintPage';
import ModelVisualizer from './ModelVisualizer';
import LearningCurves from './LearningCurves';
import FormulaBank from './FormulaBank';
import DrillMode from './DrillMode';
import WrongNotes from './WrongNotes';
import FinalSheet from './FinalSheet';

function daysLeft(): string {
  const exam = new Date(2026, 6, 31);
  const d = Math.max(0, Math.ceil((exam.getTime() - Date.now()) / 864e5));
  return d === 0 ? 'exam day' : `${d} day${d === 1 ? '' : 's'} left`;
}

export default function LayoutShell() {
  const [page, setPage] = useState<PageId>('map');
  const [drillWeakOnly, setDrillWeakOnly] = useState<boolean | null>(null);
  const syncStatus = useSprintStore(s => s.syncStatus);
  const reset = useSprintStore(s => s.reset);
  const router = useRouter();

  const startWeaknessDrill = () => { setDrillWeakOnly(true); setPage('drill'); };
  const gotoDrill = () => { setDrillWeakOnly(null); setPage('drill'); };

  async function logout() {
    await getSupabase().auth.signOut();
    reset();
    router.replace('/login');
  }

  return (
    <>
      <div className={`syncdot ${syncStatus}`}>
        {syncStatus === 'saving' ? 'Saving…' : syncStatus === 'saved' ? 'Saved' :
         syncStatus === 'error' ? 'Offline — changes not saved' : ''}
      </div>
      <header>
        <h1>STAT41120 <span>·</span> Exam Sprint</h1>
        <div className="sub">
          Fri 31 July · <span id="daysleft">{daysLeft()}</span> · memory recovery, not learning from zero
          {' · '}<a onClick={logout} style={{ cursor: 'pointer', color: 'var(--faint)' }}>log out</a>
        </div>
      </header>
      <main>
        {page === 'map' && <BigPictureMap onTryDrill={gotoDrill} />}
        {page === 'sprint' && <SprintPage />}
        {page === 'viz' && <ModelVisualizer onTryDrill={gotoDrill} />}
        {page === 'curves' && <LearningCurves />}
        {page === 'formulas' && <FormulaBank />}
        {page === 'drill' && (
          <DrillMode initialWeakOnly={drillWeakOnly} onConsumedInitial={() => setDrillWeakOnly(null)} />
        )}
        {page === 'note' && <WrongNotes onWeaknessDrill={startWeaknessDrill} />}
        {page === 'sheet' && <FinalSheet />}
      </main>
      <BottomNav page={page} setPage={setPage} />
    </>
  );
}

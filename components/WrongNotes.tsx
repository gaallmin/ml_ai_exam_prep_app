'use client';
import { useSprintStore } from '@/lib/store';
import type { WrongNote } from '@/lib/stat41120/content/types';

function NoteCard({ n, cls }: { n: WrongNote; cls: string }) {
  const selfMarkWrongNote = useSprintStore(s => s.selfMarkWrongNote);
  return (
    <div className={`card wrong-item ${cls}`}>
      <h4>{n.topic}</h4>
      <div className="small">{n.wk} · from {n.src} · missed ×{n.count} · streak {n.correctStreak}/2</div>
      <details>
        <summary>What I got wrong</summary>
        <div className="small">{n.wrong}</div>
      </details>
      <div className="formula">{n.rule}</div>
      <div className="small"><b style={{ color: 'var(--amber)' }}>Hook:</b> {n.hook}</div>
      <div className="small"><b style={{ color: 'var(--coral)' }}>Trigger:</b> {n.trigger}</div>
      {!n.mastered && (
        <div className="meta">
          <button className="btn good" onClick={() => selfMarkWrongNote(n.id, true)}>Recalled it ✓</button>
          <button className="btn bad" onClick={() => selfMarkWrongNote(n.id, false)}>Still shaky ✗</button>
        </div>
      )}
    </div>
  );
}

export default function WrongNotes({ onWeaknessDrill }: { onWeaknessDrill: () => void }) {
  const wrongNotes = useSprintStore(s => s.wrongNotes);
  const syncStatus = useSprintStore(s => s.syncStatus);
  const now = Date.now();

  const due = wrongNotes.filter(n => !n.mastered && n.due <= now);
  const later = wrongNotes.filter(n => !n.mastered && n.due > now);
  const mastered = wrongNotes.filter(n => n.mastered);
  const active = wrongNotes.filter(n => !n.mastered).length;

  return (
    <section className="page active">
      <h2>오답노트</h2>
      <p className="lead">
        Synced to your account across devices. Spaced repetition: new mistake → 20 min, repeated → next day,
        correct twice → mastered.{syncStatus === 'error' ? ' ⚠ offline — changes not saved.' : ''}
      </p>
      <button className="btn primary" onClick={onWeaknessDrill}>Weakness Drill ({active} active)</button>
      <div className="grid2" style={{ marginTop: 10 }}>
        <div className="card"><div className="statnum">{due.length}</div><div className="statlbl">due now</div></div>
        <div className="card"><div className="statnum">{mastered.length}</div><div className="statlbl">mastered (×2 correct)</div></div>
      </div>
      {due.length > 0 && <><h3>Due now — recall the rule from the trigger, then self-mark</h3>
        {due.map(n => <NoteCard key={n.id} n={n} cls="due" />)}</>}
      {later.length > 0 && <><h3>Scheduled</h3>
        {later.map(n => <NoteCard key={n.id} n={n} cls="" />)}</>}
      {mastered.length > 0 && <><h3>Mastered — final-review only</h3>
        {mastered.map(n => <NoteCard key={n.id} n={n} cls="mastered" />)}</>}
    </section>
  );
}

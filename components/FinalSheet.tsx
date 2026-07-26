'use client';
import { MAP } from '@/lib/stat41120/content/map';
import { FORMULAS } from '@/lib/stat41120/content/formulas';
import { useSprintStore } from '@/lib/store';

export default function FinalSheet() {
  const wrongNotes = useSprintStore(s => s.wrongNotes);
  const traps: string[] = [];
  MAP.forEach(b => b.kids.forEach(k => (k.traps ?? []).forEach(t => traps.push(t))));
  FORMULAS.forEach(f => traps.push(f.trap));
  const uniqueTraps = [...new Set(traps)];
  const activeNotes = wrongNotes.filter(n => !n.mastered);

  return (
    <section className="page active">
      <h2>Final Sheet</h2>
      <p className="lead">
        Everything on one page: every formula and every trap. Read once, slowly, the night before —
        then only the 오답노트 on exam day.
      </p>
      <h3>Formulas</h3>
      {FORMULAS.map(f => (
        <div key={f.cat}>
          <div className="small" style={{ marginTop: 8 }}><b>{f.cat}</b></div>
          <div className="formula">{f.f}</div>
        </div>
      ))}
      <h3>All traps</h3>
      {uniqueTraps.map((t, i) => <div className="trapbox" key={i}>{t}</div>)}
      <h3>Active 오답노트 hooks</h3>
      {activeNotes.map(n => <div className="notebox" key={n.id}><b>{n.topic}:</b> {n.hook}</div>)}
    </section>
  );
}

'use client';
import { SPRINT } from '@/lib/stat41120/content/sprint';
import { useSprintStore } from '@/lib/store';

export default function SprintPage() {
  const sprintChecks = useSprintStore(s => s.sprintChecks);
  const toggleSprintCheck = useSprintStore(s => s.toggleSprintCheck);

  const today = new Date();
  const inWindow = today.getMonth() === 6 && today.getDate() >= 27;
  const todayIdx = inWindow ? Math.min(4, Math.max(0, today.getDate() - 27)) : -1;

  let done = 0, total = 0;
  SPRINT.forEach((d, di) => d.items.forEach((_, ii) => { total++; if (sprintChecks[`${di}-${ii}`]) done++; }));

  return (
    <section className="page active">
      <h2>5-Day Sprint</h2>
      <p className="lead">
        One theme per day, in dependency order: shapes → recursion → training craft → gradients & metrics →
        오답노트 only. {done}/{total} tasks done.
      </p>
      <div className="progress"><i style={{ width: `${total ? (100 * done) / total : 0}%` }} /></div>
      {SPRINT.map((d, di) => {
        const isToday = di === todayIdx;
        return (
          <div className="card" key={d.day}>
            <div className="dayrow">
              <div className={`daynum ${isToday ? 'today' : ''}`}>{di + 1}</div>
              <div style={{ flex: 1 }}>
                <h4>{d.day} — {d.title}</h4>
                <div className="small">Core: {d.core.join(' · ')}</div>
                <details open={isToday || di === 0}>
                  <summary>Tasks ({d.items.length})</summary>
                  {d.items.map((it, ii) => {
                    const key = `${di}-${ii}`;
                    const on = !!sprintChecks[key];
                    return (
                      <label className={`chk ${on ? 'on' : ''}`} key={key}>
                        <input type="checkbox" checked={on} onChange={e => toggleSprintCheck(key, e.target.checked)} />
                        {it}
                      </label>
                    );
                  })}
                </details>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

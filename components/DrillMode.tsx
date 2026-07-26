'use client';
import { useEffect, useState } from 'react';
import { DRILLS } from '@/lib/stat41120/content/drills';
import type { Drill, Mark } from '@/lib/stat41120/content/types';
import EquationBlock from './EquationBlock';
import AnswerTemplateBlock from './AnswerTemplateBlock';
import { useSprintStore } from '@/lib/store';

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props { initialWeakOnly: boolean | null; onConsumedInitial: () => void; }

export default function DrillMode({ initialWeakOnly, onConsumedInitial }: Props) {
  const wrongNotes = useSprintStore(s => s.wrongNotes);
  const drillHistory = useSprintStore(s => s.drillHistory);
  const saveDrillAttempt = useSprintStore(s => s.saveDrillAttempt);
  const saveFreeResponse = useSprintStore(s => s.saveFreeResponse);

  const [queue, setQueue] = useState<Drill[]>([]);
  const [idx, setIdx] = useState(0);
  const [weakOnly, setWeakOnly] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [mark, setMark] = useState<Mark | null>(null);
  const [userTxt, setUserTxt] = useState('');
  const [numInput, setNumInput] = useState('');
  const [freeInput, setFreeInput] = useState('');
  const [freeShown, setFreeShown] = useState(false);

  function buildQueue(weak: boolean) {
    let pool = DRILLS.slice();
    if (weak) {
      const weakTopics = new Set(
        wrongNotes.filter(n => !n.mastered).map(n => n.topic.toLowerCase())
      );
      pool = pool.filter(d =>
        [...weakTopics].some(t =>
          d.topic.toLowerCase().includes(t) || t.includes(d.topic.toLowerCase()) || d.wk.toLowerCase().includes(t)
        )
      );
      if (!pool.length) pool = DRILLS.slice();
    }
    setQueue(shuffle(pool));
    setIdx(0); setWeakOnly(weak);
    setAnswered(false); setMark(null); setUserTxt(''); setNumInput(''); setFreeInput(''); setFreeShown(false);
  }

  useEffect(() => {
    if (initialWeakOnly !== null) { buildQueue(initialWeakOnly); onConsumedInitial(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWeakOnly]);

  const q = queue[idx];

  function finishMark(m: Mark, answerText: string) {
    setMark(m); setUserTxt(answerText); setAnswered(true);
    saveDrillAttempt(q, m, answerText);
  }
  function markNumeric() {
    const v = parseFloat(numInput);
    const ok = isFinite(v) && Math.abs(v - (q.ans ?? NaN)) <= (q.tol ?? 0) + 1e-9;
    finishMark(ok ? 'Correct' : 'Incorrect', isFinite(v) ? String(v) : '(blank)');
  }
  function markMCQ(i: number) {
    finishMark(i === q.correct ? 'Correct' : 'Incorrect', `${String.fromCharCode(97 + i)}) ${q.opts![i]}`);
  }
  function freeSelfMark(m: Mark) {
    finishMark(m, freeInput.trim() || '(blank)');
    saveFreeResponse(q, freeInput.trim(), m);
  }
  function next() {
    if (idx < queue.length - 1) {
      setIdx(idx + 1);
      setAnswered(false); setMark(null); setUserTxt(''); setNumInput(''); setFreeInput(''); setFreeShown(false);
    } else {
      setQueue([]);
    }
  }

  if (!q) {
    const total = drillHistory.length;
    const correct = drillHistory.filter(h => h.mark === 'Correct').length;
    return (
      <section className="page active">
        <h2>Professor Drill Mode</h2>
        <p className="lead">
          One question at a time. Strict marking. Numeric and multiple-choice questions are auto-marked;
          free-response you self-mark against the model answer. Every miss goes into the 오답노트.
        </p>
        <div className="card">
          <button className="btn primary" onClick={() => buildQueue(false)}>Start mixed drill ({DRILLS.length} questions)</button>
          <button className="btn" onClick={() => buildQueue(true)}>Weakness-only drill (from 오답노트)</button>
        </div>
        {total > 0 && (
          <div className="card">
            <div className="grid2">
              <div><div className="statnum">{total}</div><div className="statlbl">questions attempted</div></div>
              <div><div className="statnum">{Math.round((100 * correct) / total)}%</div><div className="statlbl">correct</div></div>
            </div>
          </div>
        )}
      </section>
    );
  }

  const markCls = mark === 'Correct' ? 'correct' : mark === 'Partially correct' ? 'partial' : 'incorrect';

  return (
    <section className="page active">
      <h2>Drill {weakOnly ? '· weakness mode' : ''}</h2>
      <div className="progress"><i style={{ width: `${(100 * idx) / queue.length}%` }} /></div>
      <div className="card">
        <div className="small">{q.topic} · {q.wk}</div>
        <h4 style={{ marginTop: 6 }}>Q{idx + 1}. {q.q}</h4>

        {!answered && q.type === 'numeric' && (
          <>
            <label className="fl">Your answer (number)</label>
            <input type="number" step="any" value={numInput} autoFocus
              onChange={e => setNumInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && markNumeric()} />
            <button className="btn primary" style={{ marginTop: 8 }} onClick={markNumeric}>Submit</button>
          </>
        )}
        {!answered && q.type === 'mcq' && q.opts!.map((o, i) => (
          <button key={i} className="btn" style={{ display: 'block', width: '100%', textAlign: 'left', margin: '6px 0' }}
            onClick={() => markMCQ(i)}>
            {String.fromCharCode(97 + i)}) {o}
          </button>
        ))}
        {!answered && q.type === 'free' && !freeShown && (
          <>
            <label className="fl">Write your answer as you would in the exam</label>
            <textarea value={freeInput} onChange={e => setFreeInput(e.target.value)} />
            <button className="btn primary" style={{ marginTop: 8 }} onClick={() => setFreeShown(true)}>
              Compare with model answer
            </button>
          </>
        )}
        {!answered && q.type === 'free' && freeShown && (
          <>
            <div className="small">Your answer:</div>
            <div className="qbox">{freeInput.trim() || '(blank)'}</div>
            <div className="notebox"><b>Model answer:</b> {q.model}</div>
            <div className="formula">{`Rule to memorise:\n${q.rule}`}</div>
            <div className="small"><b style={{ color: 'var(--amber)' }}>Memory hook:</b> {q.hook}</div>
            <div style={{ marginTop: 10 }} className="small">Mark yourself honestly against the model answer:</div>
            <button className="btn good" onClick={() => freeSelfMark('Correct')}>Correct</button>
            <button className="btn mid" onClick={() => freeSelfMark('Partially correct')}>Partial</button>
            <button className="btn bad" onClick={() => freeSelfMark('Incorrect')}>Incorrect</button>
          </>
        )}

        {answered && (
          <>
            <div style={{ margin: '10px 0' }}><span className={`mark ${markCls}`}>{mark}</span></div>
            <div className="small">You answered: <code>{userTxt}</code></div>
            <div className="notebox"><b>Model answer:</b> {q.sol ?? q.model}</div>
            <AnswerTemplateBlock title="Rule to memorise">{q.rule}</AnswerTemplateBlock>
            <div className="small"><b style={{ color: 'var(--amber)' }}>Memory hook:</b> {q.hook}</div>
            <div className="small"><b style={{ color: 'var(--coral)' }}>Exam trigger:</b> {q.trigger}</div>
          </>
        )}
      </div>
      {answered && (
        <button className="btn primary" onClick={next}>
          {idx < queue.length - 1 ? 'Next question →' : 'Finish drill'}
        </button>
      )}
    </section>
  );
}

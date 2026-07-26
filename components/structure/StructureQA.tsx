'use client';
// One Structure-Lab question: typed answer → strict marking → textbook
// equation + exact-mistake explanation → saved attempt (+ 오답노트 on miss).
import { useState } from 'react';
import type { Mark } from '@/lib/stat41120/content/types';
import type { SLModel, SLMode, SLQuestion } from '@/lib/stat41120/content/structureLab';
import { markTextAnswer } from '@/lib/stat41120/content/structureLab';
import { useSprintStore } from '@/lib/store';
import EquationBlock from '@/components/EquationBlock';

interface Props {
  q: SLQuestion;
  model: SLModel;
  mode: SLMode;
  idx: number;
  total: number;
  onDone: (mark: Mark) => void;
}

export default function StructureQA({ q, model, mode, idx, total, onDone }: Props) {
  const saveStructureAttempt = useSprintStore(s => s.saveStructureAttempt);
  const [numIn, setNumIn] = useState('');
  const [txtIn, setTxtIn] = useState('');
  const [mark, setMark] = useState<Mark | null>(null);
  const [userAns, setUserAns] = useState('');

  function finish(m: Mark, answer: string) {
    setMark(m);
    setUserAns(answer);
    saveStructureAttempt({
      qid: q.id, model, mode, step: q.step ?? null,
      question: q.q, userAnswer: answer, correctAnswer: q.answerText,
      mark: m, wk: q.wk, hook: q.hook, trigger: q.trigger,
    });
  }

  function submitNumeric() {
    const v = parseFloat(numIn);
    const ok = isFinite(v) && Math.abs(v - (q.ans ?? NaN)) <= (q.tol ?? 0) + 1e-9;
    finish(ok ? 'Correct' : 'Incorrect', isFinite(v) ? String(v) : '(blank)');
  }
  function submitMCQ(i: number) {
    finish(i === q.correct ? 'Correct' : 'Incorrect', `${String.fromCharCode(97 + i)}) ${q.opts![i]}`);
  }
  function submitText() {
    const { mark: m } = markTextAnswer(txtIn, q.keywords ?? []);
    finish(m, txtIn.trim() || '(blank)');
  }

  const markCls = mark === 'Correct' ? 'correct' : mark === 'Partially correct' ? 'partial' : 'incorrect';

  return (
    <div className="card sl-qa">
      <div className="small">
        {mode === 'trace' ? 'Trace' : 'Exam'} question {idx + 1} / {total} · <span style={{ color: 'var(--coral)' }}>{q.wk}</span>
      </div>
      <h4 style={{ marginTop: 6 }}>{q.q}</h4>

      {!mark && q.type === 'numeric' && (
        <>
          <label className="fl">Your answer (number)</label>
          <input
            type="number" step="any" value={numIn} autoFocus
            onChange={e => setNumIn(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitNumeric()}
          />
          <button className="btn primary" style={{ marginTop: 8 }} onClick={submitNumeric}>Submit</button>
        </>
      )}

      {!mark && q.type === 'mcq' && q.opts!.map((o, i) => (
        <button key={i} className="btn" style={{ display: 'block', width: '100%', textAlign: 'left', margin: '6px 0' }}
          onClick={() => submitMCQ(i)}>
          {String.fromCharCode(97 + i)}) {o}
        </button>
      ))}

      {!mark && q.type === 'text' && (
        <>
          <label className="fl">Type your answer exactly as you would write it in the exam</label>
          <textarea value={txtIn} onChange={e => setTxtIn(e.target.value)} />
          <button className="btn primary" style={{ marginTop: 8 }} onClick={submitText}>Submit</button>
        </>
      )}

      {mark && (
        <>
          <div style={{ margin: '10px 0' }}><span className={`mark ${markCls}`}>{mark}</span></div>
          <div className="small">You answered: <code>{userAns}</code></div>
          {q.latex && <EquationBlock title="Textbook equation" latex={q.latex} highlight={mark !== 'Correct'} />}
          <div className="notebox"><b>Model answer:</b> {q.answerText}</div>
          <div className={mark === 'Correct' ? 'notebox' : 'trapbox'}>
            <b>{mark === 'Correct' ? 'Why' : 'Exact mistake to fix'}</b> · {q.why}
          </div>
          <div className="small"><b style={{ color: 'var(--amber)' }}>Memory hook:</b> {q.hook}</div>
          <div className="small"><b style={{ color: 'var(--coral)' }}>Exam trigger:</b> {q.trigger}</div>
          {mark !== 'Correct' && <div className="small" style={{ marginTop: 4, color: 'var(--coral)' }}>Saved to 오답노트.</div>}
          <button className="btn primary" style={{ marginTop: 10 }} onClick={() => onDone(mark)}>Continue →</button>
        </>
      )}
    </div>
  );
}

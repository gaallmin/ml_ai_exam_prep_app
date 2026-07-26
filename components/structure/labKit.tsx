'use client';
// Shared Structure-Lab chrome: Watch/Trace/Exam mode tabs and the
// sequential question runner used by trace and exam modes.
import { useEffect, useState } from 'react';
import type { Mark } from '@/lib/stat41120/content/types';
import type { SLMode, SLModel, SLQuestion } from '@/lib/stat41120/content/structureLab';
import StructureQA from './StructureQA';

export function ModeTabs({ mode, setMode }: { mode: SLMode; setMode: (m: SLMode) => void }) {
  const labels: Record<SLMode, string> = { watch: '▶ Watch', trace: '✎ Trace', exam: '⏱ Exam' };
  return (
    <div className="modetabs" role="tablist" aria-label="Structure Lab mode">
      {(Object.keys(labels) as SLMode[]).map(m => (
        <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>
          {labels[m]}
        </button>
      ))}
    </div>
  );
}

interface RunnerProps {
  questions: SLQuestion[];
  model: SLModel;
  mode: SLMode;
  onStepChange?: (step: number | null) => void;
}

export function QuestionRunner({ questions, model, mode, onStepChange }: RunnerProps) {
  const [i, setI] = useState(0);
  const [marks, setMarks] = useState<Mark[]>([]);

  const q = questions[i];
  useEffect(() => {
    onStepChange?.(q?.step ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  if (!q) {
    const correct = marks.filter(m => m === 'Correct').length;
    const partial = marks.filter(m => m === 'Partially correct').length;
    return (
      <div className="card">
        <h4>{mode === 'trace' ? 'Trace' : 'Exam'} complete</h4>
        <div className="grid2">
          <div><div className="statnum">{correct} / {marks.length}</div><div className="statlbl">correct</div></div>
          <div><div className="statnum">{partial}</div><div className="statlbl">partially correct</div></div>
        </div>
        {correct < marks.length && (
          <p className="small" style={{ marginTop: 8 }}>
            Every miss is now in the 오답노트 with the textbook equation — review it before re-running.
          </p>
        )}
        <button className="btn primary" onClick={() => { setI(0); setMarks([]); }}>Run again</button>
      </div>
    );
  }

  return (
    <StructureQA
      key={q.id}
      q={q} model={model} mode={mode} idx={i} total={questions.length}
      onDone={m => { setMarks(prev => [...prev, m]); setI(n => n + 1); }}
    />
  );
}

/** Watch-mode autoplay: advances `setStep` every `ms` until the last step. */
export function useAutoplay(playing: boolean, setPlaying: (b: boolean) => void,
  setStep: React.Dispatch<React.SetStateAction<number>>, lastStep: number, ms = 2600) {
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setStep(s => {
        if (s >= lastStep) { setPlaying(false); return s; }
        return s + 1;
      });
    }, ms);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, lastStep, ms]);
}

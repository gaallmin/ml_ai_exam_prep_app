'use client';
import { useState } from 'react';
import { CURVES } from '@/lib/stat41120/content/curves';

const PATHS: Record<string, { tr: string; va: string }> = {
  over:    { tr: 'M10,20 C60,55 150,72 290,78', va: 'M10,25 C60,52 130,58 180,52 C230,44 260,32 290,20' },
  under:   { tr: 'M10,30 C60,42 120,46 290,47', va: 'M10,26 C60,38 120,42 290,43' },
  dropout: { tr: 'M10,18 C70,42 160,52 290,56', va: 'M10,28 C70,52 160,62 290,66' },
  noisy:   { tr: 'M10,25 L35,48 L60,32 L85,55 L110,40 L135,60 L160,48 L185,65 L210,55 L235,70 L260,62 L290,72',
             va: 'M10,20 L35,42 L60,28 L85,50 L110,36 L135,55 L160,44 L185,60 L210,50 L235,64 L260,57 L290,66' },
  slow:    { tr: 'M10,22 L290,42', va: 'M10,18 L290,38' },
  diverge: { tr: 'M10,45 L45,25 L80,60 L115,20 L150,68 L185,15 L220,75 L255,10 L290,80',
             va: 'M10,42 L45,28 L80,55 L115,25 L150,62 L185,20 L220,70 L255,15 L290,76' },
  good:    { tr: 'M10,20 C70,55 150,68 290,72', va: 'M10,16 C70,50 150,63 290,67' },
};

function CurveSVG({ shape }: { shape: string }) {
  const p = PATHS[shape] ?? PATHS.over;
  return (
    <svg viewBox="0 0 300 90" width="100%" role="img" aria-label="learning curve">
      <line x1="10" y1="82" x2="292" y2="82" stroke="var(--line)" />
      <line x1="10" y1="82" x2="10" y2="8" stroke="var(--line)" />
      <path d={p.tr} fill="none" stroke="var(--sky)" strokeWidth="2" />
      <path d={p.va} fill="none" stroke="var(--coral)" strokeWidth="2" />
      <text x="220" y="14" fill="var(--sky)" fontSize="10">— train</text>
      <text x="220" y="26" fill="var(--coral)" fontSize="10">— validation</text>
      <text x="255" y="80" fill="var(--faint)" fontSize="9">epochs</text>
      <text x="14" y="14" fill="var(--faint)" fontSize="9">loss</text>
    </svg>
  );
}

export default function LearningCurves() {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const c = CURVES[idx];
  const nav = (d: number) => { setIdx(i => (i + d + CURVES.length) % CURVES.length); setRevealed(false); };

  return (
    <section className="page active">
      <h2>Learning Curve Diagnosis</h2>
      <p className="lead">
        Look at the curve, say the diagnosis ALOUD using Evidence → diagnosis → fix, then reveal. {idx + 1}/{CURVES.length}.
      </p>
      <div className="card">
        <h4>Pattern: {revealed ? c.name : '???'}</h4>
        <div className="viz"><CurveSVG shape={c.shape} /></div>
        {!revealed ? (
          <>
            <div className="notebox">Say: Evidence → diagnosis → fix. Then reveal.</div>
            <button className="btn primary" onClick={() => setRevealed(true)}>Reveal diagnosis</button>
          </>
        ) : (
          <>
            <div className="qbox"><b>Evidence:</b> {c.ev}</div>
            <div className="notebox"><b>Diagnosis:</b> {c.dx}<br /><b>Fix:</b> {c.fix}</div>
            <div className="formula">{`Full-mark template:\n${c.tmpl}`}</div>
            <div className="trapbox"><b>Common wrong answer</b> · {c.wrong}</div>
          </>
        )}
        <div className="stepper">
          <button className="btn" onClick={() => nav(-1)}>← Previous</button>
          <button className="btn primary" onClick={() => nav(1)}>Next pattern →</button>
        </div>
      </div>
    </section>
  );
}

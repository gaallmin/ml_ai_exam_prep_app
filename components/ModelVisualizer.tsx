'use client';
import { useState } from 'react';
import { VIZ_MODELS } from '@/lib/stat41120/content/visualisers';
import CNNVisualizer from './CNNVisualizer';
import RNNLab from './structure/RNNLab';
import LSTMLab from './structure/LSTMLab';
import GRULab from './structure/GRULab';

type ModelId = 'fnn' | 'cnn' | 'rnn' | 'lstm' | 'gru';

function FNNDiagram({ hi }: { hi: number }) {
  const on = (i: number) => (i === hi ? 'var(--amber)' : 'var(--faint)');
  const onT = (i: number) => (i === hi ? 'var(--amber)' : 'var(--dim)');
  return (
    <svg viewBox="0 0 460 130" width="100%" role="img" aria-label="FNN diagram">
      <text x="20" y="25" fill={onT(0)} fontSize="12">x₁ ●</text>
      <text x="20" y="105" fill={onT(0)} fontSize="12">x₂ ●</text>
      <line x1="60" y1="20" x2="150" y2="40" stroke={on(1)} /><line x1="60" y1="100" x2="150" y2="40" stroke={on(1)} />
      <line x1="60" y1="20" x2="150" y2="90" stroke={on(1)} /><line x1="60" y1="100" x2="150" y2="90" stroke={on(1)} />
      <circle cx="160" cy="40" r="14" fill="none" stroke={on(1)} /><circle cx="160" cy="90" r="14" fill="none" stroke={on(1)} />
      <text x="146" y="20" fill={onT(1)} fontSize="11">z(1) → h(1)</text>
      <line x1="174" y1="40" x2="280" y2="65" stroke={on(2)} /><line x1="174" y1="90" x2="280" y2="65" stroke={on(2)} />
      <circle cx="294" cy="65" r="14" fill="none" stroke={on(2)} />
      <text x="272" y="40" fill={onT(2)} fontSize="11">z(2) → o</text>
      <text x="330" y="70" fill={onT(2)} fontSize="12">→ σ → p(y=1|x)</text>
    </svg>
  );
}

export default function ModelVisualizer({ onTryDrill }: { onTryDrill: () => void }) {
  const [model, setModel] = useState<ModelId>('fnn');
  const [step, setStep] = useState(0);

  const pick = (m: ModelId) => { setModel(m); setStep(0); };

  return (
    <section className="page active">
      <h2>Model Structure Lab</h2>
      <div>
        {(['fnn', 'cnn', 'rnn', 'lstm', 'gru'] as ModelId[]).map(m => (
          <button key={m} className={`btn ${model === m ? 'primary' : ''}`} onClick={() => pick(m)}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>
      {model === 'cnn' && <CNNVisualizer onTryDrill={onTryDrill} />}
      {model === 'rnn' && <RNNLab />}
      {model === 'lstm' && <LSTMLab />}
      {model === 'gru' && <GRULab />}
      {model === 'fnn' && (() => {
        const vm = VIZ_MODELS.fnn;
        const st = vm.steps[Math.min(step, vm.steps.length - 1)];
        return (
          <div className="card">
            <h4>{vm.name}</h4>
            <div className="viz"><FNNDiagram hi={st.hi} /></div>
            <div className="stepper">
              <button className="btn" onClick={() => setStep(s => Math.max(0, s - 1))}>← Back</button>
              <span className="stepct">Step {step + 1} / {vm.steps.length} — <b style={{ color: 'var(--amber)' }}>{st.t}</b></span>
              <button className="btn primary" onClick={() => setStep(s => Math.min(vm.steps.length - 1, s + 1))}>Next →</button>
            </div>
            <div className="formula">{st.f}</div>
            <div className="notebox">{st.d}</div>
          </div>
        );
      })()}
    </section>
  );
}

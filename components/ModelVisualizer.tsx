'use client';
import { useState } from 'react';
import { VIZ_MODELS } from '@/lib/stat41120/content/visualisers';
import CNNVisualizer from './CNNVisualizer';

type ModelId = 'fnn' | 'cnn' | 'rnn' | 'lstm' | 'gru';

function VizDiagram({ model, hi }: { model: 'fnn' | 'rnn' | 'lstm' | 'gru'; hi: number }) {
  const on = (i: number) => (i === hi ? 'var(--amber)' : 'var(--faint)');
  const onT = (i: number) => (i === hi ? 'var(--amber)' : 'var(--dim)');
  if (model === 'fnn') {
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
  if (model === 'rnn') {
    return (
      <svg viewBox="0 0 470 110" width="100%" role="img" aria-label="RNN unfolding">
        {[0, 1, 2].map(t => {
          const x = 40 + t * 130;
          return (
            <g key={t}>
              <text x={x + 8} y="100" fill={onT(t)} fontSize="11">x({t + 1})</text>
              <line x1={x + 18} y1="88" x2={x + 18} y2="60" stroke={on(t)} />
              <rect x={x} y="30" width="38" height="28" rx="6" fill="none" stroke={on(t)} />
              <text x={x + 7} y="49" fill={onT(t)} fontSize="11">h({t + 1})</text>
              {t < 2 && (<>
                <line x1={x + 38} y1="44" x2={x + 130} y2="44" stroke={on(t + 1)} />
                <text x={x + 72} y="38" fill={onT(t + 1)} fontSize="10">W</text>
              </>)}
            </g>
          );
        })}
        <line x1="428" y1="44" x2="448" y2="44" stroke={on(3)} />
        <text x="430" y="30" fill={onT(3)} fontSize="10">V</text>
        <text x="450" y="48" fill={onT(3)} fontSize="12">o(T)</text>
      </svg>
    );
  }
  const labels = model === 'lstm'
    ? ['forget ft', 'input it + c̃t', 'cell ct', 'output ot → ht']
    : ['reset rt', 'candidate h̃t', 'update zt', 'new ht'];
  return (
    <svg viewBox="0 0 470 70" width="100%" role="img">
      {labels.map((L, i) => {
        const x = 8 + i * 118;
        return (
          <g key={L}>
            <rect x={x} y="18" width="104" height="34" rx="7" fill="none" stroke={on(i)} />
            <text x={x + 8} y="39" fill={onT(i)} fontSize="10.5">{L}</text>
            {i < 3 && <text x={x + 107} y="40" fill={on(i)} fontSize="12">→</text>}
          </g>
        );
      })}
    </svg>
  );
}

const TRAPS: Partial<Record<ModelId, string>> = {
  lstm: 'gates use sigmoid, candidate uses tanh · c(t) ≠ h(t) · LSTM alleviates vanishing gradients but exploding gradients remain possible · ~4× the parameters of a simple RNN.',
  gru: 'reset gate sits INSIDE the candidate · no separate cell state · fewer parameters than LSTM · performance vs LSTM is task-dependent.',
  rnn: 'h(t−1), never h(t) · same W,U,V at every step · hidden dimension H does not depend on T · order matters.',
};

export default function ModelVisualizer({ onTryDrill }: { onTryDrill: () => void }) {
  const [model, setModel] = useState<ModelId>('fnn');
  const [step, setStep] = useState(0);

  const pick = (m: ModelId) => { setModel(m); setStep(0); };

  return (
    <section className="page active">
      <h2>Model Structure Visualiser</h2>
      <div>
        {(['fnn', 'cnn', 'rnn', 'lstm', 'gru'] as ModelId[]).map(m => (
          <button key={m} className={`btn ${model === m ? 'primary' : ''}`} onClick={() => pick(m)}>
            {m.toUpperCase()}
          </button>
        ))}
      </div>
      {model === 'cnn' ? (
        <CNNVisualizer onTryDrill={onTryDrill} />
      ) : (() => {
        const vm = VIZ_MODELS[model];
        const st = vm.steps[Math.min(step, vm.steps.length - 1)];
        return (
          <>
            <div className="card">
              <h4>{vm.name}</h4>
              <div className="viz"><VizDiagram model={model} hi={st.hi} /></div>
              <div className="stepper">
                <button className="btn" onClick={() => setStep(s => Math.max(0, s - 1))}>← Back</button>
                <span className="stepct">Step {step + 1} / {vm.steps.length} — <b style={{ color: 'var(--amber)' }}>{st.t}</b></span>
                <button className="btn primary" onClick={() => setStep(s => Math.min(vm.steps.length - 1, s + 1))}>Next →</button>
              </div>
              <div className="formula">{st.f}</div>
              <div className="notebox">{st.d}</div>
            </div>
            {TRAPS[model] && <div className="trapbox"><b>Traps</b> · {TRAPS[model]}</div>}
          </>
        );
      })()}
    </section>
  );
}

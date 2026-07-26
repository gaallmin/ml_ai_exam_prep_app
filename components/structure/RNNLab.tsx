'use client';
// RNN Structure Lab — folded recurrent cell + unrolled-through-time
// computational graph, with Watch / Trace / Exam modes.
import { useState } from 'react';
import type { SLMode } from '@/lib/stat41120/content/structureLab';
import {
  RNN_FOLDED_STEPS, RNN_UNROLLED_STEPS, RNN_FORMULAS, RNN_TRACE, RNN_EXAM, RNN_TRAPS,
} from '@/lib/stat41120/content/structureLab';
import EquationBlock from '@/components/EquationBlock';
import { SLDefs, Edge, OpNode, Lbl, CellBox } from './svgParts';
import { ModeTabs, QuestionRunner, useAutoplay } from './labKit';

/* ---------- folded recurrent view ---------- */
function FoldedRNN({ step, labels, flow }: { step: number; labels: boolean; flow: boolean }) {
  const hl = (i: number) => step === i;
  return (
    <svg viewBox="0 0 620 280" width="100%" role="img" aria-label="Folded RNN cell: h(t-1) and x(t) enter, W and U weight the paths, tanh produces h(t), which loops back; V maps h(T) to the output">
      <SLDefs />
      {/* recurrence loop (drawn behind) */}
      <Edge d="M 440 104 V 42 H 62 V 100" cls="dash" hl={hl(3)} flow={flow} dur="2.4s" />
      <Lbl x={250} y={34} hl={hl(3)} hidden={!labels} size={10.5} cls="dim">
        recurrence: h(t) becomes h(t−1) at the next step — same W, U reused
      </Lbl>

      {/* inputs */}
      <Lbl x={40} y={125} hl={hl(0)} hidden={!labels} size={14}>hₜ₋₁</Lbl>
      <Lbl x={252} y={262} hl={hl(0)} hidden={!labels} size={14}>xₜ</Lbl>

      {/* weighted paths into + */}
      <Edge d="M 78 120 H 233" cls="w" hl={hl(1)} flow={flow} />
      <Lbl x={150} y={110} hl={hl(1)} hidden={!labels} cls="w">W</Lbl>
      <Edge d="M 252 246 V 140" cls="u" hl={hl(1)} flow={flow} />
      <Lbl x={266} y={200} hl={hl(1)} hidden={!labels} cls="u">U</Lbl>
      <OpNode x={252} y={120} sym="+" hl={hl(1)} />

      {/* tanh */}
      <Edge d="M 266 120 H 298" hl={hl(2)} flow={flow} />
      <CellBox x={300} y={98} w={66} h={44} title="tanh" hl={hl(2)} />
      <Edge d="M 366 120 H 420" hl={hl(2)} flow={flow} />
      <Lbl x={440} y={125} hl={hl(2) || hl(3)} hidden={!labels} size={14}>hₜ</Lbl>

      {/* output */}
      <Edge d="M 460 120 H 535" cls="v" hl={hl(4)} flow={flow} />
      <Lbl x={498} y={110} hl={hl(4)} hidden={!labels} cls="v">V</Lbl>
      <Lbl x={568} y={117} hl={hl(4)} hidden={!labels} size={13}>o_T</Lbl>
      <Lbl x={568} y={134} hl={hl(4)} hidden={!labels} size={10} cls="dim">= g(V hₜ)</Lbl>
    </svg>
  );
}

/* ---------- unrolled-through-time view ---------- */
const H_VALS = ['h₁ = 0.7616', 'h₂ = −0.5506', 'h₃ = 0.2210'];
const X_VALS = ['x₁ = 1', 'x₂ = −1', 'x₃ = 0.5'];

function UnrolledRNN({ step, labels, flow }: { step: number; labels: boolean; flow: boolean }) {
  const cellX = [105, 285, 465];
  const cellHl = [step === 2 || step === 3, step === 5, step === 6];
  const hShown = [step >= 3, step >= 5, step >= 6];
  const uHl = [step === 1, step === 5, step === 6];
  const wHl = [step === 2, step === 4, step === 5 || step === 4];
  const sharedHl = step === 2 || step === 4 || step === 5;
  return (
    <svg viewBox="0 0 740 270" width="100%" role="img" aria-label="RNN unrolled through time: x1..x3 enter through the same U, hidden states flow left to right through the same W, final h maps through V to the output">
      <SLDefs />
      <Lbl x={370} y={22} hl={sharedHl} hidden={!labels} size={10.5} cls="dim">
        SHARED WEIGHTS — the same W (blue) and same U (green) are reused at every time step
      </Lbl>

      {/* h0 */}
      <Lbl x={42} y={116} hl={step === 0} hidden={!labels} size={14}>h₀</Lbl>
      <Lbl x={42} y={133} hl={step === 0} hidden={!labels} size={10} cls="dim">= 0</Lbl>

      {/* cells + W chain */}
      <Edge d="M 62 112 H 103" cls="w" hl={wHl[0]} flow={flow} />
      <Lbl x={82} y={102} hl={wHl[0]} hidden={!labels} cls="w" size={11}>W</Lbl>
      {cellX.map((x, t) => (
        <g key={t}>
          <CellBox x={x} y={88} w={95} h={50} title="+ → tanh" hl={cellHl[t]} />
          {t < 2 && (
            <>
              <Edge d={`M ${x + 95} 112 H ${cellX[t + 1] - 2}`} cls="w" hl={wHl[t + 1]} flow={flow} />
              <Lbl x={(x + 95 + cellX[t + 1]) / 2} y={102} hl={wHl[t + 1]} hidden={!labels} cls="w" size={11}>W</Lbl>
            </>
          )}
          {/* inputs from below through U */}
          <Edge d={`M ${x + 47} 234 V 142`} cls="u" hl={uHl[t]} flow={flow} />
          <Lbl x={x + 62} y={195} hl={uHl[t]} hidden={!labels} cls="u" size={11}>U</Lbl>
          <Lbl x={x + 47} y={252} hl={uHl[t]} hidden={!labels} size={12}>{X_VALS[t]}</Lbl>
          {/* computed hidden values appear as the animation reaches them */}
          {hShown[t] && <Lbl x={x + 47} y={76} hl={cellHl[t]} hidden={!labels} size={11.5} cls="val">{H_VALS[t]}</Lbl>}
        </g>
      ))}

      {/* output */}
      <Edge d="M 560 112 H 638" cls="v" hl={step === 7} flow={flow} />
      <Lbl x={600} y={102} hl={step === 7} hidden={!labels} cls="v" size={11}>V</Lbl>
      <Lbl x={666} y={116} hl={step === 7} hidden={!labels} size={13}>o_T</Lbl>
      <Lbl x={666} y={133} hl={step === 7} hidden={!labels} size={10} cls="dim">= g(V h₃)</Lbl>
    </svg>
  );
}

/* ---------- lab ---------- */
export default function RNNLab() {
  const [mode, setModeRaw] = useState<SLMode>('watch');
  const [view, setView] = useState<'folded' | 'unrolled'>('folded');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = view === 'folded' ? RNN_FOLDED_STEPS : RNN_UNROLLED_STEPS;
  const st = steps[Math.min(step, steps.length - 1)];
  const labels = mode !== 'exam';

  const setMode = (m: SLMode) => {
    setModeRaw(m); setPlaying(false); setStep(0);
    if (m === 'trace') setView('unrolled'); // trace questions live on the unrolled graph
  };
  const pickView = (v: 'folded' | 'unrolled') => { setView(v); setStep(0); setPlaying(false); };

  useAutoplay(playing, setPlaying, setStep, steps.length - 1);

  const diagram = view === 'folded'
    ? <FoldedRNN step={step} labels={labels} flow={mode === 'watch'} />
    : <UnrolledRNN step={step} labels={labels} flow={mode === 'watch'} />;

  return (
    <>
      <div className="card">
        <h4>RNN — recurrent computational graph</h4>
        <ModeTabs mode={mode} setMode={setMode} />
        <div style={{ margin: '4px 0' }}>
          <button className={`btn ${view === 'folded' ? 'primary' : ''}`} onClick={() => pickView('folded')} disabled={mode === 'trace'}>Folded (recurrent loop)</button>
          <button className={`btn ${view === 'unrolled' ? 'primary' : ''}`} onClick={() => pickView('unrolled')}>Unrolled through time</button>
        </div>
        <div className="viz">{diagram}</div>

        {mode === 'watch' && (
          <>
            <div className="stepper">
              <button className="btn" onClick={() => { setPlaying(false); setStep(s => Math.max(0, s - 1)); }}>← Back</button>
              <span className="stepct">Step {step + 1} / {steps.length} — <b style={{ color: 'var(--amber)' }}>{st.title}</b></span>
              <button className="btn primary" onClick={() => { setPlaying(false); setStep(s => Math.min(steps.length - 1, s + 1)); }}>Next →</button>
              <button className="btn" onClick={() => setPlaying(p => !p)}>{playing ? '⏸ Pause' : '▶ Play'}</button>
            </div>
            {st.latex && <EquationBlock title={st.title} latex={st.latex} highlight />}
            <div className="notebox">{st.desc}</div>
          </>
        )}
      </div>

      {mode === 'trace' && (
        <QuestionRunner questions={RNN_TRACE} model="rnn" mode="trace"
          onStepChange={s => setStep(s ?? 0)} />
      )}
      {mode === 'exam' && (
        <QuestionRunner questions={RNN_EXAM} model="rnn" mode="exam" />
      )}

      {labels && (
        <details className="card sl-formulas" open={mode === 'watch'}>
          <summary>Formula view — textbook equations</summary>
          {RNN_FORMULAS.map(f => <EquationBlock key={f.title} title={f.title} latex={f.latex} caption={f.caption} />)}
        </details>
      )}

      <div className="trapbox"><b>RNN traps</b> · {RNN_TRAPS.join(' · ')}</div>
    </>
  );
}

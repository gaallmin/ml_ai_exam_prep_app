'use client';
// LSTM Structure Lab — real cell layout: cell-state memory highway on top,
// sigmoid gate valves below, candidate tanh path, gated output. Sliders drive
// a live scalar computation of c_t and h_t.
import { useState } from 'react';
import type { SLMode } from '@/lib/stat41120/content/structureLab';
import {
  LSTM_STEPS, LSTM_FORMULAS, LSTM_TRACE, LSTM_EXAM, LSTM_TRAPS,
} from '@/lib/stat41120/content/structureLab';
import EquationBlock, { aligned } from '@/components/EquationBlock';
import { SLDefs, Edge, OpNode, Lbl, CellBox, GateValve } from './svgParts';
import { ModeTabs, QuestionRunner, useAutoplay } from './labKit';

interface Gates { f: number; i: number; ctil: number; o: number; cPrev: number; }
const DEFAULTS: Gates = { f: 0.5, i: 0.7, ctil: 0.4, o: 0.9, cPrev: 0.8 };

function LSTMCell({ step, labels, flow, g }: { step: number; labels: boolean; flow: boolean; g: Gates }) {
  const hl = (...idx: number[]) => idx.includes(step);
  return (
    <svg viewBox="0 0 740 380" width="100%" role="img" aria-label="LSTM cell: c(t-1) rides the top memory highway through a forget-gate multiplier and an addition node to c(t); x(t) and h(t-1) feed four gates below; the output gate exposes tanh of the cell state as h(t)">
      <SLDefs />
      <Lbl x={370} y={26} hidden={!labels} hl={hl(0, 4)} size={10.5} cls="dim">
        CELL-STATE MEMORY HIGHWAY — additive, mostly linear: this is why gradients survive
      </Lbl>

      {/* memory highway */}
      <Edge d="M 62 70 H 652" cls="highway" hl={hl(0, 4)} flow={flow} dur="2.6s" />
      <Lbl x={36} y={74} hl={hl(0)} hidden={!labels} size={13}>cₜ₋₁</Lbl>
      <Lbl x={686} y={74} hl={hl(4)} hidden={!labels} size={13}>cₜ</Lbl>
      <OpNode x={230} y={70} sym="×" r={14} hl={hl(1)} />
      <OpNode x={400} y={70} sym="+" r={14} hl={hl(4)} />

      {/* forget valve → × on the highway */}
      <Edge d="M 200 238 C 200 160 230 150 230 86" hl={hl(1)} flow={flow} />
      <GateValve x={170} y={240} act="σ" label="fₜ  forget" value={g.f} hl={hl(1)} showLabel={labels} />

      {/* candidate + input gate → × → + */}
      <GateValve x={280} y={240} act="σ" label="iₜ  input" value={g.i} hl={hl(3)} showLabel={labels} />
      <Edge d="M 310 238 C 310 195 345 188 352 172" hl={hl(3)} flow={flow} />
      <GateValve x={370} y={240} act="tanh" label="c̃ₜ  candidate" value={g.ctil} hl={hl(2)} showLabel={labels} />
      <Edge d="M 400 238 C 400 200 372 186 366 173" hl={hl(2)} flow={flow} />
      <OpNode x={358} y={160} sym="×" r={12} hl={hl(3)} />
      <Edge d="M 358 148 C 358 105 393 98 399 86" hl={hl(3, 4)} flow={flow} />
      <Lbl x={322} y={158} hl={hl(3)} hidden={!labels} size={10} cls="dim">iₜ ⊙ c̃ₜ</Lbl>

      {/* output branch: c_t → tanh → × o → h_t */}
      <Edge d="M 500 70 V 128" hl={hl(5)} flow={flow} />
      <CellBox x={470} y={130} w={60} h={30} title="tanh" hl={hl(5)} />
      <Edge d="M 500 160 V 203" hl={hl(5)} flow={flow} />
      <OpNode x={500} y={218} sym="×" r={13} hl={hl(5)} />
      <GateValve x={560} y={240} act="σ" label="oₜ  output" value={g.o} hl={hl(5)} showLabel={labels} />
      <Edge d="M 590 238 C 590 222 528 226 514 221" hl={hl(5)} flow={flow} />
      <Edge d="M 500 231 V 300" hl={hl(6)} flow={flow} />
      <Lbl x={500} y={320} hl={hl(6)} hidden={!labels} size={14}>hₜ</Lbl>
      <Lbl x={500} y={337} hl={hl(6)} hidden={!labels} size={10} cls="dim">= oₜ ⊙ tanh(cₜ) — the EXPOSED memory</Lbl>

      {/* input rail feeding all four gates */}
      <Lbl x={120} y={360} hl={hl(2)} hidden={!labels} size={13}>xₜ</Lbl>
      <Lbl x={250} y={360} hl={hl(2)} hidden={!labels} size={13}>hₜ₋₁</Lbl>
      <Edge d="M 128 348 C 150 320 180 300 196 284" cls="rail" hl={hl(2)} arrow={false} />
      <Edge d="M 250 348 C 235 320 215 300 205 284" cls="rail" hl={hl(2)} arrow={false} />
      <Edge d="M 138 350 C 220 320 285 300 305 284" cls="rail" hl={hl(2)} arrow={false} />
      <Edge d="M 258 348 C 280 320 300 300 312 284" cls="rail" hl={hl(2)} arrow={false} />
      <Edge d="M 142 352 C 260 330 370 305 396 284" cls="rail" hl={hl(2)} arrow={false} />
      <Edge d="M 262 350 C 320 325 380 305 402 284" cls="rail" hl={hl(2)} arrow={false} />
      <Edge d="M 145 354 C 320 345 520 320 585 284" cls="rail" hl={hl(2)} arrow={false} />
      <Edge d="M 266 352 C 380 335 540 315 592 284" cls="rail" hl={hl(2)} arrow={false} />
    </svg>
  );
}

function Slider({ label, min, max, value, onChange }: {
  label: string; min: number; max: number; value: number; onChange: (v: number) => void;
}) {
  return (
    <label className="sl-slider">
      <span>{label} = <b>{value.toFixed(2)}</b></span>
      <input type="range" min={min} max={max} step={0.01} value={value}
        onChange={e => onChange(parseFloat(e.target.value))} />
    </label>
  );
}

export default function LSTMLab() {
  const [mode, setModeRaw] = useState<SLMode>('watch');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [g, setG] = useState<Gates>(DEFAULTS);

  const labels = mode !== 'exam';
  const st = LSTM_STEPS[Math.min(step, LSTM_STEPS.length - 1)];
  const setMode = (m: SLMode) => { setModeRaw(m); setPlaying(false); setStep(0); };
  useAutoplay(playing, setPlaying, setStep, LSTM_STEPS.length - 1);

  const ct = g.f * g.cPrev + g.i * g.ctil;
  const ht = g.o * Math.tanh(ct);
  const liveLatex = aligned([
    `c_t &= f_t\\, c_{t-1} + i_t\\, \\tilde{c}_t = ${g.f.toFixed(2)} \\cdot ${g.cPrev.toFixed(2)} + ${g.i.toFixed(2)} \\cdot ${g.ctil.toFixed(2)} = ${ct.toFixed(4)}`,
    `h_t &= o_t \\tanh(c_t) = ${g.o.toFixed(2)} \\cdot \\tanh(${ct.toFixed(4)}) = ${ht.toFixed(4)}`,
  ]);

  const set = (k: keyof Gates) => (v: number) => setG(prev => ({ ...prev, [k]: v }));

  return (
    <>
      <div className="card">
        <h4>LSTM — memory-cell computational graph</h4>
        <ModeTabs mode={mode} setMode={setMode} />
        <div className="viz"><LSTMCell step={step} labels={labels} flow={mode === 'watch'} g={g} /></div>

        {mode === 'watch' && (
          <>
            <div className="stepper">
              <button className="btn" onClick={() => { setPlaying(false); setStep(s => Math.max(0, s - 1)); }}>← Back</button>
              <span className="stepct">Step {step + 1} / {LSTM_STEPS.length} — <b style={{ color: 'var(--amber)' }}>{st.title}</b></span>
              <button className="btn primary" onClick={() => { setPlaying(false); setStep(s => Math.min(LSTM_STEPS.length - 1, s + 1)); }}>Next →</button>
              <button className="btn" onClick={() => setPlaying(p => !p)}>{playing ? '⏸ Pause' : '▶ Play'}</button>
            </div>
            {st.latex && <EquationBlock title={st.title} latex={st.latex} highlight />}
            <div className="notebox">{st.desc}</div>
          </>
        )}

        {labels && (
          <>
            <div className="sl-controls">
              <Slider label="fₜ" min={0} max={1} value={g.f} onChange={set('f')} />
              <Slider label="iₜ" min={0} max={1} value={g.i} onChange={set('i')} />
              <Slider label="c̃ₜ" min={-1} max={1} value={g.ctil} onChange={set('ctil')} />
              <Slider label="oₜ" min={0} max={1} value={g.o} onChange={set('o')} />
              <Slider label="cₜ₋₁" min={-1} max={1} value={g.cPrev} onChange={set('cPrev')} />
            </div>
            <EquationBlock title="Live scalar computation (from the sliders)" latex={liveLatex}
              caption="Drag the valves: f scales OLD memory, i scales the NEW candidate, o decides how much is exposed." />
          </>
        )}
      </div>

      {mode === 'trace' && (
        <QuestionRunner questions={LSTM_TRACE} model="lstm" mode="trace"
          onStepChange={s => setStep(s ?? 0)} />
      )}
      {mode === 'exam' && <QuestionRunner questions={LSTM_EXAM} model="lstm" mode="exam" />}

      {labels && (
        <details className="card sl-formulas" open={mode === 'watch'}>
          <summary>Formula view — textbook equations</summary>
          {LSTM_FORMULAS.map(f => <EquationBlock key={f.title} title={f.title} latex={f.latex} caption={f.caption} />)}
        </details>
      )}

      <div className="trapbox"><b>LSTM traps</b> · {LSTM_TRAPS.join(' · ')}</div>
    </>
  );
}

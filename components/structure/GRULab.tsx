'use client';
// GRU Structure Lab — real computational cell: h(t-1) splits into the direct
// old-state path, the reset-gated candidate path, and the gate inputs; the
// update gate blends old vs candidate. Sliders drive a live scalar h_t and a
// visual old/new blend bar.
import { useState } from 'react';
import type { SLMode } from '@/lib/stat41120/content/structureLab';
import {
  GRU_STEPS, GRU_FORMULAS, GRU_TRACE, GRU_EXAM, GRU_TRAPS,
} from '@/lib/stat41120/content/structureLab';
import EquationBlock, { aligned } from '@/components/EquationBlock';
import { SLDefs, Edge, OpNode, Lbl, CellBox, GateValve } from './svgParts';
import { ModeTabs, QuestionRunner, useAutoplay } from './labKit';

interface Vals { r: number; z: number; hPrev: number; x: number; }
const DEFAULTS: Vals = { r: 0.6, z: 0.3, hPrev: 0.5, x: 1.0 };

function GRUCell({ step, labels, flow, v }: { step: number; labels: boolean; flow: boolean; v: Vals }) {
  const hl = (...idx: number[]) => idx.includes(step);
  return (
    <svg viewBox="0 0 740 350" width="100%" role="img" aria-label="GRU cell: h(t-1) splits into a direct old-state path scaled by 1 minus z, a reset-gated path into the tanh candidate, and gate inputs; update gate z blends old state with candidate to produce h(t)">
      <SLDefs />
      {/* h_{t-1} and the three-way split */}
      <Lbl x={46} y={72} hl={hl(0)} hidden={!labels} size={14}>hₜ₋₁</Lbl>
      <Lbl x={46} y={89} hl={hl(0)} hidden={!labels} size={9.5} cls="dim">splits 3 ways</Lbl>

      {/* (1) direct old-state path along the top */}
      <Edge d="M 82 66 H 434" hl={hl(0, 4)} flow={flow} />
      <Lbl x={255} y={54} hl={hl(4)} hidden={!labels} size={10} cls="dim">old-state path (kept memory)</Lbl>
      <OpNode x={450} y={66} sym="×" r={13} hl={hl(4)} />
      <Lbl x={450} y={40} hl={hl(4)} hidden={!labels} size={11} cls="val">1 − zₜ</Lbl>
      <Edge d="M 464 66 H 544" hl={hl(4)} flow={flow} />
      <OpNode x={560} y={66} sym="+" r={13} hl={hl(4)} />
      <Edge d="M 574 66 H 640" hl={hl(5)} flow={flow} />
      <Lbl x={666} y={70} hl={hl(5)} hidden={!labels} size={14}>hₜ</Lbl>
      <Lbl x={666} y={87} hl={hl(5)} hidden={!labels} size={9.5} cls="dim">memory AND output</Lbl>

      {/* (2) reset-gated path into the candidate */}
      <Edge d="M 82 76 C 115 120 125 185 148 185" hl={hl(0, 1)} flow={flow} />
      <OpNode x={165} y={185} sym="×" r={12} hl={hl(1)} />
      <Lbl x={165} y={162} hl={hl(1)} hidden={!labels} size={11} cls="val">rₜ</Lbl>
      <Edge d="M 177 185 H 243" hl={hl(1, 2)} flow={flow} />
      <CellBox x={245} y={163} w={100} h={44} title="tanh" hl={hl(2)} />
      <Lbl x={295} y={152} hl={hl(2)} hidden={!labels} size={11}>candidate h̃ₜ</Lbl>
      <Edge d="M 345 185 H 400" hl={hl(2, 4)} flow={flow} />
      <OpNode x={415} y={185} sym="×" r={12} hl={hl(4)} />
      <Lbl x={415} y={162} hl={hl(4)} hidden={!labels} size={11} cls="val">zₜ</Lbl>
      <Edge d="M 415 173 C 415 120 545 122 557 80" hl={hl(4)} flow={flow} />

      {/* x_t into the candidate */}
      <Lbl x={295} y={330} hl={hl(2)} hidden={!labels} size={13}>xₜ</Lbl>
      <Edge d="M 295 316 V 209 " hl={hl(2)} flow={flow} />

      {/* (3) gate inputs */}
      <GateValve x={80} y={245} act="σ" label="rₜ  reset" value={v.r} hl={hl(1)} showLabel={labels} />
      <Edge d="M 125 243 C 135 225 152 210 160 198" hl={hl(1)} flow={flow} />
      <GateValve x={490} y={245} act="σ" label="zₜ  update" value={v.z} hl={hl(3)} showLabel={labels} />
      <Edge d="M 512 243 C 500 225 440 215 424 198" hl={hl(3, 4)} flow={flow} />
      <Edge d="M 540 243 C 600 200 475 120 462 80" hl={hl(3, 4)} flow={flow} />
      <Lbl x={585} y={175} hl={hl(3)} hidden={!labels} size={9.5} cls="dim">z also sets 1−z</Lbl>

      {/* faint rails: x_t and h_{t-1} feed both gates */}
      <Edge d="M 82 82 C 90 150 95 210 102 243" cls="rail" hl={hl(1, 3)} arrow={false} />
      <Edge d="M 283 318 C 200 300 130 280 118 285" cls="rail" hl={hl(1, 3)} arrow={false} />
      <Edge d="M 92 80 C 200 170 420 210 505 245" cls="rail" hl={hl(1, 3)} arrow={false} />
      <Edge d="M 307 318 C 380 300 470 285 505 283" cls="rail" hl={hl(1, 3)} arrow={false} />
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

export default function GRULab() {
  const [mode, setModeRaw] = useState<SLMode>('watch');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [v, setV] = useState<Vals>(DEFAULTS);

  const labels = mode !== 'exam';
  const st = GRU_STEPS[Math.min(step, GRU_STEPS.length - 1)];
  const setMode = (m: SLMode) => { setModeRaw(m); setPlaying(false); setStep(0); };
  useAutoplay(playing, setPlaying, setStep, GRU_STEPS.length - 1);

  // scalar demo with W_h = U_h = 1, b = 0
  const hTil = Math.tanh(v.x + v.r * v.hPrev);
  const oldPart = (1 - v.z) * v.hPrev;
  const newPart = v.z * hTil;
  const ht = oldPart + newPart;
  const liveLatex = aligned([
    `\\tilde{h}_t &= \\tanh\\!\\big(x_t + r_t\\, h_{t-1}\\big) = \\tanh\\!\\big(${v.x.toFixed(2)} + ${v.r.toFixed(2)} \\cdot ${v.hPrev.toFixed(2)}\\big) = ${hTil.toFixed(4)}`,
    `h_t &= (1 - z_t)\\, h_{t-1} + z_t\\, \\tilde{h}_t = ${(1 - v.z).toFixed(2)} \\cdot ${v.hPrev.toFixed(2)} + ${v.z.toFixed(2)} \\cdot ${hTil.toFixed(4)} = ${ht.toFixed(4)}`,
  ]);

  const set = (k: keyof Vals) => (val: number) => setV(prev => ({ ...prev, [k]: val }));
  const oldPct = Math.round((1 - v.z) * 100);

  return (
    <>
      <div className="card">
        <h4>GRU — gated computational graph (no cell state)</h4>
        <ModeTabs mode={mode} setMode={setMode} />
        <div className="viz"><GRUCell step={step} labels={labels} flow={mode === 'watch'} v={v} /></div>

        {mode === 'watch' && (
          <>
            <div className="stepper">
              <button className="btn" onClick={() => { setPlaying(false); setStep(s => Math.max(0, s - 1)); }}>← Back</button>
              <span className="stepct">Step {step + 1} / {GRU_STEPS.length} — <b style={{ color: 'var(--amber)' }}>{st.title}</b></span>
              <button className="btn primary" onClick={() => { setPlaying(false); setStep(s => Math.min(GRU_STEPS.length - 1, s + 1)); }}>Next →</button>
              <button className="btn" onClick={() => setPlaying(p => !p)}>{playing ? '⏸ Pause' : '▶ Play'}</button>
            </div>
            {st.latex && <EquationBlock title={st.title} latex={st.latex} highlight />}
            <div className="notebox">{st.desc}</div>
          </>
        )}

        {labels && (
          <>
            <div className="sl-controls">
              <Slider label="rₜ" min={0} max={1} value={v.r} onChange={set('r')} />
              <Slider label="zₜ" min={0} max={1} value={v.z} onChange={set('z')} />
              <Slider label="hₜ₋₁" min={-1} max={1} value={v.hPrev} onChange={set('hPrev')} />
              <Slider label="xₜ" min={-1} max={1} value={v.x} onChange={set('x')} />
            </div>

            <div className="small" style={{ marginTop: 8 }}>Old-vs-new blend controlled by the update gate zₜ:</div>
            <div className="blendbar" role="img"
              aria-label={`Blend: ${oldPct}% old state, ${100 - oldPct}% candidate`}>
              <div className="old" style={{ width: `${oldPct}%` }}>
                {oldPct >= 18 && <span>old hₜ₋₁ · (1−z) = {(1 - v.z).toFixed(2)} → {oldPart.toFixed(3)}</span>}
              </div>
              <div className="new" style={{ width: `${100 - oldPct}%` }}>
                {oldPct <= 82 && <span>candidate h̃ₜ · z = {v.z.toFixed(2)} → {newPart.toFixed(3)}</span>}
              </div>
            </div>

            <EquationBlock title="Live scalar computation (from the sliders)" latex={liveLatex}
              caption="Scalar demo with W_h = U_h = 1, b = 0. z→0 keeps the old state; z→1 replaces it with the candidate. r only shapes the candidate." />
          </>
        )}
      </div>

      {mode === 'trace' && (
        <QuestionRunner questions={GRU_TRACE} model="gru" mode="trace"
          onStepChange={s => setStep(s ?? 0)} />
      )}
      {mode === 'exam' && <QuestionRunner questions={GRU_EXAM} model="gru" mode="exam" />}

      {labels && (
        <details className="card sl-formulas" open={mode === 'watch'}>
          <summary>Formula view — textbook equations</summary>
          {GRU_FORMULAS.map(f => <EquationBlock key={f.title} title={f.title} latex={f.latex} caption={f.caption} />)}
        </details>
      )}

      <div className="trapbox"><b>GRU traps</b> · {GRU_TRAPS.join(' · ')}</div>
    </>
  );
}

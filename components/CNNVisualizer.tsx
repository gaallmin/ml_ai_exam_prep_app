'use client';
import { useState } from 'react';
import EquationBlock from './EquationBlock';
import { useSprintStore } from '@/lib/store';

const CONV_INPUT = [[1,0,2,1,0],[0,1,0,2,1],[3,0,1,0,2],[1,2,0,1,0],[0,1,3,0,1]];
const CONV_K = [[1,0,-1],[1,0,-1],[1,0,-1]];

interface CnnParams { Win: number; Din: number; k: number; Dout: number; p: number; s: number; pool: number; ps: number; }
const DEFAULTS: CnnParams = { Win: 32, Din: 3, k: 5, Dout: 16, p: 0, s: 1, pool: 2, ps: 2 };

export default function CNNVisualizer({ onTryDrill }: { onTryDrill: () => void }) {
  const [c, setC] = useState<CnnParams>(DEFAULTS);
  const [convStep, setConvStep] = useState(0);
  const saveCalculation = useSprintStore(s => s.saveCalculation);
  const addManualWrongNote = useSprintStore(s => s.addManualWrongNote);
  const [savedMsg, setSavedMsg] = useState('');

  const wc = Math.floor((c.Win - c.k + 2 * c.p) / (c.s || 1)) + 1;
  const params = (c.k * c.k * c.Din + 1) * c.Dout;
  const wp = Math.floor((wc - c.pool) / (c.ps || 1)) + 1;
  const flat = wp * wp * c.Dout;

  const r = Math.floor(convStep / 3), col = convStep % 3;
  let val = 0;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) val += CONV_INPUT[r + i][col + j] * CONV_K[i][j];

  const summary =
    `conv: ⌊(${c.Win}−${c.k}+2·${c.p})/${c.s}⌋+1=${wc} → ${wc}×${wc}×${c.Dout}; ` +
    `params=(${c.k}·${c.k}·${c.Din}+1)×${c.Dout}=${params}; ` +
    `pool → ${wp}×${wp}×${c.Dout}; flatten=${flat}`;

  const num = (f: keyof CnnParams) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setC(prev => ({ ...prev, [f]: parseInt(e.target.value) || 0 }));

  return (
    <>
      <div className="card">
        <h4>Kernel animation — 5×5 input, 3×3 filter, stride 1, no padding</h4>
        <div className="viz">
          <svg viewBox="0 0 330 130" width="100%" role="img" aria-label="convolution animation">
            {CONV_INPUT.map((row, i) => row.map((v, j) => {
              const inWin = i >= r && i < r + 3 && j >= col && j < col + 3;
              return (
                <g key={`${i}-${j}`}>
                  <rect x={8 + j * 24} y={5 + i * 24} width="22" height="22"
                    fill={inWin ? '#3a3320' : '#1c2426'} stroke={inWin ? 'var(--amber)' : 'var(--line)'} />
                  <text x={15 + j * 24} y={20 + i * 24} fill={inWin ? 'var(--amber)' : 'var(--dim)'} fontSize="11">{v}</text>
                </g>
              );
            }))}
            <text x="140" y="18" fill="var(--dim)" fontSize="10">kernel</text>
            {CONV_K.map((row, i) => row.map((v, j) => (
              <g key={`k${i}-${j}`}>
                <rect x={140 + j * 20} y={24 + i * 20} width="18" height="18" fill="#1c2426" stroke="var(--sky)" />
                <text x={144 + j * 20} y={37 + i * 20} fill="var(--sky)" fontSize="10">{v}</text>
              </g>
            )))}
            <text x="222" y="18" fill="var(--dim)" fontSize="10">feature map</text>
            {[0, 1, 2].map(i => [0, 1, 2].map(j => {
              const idx = i * 3 + j, done = idx < convStep, cur = idx === convStep;
              let v: number | '' = '';
              if (done || cur) {
                let s2 = 0;
                for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) s2 += CONV_INPUT[i + a][j + b] * CONV_K[a][b];
                v = s2;
              }
              return (
                <g key={`o${i}-${j}`}>
                  <rect x={222 + j * 24} y={24 + i * 24} width="22" height="22"
                    fill={cur ? '#3a3320' : '#1c2426'} stroke={cur ? 'var(--amber)' : done ? 'var(--moss)' : 'var(--line)'} />
                  <text x={228 + j * 24} y={39 + i * 24} fill={cur ? 'var(--amber)' : 'var(--moss)'} fontSize="10">{v}</text>
                </g>
              );
            }))}
          </svg>
        </div>
        <div className="stepper">
          <button className="btn" onClick={() => setConvStep(s => Math.max(0, s - 1))}>← Back</button>
          <span className="stepct">Position {convStep + 1}/9 · window ⊙ kernel summed = <b style={{ color: 'var(--amber)' }}>{val}</b></span>
          <button className="btn primary" onClick={() => setConvStep(s => Math.min(8, s + 1))}>Slide →</button>
        </div>
        <div className="notebox">
          Elementwise multiply the highlighted window with the kernel, sum → one feature-map value.
          One filter produces one feature map; output depth = number of filters.
        </div>
      </div>

      <div className="card">
        <h4>Live dimension & parameter calculator</h4>
        <div className="grid2">
          <div><label className="fl">Input width Win</label><input type="number" value={c.Win} onChange={num('Win')} /></div>
          <div><label className="fl">Input depth Din</label><input type="number" value={c.Din} onChange={num('Din')} /></div>
          <div><label className="fl">Kernel k</label><input type="number" value={c.k} onChange={num('k')} /></div>
          <div><label className="fl">Filters Dout</label><input type="number" value={c.Dout} onChange={num('Dout')} /></div>
          <div><label className="fl">Padding p</label><input type="number" value={c.p} onChange={num('p')} /></div>
          <div><label className="fl">Stride s</label><input type="number" value={c.s} onChange={num('s')} /></div>
          <div><label className="fl">Pool size</label><input type="number" value={c.pool} onChange={num('pool')} /></div>
          <div><label className="fl">Pool stride</label><input type="number" value={c.ps} onChange={num('ps')} /></div>
        </div>
        <EquationBlock
          title="Dimension & parameter calculations"
          latex={`\\begin{aligned}
            \\text{Conv out:} \\quad W &= \\left\\lfloor\\frac{${c.Win}-${c.k}+2\\cdot${c.p}}{${c.s}}\\right\\rfloor + 1 = ${wc} \\quad &\\Rightarrow ${wc}\\times${wc}\\times${c.Dout} \\\\
            \\text{Conv params:} \\quad & (${c.k}\\cdot${c.k}\\cdot${c.Din}+1) \\times ${c.Dout} = ${params} \\\\
            \\text{Pool out:} \\quad W &= \\left\\lfloor\\frac{${wc}-${c.pool}}{${c.ps}}\\right\\rfloor + 1 = ${wp} \\quad &\\Rightarrow ${wp}\\times${wp}\\times${c.Dout} \\\\
            \\text{Flatten:} \\quad & ${wp} \\times ${wp} \\times ${c.Dout} = ${flat}
          \\end{aligned}`}
        />
        <div className="trapbox">
          <b>Traps</b> · output depth = number of filters · pooling preserves depth, 0 params · flatten has 0 params ·
          a following dense layer of 128 units would add ({flat}+1)×128 = {(flat + 1) * 128} params — dense layers dominate ·
          conv is translation equivariant, pooling gives approximate invariance.
        </div>
        <div>
          <button className="btn" onClick={() => {
            saveCalculation('CNN dimensions', `Win=${c.Win} Din=${c.Din} k=${c.k} Dout=${c.Dout} p=${c.p} s=${c.s} pool=${c.pool}/${c.ps}`, summary);
            setSavedMsg('Calculation saved.');
          }}>Save this calculation</button>
          <button className="btn" onClick={() => {
            const now = Date.now();
            addManualWrongNote({
              sourceId: null, topic: 'CNN calculation', wk: 'CNN calculation gap',
              wrong: `Struggled with: ${summary}`,
              rule: 'Wout = ⌊(Win−k+2p)/s⌋+1 ; params = (k·k·Din+1)·Dout ; pooling preserves depth; flatten = W·H·D.',
              hook: 'floor before +1; +1 bias per filter.',
              trigger: 'CNN output-shape or parameter-count question.',
              src: 'cnn-visualiser', count: 1, correctStreak: 0, last: now, due: now, mastered: false,
            });
            setSavedMsg('Added to 오답노트.');
          }}>Add to 오답노트</button>
          <button className="btn" onClick={onTryDrill}>Try related drill</button>
          {savedMsg && <span className="small" style={{ marginLeft: 8, color: 'var(--moss)' }}>{savedMsg}</span>}
        </div>
      </div>
    </>
  );
}

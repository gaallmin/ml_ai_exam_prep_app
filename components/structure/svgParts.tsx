'use client';
// Shared SVG vocabulary for the Structure Lab computational graphs:
// edges with flowing particles, ×/+ op nodes, sigmoid/tanh gate valves, labels.

export function SLDefs() {
  return (
    <defs>
      <marker id="sl-arr" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--faint)" />
      </marker>
      <marker id="sl-arr-hl" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill="var(--amber)" />
      </marker>
    </defs>
  );
}

interface EdgeProps {
  d: string;
  hl?: boolean;        // highlighted by the current animation step
  cls?: string;        // extra class: 'w' | 'u' | 'v' | 'highway' | 'dash' | 'rail'
  flow?: boolean;      // draw a moving particle along the path while highlighted
  arrow?: boolean;
  dur?: string;
}

export function Edge({ d, hl, cls = '', flow, arrow = true, dur = '1.6s' }: EdgeProps) {
  return (
    <g>
      <path
        d={d}
        className={`sl-edge ${cls} ${hl ? 'hl' : ''}`}
        markerEnd={arrow ? (hl ? 'url(#sl-arr-hl)' : 'url(#sl-arr)') : undefined}
      />
      {flow && hl && (
        <circle r="3.2" className="sl-particle">
          <animateMotion dur={dur} repeatCount="indefinite" path={d} />
        </circle>
      )}
    </g>
  );
}

export function OpNode({ x, y, sym, hl, r = 13 }: { x: number; y: number; sym: string; hl?: boolean; r?: number }) {
  return (
    <g className={`sl-op ${hl ? 'hl' : ''}`}>
      <circle cx={x} cy={y} r={r} />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="13">{sym}</text>
    </g>
  );
}

/** Gate valve: box with σ/tanh symbol, a fill gauge showing its current value, and a label. */
export function GateValve({
  x, y, w = 60, h = 40, act, label, value, hl, showLabel = true,
}: {
  x: number; y: number; w?: number; h?: number;
  act: 'σ' | 'tanh'; label: string; value?: number; hl?: boolean; showLabel?: boolean;
}) {
  const frac = value === undefined ? null : Math.max(0, Math.min(1, act === 'tanh' ? (value + 1) / 2 : value));
  return (
    <g className={`sl-gate ${hl ? 'hl' : ''}`}>
      <rect x={x} y={y} width={w} height={h} rx="7" />
      <text x={x + w / 2} y={y + 15} textAnchor="middle" fontSize="11.5" className="sl-gate-act">{act}</text>
      {frac !== null && (
        <g>
          <rect x={x + 7} y={y + h - 13} width={w - 14} height={6} rx="3" className="sl-gauge-bg" />
          <rect x={x + 7} y={y + h - 13} width={(w - 14) * frac} height={6} rx="3" className="sl-gauge-fill" />
        </g>
      )}
      <text x={x + w / 2} y={y + h + 13} textAnchor="middle" fontSize="11" className="sl-gate-lbl">
        {showLabel ? label : '?'}
      </text>
      {value !== undefined && showLabel && (
        <text x={x + w / 2} y={y + h + 26} textAnchor="middle" fontSize="10" className="sl-gate-val">
          {value.toFixed(2)}
        </text>
      )}
    </g>
  );
}

export function Lbl({
  x, y, children, hl, hidden, anchor = 'middle', size = 12, cls = '',
}: {
  x: number; y: number; children: React.ReactNode; hl?: boolean; hidden?: boolean;
  anchor?: 'start' | 'middle' | 'end'; size?: number; cls?: string;
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} className={`sl-lbl ${cls} ${hl ? 'hl' : ''}`}>
      {hidden ? '?' : children}
    </text>
  );
}

export function CellBox({
  x, y, w, h, hl, title,
}: { x: number; y: number; w: number; h: number; hl?: boolean; title?: string }) {
  return (
    <g className={`sl-cell ${hl ? 'hl' : ''}`}>
      <rect x={x} y={y} width={w} height={h} rx="9" />
      {title && <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize="12">{title}</text>}
    </g>
  );
}

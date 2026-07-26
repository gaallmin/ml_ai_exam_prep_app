'use client';
import type { VisualDerivationContent } from '@/lib/stat41120/content/types';

interface Props {
  visual: VisualDerivationContent;
}

export default function VisualDerivationPanel({ visual }: Props) {
  return (
    <div className="visual-derivation">
      <div className="small"><b>{visual.title}</b></div>
      <div className="viz" dangerouslySetInnerHTML={{ __html: visual.svgOrHtml }} />
      {visual.numericExample && (
        <div className="numeric-example">
          <div className="small"><b>Numeric example:</b></div>
          <div className="example-values">
            {Object.entries(visual.numericExample.inputs).map(([k, v]) => (
              <div key={k} className="example-row">
                <span>{k} =</span> <span style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            <div className="example-sep">→</div>
            {Object.entries(visual.numericExample.outputs).map(([k, v]) => (
              <div key={k} className="example-row">
                <span>{k} =</span> <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: 'var(--amber)' }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="small" style={{ marginTop: 4, color: 'var(--dim)' }}>
            {visual.numericExample.explanation}
          </div>
        </div>
      )}
    </div>
  );
}

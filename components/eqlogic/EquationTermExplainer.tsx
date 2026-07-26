'use client';
import { useState } from 'react';
import InlineMath from '@/components/InlineMath';
import type { EquationTermDefinition } from '@/lib/stat41120/content/types';

interface Props {
  terms: EquationTermDefinition[];
  title?: string;
}

export default function EquationTermExplainer({ terms, title }: Props) {
  const [selected, setSelected] = useState<string | null>(terms[0]?.term ?? null);
  const selectedTerm = terms.find(t => t.term === selected);

  return (
    <div className="term-explainer">
      {title && <div className="small" style={{ marginBottom: 8 }}><b>{title}</b></div>}
      <div className="term-chips">
        {terms.map(t => (
          <button
            key={t.term}
            className={`chip ${selected === t.term ? 'on' : ''}`}
            onClick={() => setSelected(t.term)}
          >
            <InlineMath latex={t.term} />
          </button>
        ))}
      </div>

      {selectedTerm && (
        <div className="term-detail">
          <div className="term-name">{selectedTerm.name}</div>
          <div className="small">
            <b>Meaning:</b> {selectedTerm.meaning}
          </div>
          <div className="small">
            <b>Role:</b> {selectedTerm.role}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { FORMULAS } from '@/lib/stat41120/content/formulas';
import type { FormulaStatus } from '@/lib/stat41120/content/types';
import { useSprintStore } from '@/lib/store';
import EquationBlock from './EquationBlock';
import EquationLogicLab from './eqlogic/EquationLogicLab';
import { EQUATION_LOGIC } from '@/lib/stat41120/content/equationLogic';

const STATUSES: FormulaStatus[] = ['unseen', 'weak', 'memorised'];

export default function FormulaBank() {
  const formulaProgress = useSprintStore(s => s.formulaProgress);
  const markFormulaStatus = useSprintStore(s => s.markFormulaStatus);
  const memorised = FORMULAS.filter(f => formulaProgress[f.cat] === 'memorised').length;
  const [openLabId, setOpenLabId] = useState<string | null>(null);

  return (
    <section className="page active">
      <h2>Formula Bank</h2>
      <p className="lead">
        Formulas are blurred. Recall each one out loud or on paper, then tap to check.
        Mark your recall honestly — status syncs across devices. {memorised}/{FORMULAS.length} memorised.
      </p>
      {FORMULAS.map(f => {
        const status: FormulaStatus = formulaProgress[f.cat] ?? 'unseen';
        const hasLogicLab = f.logicLabId && EQUATION_LOGIC[f.logicLabId];
        return (
          <div className="card" key={f.cat}>
            <h4>{f.cat}</h4>
            {f.latex && <EquationBlock latex={f.latex} reveal />}
            <div className="small"><b style={{ color: 'var(--moss)' }}>When:</b> {f.when}</div>
            <div className="trapbox"><b>Trap</b> · {f.trap}</div>
            <div className="small"><b style={{ color: 'var(--sky)' }}>Micro example:</b> <code>{f.ex}</code></div>
            <div className="qbox"><b>Professor asks:</b> {f.q}</div>
            <div className="fstatus">
              {hasLogicLab && (
                <button className="btn" onClick={() => setOpenLabId(f.logicLabId!)}>
                  📖 Understand
                </button>
              )}
              {STATUSES.map(st => (
                <button key={st} className={`btn ${status === st ? 'on' : ''}`}
                  onClick={() => markFormulaStatus(f.cat, st)}>
                  {st}
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {openLabId && EQUATION_LOGIC[openLabId] && (
        <EquationLogicLab content={EQUATION_LOGIC[openLabId]} onClose={() => setOpenLabId(null)} />
      )}
    </section>
  );
}

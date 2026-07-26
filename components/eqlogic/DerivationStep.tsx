'use client';
import { useState } from 'react';
import EquationBlock from '@/components/EquationBlock';
import type { DerivationStepContent } from '@/lib/stat41120/content/types';

interface Props {
  step: DerivationStepContent;
  hideUntilRevealed?: boolean;
}

export default function DerivationStep({ step, hideUntilRevealed }: Props) {
  const [revealed, setRevealed] = useState(!hideUntilRevealed);
  const [hiddenExpanded, setHiddenExpanded] = useState(false);

  return (
    <div className="derivation-step">
      <div className="step-header">
        <span className="step-num">Step {step.stepNum}</span>
        <span className="step-title">{step.title}</span>
        {hideUntilRevealed && !revealed && (
          <button className="btn-reveal-step" onClick={() => setRevealed(true)}>
            reveal
          </button>
        )}
      </div>

      {revealed && (
        <>
          <div className="step-flow">
            <EquationBlock latex={step.fromLatex} compact />
            <div className="arrow">↓</div>
            <EquationBlock latex={step.toLatex} compact />
          </div>

          <div className="step-explanation">
            <div className="small" style={{ marginBottom: 4 }}>
              <b>Why:</b> {step.whyValid}
            </div>
            <div className="small" style={{ marginBottom: 6, color: 'var(--dim)' }}>
              {step.explanation}
            </div>
            <div className="exam-phrase">
              <b style={{ color: 'var(--amber)' }}>In the exam, write:</b> "{step.examPhrase}"
            </div>
          </div>

          {step.hiddenSteps && step.hiddenSteps.length > 0 && (
            <details className="hidden-steps">
              <summary>algebra (click to expand)</summary>
              {hiddenExpanded && (
                <div className="hidden-list">
                  {step.hiddenSteps.map((hidden, i) => (
                    <div key={i} className="hidden-item">
                      {i + 1}. {hidden}
                    </div>
                  ))}
                </div>
              )}
            </details>
          )}
        </>
      )}
    </div>
  );
}

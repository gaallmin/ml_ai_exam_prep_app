'use client';
import { useState } from 'react';
import EquationBlock from '@/components/EquationBlock';
import AnswerTemplateBlock from '@/components/AnswerTemplateBlock';
import DerivationStep from './DerivationStep';
import EquationTermExplainer from './EquationTermExplainer';
import VisualDerivationPanel from './VisualDerivationPanel';
import EquationRecallCheck from './EquationRecallCheck';
import type { EquationLogicContent, Mark } from '@/lib/stat41120/content/types';

interface Props {
  content: EquationLogicContent;
  onClose: () => void;
}

export default function EquationLogicLab({ content, onClose }: Props) {
  const [section, setSection] = useState<'overview' | 'terms' | 'visual' | 'derivation' | 'exam' | 'traps' | 'recall'>(
    'overview'
  );

  return (
    <div className="eqlogic-lab modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{content.title}</h3>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        <div className="eqlogic-nav">
          {(['overview', 'terms', 'visual', 'derivation', 'exam', 'traps', 'recall'] as const).map(s => (
            <button
              key={s}
              className={`tab ${section === s ? 'on' : ''}`}
              onClick={() => setSection(s)}
            >
              {s === 'overview' ? '📖 Equation'
               : s === 'terms' ? '📝 Terms'
               : s === 'visual' ? '📊 Visual'
               : s === 'derivation' ? '🔗 Derivation'
               : s === 'exam' ? '✏️ Exam'
               : s === 'traps' ? '⚠️ Traps'
               : '🧠 Recall'}
            </button>
          ))}
        </div>

        <div className="eqlogic-body">
          {section === 'overview' && (
            <>
              <EquationBlock latex={content.mainLatex} title={content.title} />
              <div className="notebox">
                <b>Where it comes from:</b> {content.sourceDescription}
              </div>
            </>
          )}

          {section === 'terms' && content.terms.length > 0 && (
            <EquationTermExplainer terms={content.terms} />
          )}

          {section === 'visual' && (
            <VisualDerivationPanel visual={content.visualIntuition} />
          )}

          {section === 'derivation' && (
            <div className="derivation-list">
              <div className="small" style={{ marginBottom: 10 }}>
                <b>Step-by-step derivation</b> (click to reveal hidden algebra)
              </div>
              {content.derivationSteps.map((step, i) => (
                <DerivationStep key={i} step={step} hideUntilRevealed={i > 0} />
              ))}
            </div>
          )}

          {section === 'exam' && (
            <>
              <div className="small" style={{ marginBottom: 6 }}>
                <b>What the professor says:</b>
              </div>
              <AnswerTemplateBlock highlight>{content.examTemplate.statement}</AnswerTemplateBlock>
              <div className="small" style={{ marginTop: 10, marginBottom: 6 }}>
                <b>Your answer template:</b>
              </div>
              <AnswerTemplateBlock>{content.examTemplate.template}</AnswerTemplateBlock>
              <div className="small" style={{ marginTop: 10 }}>
                <b>Marking criteria:</b>
              </div>
              {content.examTemplate.markingCriteria.map((crit, i) => (
                <div key={i} className="small" style={{ marginTop: 3 }}>
                  • {crit}
                </div>
              ))}
            </>
          )}

          {section === 'traps' && (
            <div>
              <div className="small" style={{ marginBottom: 8 }}><b>Common mistakes:</b></div>
              {content.traps.map((trap, i) => (
                <div key={i} className="trapbox" style={{ marginBottom: 6 }}>
                  <b>Trap {i + 1}:</b> {trap}
                </div>
              ))}
            </div>
          )}

          {section === 'recall' && content.recallChecks.length > 0 && (
            <div>
              {content.recallChecks.map((check, i) => (
                <EquationRecallCheck
                  key={i}
                  prompt={check.prompt}
                  answer={check.answer}
                  keywords={check.keywords}
                  formulaId={content.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

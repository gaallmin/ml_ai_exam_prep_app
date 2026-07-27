'use client';
import { useState } from 'react';
import type { Mark } from '@/lib/stat41120/content/types';
import AnswerTemplateBlock from '@/components/AnswerTemplateBlock';
import { useSprintStore } from '@/lib/store';

interface Props {
  prompt: string;      // LaTeX OK
  answer: string;
  keywords?: string[][]; // for text marking
  formulaId: string;
  onAnswered?: (mark: Mark) => void;
}

export default function EquationRecallCheck({ prompt, answer, keywords, formulaId, onAnswered }: Props) {
  const [userAnswer, setUserAnswer] = useState('');
  const [mark, setMark] = useState<Mark | null>(null);
  const addManualWrongNote = useSprintStore(s => s.addManualWrongNote);

  function submit() {
    if (!userAnswer.trim()) {
      setMark('Incorrect');
      return;
    }

    // Simple keyword matching for text answers
    if (keywords) {
      const input = userAnswer.toLowerCase();
      let hit = 0;
      for (const group of keywords) {
        if (group.some(k => input.includes(k.toLowerCase()))) hit++;
      }
      const total = keywords.length;
      const isCorrect = hit === total;
      const finalMark: Mark = isCorrect ? 'Correct' : hit >= Math.ceil(total / 2) ? 'Partially correct' : 'Incorrect';
      setMark(finalMark);

      if (finalMark !== 'Correct') {
        const now = Date.now();
        addManualWrongNote({
          sourceId: `eqlogic:${formulaId}`,
          topic: `Equation Logic: ${formulaId}`,
          wk: 'Formula memory gap',
          wrong: `Recall check: answered "${userAnswer}". Expected: ${answer}`,
          rule: answer,
          hook: 'Equation logic lab — active recall',
          trigger: 'Recall check during equation understanding',
          src: 'equation-logic-lab',
          count: 1,
          correctStreak: 0,
          last: now,
          due: now,
          mastered: false,
        });
      }
      onAnswered?.(finalMark);
    } else {
      // Numeric or exact match
      setMark(userAnswer.trim() === answer.trim() ? 'Correct' : 'Incorrect');
    }
  }

  return (
    <div className="recall-check">
      <div className="small"><b>Active recall check:</b></div>
      <div className="recall-prompt">{prompt}</div>

      {!mark && (
        <>
          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            placeholder="Your answer…"
            rows={2}
          />
          <button className="btn primary" onClick={submit}>Check</button>
        </>
      )}

      {mark && (
        <>
          <div className={`mark ${mark === 'Correct' ? 'correct' : mark === 'Partially correct' ? 'partial' : 'incorrect'}`}>
            {mark}
          </div>
          <AnswerTemplateBlock title="Expected answer" highlight={mark !== 'Correct'}>{answer}</AnswerTemplateBlock>
          <button className="btn" onClick={() => { setMark(null); setUserAnswer(''); }}>Try another</button>
        </>
      )}
    </div>
  );
}

'use client';
// Answer template or textual solution block (NOT a mathematical formula).
// Used for learning curve full-mark templates, exam answer patterns, etc.
// Styled like a formula block but renders as plain readable text.

interface Props {
  title?: string;
  children: React.ReactNode;
  highlight?: boolean;
}

export default function AnswerTemplateBlock({ title, children, highlight }: Props) {
  return (
    <div className={`answer-template-block ${highlight ? 'hl' : ''}`}>
      {title && <div className="atb-title">{title}</div>}
      <div className="atb-body">{children}</div>
    </div>
  );
}

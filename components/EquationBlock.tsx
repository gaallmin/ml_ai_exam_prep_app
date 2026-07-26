'use client';
// Textbook-style equation rendering via KaTeX. Never render formulas as
// markdown/code blocks inside the Structure Lab — always through this.
import { useMemo, useState } from 'react';
import katex from 'katex';

interface Props {
  latex: string;          // single equation, or a \begin{aligned}...\end{aligned} block
  title?: string;         // caption like "State update" / "Candidate memory"
  caption?: string;       // small note under the equation
  highlight?: boolean;    // amber glow — used when the animation is on this equation
  compact?: boolean;
}

/** Join rows (each containing a single `&` alignment point) into an aligned block. */
export const aligned = (rows: string[]) => `\\begin{aligned}${rows.join(' \\\\[2pt] ')}\\end{aligned}`;

export default function EquationBlock({ latex, title, caption, highlight, compact }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        strict: false,
        output: 'html',
      });
    } catch {
      return '';
    }
  }, [latex]);

  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(latex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    });
  };

  return (
    <div className={`eqblock ${highlight ? 'hl' : ''} ${compact ? 'compact' : ''}`}>
      {(title || true) && (
        <div className="eqhead">
          {title && <span className="eqtitle">{title}</span>}
          <button className="eqcopy" onClick={copy} title="Copy LaTeX source" aria-label="Copy LaTeX source">
            {copied ? '✓ copied' : 'copy LaTeX'}
          </button>
        </div>
      )}
      <div className="eqbody" dangerouslySetInnerHTML={{ __html: html }} />
      {caption && <div className="eqcaption">{caption}</div>}
    </div>
  );
}

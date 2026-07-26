'use client';
// Inline mathematical formula rendered via KaTeX within text flow.
import { useMemo } from 'react';
import katex from 'katex';

interface Props {
  latex: string;  // e.g. "x^2 + y^2"
}

export default function InlineMath({ latex }: Props) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        displayMode: false,
        throwOnError: false,
        strict: false,
        output: 'html',
      });
    } catch {
      return '';
    }
  }, [latex]);

  return <span className="inline-math" dangerouslySetInnerHTML={{ __html: html }} />;
}

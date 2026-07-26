'use client';
import { useState } from 'react';
import { MAP } from '@/lib/stat41120/content/map';
import type { MapLeaf } from '@/lib/stat41120/content/types';
import { useSprintStore } from '@/lib/store';
import Reveal from './Reveal';

export default function BigPictureMap({ onTryDrill }: { onTryDrill: () => void }) {
  const visited = useSprintStore(s => s.visited);
  const markTopicVisited = useSprintStore(s => s.markTopicVisited);
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const [leaf, setLeaf] = useState<MapLeaf | null>(null);

  const total = MAP.reduce((a, b) => a + b.kids.length, 0);
  const visitedCount = Object.keys(visited).length;

  return (
    <section className="page active">
      <h2>STAT41120 Big Picture</h2>
      <p className="lead">
        The whole course as one hierarchy. Tap a branch to expand, tap a topic to open its exam card:
        note → formula → trap → question. {visitedCount}/{total} cards opened.
      </p>
      <ul className="tree">
        {MAP.map((br, bi) => (
          <li key={br.name}>
            <div className={`tnode branch ${open[bi] ? 'open' : ''}`} role="button" tabIndex={0}
              onClick={() => setOpen(o => ({ ...o, [bi]: !o[bi] }))}
              onKeyDown={e => e.key === 'Enter' && setOpen(o => ({ ...o, [bi]: !o[bi] }))}>
              <span className="arrow">▶</span>
              <span className="dot" style={{ background: br.color }} />
              <span className="nm"><b>{br.name}</b></span>
            </div>
            <ul className={open[bi] ? 'open' : ''}>
              {br.kids.map(k => (
                <li key={k.id}>
                  <div className={`tnode leaf ${visited[k.id] ? 'done' : ''}`} role="button" tabIndex={0}
                    onClick={() => { markTopicVisited(k.id); setLeaf(k); }}
                    onKeyDown={e => { if (e.key === 'Enter') { markTopicVisited(k.id); setLeaf(k); } }}>
                    <span className="arrow" style={{ visibility: 'hidden' }}>▶</span>
                    <span className="nm">{k.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {leaf && (
        <div id="detail" className="open" onClick={e => { if ((e.target as HTMLElement).id === 'detail') setLeaf(null); }}>
          <div className="inner">
            <button className="close" aria-label="Close" onClick={() => setLeaf(null)}>×</button>
            <h2>{leaf.name}</h2>
            <div className="notebox">{leaf.note}</div>
            {leaf.formulas && leaf.formulas.length > 0 && (
              <>
                <div className="reveal-hint">Formula — try to recall it, then tap to reveal</div>
                {leaf.formulas.map((f, i) => <Reveal key={i} className="formula">{f}</Reveal>)}
              </>
            )}
            {(leaf.traps ?? []).map((t, i) => <div key={i} className="trapbox"><b>Trap</b> · {t}</div>)}
            {leaf.q && (
              <>
                <div className="qbox"><b>Professor asks:</b> {leaf.q}</div>
                <div className="reveal-hint">Answer on paper first, then tap to reveal</div>
                <Reveal className="notebox">{leaf.a ?? ''}</Reveal>
              </>
            )}
            <hr />
            <button className="btn" onClick={() => { setLeaf(null); onTryDrill(); }}>Try a drill question</button>
            <button className="btn" onClick={() => setLeaf(null)}>Done</button>
          </div>
        </div>
      )}
    </section>
  );
}

'use client';
import { useState } from 'react';

export default function Reveal({ className, children }: { className: string; children: React.ReactNode }) {
  const [shown, setShown] = useState(false);
  return (
    <div className={`${className} reveal ${shown ? 'shown' : ''}`} onClick={() => setShown(true)}>
      {children}
    </div>
  );
}

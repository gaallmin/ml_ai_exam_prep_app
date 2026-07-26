'use client';
export type PageId = 'map' | 'sprint' | 'viz' | 'curves' | 'formulas' | 'drill' | 'note' | 'sheet';

const TABS: { id: PageId; label: string }[] = [
  { id: 'map', label: 'Map' },
  { id: 'sprint', label: 'Sprint' },
  { id: 'viz', label: 'Models' },
  { id: 'curves', label: 'Curves' },
  { id: 'formulas', label: 'Formulas' },
  { id: 'drill', label: 'Drill' },
  { id: 'note', label: '오답노트' },
  { id: 'sheet', label: 'Final Sheet' },
];

export default function BottomNav({ page, setPage }: { page: PageId; setPage: (p: PageId) => void }) {
  return (
    <nav id="nav">
      {TABS.map(t => (
        <button key={t.id} className={page === t.id ? 'active' : ''}
          onClick={() => { setPage(t.id); window.scrollTo(0, 0); }}>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

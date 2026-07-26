// Types mirror the data structures in the original stat41120_sprint.html verbatim.

export interface MapLeaf {
  id: string;
  name: string;
  note: string;
  formulas?: string[];
  traps?: string[];
  q?: string;
  a?: string;
}
export interface MapBranch { name: string; color: string; kids: MapLeaf[]; }

export interface FormulaCard {
  cat: string; f: string; when: string; trap: string; ex: string; q: string;
}
export type FormulaStatus = 'unseen' | 'weak' | 'memorised';

export interface CurvePattern {
  name: string; ev: string; dx: string; fix: string; tmpl: string; wrong: string;
  shape: 'over' | 'under' | 'dropout' | 'noisy' | 'slow' | 'diverge' | 'good';
}

export type DrillType = 'numeric' | 'mcq' | 'free';
export interface Drill {
  id: string; topic: string; wk: string; type: DrillType; q: string;
  tol?: number; ans?: number;            // numeric
  opts?: string[]; correct?: number;     // mcq
  model?: string;                        // free
  sol?: string; rule: string; hook: string; trigger: string;
}
export type Mark = 'Correct' | 'Partially correct' | 'Incorrect';

export interface SprintDay { day: string; title: string; core: string[]; items: string[]; }

export interface VizStep { t: string; f: string; d: string; hi: number; }
export interface VizModel { name: string; steps: VizStep[]; }

export interface WrongNote {
  id: string;                 // supabase uuid (or local temp id before sync)
  sourceId: string | null;    // drill id / seed id
  topic: string;
  wk: string;                 // weakness type
  wrong: string;
  rule: string;
  hook: string;
  trigger: string;
  src: string;
  count: number;
  correctStreak: number;
  last: number;               // epoch ms
  due: number;                // epoch ms
  mastered: boolean;
}
export interface DrillAttempt { qid: string; mark: Mark; ts: number; }

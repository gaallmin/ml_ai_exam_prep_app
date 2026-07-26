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
  cat: string;
  f?: string;      // DEPRECATED: old plain-text formula
  latex?: string;  // new: LaTeX formula string
  when: string;
  trap: string;
  ex: string;
  q: string;
  logicLabId?: string; // link to equation logic content
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

export interface VizStep {
  t: string;      // title
  f?: string;     // DEPRECATED: old plain-text formula
  latex?: string; // new: LaTeX formula
  d: string;      // description
  hi: number;     // highlight index
}
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

/* ===================== Equation Logic Lab Types ===================== */

export interface EquationTermDefinition {
  term: string;      // LaTeX for the term, e.g. "\\lambda w"
  name: string;      // human name, e.g. "L2 penalty gradient"
  meaning: string;   // what it represents
  role: string;      // what role it plays in the equation
}

export interface DerivationStepContent {
  stepNum: number;
  title: string;
  fromLatex: string;       // equation at start of this step
  toLatex: string;         // equation at end of this step
  explanation: string;     // why this step is valid
  whyValid: string;        // deep reason / rule used
  examPhrase: string;      // how to write this in the exam
  hiddenSteps?: string[];  // intermediate algebra (revealed one-by-one)
}

export interface VisualDerivationContent {
  title: string;
  svgOrHtml: string;   // embedded SVG or HTML for visual
  numericExample?: {
    inputs: Record<string, number>;
    outputs: Record<string, number>;
    explanation: string;
  };
}

export interface EquationLogicContent {
  id: string;                           // unique ID
  formulaId: string;                    // link to formula
  title: string;
  equationType: 'definition' | 'derivation' | 'penalty' | 'dimension' | 'gate' | 'chain-rule';

  // Part 1: The equation
  mainLatex: string;

  // Part 2: Where it comes from
  sourceDescription: string;            // 1-2 sentences

  // Part 3: Term meanings
  terms: EquationTermDefinition[];

  // Part 4: Visual intuition
  visualIntuition: VisualDerivationContent;

  // Part 5: Derivation steps
  derivationSteps: DerivationStepContent[];

  // Part 6: Exam template
  examTemplate: {
    statement: string;                  // what professor says
    template: string;                   // answer template (not code)
    markingCriteria: string[];          // what earns marks
  };

  // Part 7: Common traps
  traps: string[];

  // Part 8: Active recall check
  recallChecks: Array<{
    prompt: string;                     // question (LaTeX OK)
    answer: string;                     // expected answer
    keywords?: string[][];              // for text marking
  }>;

  // Part 9: Related drills
  relatedDrillIds: string[];
}

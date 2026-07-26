// Extracted verbatim from stat41120_sprint.html — do not paraphrase.
import type { SprintDay } from './types';

export const SPRINT: SprintDay[] = [
 {
  "day": "Mon 27",
  "title": "CNN day",
  "core": [
   "Conv dimensions & parameters",
   "Pooling & flatten",
   "Translation equivariance vs invariance"
  ],
  "items": [
   "Formula Bank: CNN dims, CNN params, pooling, flatten (hide & recall each)",
   "CNN visualiser: step the kernel animation once",
   "Drill: CNN output dimension",
   "Drill: CNN parameter count",
   "Drill: convolution calculation",
   "Drill: max-pooling calculation",
   "Mini mock: full pipeline 32×32×3 → conv → pool → flatten → dense, compute every shape + total params",
   "Memory dump: write the 4 CNN formulas from memory"
  ]
 },
 {
  "day": "Tue 28",
  "title": "RNN · LSTM · GRU day",
  "core": [
   "Simple RNN recursion",
   "LSTM gates & cell state",
   "GRU gates"
  ],
  "items": [
   "RNN visualiser: step through unfolding",
   "LSTM walkthrough: recite all 6 equations, then check",
   "GRU walkthrough: recite all 4 equations, then check",
   "Drill: RNN hidden-state calculation",
   "Drill: LSTM gate interpretation",
   "Drill: GRU comparison",
   "Map: BPTT & vanishing/exploding gradients card",
   "Memory dump: LSTM + GRU equations from blank paper"
  ]
 },
 {
  "day": "Wed 29",
  "title": "Regularisation & optimisation day",
  "core": [
   "Dropout as implicit ensemble",
   "Weight decay update rule",
   "Momentum / RMSProp / Adam roles"
  ],
  "items": [
   "Drill: weight decay update",
   "Drill: dropout free-response",
   "Drill: momentum question",
   "Drill: L1 vs L2",
   "Curves module: run all 10 patterns, say diagnosis aloud before revealing",
   "Drill: learning curve diagnosis ×2",
   "Map: initialization & batch norm card",
   "Memory dump: ∇ℓpen = ∇ℓ + λw and the momentum update"
  ]
 },
 {
  "day": "Thu 30",
  "title": "Backprop & evaluation day",
  "core": [
   "δ-recursion with downstream weights",
   "softmax+CE derivative",
   "ECE & calibration"
  ],
  "items": [
   "Drill: softmax+CE derivative (numeric)",
   "Drill: derive ok − yk (free, full derivation)",
   "Drill: highlighted-weight gradient ×2",
   "Drill: ECE calculation",
   "Drill: calibration interpretation",
   "Drill: threshold metrics (FPR vs sensitivity)",
   "Map: scoring rules card",
   "Memory dump: δ(G)=o−y, δ(g)=(Wᵀδ)⊙f′(z), ECE formula"
  ]
 },
 {
  "day": "Fri 31",
  "title": "Exam day — final pass",
  "core": [
   "오답노트 only",
   "Final Sheet",
   "Calm"
  ],
  "items": [
   "오답노트: drill every non-mastered entry once",
   "Final Sheet: read top-to-bottom once, slowly",
   "Blank-paper dump: CNN formulas, LSTM/GRU equations, backprop recursion, ECE",
   "Stop 2 hours before the exam. No new material."
  ]
 }
];

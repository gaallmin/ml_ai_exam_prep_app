// Structure Lab content — detailed RNN / LSTM / GRU computational-graph
// walkthroughs, trace-mode and exam-mode questions, and weakness taxonomy.
import type { Mark } from './types';
import { aligned } from '@/components/EquationBlock';

export type SLModel = 'rnn' | 'lstm' | 'gru';
export type SLMode = 'watch' | 'trace' | 'exam';
export type SLWeakness =
  | 'RNN recursion gap'
  | 'LSTM gate interpretation gap'
  | 'GRU gate interpretation gap'
  | 'Formula memory gap'
  | 'Dimension/shape reasoning gap'
  | 'Exam-expression gap';

export interface SLStep {
  title: string;
  latex?: string;   // textbook equation shown beside the highlighted part
  desc: string;
}

export interface SLQuestion {
  id: string;
  step?: number;                 // trace mode: diagram step this question sits on
  q: string;
  type: 'numeric' | 'mcq' | 'text';
  ans?: number; tol?: number;    // numeric
  opts?: string[]; correct?: number; // mcq
  keywords?: string[][];         // text: each group is a set of alternatives; all groups → Correct
  answerText: string;            // textbook answer, always revealed
  latex?: string;                // textbook equation revealed with the answer
  why: string;                   // the exact reasoning / exact mistake explanation
  wk: SLWeakness;
  hook: string;
  trigger: string;
}

export interface SLFormulaGroup { title: string; latex: string; caption?: string; }

/* ---------- strict text marking ---------- */
export function markTextAnswer(input: string, groups: string[][]): { mark: Mark; hit: number; total: number } {
  const s = ' ' + input.toLowerCase().replace(/\s+/g, ' ') + ' ';
  const compact = s.replace(/[\s_{}()\\·⋅*]/g, '');
  let hit = 0;
  for (const g of groups) {
    if (g.some(k => {
      const kl = k.toLowerCase();
      return s.includes(kl) || compact.includes(kl.replace(/[\s_{}()\\·⋅*]/g, ''));
    })) hit++;
  }
  const total = groups.length;
  if (!input.trim()) return { mark: 'Incorrect', hit: 0, total };
  const mark: Mark = hit === total ? 'Correct' : hit >= Math.ceil(total / 2) ? 'Partially correct' : 'Incorrect';
  return { mark, hit, total };
}

/* =====================================================================
   RNN — scalar running example: W = 0.5, U = 1.0, h0 = 0, x = (1, −1, 0.5)
   ===================================================================== */

export const RNN_FOLDED_STEPS: SLStep[] = [
  {
    title: 'Two inputs enter the cell',
    latex: 'h_{t-1} \\;\\text{(recurrent)}, \\qquad x_t \\;\\text{(new input)}',
    desc: 'The cell receives the PREVIOUS hidden state h_{t−1} on the recurrent path and the current input x_t. Never h_t itself — that is what we are about to compute.',
  },
  {
    title: 'Weighted sum at the + node',
    latex: 'W h_{t-1} + U x_t',
    desc: 'W (hidden→hidden) scales the memory path; U (input→hidden) scales the input path. The two paths meet at the addition node.',
  },
  {
    title: 'tanh squashes → new state',
    latex: 'h_t = \\tanh\\!\\left(W h_{t-1} + U x_t\\right)',
    desc: 'The nonlinearity produces the new hidden state h_t ∈ (−1, 1)^H. This is THE simple-RNN recurrence — write it exactly like this in the exam.',
  },
  {
    title: 'Recurrence loop (delay of one step)',
    latex: 'h_t \\;\\longrightarrow\\; h_{(t+1)-1}',
    desc: 'h_t leaves the cell and loops back: at the next time step it plays the role of h_{t−1}. The same W and U are reused — that loop is the parameter sharing.',
  },
  {
    title: 'Output through V (final step only)',
    latex: 'o_T = g\\!\\left(V h_T\\right)',
    desc: 'Many-to-one: only the FINAL hidden state h_T is mapped through the output weight V (with output activation g, e.g. sigmoid/softmax).',
  },
];

export const RNN_UNROLLED_STEPS: SLStep[] = [
  {
    title: 'Initial state h₀',
    latex: 'h_0 = 0',
    desc: 'Before any input arrives the hidden state is initialised (here to 0). Its dimension H is fixed by the architecture — it does NOT depend on sequence length T.',
  },
  {
    title: 'x₁ enters through U',
    latex: 'U x_1 = 1.0 \\cdot 1 = 1.0',
    desc: 'The first input is pushed through the input weight U. The same U will be used for x₂ and x₃.',
  },
  {
    title: 'W h₀ joins at the + node',
    latex: 'W h_0 + U x_1 = 0.5 \\cdot 0 + 1.0 = 1.0',
    desc: 'The recurrent path contributes W h₀. Input path and memory path are summed before the nonlinearity.',
  },
  {
    title: 'tanh produces h₁',
    latex: 'h_1 = \\tanh(1.0) = 0.7616',
    desc: 'First hidden state computed. Everything the network “remembers” about x₁ now lives inside h₁.',
  },
  {
    title: 'h₁ crosses into the next cell',
    latex: 'h_1 \\longrightarrow \\text{cell } t{=}2',
    desc: 'The ONLY thing that crosses the time boundary is the hidden state. The next cell is the SAME cell — same W, same U — applied again.',
  },
  {
    title: 't = 2: same weights, new input',
    latex: 'h_2 = \\tanh\\!\\big(0.5 \\cdot 0.7616 + 1.0 \\cdot (-1)\\big) = \\tanh(-0.6192) = -0.5506',
    desc: 'h₂ mixes the summary of the past (via W h₁) with the new input x₂ = −1. Reversing the input order would give a different h₂: order matters.',
  },
  {
    title: 't = 3: recurrence again',
    latex: 'h_3 = \\tanh\\!\\big(0.5 \\cdot (-0.5506) + 1.0 \\cdot 0.5\\big) = \\tanh(0.2247) = 0.2210',
    desc: 'Each h_t is a lossy compressed summary of x₁…x_t — not a perfect memory.',
  },
  {
    title: 'Final state → output through V',
    latex: 'o_T = g\\!\\left(V h_T\\right)',
    desc: 'V appears ONLY here (many-to-one). BPTT now runs backwards through this whole unrolled graph — the repeated Jacobian products through W are what vanish or explode.',
  },
];

export const RNN_FORMULAS: SLFormulaGroup[] = [
  {
    title: 'Simple RNN recurrence',
    latex: 'h_t = \\tanh\\!\\left(W h_{t-1} + U x_t\\right)',
    caption: 'W: hidden→hidden (recurrent) · U: input→hidden · shared across all t',
  },
  {
    title: 'Output (many-to-one)',
    latex: 'o_T = g\\!\\left(V h_T\\right)',
    caption: 'V: hidden→output, applied to the final hidden state only',
  },
  {
    title: 'Expanded recurrence — why h₂ depends on x₁',
    latex: 'h_2 = \\tanh\\!\\Big(W \\tanh\\!\\big(W h_0 + U x_1\\big) + U x_2\\Big)',
    caption: 'Unrolling substitutes h₁ into h₂: every past input is nested inside the current state. Repeated products of W through these nestings ⇒ vanishing/exploding gradients.',
  },
];

export const RNN_TRACE: SLQuestion[] = [
  {
    id: 'rnn-t1', step: 3, type: 'numeric', ans: 0.7616, tol: 0.01,
    q: 'W = 0.5, U = 1.0, h₀ = 0, x₁ = 1. Compute h₁ = tanh(W h₀ + U x₁)  (4 dp).',
    answerText: 'h₁ = tanh(0.5·0 + 1.0·1) = tanh(1) = 0.7616',
    latex: 'h_1 = \\tanh(0.5 \\cdot 0 + 1.0 \\cdot 1) = \\tanh(1) = 0.7616',
    why: 'Plug h₀ into the recurrence first, then apply tanh LAST. A common slip is applying tanh to each term separately.',
    wk: 'RNN recursion gap', hook: 'weighted sum first, tanh last.',
    trigger: '“Compute the hidden state at t=1” with scalar weights.',
  },
  {
    id: 'rnn-t2', step: 5, type: 'numeric', ans: -0.5506, tol: 0.01,
    q: 'Now x₂ = −1. Compute h₂ = tanh(W h₁ + U x₂)  (4 dp).',
    answerText: 'h₂ = tanh(0.5·0.7616 + 1.0·(−1)) = tanh(−0.6192) = −0.5506',
    latex: 'h_2 = \\tanh(0.5 \\cdot 0.7616 - 1.0) = \\tanh(-0.6192) = -0.5506',
    why: 'h₂ uses h₁ (the PREVIOUS state), not h₀ and not h₂. If you got +0.5506 you dropped the sign of x₂.',
    wk: 'RNN recursion gap', hook: 'h_t eats h_{t−1}, never itself.',
    trigger: '“Compute h₂” — chain the previous answer forward.',
  },
  {
    id: 'rnn-t3', step: 4, type: 'mcq',
    q: 'Which parameters are shared across time steps?',
    opts: ['W and U — the same matrices at every step', 'A fresh W_t and U_t per time step', 'Only the biases', 'Only V'],
    correct: 0,
    answerText: 'W and U are reused at every time step (V is applied once, at the output).',
    why: 'Parameter sharing is the defining property of the recurrence: one cell applied T times. That is why parameters don’t grow with T.',
    wk: 'RNN recursion gap', hook: 'one cell, applied T times.',
    trigger: '“Which weights are shared / why constant parameter count?”',
  },
  {
    id: 'rnn-t4', step: 0, type: 'text',
    q: 'Why does the hidden dimension H not depend on the sequence length T?',
    keywords: [['same', 'shared', 'reused', 'one cell', 'fixed'], ['time', 'step', 'applied', 'unroll', 'repeat']],
    answerText: 'Because the SAME cell (same W, U, and state size H) is applied at every time step; T only changes how many times the cell is applied, not the size of h.',
    why: 'H is an architecture choice; T is a data property. Unrolling repeats the cell — it never widens the state.',
    wk: 'Dimension/shape reasoning gap', hook: 'T = how many times, H = how wide.',
    trigger: '“Does the state size grow with the sequence?”',
  },
  {
    id: 'rnn-t5', step: 5, type: 'text',
    q: 'Why does the order of the inputs matter for the final hidden state?',
    keywords: [['h', 'state', 'previous', 'recurrence', 'nested'], ['order', 'sequence', 'different', 'depend']],
    answerText: 'Each h_t is computed from h_{t−1}, so inputs are nested inside each other in order: h₂ = tanh(W tanh(W h₀ + U x₁) + U x₂). Swapping x₁ and x₂ changes the nesting and hence h_T.',
    latex: 'h_2 = \\tanh\\!\\big(W \\tanh(W h_0 + U x_1) + U x_2\\big)',
    why: 'tanh is nonlinear, so the nested composition is not symmetric in its inputs — unlike a bag-of-words sum.',
    wk: 'RNN recursion gap', hook: 'nesting ≠ summing.',
    trigger: '“Would reversing the sequence change the output?”',
  },
  {
    id: 'rnn-t6', step: 7, type: 'text',
    q: 'BPTT — what exactly gets unrolled, and through what do gradients flow?',
    keywords: [['unroll', 'graph', 'network', 'copies', 'time'], ['gradient', 'backprop', 'chain', 'jacobian', 'product']],
    answerText: 'BPTT unrolls the recurrent computation graph through time (one copy of the cell per step) and backpropagates gradients through every copy; because the copies share W, the chain rule multiplies repeated Jacobians of W.',
    why: 'The repeated factors are the mechanism behind vanishing (|factors| < 1) and exploding (|factors| > 1) gradients.',
    wk: 'Exam-expression gap', hook: 'unrolled copies share W → repeated products.',
    trigger: '“Explain backpropagation through time.”',
  },
];

export const RNN_EXAM: SLQuestion[] = [
  {
    id: 'rnn-e1', type: 'text',
    q: 'Write the simple RNN recurrence for h_t (state the equation).',
    keywords: [['tanh'], ['t-1', 't−1', 'prev'], ['x'], ['w'], ['u']],
    answerText: 'h_t = tanh(W h_{t−1} + U x_t)',
    latex: 'h_t = \\tanh\\!\\left(W h_{t-1} + U x_t\\right)',
    why: 'Full marks need: tanh, W on h_{t−1}, U on x_t. Writing h_t on the right side, or forgetting tanh, loses the mark.',
    wk: 'Formula memory gap', hook: 'W·old + U·new, then tanh.',
    trigger: '“Write down the recurrence of a simple RNN.”',
  },
  {
    id: 'rnn-e2', type: 'text',
    q: 'What are W, U and V in a simple RNN?',
    keywords: [['hidden-to-hidden', 'hidden to hidden', 'recurrent'], ['input'], ['output']],
    answerText: 'W: hidden-to-hidden (recurrent) weights; U: input-to-hidden weights; V: hidden-to-output weights.',
    why: 'Three matrices, three roles. Mixing up U and V (input vs output) is the classic slip.',
    wk: 'Formula memory gap', hook: 'W=loop, U=in, V=out.',
    trigger: '“Define each parameter matrix.”',
  },
  {
    id: 'rnn-e3', type: 'text',
    q: 'What is h_t, precisely?',
    keywords: [['state', 'summary', 'memory'], ['past', 'previous', 'up to', 'history', 'inputs so far', 'x_1']],
    answerText: 'The hidden state at time t — a fixed-size, lossy summary of the input sequence x₁…x_t.',
    why: '“Lossy summary” is the exam phrase: it is NOT a perfect memory of the sequence.',
    wk: 'Exam-expression gap', hook: 'lossy fixed-size summary.',
    trigger: '“Interpret the hidden state.”',
  },
  {
    id: 'rnn-e4', type: 'text',
    q: 'Why do simple RNNs suffer from vanishing/exploding gradients?',
    keywords: [['repeated', 'product', 'multipl', 'jacobian', 'chain'], ['time', 'step', 'unroll', 'bptt'], ['vanish', 'explod', 'shrink', 'grow']],
    answerText: 'BPTT multiplies many Jacobian factors involving W (and tanh′ ≤ 1) across time steps; repeated products shrink to zero (vanishing) or blow up (exploding) exponentially in the number of steps.',
    why: 'The key words are REPEATED PRODUCTS THROUGH TIME — one per unrolled step, all sharing W.',
    wk: 'Exam-expression gap', hook: 'many factors × same W = exponential.',
    trigger: '“Why is training long sequences hard?”',
  },
  {
    id: 'rnn-e5', type: 'text',
    q: 'If the recurrent weight magnitude |W| increases, what happens to memory and stability?',
    keywords: [['explod', 'unstable', 'blow', 'diverge'], ['memory', 'persist', 'longer', 'retain']],
    answerText: 'Signals persist longer (stronger memory), but repeated products of a large W make activations/gradients explode — training becomes unstable. Small |W| is stable but forgets fast (vanishing).',
    why: 'It is a trade-off along a single dial: memory strength vs numerical stability.',
    wk: 'Exam-expression gap', hook: 'big W: remembers but explodes.',
    trigger: '“Effect of the recurrent weight’s magnitude.”',
  },
];

export const RNN_TRAPS = [
  'h_t uses h_{t−1}, never h_t itself',
  'same W and U reused at every step (V only at the output)',
  'h_t is a lossy summary, not perfect memory',
  'sequence order matters (nested, not summed)',
  'BPTT = backprop through the unrolled graph',
  'repeated products through time ⇒ vanishing/exploding gradients',
  'hidden dimension H does not depend on T',
];

/* =====================================================================
   LSTM — scalar sliders default: c_{t-1}=0.8, f=0.5, i=0.7, c̃=0.4, o=0.9
   ===================================================================== */

export const LSTM_STEPS: SLStep[] = [
  {
    title: 'c_{t−1} enters the memory highway',
    latex: 'c_{t-1}',
    desc: 'The cell state rides a mostly-linear “memory highway” across the top of the cell. It is internal memory — it is NOT the hidden state.',
  },
  {
    title: 'Forget gate scales old memory',
    latex: 'f_t = \\sigma\\!\\left(W_f x_t + U_f h_{t-1} + b_f\\right)',
    desc: 'A sigmoid valve in (0,1). f_t multiplies c_{t−1}: f≈1 keeps old memory, f≈0 wipes it.',
  },
  {
    title: 'Candidate memory is proposed',
    latex: '\\tilde{c}_t = \\tanh\\!\\left(W_c x_t + U_c h_{t-1} + b_c\\right)',
    desc: 'x_t and h_{t−1} propose NEW content through tanh (range (−1,1)). Note: candidate uses tanh, gates use sigmoid.',
  },
  {
    title: 'Input gate decides how much to write',
    latex: 'i_t = \\sigma\\!\\left(W_i x_t + U_i h_{t-1} + b_i\\right)',
    desc: 'The input-gate valve scales the candidate: i_t ⊙ c̃_t is the amount of new memory actually written.',
  },
  {
    title: 'Addition forms the new cell state',
    latex: 'c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t',
    desc: 'ADDITIVE update: kept old memory + gated new memory. This additive path is why gradients survive better than in a simple RNN.',
  },
  {
    title: 'Output gate decides what to expose',
    latex: 'o_t = \\sigma\\!\\left(W_o x_t + U_o h_{t-1} + b_o\\right)',
    desc: 'The cell state is squashed by tanh, then the output-gate valve chooses how much of it becomes visible.',
  },
  {
    title: 'h_t exits — the exposed memory',
    latex: 'h_t = o_t \\odot \\tanh(c_t)',
    desc: 'h_t (exposed, goes to the output and the next step’s gates) and c_t (internal highway) are DIFFERENT objects — the classic exam trap.',
  },
];

export const LSTM_FORMULAS: SLFormulaGroup[] = [
  {
    title: 'Gate equations (all sigmoid valves)',
    latex: aligned([
      'f_t &= \\sigma(W_f x_t + U_f h_{t-1} + b_f)',
      'i_t &= \\sigma(W_i x_t + U_i h_{t-1} + b_i)',
      'o_t &= \\sigma(W_o x_t + U_o h_{t-1} + b_o)',
    ]),
    caption: 'forget · input · output — each a value in (0,1) per component',
  },
  {
    title: 'Candidate memory',
    latex: '\\tilde{c}_t = \\tanh\\!\\left(W_c x_t + U_c h_{t-1} + b_c\\right)',
    caption: 'proposed new content, in (−1,1) — tanh, not sigmoid',
  },
  {
    title: 'State update (the additive highway)',
    latex: 'c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t',
    caption: 'keep ⊕ write — the additive path that alleviates vanishing gradients',
  },
  {
    title: 'Hidden output',
    latex: 'h_t = o_t \\odot \\tanh(c_t)',
    caption: 'expose a gated view of the memory; c_t stays internal',
  },
];

export const LSTM_TRACE: SLQuestion[] = [
  {
    id: 'lstm-t1', step: 4, type: 'numeric', ans: 0.68, tol: 0.005,
    q: 'f_t = 0.5, c_{t−1} = 0.8, i_t = 0.7, c̃_t = 0.4. Compute c_t.',
    answerText: 'c_t = 0.5×0.8 + 0.7×0.4 = 0.40 + 0.28 = 0.68',
    latex: 'c_t = f_t c_{t-1} + i_t \\tilde{c}_t = 0.5 \\cdot 0.8 + 0.7 \\cdot 0.4 = 0.68',
    why: 'Two products, one sum: forget×old PLUS input×candidate. No tanh here — the tanh happens later, on the way out.',
    wk: 'LSTM gate interpretation gap', hook: 'keep + write, no squash.',
    trigger: '“Given gate values, compute the new cell state.”',
  },
  {
    id: 'lstm-t2', step: 6, type: 'numeric', ans: 0.5323, tol: 0.01,
    q: 'With c_t = 0.68 and o_t = 0.9, compute h_t = o_t · tanh(c_t)  (4 dp).',
    answerText: 'h_t = 0.9 × tanh(0.68) = 0.9 × 0.5915 = 0.5323',
    latex: 'h_t = o_t \\tanh(c_t) = 0.9 \\cdot \\tanh(0.68) = 0.9 \\cdot 0.5915 = 0.5323',
    why: 'tanh is applied to c_t FIRST, then the output gate scales it. h_t = tanh(o_t·c_t) is the wrong order.',
    wk: 'LSTM gate interpretation gap', hook: 'squash first, gate second.',
    trigger: '“Compute the hidden state from the cell state.”',
  },
  {
    id: 'lstm-t3', step: 1, type: 'mcq',
    q: 'Which gate controls how much OLD memory survives?',
    opts: ['Forget gate f_t', 'Input gate i_t', 'Output gate o_t', 'The candidate c̃_t'],
    correct: 0,
    answerText: 'The forget gate f_t — it multiplies c_{t−1} on the highway.',
    why: 'f sits directly on the c_{t−1} path. i controls NEW memory; o controls what is EXPOSED.',
    wk: 'LSTM gate interpretation gap', hook: 'f = keep-old valve.',
    trigger: '“Role of the forget gate.”',
  },
  {
    id: 'lstm-t4', step: 3, type: 'mcq',
    q: 'Which gate decides how much NEW candidate memory is written?',
    opts: ['Input gate i_t', 'Forget gate f_t', 'Output gate o_t', 'tanh'],
    correct: 0,
    answerText: 'The input gate i_t — it scales c̃_t before the addition.',
    why: 'The candidate proposes; the input gate disposes. i_t ⊙ c̃_t is what actually reaches c_t.',
    wk: 'LSTM gate interpretation gap', hook: 'i = write valve.',
    trigger: '“Which gate writes new information?”',
  },
  {
    id: 'lstm-t5', step: 5, type: 'mcq',
    q: 'Which gate decides how much memory is EXPOSED as the hidden state?',
    opts: ['Output gate o_t', 'Forget gate f_t', 'Input gate i_t', 'None — h_t = c_t'],
    correct: 0,
    answerText: 'The output gate o_t: h_t = o_t ⊙ tanh(c_t).',
    why: 'h_t is a gated VIEW of the memory, not the memory itself.',
    wk: 'LSTM gate interpretation gap', hook: 'o = window blinds.',
    trigger: '“How is h_t obtained from c_t?”',
  },
  {
    id: 'lstm-t6', step: 6, type: 'text',
    q: 'State the difference between c_t and h_t.',
    keywords: [['internal', 'memory', 'highway', 'cell'], ['expose', 'output', 'visible', 'gated', 'tanh']],
    answerText: 'c_t is the internal cell state (long-term memory on the additive highway); h_t = o_t ⊙ tanh(c_t) is the gated, squashed view of it that is exposed to the output and to the next step’s gates.',
    why: 'They even have different ranges: c_t is unbounded, h_t ∈ (−1,1). Writing “c_t = h_t” loses marks instantly.',
    wk: 'LSTM gate interpretation gap', hook: 'c = vault, h = shop window.',
    trigger: '“Distinguish cell state and hidden state.”',
  },
];

export const LSTM_EXAM: SLQuestion[] = [
  {
    id: 'lstm-e1', type: 'text',
    q: 'Write the full set of LSTM equations (gates, candidate, state update, output).',
    keywords: [['sigma', 'sigmoid', 'σ'], ['tanh'], ['f'], ['i'], ['o'], ['c']],
    answerText: 'f_t = σ(W_f x_t + U_f h_{t−1} + b_f); i_t = σ(W_i x_t + U_i h_{t−1} + b_i); c̃_t = tanh(W_c x_t + U_c h_{t−1} + b_c); o_t = σ(W_o x_t + U_o h_{t−1} + b_o); c_t = f_t ⊙ c_{t−1} + i_t ⊙ c̃_t; h_t = o_t ⊙ tanh(c_t).',
    latex: aligned([
      'f_t &= \\sigma(W_f x_t + U_f h_{t-1} + b_f)',
      'i_t &= \\sigma(W_i x_t + U_i h_{t-1} + b_i)',
      '\\tilde{c}_t &= \\tanh(W_c x_t + U_c h_{t-1} + b_c)',
      'o_t &= \\sigma(W_o x_t + U_o h_{t-1} + b_o)',
      'c_t &= f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t',
      'h_t &= o_t \\odot \\tanh(c_t)',
    ]),
    why: 'Six lines. Check: three σ gates, one tanh candidate, additive c_t update, gated tanh output.',
    wk: 'Formula memory gap', hook: 'f i c̃ o → c → h.',
    trigger: '“Write down the LSTM cell equations.”',
  },
  {
    id: 'lstm-e2', type: 'text',
    q: 'Explain the role of the forget gate.',
    keywords: [['old', 'previous', 'c_{t-1}', 'ct-1', 'past'], ['scale', 'multipl', 'keep', 'erase', 'how much', 'valve']],
    answerText: 'f_t ∈ (0,1) multiplies the previous cell state c_{t−1} componentwise, deciding how much old memory is kept (f≈1) or erased (f≈0).',
    why: 'It acts on the OLD state, before anything new is added.',
    wk: 'LSTM gate interpretation gap', hook: 'f scales yesterday.',
    trigger: '“What does the forget gate do?”',
  },
  {
    id: 'lstm-e3', type: 'text',
    q: 'How does the LSTM alleviate vanishing gradients?',
    keywords: [['additive', 'addition', 'linear', 'highway', 'sum'], ['cell state', 'c_t', 'memory'], ['gradient']],
    answerText: 'The cell state is updated ADDITIVELY (c_t = f_t⊙c_{t−1} + i_t⊙c̃_t), so gradients can flow along this nearly-linear highway without being repeatedly squashed through tanh and multiplied by W as in a simple RNN.',
    why: 'Alleviates — does not eliminate: gates can still shrink the signal, and exploding gradients remain possible.',
    wk: 'Exam-expression gap', hook: 'additive highway ≈ gradient motorway.',
    trigger: '“Why does LSTM train better on long sequences?”',
  },
  {
    id: 'lstm-e4', type: 'text',
    q: 'Compare the LSTM with a simple RNN.',
    keywords: [['gate'], ['cell state', 'memory', 'c_t', 'additive'], ['parameter', 'more', '4', 'four']],
    answerText: 'LSTM adds a separate cell state with an additive update and three sigmoid gates (forget/input/output), so it holds long-range information and trains more stably; the cost is ≈4× the parameters of a simple RNN, which has only h_t = tanh(W h_{t−1} + U x_t).',
    why: 'Structure (extra state + gates), behaviour (long memory, better gradients), cost (parameters) — hit all three.',
    wk: 'Exam-expression gap', hook: 'state + valves + 4× cost.',
    trigger: '“LSTM vs vanilla RNN.”',
  },
  {
    id: 'lstm-e5', type: 'text',
    q: 'Why does the LSTM have more parameters than a simple RNN?',
    keywords: [['four', '4', 'gates', 'sets'], ['W', 'U', 'matri', 'weight']],
    answerText: 'It has four weight sets — one per gate (f, i, o) plus the candidate c̃ — each with its own W, U and b, versus a single (W, U, b) in the simple RNN: roughly 4× the parameters.',
    why: 'Count the equation lines with W’s in them: four.',
    wk: 'Dimension/shape reasoning gap', hook: '4 equations × (W,U,b).',
    trigger: '“Parameter count of the LSTM.”',
  },
];

export const LSTM_TRAPS = [
  'c_t is NOT h_t — internal memory vs exposed state',
  'gates use sigmoid, candidate uses tanh',
  'forget gate controls old memory; input gate new memory; output gate exposure',
  'the c_t update is additive — that is the anti-vanishing mechanism',
  'alleviates vanishing gradients; does not remove all instability',
  'more parameters than simple RNN and GRU (≈4 weight sets)',
];

/* =====================================================================
   GRU — scalar sliders: r, z, h_{t-1}, x_t (weights fixed to 1 for feel)
   ===================================================================== */

export const GRU_STEPS: SLStep[] = [
  {
    title: 'h_{t−1} splits three ways',
    latex: 'h_{t-1} \\to \\{\\,\\text{old-state path},\\; r_t\\text{-gated candidate path},\\; \\text{gate inputs}\\,\\}',
    desc: 'The previous state feeds (1) the direct old-state path to the final blend, (2) the reset-controlled path into the candidate, and (3) both gates’ inputs. There is NO separate cell state.',
  },
  {
    title: 'Reset gate gates the past — inside the candidate',
    latex: 'r_t = \\sigma\\!\\left(W_r x_t + U_r h_{t-1} + b_r\\right)',
    desc: 'r_t multiplies h_{t−1} INSIDE the candidate’s U_h term. r≈0 ⇒ candidate ignores the past and rebuilds from x_t.',
  },
  {
    title: 'Candidate state is proposed',
    latex: '\\tilde{h}_t = \\tanh\\!\\left(W_h x_t + U_h (r_t \\odot h_{t-1}) + b_h\\right)',
    desc: 'The proposal for the new state, from the fresh input plus the reset-filtered past.',
  },
  {
    title: 'Update gate sets the blend',
    latex: 'z_t = \\sigma\\!\\left(W_z x_t + U_z h_{t-1} + b_z\\right)',
    desc: 'One dial replaces LSTM’s forget/input pair: z_t decides how much of the state is REPLACED by the candidate.',
  },
  {
    title: 'Old and new are mixed',
    latex: 'h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t',
    desc: 'A convex combination: z→0 copies the old state through (memory), z→1 overwrites with the candidate (update). Watch the blend bar.',
  },
  {
    title: 'h_t exits — state and output in one',
    latex: 'h_t',
    desc: 'h_t is both the memory carried forward AND the output — unlike the LSTM there is no separate c_t to expose.',
  },
];

export const GRU_FORMULAS: SLFormulaGroup[] = [
  {
    title: 'Update gate — old-vs-new dial',
    latex: 'z_t = \\sigma\\!\\left(W_z x_t + U_z h_{t-1} + b_z\\right)',
    caption: 'z→0: keep old state · z→1: take the candidate',
  },
  {
    title: 'Reset gate — how much past enters the candidate',
    latex: 'r_t = \\sigma\\!\\left(W_r x_t + U_r h_{t-1} + b_r\\right)',
    caption: 'acts INSIDE the candidate, on the U_h h_{t−1} term',
  },
  {
    title: 'Candidate state',
    latex: '\\tilde{h}_t = \\tanh\\!\\left(W_h x_t + U_h (r_t \\odot h_{t-1}) + b_h\\right)',
    caption: 'proposal built from the input and the reset-filtered past',
  },
  {
    title: 'Final state — convex blend',
    latex: 'h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t',
    caption: 'no separate cell state; h_t is memory and output at once',
  },
];

export const GRU_TRACE: SLQuestion[] = [
  {
    id: 'gru-t1', step: 4, type: 'mcq',
    q: 'If z_t ≈ 0, what happens at the state update?',
    opts: ['The old state h_{t−1} is mostly kept (copied through)', 'The candidate mostly replaces the state', 'The state is reset to zero', 'The candidate is recomputed'],
    correct: 0,
    answerText: 'h_t ≈ h_{t−1}: with z≈0 the blend (1−z)h_{t−1} + z·h̃ keeps the old state — that is the memory setting.',
    why: 'Careful with the direction: z multiplies the CANDIDATE. Small z = little update = long memory.',
    wk: 'GRU gate interpretation gap', hook: 'z is the “how much NEW” dial.',
    trigger: '“Behaviour as z→0.”',
  },
  {
    id: 'gru-t2', step: 4, type: 'mcq',
    q: 'And if z_t ≈ 1?',
    opts: ['The candidate h̃_t mostly replaces the old state', 'The old state is mostly kept', 'h_t is forced to zero', 'The reset gate closes'],
    correct: 0,
    answerText: 'h_t ≈ h̃_t: the state is overwritten by the candidate — fast update, short memory.',
    why: 'Same equation, other extreme: z·h̃ dominates.',
    wk: 'GRU gate interpretation gap', hook: 'z=1 → wipe and replace.',
    trigger: '“Behaviour as z→1.”',
  },
  {
    id: 'gru-t3', step: 1, type: 'mcq',
    q: 'What does the reset gate r_t control?',
    opts: ['How much of h_{t−1} enters the CANDIDATE h̃_t', 'The final old-vs-new blend', 'How much memory is exposed as output', 'The learning rate'],
    correct: 0,
    answerText: 'r_t scales h_{t−1} inside the candidate: h̃_t = tanh(W_h x_t + U_h(r_t ⊙ h_{t−1}) + b_h).',
    why: 'Reset acts INSIDE the candidate; the final blend belongs to the UPDATE gate. Swapping their roles is the classic GRU error.',
    wk: 'GRU gate interpretation gap', hook: 'r lives inside the tanh.',
    trigger: '“Role of the reset gate.”',
  },
  {
    id: 'gru-t4', step: 5, type: 'mcq',
    q: 'Does the GRU have a separate cell state c_t?',
    opts: ['No — only the hidden state h_t', 'Yes, same as the LSTM', 'Yes, but it is not trained', 'Only when r_t = 0'],
    correct: 0,
    answerText: 'No. The GRU merges memory and output into the single hidden state h_t.',
    why: 'That is precisely what it drops relative to the LSTM — and a favourite true/false exam item.',
    wk: 'GRU gate interpretation gap', hook: 'GRU = LSTM minus c_t.',
    trigger: '“Does the GRU maintain a cell state?”',
  },
  {
    id: 'gru-t5', step: 4, type: 'numeric', ans: 0.62, tol: 0.005,
    q: 'z_t = 0.3, h_{t−1} = 0.5, h̃_t = 0.9. Compute h_t = (1−z_t)h_{t−1} + z_t h̃_t.',
    answerText: 'h_t = 0.7×0.5 + 0.3×0.9 = 0.35 + 0.27 = 0.62',
    latex: 'h_t = (1-0.3) \\cdot 0.5 + 0.3 \\cdot 0.9 = 0.35 + 0.27 = 0.62',
    why: '(1−z) goes with the OLD state, z with the candidate. Swapping them gives 0.78 — wrong.',
    wk: 'GRU gate interpretation gap', hook: '(1−z)·old + z·new.',
    trigger: '“Numeric GRU state update.”',
  },
  {
    id: 'gru-t6', step: 0, type: 'text',
    q: 'Why does the GRU have fewer parameters than the LSTM?',
    keywords: [['two', '2', 'fewer gates'], ['cell', 'c_t', 'no separate']],
    answerText: 'It has only two gates (reset, update) plus a candidate — three weight sets versus the LSTM’s four — and no separate cell state to maintain.',
    why: '3 × (W,U,b) vs 4 × (W,U,b): roughly three-quarters of the LSTM’s parameters.',
    wk: 'Dimension/shape reasoning gap', hook: '3 weight sets, no vault.',
    trigger: '“Parameter comparison GRU vs LSTM.”',
  },
];

export const GRU_EXAM: SLQuestion[] = [
  {
    id: 'gru-e1', type: 'text',
    q: 'Write the GRU equations (both gates, candidate, final state).',
    keywords: [['sigma', 'sigmoid', 'σ'], ['tanh'], ['1-z', '1 - z', '1−z', '(1'], ['r']],
    answerText: 'z_t = σ(W_z x_t + U_z h_{t−1} + b_z); r_t = σ(W_r x_t + U_r h_{t−1} + b_r); h̃_t = tanh(W_h x_t + U_h(r_t ⊙ h_{t−1}) + b_h); h_t = (1−z_t) ⊙ h_{t−1} + z_t ⊙ h̃_t.',
    latex: aligned([
      'z_t &= \\sigma(W_z x_t + U_z h_{t-1} + b_z)',
      'r_t &= \\sigma(W_r x_t + U_r h_{t-1} + b_r)',
      '\\tilde{h}_t &= \\tanh\\!\\big(W_h x_t + U_h (r_t \\odot h_{t-1}) + b_h\\big)',
      'h_t &= (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde{h}_t',
    ]),
    why: 'Four lines. Check: r sits INSIDE the candidate’s tanh; the final line is a convex combination with (1−z) on the old state.',
    wk: 'Formula memory gap', hook: 'z r h̃ → blend.',
    trigger: '“Write down the GRU cell equations.”',
  },
  {
    id: 'gru-e2', type: 'text',
    q: 'Compare the GRU and the LSTM.',
    keywords: [['cell', 'c_t'], ['fewer', 'two', 'less', '3'], ['gate']],
    answerText: 'GRU merges LSTM’s forget/input gates into one update gate and drops the separate cell state (memory lives in h_t), so it has fewer parameters and is cheaper; performance vs LSTM is task-dependent.',
    why: 'Two structural deletions: one gate fewer, no c_t. Don’t claim GRU is always better — say task-dependent.',
    wk: 'Exam-expression gap', hook: 'merge gates, drop vault.',
    trigger: '“GRU vs LSTM.”',
  },
  {
    id: 'gru-e3', type: 'text',
    q: 'Which gate controls the old-vs-new balance of the state?',
    keywords: [['update', 'z']],
    answerText: 'The update gate z_t: h_t = (1−z_t)⊙h_{t−1} + z_t⊙h̃_t.',
    why: 'Not the reset gate — that one shapes the candidate.',
    wk: 'GRU gate interpretation gap', hook: 'z = blend dial.',
    trigger: '“Which gate balances old and new?”',
  },
  {
    id: 'gru-e4', type: 'text',
    q: 'Which gate controls the previous state’s contribution to the CANDIDATE?',
    keywords: [['reset', 'r']],
    answerText: 'The reset gate r_t, via U_h(r_t ⊙ h_{t−1}) inside the candidate’s tanh.',
    why: 'Its whole job happens inside the candidate equation.',
    wk: 'GRU gate interpretation gap', hook: 'r = rear-view mirror dimmer.',
    trigger: '“Where does the reset gate act?”',
  },
  {
    id: 'gru-e5', type: 'text',
    q: 'Does the GRU have a separate cell state? Explain in one sentence.',
    keywords: [['no'], ['h', 'hidden', 'single', 'merge']],
    answerText: 'No — the GRU keeps a single hidden state h_t that serves as both memory and output; there is no c_t.',
    why: 'One-word answers lose the explanation mark: say what replaces it (h_t does both jobs).',
    wk: 'GRU gate interpretation gap', hook: 'one state, two jobs.',
    trigger: '“Cell state in the GRU — true or false?”',
  },
];

export const GRU_TRAPS = [
  'no separate cell state — h_t is memory AND output',
  'reset gate acts inside the candidate (on U_h h_{t−1})',
  'update gate = old-vs-new blend: (1−z)·old + z·candidate',
  'z≈0 keeps the old state; z≈1 replaces it with the candidate',
  'fewer parameters than LSTM (3 weight sets vs 4)',
  'performance vs LSTM is task-dependent',
];

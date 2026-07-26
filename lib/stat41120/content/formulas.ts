// Extracted verbatim from stat41120_sprint.html — do not paraphrase.
import type { FormulaCard } from './types';

export const FORMULAS: FormulaCard[] = [
 {
  "cat": "Forward propagation",
  "f": "z(g) = W(g) h(g−1) + b(g)\nh(g) = f(z(g))",
  "when": "Any layer computation; h(0)=x, h(G)=o.",
  "trap": "z first, activation second.",
  "ex": "W=[1,−1], b=0.5, h=(2,1) → z=1.5, ReLU→1.5",
  "q": "Compute h(1) for a given W, b, x with ReLU."
 },
 {
  "cat": "BCE",
  "f": "BCE = −1/N Σ [ y log p + (1−y) log(1−p) ]",
  "when": "Binary classification with sigmoid output.",
  "trap": "Single instance: drop 1/N. y=1 kills the second term.",
  "ex": "y=1, p=.8 → −log(.8)=0.223",
  "q": "Compute the loss for one instance given o and y."
 },
 {
  "cat": "Softmax",
  "f": "ok = exp(zk) / Σs exp(zs)",
  "when": "Multiclass output layer.",
  "trap": "Outputs sum to 1; subtracting max(z) first is numerically safe and changes nothing.",
  "ex": "z=(1,0) → o=(.731,.269)",
  "q": "Compute softmax outputs for z=(2,1,0)."
 },
 {
  "cat": "Cross-entropy",
  "f": "CE = −Σk yk log(ok)",
  "when": "Multiclass with one-hot y.",
  "trap": "Only the true-class term survives.",
  "ex": "true class prob .5 → CE=0.693",
  "q": "Compute CE given softmax output and one-hot target."
 },
 {
  "cat": "Softmax + CE derivative",
  "f": "∂ℓ/∂zk = ok − yk",
  "when": "Output-layer delta for backprop.",
  "trap": "Holds for the COMBINED softmax+CE — not for softmax alone.",
  "ex": "o=(.7,.3), y=(1,0) → δ=(−.3,.3)",
  "q": "Derive ∂ℓ/∂zk via the softmax Jacobian and chain rule."
 },
 {
  "cat": "Hidden-layer delta",
  "f": "δ(g) = ( W(g+1)ᵀ δ(g+1) ) ⊙ f′(z(g))",
  "when": "Backprop recursion through hidden layers.",
  "trap": "Downstream weight + local derivative. ReLU′ = 1 if z>0 else 0.",
  "ex": "w_next=.5, δ_next=−.2, z>0 → δ=−.1",
  "q": "Compute the gradient for a highlighted hidden weight."
 },
 {
  "cat": "Weight decay (L2)",
  "f": "ℓpen = ℓ + λ·½‖w‖²\n∇ℓpen = ∇ℓ + λw\nw ← w − η(∇ℓ + λw)",
  "when": "Any L2-regularised update question.",
  "trap": "ADD λw to the gradient; never multiply λ by ∇ℓ.",
  "ex": "w=.6, ∇=−.2, λ=.1, η=.5 → w=.67",
  "q": "Perform one weight-decay update step."
 },
 {
  "cat": "L1 penalty",
  "f": "q(w) = Σ|wj| ;  subgradient sign(wj) ∈ {−1,0,+1}",
  "when": "Sparsity questions.",
  "trap": "L1 drives weights EXACTLY to zero; L2 only shrinks.",
  "ex": "w=−.3 → subgradient −1",
  "q": "Contrast L1 vs L2 effect on weights."
 },
 {
  "cat": "CNN output dims",
  "f": "Wout = ⌊(Win − k + 2p)/s⌋ + 1",
  "when": "Every conv shape question (same for H).",
  "trap": "Padding is 2p in the numerator; floor before +1.",
  "ex": "32,k5,p0,s1 → 28",
  "q": "Give the output shape of a conv layer."
 },
 {
  "cat": "CNN parameters",
  "f": "(k × k × Din + 1) × Dout",
  "when": "Trainable parameter counts.",
  "trap": "+1 bias per FILTER; Din is input depth, Dout = number of filters.",
  "ex": "5×5×3+1=76; ×16 filters=1216",
  "q": "Count the parameters of a conv layer."
 },
 {
  "cat": "Pooling",
  "f": "Wout = ⌊(Win − kpool)/s⌋ + 1 ;  Dout = Din",
  "when": "Pooling shape questions.",
  "trap": "Depth preserved; zero parameters.",
  "ex": "28, 2×2, s2 → 14",
  "q": "Give the output shape after max pooling."
 },
 {
  "cat": "Flatten",
  "f": "size = W × H × D",
  "when": "Between conv blocks and dense layers.",
  "trap": "No parameters; the following dense layer often dominates the count.",
  "ex": "7×7×64 → 3136",
  "q": "Compute the flatten size and next dense layer's parameters."
 },
 {
  "cat": "Simple RNN",
  "f": "h(t) = tanh( W h(t−1) + U x(t) )\no(T) = g( V h(T) )",
  "when": "Hidden-state calculations, many-to-one.",
  "trap": "h(t−1) not h(t); shared W,U,V across time.",
  "ex": "W=.5,U=1,x1=1 → h1=tanh(1)=.762",
  "q": "Compute h(1), h(2) for scalar inputs."
 },
 {
  "cat": "LSTM gates",
  "f": "ft = σ(Wf xt + Uf ht−1 + bf)\nit = σ(Wi xt + Ui ht−1 + bi)\nc̃t = tanh(Wc xt + Uc ht−1 + bc)\not = σ(Wo xt + Uo ht−1 + bo)\nct = ft⊙ct−1 + it⊙c̃t\nht = ot⊙tanh(ct)",
  "when": "Gate interpretation & recall questions.",
  "trap": "c(t) ≠ h(t); gates sigmoid, candidate tanh.",
  "ex": "ft=1, it=0 → pure memory copy",
  "q": "Name each gate's role and activation."
 },
 {
  "cat": "GRU gates",
  "f": "zt = σ(Wz xt + Uz ht−1 + bz)\nrt = σ(Wr xt + Ur ht−1 + br)\nh̃t = tanh(Wh xt + Uh(rt⊙ht−1) + bh)\nht = (1−zt)⊙ht−1 + zt⊙h̃t",
  "when": "GRU recall & comparison with LSTM.",
  "trap": "Reset gate sits inside the candidate; no cell state.",
  "ex": "zt=0 → state copied",
  "q": "Compare GRU and LSTM: gates, cell state, parameters."
 },
 {
  "cat": "ECE",
  "f": "ECE = Σm (nm/N) |acc(Bm) − conf(Bm)|",
  "when": "Calibration questions with binned predictions.",
  "trap": "Weight by nm/N; conf = mean predicted prob, acc = observed frequency.",
  "ex": "two equal bins, gaps .10/.05 → .075",
  "q": "Compute ECE from a bin table."
 },
 {
  "cat": "Calibration",
  "f": "Perfect: Pr(Y=1 | p̂(x)=s) = s",
  "when": "Defining calibration; Platt vs isotonic.",
  "trap": "Platt = parametric logistic on scores; isotonic = monotone, non-parametric, data-hungry.",
  "ex": "conf .8 bin with acc .6 → overconfident",
  "q": "Define calibration and one recalibration method."
 }
];

// Extracted verbatim from stat41120_sprint.html — do not paraphrase.
import type { VizModel } from './types';

export const VIZ_MODELS: Record<'fnn'|'rnn'|'lstm'|'gru', VizModel> = {
 "fnn": {
  "name": "FNN forward pass",
  "steps": [
   {
    "t": "Input",
    "f": "h(0) = x = (−1, 1)",
    "d": "Two input units. No parameters at the input layer.",
    "hi": 0
   },
   {
    "t": "Pre-activation z(1)",
    "f": "z(1) = W(1)x + b(1)\nW(1)=[[1,−1],[0,2]], b(1)=(0.5,−1)\nz(1) = (−1.5, 1)",
    "d": "Affine map: each hidden unit takes a weighted sum of ALL inputs plus its bias.",
    "hi": 1
   },
   {
    "t": "Activation h(1)",
    "f": "h(1) = ReLU(z(1)) = (0, 1)",
    "d": "ReLU zeroes the negative pre-activation. Note the first unit is now dead for this input.",
    "hi": 1
   },
   {
    "t": "Pre-activation z(2)",
    "f": "z(2) = W(2)h(1) + b(2)\nW(2)=[2, −1], b(2)=0.4\nz(2) = 2·0 + (−1)·1 + 0.4 = −0.6",
    "d": "The output unit combines the hidden activations — including the zero from the dead unit.",
    "hi": 2
   },
   {
    "t": "Output o",
    "f": "o = σ(−0.6) = 0.3543",
    "d": "Sigmoid output → probability of class 1. If y=1: ℓ = −log(0.3543) = 1.038.",
    "hi": 2
   },
   {
    "t": "Backward: δ",
    "f": "δ = o − y = −0.6457\n∇W(2) = δ · h(1)ᵀ = (0, −0.6457)",
    "d": "The gradient for each output weight is δ times the activation entering it. The dead unit's weight gets zero gradient.",
    "hi": 2
   }
  ]
 },
 "rnn": {
  "name": "RNN unfolding",
  "steps": [
   {
    "t": "t = 1",
    "f": "h(1) = tanh(W·h(0) + U·x(1))\n= tanh(0.5·0 + 1·1) = tanh(1) = 0.7616",
    "d": "Same W and U will be reused at every step — parameter sharing.",
    "hi": 0
   },
   {
    "t": "t = 2",
    "f": "h(2) = tanh(W·h(1) + U·x(2))\n= tanh(0.5·0.7616 + 1·(−1)) = tanh(−0.6192) = −0.5506",
    "d": "The PREVIOUS hidden state carries a lossy summary of the past into the present.",
    "hi": 1
   },
   {
    "t": "t = 3",
    "f": "h(3) = tanh(0.5·(−0.5506) + 1·0.5)\n= tanh(0.2247) = 0.2210",
    "d": "Reversing the input order would give a different h(3): order matters.",
    "hi": 2
   },
   {
    "t": "Output",
    "f": "o(T) = g(V·h(T))",
    "d": "Many-to-one: only the final hidden state feeds the output. BPTT then unfolds gradients back through every step — repeated Jacobian products cause vanishing/exploding gradients.",
    "hi": 3
   }
  ]
 },
 "lstm": {
  "name": "LSTM cell walkthrough",
  "steps": [
   {
    "t": "Forget gate",
    "f": "ft = σ(Wf xt + Uf ht−1 + bf)",
    "d": "How much of the OLD cell state survives. Sigmoid → each memory component scaled by (0,1).",
    "hi": 0
   },
   {
    "t": "Input gate + candidate",
    "f": "it = σ(Wi xt + Ui ht−1 + bi)\nc̃t = tanh(Wc xt + Uc ht−1 + bc)",
    "d": "The candidate (tanh) proposes new memory; the input gate decides how much to actually write.",
    "hi": 1
   },
   {
    "t": "Cell update",
    "f": "ct = ft ⊙ ct−1 + it ⊙ c̃t",
    "d": "ADDITIVE path: old memory + new memory. This additive highway is why gradients flow more easily.",
    "hi": 2
   },
   {
    "t": "Output gate",
    "f": "ot = σ(Wo xt + Uo ht−1 + bo)\nht = ot ⊙ tanh(ct)",
    "d": "The cell state is squashed by tanh, then the output gate decides how much to EXPOSE as h(t). Trap: c(t) and h(t) are different objects.",
    "hi": 3
   }
  ]
 },
 "gru": {
  "name": "GRU cell walkthrough",
  "steps": [
   {
    "t": "Reset gate",
    "f": "rt = σ(Wr xt + Ur ht−1 + br)",
    "d": "How strongly the previous state enters the CANDIDATE — note it acts inside the candidate's Uh term.",
    "hi": 0
   },
   {
    "t": "Candidate",
    "f": "h̃t = tanh(Wh xt + Uh(rt ⊙ ht−1) + bh)",
    "d": "rt ≈ 0 makes the candidate depend mostly on the new input, forgetting the past.",
    "hi": 1
   },
   {
    "t": "Update gate",
    "f": "zt = σ(Wz xt + Uz ht−1 + bz)",
    "d": "Balances old versus new: the single dial that replaces LSTM's forget/input pair.",
    "hi": 2
   },
   {
    "t": "State update",
    "f": "ht = (1 − zt) ⊙ ht−1 + zt ⊙ h̃t",
    "d": "zt → 0: copy old state. zt → 1: replace with candidate. No cell state, fewer parameters than LSTM.",
    "hi": 3
   }
  ]
 }
};

// Extracted verbatim from stat41120_sprint.html — converted to LaTeX 2026-07-26.
import type { VizModel } from './types';

export const VIZ_MODELS: Record<'fnn'|'rnn'|'lstm'|'gru', VizModel> = {
 "fnn": {
  "name": "FNN forward pass",
  "steps": [
   {
    "t": "Input",
    "latex": "h^{(0)} = x = (-1, 1)",
    "d": "Two input units. No parameters at the input layer.",
    "hi": 0
   },
   {
    "t": "Pre-activation z(1)",
    "latex": "\\begin{aligned} z^{(1)} &= W^{(1)}x + b^{(1)} \\\\ W^{(1)} &= \\begin{bmatrix} 1 & -1 \\\\ 0 & 2 \\end{bmatrix}, \\quad b^{(1)} = (0.5, -1) \\\\ z^{(1)} &= (-1.5, 1) \\end{aligned}",
    "d": "Affine map: each hidden unit takes a weighted sum of ALL inputs plus its bias.",
    "hi": 1
   },
   {
    "t": "Activation h(1)",
    "latex": "h^{(1)} = \\operatorname{ReLU}(z^{(1)}) = (0, 1)",
    "d": "ReLU zeroes the negative pre-activation. Note the first unit is now dead for this input.",
    "hi": 1
   },
   {
    "t": "Pre-activation z(2)",
    "latex": "\\begin{aligned} z^{(2)} &= W^{(2)}h^{(1)} + b^{(2)} \\\\ W^{(2)} &= [2, -1], \\quad b^{(2)} = 0.4 \\\\ z^{(2)} &= 2 \\cdot 0 + (-1) \\cdot 1 + 0.4 = -0.6 \\end{aligned}",
    "d": "The output unit combines the hidden activations — including the zero from the dead unit.",
    "hi": 2
   },
   {
    "t": "Output o",
    "latex": "o = \\sigma(-0.6) = 0.3543",
    "d": "Sigmoid output → probability of class 1. If y=1: ℓ = −log(0.3543) = 1.038.",
    "hi": 2
   },
   {
    "t": "Backward: δ",
    "latex": "\\begin{aligned} \\delta &= o - y = -0.6457 \\\\ \\nabla W^{(2)} &= \\delta \\cdot \\left(h^{(1)}\\right)^\\top = (0, -0.6457) \\end{aligned}",
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
    "latex": "\\begin{aligned} h^{(1)} &= \\tanh(W \\cdot h^{(0)} + U \\cdot x^{(1)}) \\\\ &= \\tanh(0.5 \\cdot 0 + 1 \\cdot 1) = \\tanh(1) = 0.7616 \\end{aligned}",
    "d": "Same W and U will be reused at every step — parameter sharing.",
    "hi": 0
   },
   {
    "t": "t = 2",
    "latex": "\\begin{aligned} h^{(2)} &= \\tanh(W \\cdot h^{(1)} + U \\cdot x^{(2)}) \\\\ &= \\tanh(0.5 \\cdot 0.7616 + 1 \\cdot (-1)) = \\tanh(-0.6192) = -0.5506 \\end{aligned}",
    "d": "The PREVIOUS hidden state carries a lossy summary of the past into the present.",
    "hi": 1
   },
   {
    "t": "t = 3",
    "latex": "\\begin{aligned} h^{(3)} &= \\tanh(0.5 \\cdot (-0.5506) + 1 \\cdot 0.5) \\\\ &= \\tanh(0.2247) = 0.2210 \\end{aligned}",
    "d": "Reversing the input order would give a different h(3): order matters.",
    "hi": 2
   },
   {
    "t": "Output",
    "latex": "o^{(T)} = g(V \\cdot h^{(T)})",
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
    "latex": "f_t = \\sigma(W_f x_t + U_f h_{t-1} + b_f)",
    "d": "How much of the OLD cell state survives. Sigmoid → each memory component scaled by (0,1).",
    "hi": 0
   },
   {
    "t": "Input gate + candidate",
    "latex": "\\begin{aligned} i_t &= \\sigma(W_i x_t + U_i h_{t-1} + b_i) \\\\ \\tilde c_t &= \\tanh(W_c x_t + U_c h_{t-1} + b_c) \\end{aligned}",
    "d": "The candidate (tanh) proposes new memory; the input gate decides how much to actually write.",
    "hi": 1
   },
   {
    "t": "Cell update",
    "latex": "c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde c_t",
    "d": "ADDITIVE path: old memory + new memory. This additive highway is why gradients flow more easily.",
    "hi": 2
   },
   {
    "t": "Output gate",
    "latex": "\\begin{aligned} o_t &= \\sigma(W_o x_t + U_o h_{t-1} + b_o) \\\\ h_t &= o_t \\odot \\tanh(c_t) \\end{aligned}",
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
    "latex": "r_t = \\sigma(W_r x_t + U_r h_{t-1} + b_r)",
    "d": "How strongly the previous state enters the CANDIDATE — note it acts inside the candidate's Uh term.",
    "hi": 0
   },
   {
    "t": "Candidate",
    "latex": "\\tilde h_t = \\tanh(W_h x_t + U_h(r_t \\odot h_{t-1}) + b_h)",
    "d": "rt ≈ 0 makes the candidate depend mostly on the new input, forgetting the past.",
    "hi": 1
   },
   {
    "t": "Update gate",
    "latex": "z_t = \\sigma(W_z x_t + U_z h_{t-1} + b_z)",
    "d": "Balances old versus new: the single dial that replaces LSTM's forget/input pair.",
    "hi": 2
   },
   {
    "t": "State update",
    "latex": "h_t = (1 - z_t) \\odot h_{t-1} + z_t \\odot \\tilde h_t",
    "d": "zt → 0: copy old state. zt → 1: replace with candidate. No cell state, fewer parameters than LSTM.",
    "hi": 3
   }
  ]
 }
};

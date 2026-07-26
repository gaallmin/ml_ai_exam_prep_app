// Extracted verbatim from stat41120_sprint.html — converted to LaTeX 2026-07-26.
import type { FormulaCard } from './types';

export const FORMULAS: FormulaCard[] = [
 {
  "cat": "Forward propagation",
  "latex": "\\begin{aligned}\nz^{(g)} &= W^{(g)}h^{(g-1)} + b^{(g)} \\\\\nh^{(g)} &= f\\!\\left(z^{(g)}\\right)\n\\end{aligned}\n\\qquad\nh^{(0)} = x, \\quad h^{(G)} = o",
  "when": "Any layer computation; h(0)=x, h(G)=o.",
  "trap": "z first, activation second.",
  "ex": "W=[1,−1], b=0.5, h=(2,1) → z=1.5, ReLU→1.5",
  "q": "Compute h(1) for a given W, b, x with ReLU.",
  "logicLabId": "forward-prop"
 },
 {
  "cat": "BCE",
  "latex": "\\operatorname{BCE} = -\\frac{1}{N}\\sum_{i=1}^{N}\\left[y_i\\log(p_i)+(1-y_i)\\log(1-p_i)\\right]",
  "when": "Binary classification with sigmoid output.",
  "trap": "Single instance: drop 1/N. y=1 kills the second term.",
  "ex": "y=1, p=.8 → −log(.8)=0.223",
  "q": "Compute the loss for one instance given o and y.",
  "logicLabId": "bce"
 },
 {
  "cat": "Softmax",
  "latex": "o_k = \\frac{\\exp(z_k)}{\\sum_{s=1}^{K}\\exp(z_s)}",
  "when": "Multiclass output layer.",
  "trap": "Outputs sum to 1; subtracting max(z) first is numerically safe and changes nothing.",
  "ex": "z=(1,0) → o=(.731,.269)",
  "q": "Compute softmax outputs for z=(2,1,0).",
  "logicLabId": "softmax"
 },
 {
  "cat": "Cross-entropy",
  "latex": "\\operatorname{CE} = -\\sum_{k=1}^{K}y_k\\log(o_k)",
  "when": "Multiclass with one-hot y.",
  "trap": "Only the true-class term survives.",
  "ex": "true class prob .5 → CE=0.693",
  "q": "Compute CE given softmax output and one-hot target."
 },
 {
  "cat": "Softmax + CE derivative",
  "latex": "\\frac{\\partial \\ell}{\\partial z_k} = o_k - y_k",
  "when": "Output-layer delta for backprop.",
  "trap": "Holds for the COMBINED softmax+CE — not for softmax alone.",
  "ex": "o=(.7,.3), y=(1,0) → δ=(−.3,.3)",
  "q": "Derive ∂ℓ/∂zk via the softmax Jacobian and chain rule."
 },
 {
  "cat": "Hidden-layer delta",
  "latex": "\\delta^{(g)} = \\left(\\left(W^{(g+1)}\\right)^\\top \\delta^{(g+1)}\\right) \\odot f'\\!\\left(z^{(g)}\\right)",
  "when": "Backprop recursion through hidden layers.",
  "trap": "Downstream weight + local derivative. ReLU′ = 1 if z>0 else 0.",
  "ex": "w_next=.5, δ_next=−.2, z>0 → δ=−.1",
  "q": "Compute the gradient for a highlighted hidden weight."
 },
 {
  "cat": "Weight decay (L2)",
  "latex": "\\begin{aligned}\n\\ell_{\\text{pen}} &= \\ell + \\lambda\\frac{1}{2}\\lVert w\\rVert_2^2 \\\\\n\\nabla\\ell_{\\text{pen}} &= \\nabla\\ell + \\lambda w \\\\\nw_{\\text{new}} &= w - \\eta(\\nabla\\ell + \\lambda w)\n\\end{aligned}",
  "when": "Any L2-regularised update question.",
  "trap": "ADD λw to the gradient; never multiply λ by ∇ℓ.",
  "ex": "w=.6, ∇=−.2, λ=.1, η=.5 → w=.67",
  "q": "Perform one weight-decay update step."
 },
 {
  "cat": "L1 penalty",
  "latex": "q(w) = \\lVert w \\rVert_1 = \\sum_j |w_j|",
  "when": "Sparsity questions.",
  "trap": "L1 drives weights EXACTLY to zero; L2 only shrinks.",
  "ex": "w=−.3 → subgradient −1",
  "q": "Contrast L1 vs L2 effect on weights."
 },
 {
  "cat": "CNN output dims",
  "latex": "W_{\\text{out}} = \\left\\lfloor\\frac{W_{\\text{in}}-k+2p}{s}\\right\\rfloor + 1",
  "when": "Every conv shape question (same for H).",
  "trap": "Padding is 2p in the numerator; floor before +1.",
  "ex": "32,k5,p0,s1 → 28",
  "q": "Give the output shape of a conv layer."
 },
 {
  "cat": "CNN parameters",
  "latex": "\\#\\text{params} = (k \\cdot k \\cdot D_{\\text{in}} + 1) \\times D_{\\text{out}}",
  "when": "Trainable parameter counts.",
  "trap": "+1 bias per FILTER; Din is input depth, Dout = number of filters.",
  "ex": "5×5×3+1=76; ×16 filters=1216",
  "q": "Count the parameters of a conv layer."
 },
 {
  "cat": "Pooling",
  "latex": "W_{\\text{out}} = \\left\\lfloor\\frac{W_{\\text{in}}-k_{\\text{pool}}}{s}\\right\\rfloor + 1, \\quad D_{\\text{out}} = D_{\\text{in}}",
  "when": "Pooling shape questions.",
  "trap": "Depth preserved; zero parameters.",
  "ex": "28, 2×2, s2 → 14",
  "q": "Give the output shape after max pooling."
 },
 {
  "cat": "Flatten",
  "latex": "\\text{size} = W \\times H \\times D",
  "when": "Between conv blocks and dense layers.",
  "trap": "No parameters; the following dense layer often dominates the count.",
  "ex": "7×7×64 → 3136",
  "q": "Compute the flatten size and next dense layer's parameters."
 },
 {
  "cat": "Simple RNN",
  "latex": "\\begin{aligned}\nh^{(t)} &= \\tanh\\!\\left(W h^{(t-1)} + U x^{(t)}\\right) \\\\\no^{(T)} &= g\\!\\left(V h^{(T)}\\right)\n\\end{aligned}",
  "when": "Hidden-state calculations, many-to-one.",
  "trap": "h(t−1) not h(t); shared W,U,V across time.",
  "ex": "W=.5,U=1,x1=1 → h1=tanh(1)=.762",
  "q": "Compute h(1), h(2) for scalar inputs."
 },
 {
  "cat": "LSTM gates",
  "latex": "\\begin{aligned}\nf_t &= \\sigma(W_f x_t + U_f h_{t-1} + b_f) \\\\\ni_t &= \\sigma(W_i x_t + U_i h_{t-1} + b_i) \\\\\n\\tilde c_t &= \\tanh(W_c x_t + U_c h_{t-1} + b_c) \\\\\no_t &= \\sigma(W_o x_t + U_o h_{t-1} + b_o) \\\\\nc_t &= f_t \\odot c_{t-1} + i_t \\odot \\tilde c_t \\\\\nh_t &= o_t \\odot \\tanh(c_t)\n\\end{aligned}",
  "when": "Gate interpretation & recall questions.",
  "trap": "c(t) ≠ h(t); gates sigmoid, candidate tanh.",
  "ex": "ft=1, it=0 → pure memory copy",
  "q": "Name each gate's role and activation."
 },
 {
  "cat": "GRU gates",
  "latex": "\\begin{aligned}\nz_t &= \\sigma(W_z x_t + U_z h_{t-1} + b_z) \\\\\nr_t &= \\sigma(W_r x_t + U_r h_{t-1} + b_r) \\\\\n\\tilde h_t &= \\tanh\\!\\left(W_h x_t + U_h(r_t\\odot h_{t-1}) + b_h\\right) \\\\\nh_t &= (1-z_t)\\odot h_{t-1} + z_t\\odot \\tilde h_t\n\\end{aligned}",
  "when": "GRU recall & comparison with LSTM.",
  "trap": "Reset gate sits inside the candidate; no cell state.",
  "ex": "zt=0 → state copied",
  "q": "Compare GRU and LSTM: gates, cell state, parameters."
 },
 {
  "cat": "ECE",
  "latex": "\\operatorname{ECE} = \\sum_{m=1}^{M}\\frac{n_m}{N}\\left|\\operatorname{acc}(B_m) - \\operatorname{conf}(B_m)\\right|",
  "when": "Calibration questions with binned predictions.",
  "trap": "Weight by nm/N; conf = mean predicted prob, acc = observed frequency.",
  "ex": "two equal bins, gaps .10/.05 → .075",
  "q": "Compute ECE from a bin table."
 },
 {
  "cat": "Calibration",
  "latex": "\\Pr(Y=1 \\mid \\hat p(x)=s) = s",
  "when": "Defining calibration; Platt vs isotonic.",
  "trap": "Platt = parametric logistic on scores; isotonic = monotone, non-parametric, data-hungry.",
  "ex": "conf .8 bin with acc .6 → overconfident",
  "q": "Define calibration and one recalibration method."
 }
];

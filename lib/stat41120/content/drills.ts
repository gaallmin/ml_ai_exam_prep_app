// Extracted verbatim from stat41120_sprint.html — do not paraphrase.
import type { Drill } from './types';

export const DRILLS: Drill[] = [
 {
  "id": "d-fwd1",
  "topic": "Forward propagation",
  "wk": "Formula memory gap",
  "type": "numeric",
  "tol": 0.005,
  "q": "Scalar chain: x = −1. Hidden: z₁ = 2x + 0.5, ReLU. Output: z₂ = 3h₁ − 0.4, sigmoid. Compute the output o.",
  "ans": 0.4013,
  "sol": "z₁ = −1.5 → ReLU → h₁ = 0. z₂ = −0.4 → σ(−0.4) = 0.4013.",
  "rule": "z first → activation second → next layer.",
  "hook": "ReLU kills negatives BEFORE they reach the next layer.",
  "trigger": "Any 'perform forward propagation' with given weights."
 },
 {
  "id": "d-bce1",
  "topic": "BCE calculation",
  "wk": "Formula memory gap",
  "type": "numeric",
  "tol": 0.005,
  "q": "Output o = 0.35 for a training instance with true label y = 0. Compute the BCE loss for this instance.",
  "ans": 0.4308,
  "sol": "y=0 → ℓ = −log(1−0.35) = −log(0.65) = 0.4308.",
  "rule": "BCE = −[y log p + (1−y) log(1−p)]; one term always vanishes.",
  "hook": "y=0 → use log(1−p). y=1 → use log(p).",
  "trigger": "'Calculate the loss' after a forward pass."
 },
 {
  "id": "d-sm1",
  "topic": "Softmax + CE derivative",
  "wk": "Derivation logic gap",
  "type": "numeric",
  "tol": 0.005,
  "q": "Softmax outputs o = (0.7, 0.2, 0.1); one-hot target y = (0, 1, 0). Give ∂ℓ/∂z₂.",
  "ans": -0.8,
  "sol": "∂ℓ/∂zk = ok − yk → 0.2 − 1 = −0.8.",
  "rule": "For softmax+CE combined, the delta is simply o − y.",
  "hook": "softmax+CE = 'output minus target'.",
  "trigger": "'Gradient with respect to pre-activation z'."
 },
 {
  "id": "d-grad1",
  "topic": "Highlighted-weight gradient",
  "wk": "Derivation logic gap",
  "type": "numeric",
  "tol": 0.005,
  "q": "Binary net: output o = 0.9, y = 1. The highlighted output weight receives hidden activation h = 0.5. Compute ∇ℓ(w).",
  "ans": -0.05,
  "sol": "δ = o − y = −0.1. ∇ℓ(w) = δ·h = −0.1 × 0.5 = −0.05.",
  "rule": "Gradient for an output weight = (o − y) × input flowing through that weight.",
  "hook": "delta × what enters the edge.",
  "trigger": "'Purple/green colored edge' style questions."
 },
 {
  "id": "d-grad2",
  "topic": "Hidden-weight gradient",
  "wk": "Derivation logic gap",
  "type": "numeric",
  "tol": 0.005,
  "q": "Same net: o = 0.9, y = 1, downstream weight from the hidden unit to output is v = 0.8, the hidden unit has z > 0 (ReLU), and the input feeding the highlighted hidden weight is x = 2. Compute ∇ℓ(w).",
  "ans": -0.16,
  "sol": "δ_out = −0.1. δ_hidden = v·δ_out·ReLU′ = 0.8×(−0.1)×1 = −0.08. ∇ = δ_hidden·x = −0.16.",
  "rule": "Hidden delta uses the DOWNSTREAM weight and the local activation derivative.",
  "hook": "downstream weight, local derivative, then × input.",
  "trigger": "Gradient for a weight NOT in the output layer."
 },
 {
  "id": "d-wd1",
  "topic": "Weight decay update",
  "wk": "Regularisation gap",
  "type": "numeric",
  "tol": 0.005,
  "q": "w = −0.4, unpenalised gradient ∇ℓ = 0.3, λ = 0.2, η = 1. Perform one L2 weight-decay update; give the new w.",
  "ans": -0.62,
  "sol": "∇pen = 0.3 + 0.2×(−0.4) = 0.22. w ← −0.4 − 1×0.22 = −0.62.",
  "rule": "∇ℓpen = ∇ℓ + λw, then standard GD step.",
  "hook": "ADD λw — never multiply λ into the gradient. (오답노트)",
  "trigger": "'L2 regularization term is applied during training.'"
 },
 {
  "id": "d-lc1",
  "topic": "Learning curve diagnosis",
  "wk": "Diagnosis gap",
  "type": "mcq",
  "q": "Training loss stays above validation loss for every epoch. Most appropriate diagnosis?",
  "opts": [
   "Data leakage from validation into training",
   "Dropout active during training",
   "Validation set too small",
   "Learning rate too high"
  ],
  "correct": 1,
  "sol": "Training loss is computed on thinned subnetworks under dropout; the full network evaluated on validation does better.",
  "rule": "train > val throughout → dropout likely.",
  "hook": "오답노트 entry: dropout pattern, not leakage.",
  "trigger": "Train curve sitting above val curve."
 },
 {
  "id": "d-lc2",
  "topic": "Batch size / LR diagnosis",
  "wk": "Optimisation gap",
  "type": "mcq",
  "q": "Both loss curves zigzag strongly every epoch but trend downward. Best single change?",
  "opts": [
   "Add dropout",
   "Increase batch size",
   "Add more layers",
   "Decrease batch size"
  ],
  "correct": 1,
  "sol": "Zigzag = high-variance gradient estimates from small batches; larger batches average out the noise.",
  "rule": "Noisy curves → small batch (or large η).",
  "hook": "noise ↔ batch size; direction ↔ learning rate.",
  "trigger": "'Oscillating' or 'noisy' curves."
 },
 {
  "id": "d-keras1",
  "topic": "Keras architecture interpretation",
  "wk": "Keras/code interpretation gap",
  "type": "mcq",
  "q": "keras_model_sequential() |> layer_dense(units=32, activation='relu', input_shape=8) |> layer_dense(units=3, activation='softmax'); loss='categorical_crossentropy'. Task and parameter count?",
  "opts": [
   "Regression; 385 params",
   "3-class classification; 387 params",
   "3-class classification; 288 params",
   "Binary classification; 387 params"
  ],
  "correct": 1,
  "sol": "(8+1)×32 = 288, (32+1)×3 = 99, total 387. Softmax + categorical CE → 3-class classification.",
  "rule": "dense params = (in+1)×out; task read from output activation + loss.",
  "hook": "+1 for bias, every layer.",
  "trigger": "Any R keras architecture snippet."
 },
 {
  "id": "d-cnn1",
  "topic": "CNN output dimension",
  "wk": "Dimension/shape reasoning gap",
  "type": "numeric",
  "tol": 0,
  "q": "Input 28×28×1, conv with 8 filters, k=3, stride 1, padding 1. Give the output WIDTH.",
  "ans": 28,
  "sol": "(28 − 3 + 2·1)/1 + 1 = 28. 'Same' padding preserves width; depth becomes 8.",
  "rule": "Wout = ⌊(Win−k+2p)/s⌋+1.",
  "hook": "p=1 with k=3, s=1 → same size.",
  "trigger": "Conv layer with padding stated."
 },
 {
  "id": "d-cnn2",
  "topic": "CNN parameter count",
  "wk": "CNN calculation gap",
  "type": "numeric",
  "tol": 0,
  "q": "Conv layer: input depth 8, 16 filters of size 3×3. How many trainable parameters?",
  "ans": 1168,
  "sol": "(3×3×8 + 1) × 16 = 73 × 16 = 1168.",
  "rule": "(k·k·Din + 1)·Dout.",
  "hook": "one bias per filter.",
  "trigger": "'How many trainable parameters' for conv."
 },
 {
  "id": "d-cnn3",
  "topic": "Max-pooling calculation",
  "wk": "CNN calculation gap",
  "type": "numeric",
  "tol": 0,
  "q": "A 4×4 feature map [[1,3,2,4],[5,6,1,0],[7,2,9,8],[3,4,6,5]] passes through 2×2 max pooling, stride 2. Give the TOP-LEFT value of the output.",
  "ans": 6,
  "sol": "Top-left window {1,3,5,6} → max = 6. Full output: [[6,4],[7,9]].",
  "rule": "Take the max of each non-overlapping window.",
  "hook": "pooling: shrink W,H — keep D.",
  "trigger": "Numeric pooling grid."
 },
 {
  "id": "d-conv1",
  "topic": "Convolution calculation",
  "wk": "CNN calculation gap",
  "type": "numeric",
  "tol": 0,
  "q": "3×3 input [[1,0,2],[0,1,0],[3,0,1]] convolved with 2×2 kernel [[1,0],[0,1]], stride 1, no padding. Give the TOP-LEFT output value.",
  "ans": 2,
  "sol": "Window [[1,0],[0,1]] ⊙ kernel = 1+1 = 2.",
  "rule": "Elementwise multiply, then sum.",
  "hook": "convolution = dot product per window.",
  "trigger": "Small numeric kernel questions."
 },
 {
  "id": "d-rnn1",
  "topic": "RNN hidden-state calculation",
  "wk": "RNN recursion gap",
  "type": "numeric",
  "tol": 0.005,
  "q": "Scalar RNN: h(t) = tanh(0.5·h(t−1) + 1·x(t)), h(0)=0, x = (1, −1). Compute h(2).",
  "ans": -0.5506,
  "sol": "h(1)=tanh(1)=0.7616. h(2)=tanh(0.5×0.7616 − 1)=tanh(−0.6192)=−0.5506.",
  "rule": "Feed h(t−1), not h(t); same W,U each step.",
  "hook": "previous state in, order matters.",
  "trigger": "'Compute h1, h2'."
 },
 {
  "id": "d-lstm1",
  "topic": "LSTM/GRU gate interpretation",
  "wk": "RNN recursion gap",
  "type": "mcq",
  "q": "In an LSTM, which statement is correct?",
  "opts": [
   "The output gate decides how much new information enters the cell",
   "ct = ft ⊙ ct−1 + it ⊙ c̃t updates the cell state",
   "ht = tanh(ct) with no gating",
   "The forget gate uses tanh activation"
  ],
  "correct": 1,
  "sol": "Forget gate scales old memory, input gate scales the tanh candidate; gates are sigmoid; ht = ot ⊙ tanh(ct).",
  "rule": "ct = ft⊙ct−1 + it⊙c̃t; ht = ot⊙tanh(ct).",
  "hook": "forget=keep old, input=write new, output=expose.",
  "trigger": "'Which statement is correct' on LSTM."
 },
 {
  "id": "d-gru1",
  "topic": "LSTM/GRU gate interpretation",
  "wk": "RNN recursion gap",
  "type": "mcq",
  "q": "Compared with an LSTM, a GRU:",
  "opts": [
   "Has more parameters and a separate cell state",
   "Has fewer gates and no separate cell state",
   "Eliminates exploding gradients entirely",
   "Uses a different W at each time step"
  ],
  "correct": 1,
  "sol": "GRU: two gates (reset, update), no cell state, fewer parameters; still shares weights across time.",
  "rule": "GRU = simplified LSTM; performance task-dependent.",
  "hook": "GRU = 2 gates, 0 cells.",
  "trigger": "'Compare LSTM and GRU'."
 },
 {
  "id": "d-ece1",
  "topic": "ECE calculation",
  "wk": "Evaluation interpretation gap",
  "type": "numeric",
  "tol": 0.002,
  "q": "Bins: B1 n=20, acc 0.55, conf 0.70; B2 n=80, acc 0.85, conf 0.80. N=100. Compute ECE.",
  "ans": 0.07,
  "sol": "0.2×|0.55−0.70| + 0.8×|0.85−0.80| = 0.03 + 0.04 = 0.07.",
  "rule": "ECE = Σ (nm/N)|acc−conf| — weighted, absolute gaps.",
  "hook": "weight by bin size; never plain-average.",
  "trigger": "Bin table with n, acc, conf."
 },
 {
  "id": "d-cal1",
  "topic": "Calibration interpretation",
  "wk": "Evaluation interpretation gap",
  "type": "mcq",
  "q": "In a reliability diagram, points lying BELOW the diagonal (acc < conf) indicate:",
  "opts": [
   "Underconfidence",
   "Overconfidence",
   "Perfect calibration",
   "High AUC"
  ],
  "correct": 1,
  "sol": "Predicted probabilities exceed the observed frequency of positives → the model is overconfident.",
  "rule": "below diagonal = overconfident; above = underconfident.",
  "hook": "conf > acc = bragging.",
  "trigger": "Reliability diagram reading."
 },
 {
  "id": "d-metric1",
  "topic": "Threshold metrics",
  "wk": "Evaluation interpretation gap",
  "type": "numeric",
  "tol": 0.005,
  "q": "TP=30, FN=20, FP=10, TN=40. Compute the false positive rate.",
  "ans": 0.2,
  "sol": "FPR = FP/(FP+TN) = 10/50 = 0.2. (Sensitivity would be 30/50 = 0.6.)",
  "rule": "FPR denominator = all actual negatives.",
  "hook": "오답노트: sensitivity row = positives; FPR row = negatives.",
  "trigger": "Confusion matrix cell questions."
 },
 {
  "id": "d-l1-1",
  "topic": "Regularisation",
  "wk": "Regularisation gap",
  "type": "mcq",
  "q": "Which statement about L1 vs L2 penalties is most appropriate?",
  "opts": [
   "L2 sets many weights exactly to zero",
   "L1 produces sparse solutions; L2 shrinks weights smoothly",
   "Both are differentiable everywhere",
   "L1 penalises ½‖w‖²"
  ],
  "correct": 1,
  "sol": "L1's corners at 0 (subgradient in {−1,0,1}) push weights exactly to zero; L2's quadratic penalty only shrinks.",
  "rule": "L1 = sparsity, L2 = shrinkage.",
  "hook": "1 = zeros, 2 = shrink.",
  "trigger": "'Compare L1 and L2'."
 },
 {
  "id": "d-opt1",
  "topic": "Optimisation",
  "wk": "Optimisation gap",
  "type": "mcq",
  "q": "What does momentum add to plain SGD?",
  "opts": [
   "A per-parameter adaptive learning rate",
   "A velocity term accumulating past gradients",
   "Random restarts",
   "A larger batch size"
  ],
  "correct": 1,
  "sol": "v ← αv − η∇ℓ; w ← w + v: consistent directions accelerate, oscillating directions damp.",
  "rule": "momentum remembers direction via velocity.",
  "hook": "오답노트: momentum ≠ bigger LR; it is memory of direction.",
  "trigger": "'What changes with momentum?'"
 },
 {
  "id": "d-drop1",
  "topic": "Dropout",
  "wk": "Regularisation gap",
  "type": "free",
  "q": "Exam style, 3–4 sentences: explain how dropout acts as a regulariser, and what changes at test time.",
  "model": "During training, each unit is dropped with probability p per mini-batch, so each update trains a random thinned subnetwork. The full network approximates an ensemble average of exponentially many subnetworks, and units cannot rely on specific co-adapted partners, reducing overfitting. At test time no units are dropped; activations (or weights) are rescaled so expected pre-activations match training. (오답노트: dropout = implicit ensemble of thinned subnetworks.)",
  "rule": "dropout = implicit ensemble of thinned subnetworks.",
  "hook": "train: drop & thin. test: keep & rescale.",
  "trigger": "'Explain dropout' / 'why does dropout help'."
 },
 {
  "id": "d-bp-free",
  "topic": "Backpropagation",
  "wk": "Derivation logic gap",
  "type": "free",
  "q": "Derive ∂ℓ/∂zk = ok − yk for softmax outputs with cross-entropy loss. Show your working.",
  "model": "ℓ = −Σj yj log oj with oj = e^{zj}/Σs e^{zs}. Softmax Jacobian: ∂oj/∂zk = oj(1{j=k} − ok). Chain rule: ∂ℓ/∂zk = −Σj (yj/oj)·oj(1{j=k} − ok) = −Σj yj(1{j=k} − ok) = −yk + ok Σj yj = ok − yk, using Σj yj = 1. Each step: write loss, write Jacobian, apply chain rule, use one-hot sum.",
  "rule": "Jacobian + chain rule + Σy=1.",
  "hook": "'output minus target' — but be able to SHOW it.",
  "trigger": "'Show that ∂ℓ/∂zk = ok − yk.'"
 },
 {
  "id": "d-fp-free",
  "topic": "Forward propagation",
  "wk": "Exam-expression gap",
  "type": "free",
  "q": "Give the shortest full-mark answer: describe forward propagation in a G-layer network using compact matrix notation.",
  "model": "Set h(0) = x. For g = 1,…,G: z(g) = W(g)h(g−1) + b(g), h(g) = f(z(g)). The output is o = h(G), with the output activation chosen by the task (sigmoid/softmax/identity). Define all symbols: W(g) weights, b(g) biases, f activation.",
  "rule": "State recursion + initial condition + output mapping + define symbols.",
  "hook": "formula alone is not enough: define symbols, state objective, interpret.",
  "trigger": "'Describe/state the forward propagation equations.'"
 }
];

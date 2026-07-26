// Extracted verbatim from stat41120_sprint.html — do not paraphrase.
import type { MapBranch } from './types';

export const MAP: MapBranch[] = [
 {
  "name": "FNN / DNN",
  "color": "var(--amber)",
  "kids": [
   {
    "id": "fnn-arch",
    "name": "Architecture",
    "note": "A DNN stacks G layers. Each layer applies an affine map (pre-activation) then a nonlinearity (activation). Depth = number of layers with learnable weights (including output). Width = units per hidden layer.",
    "formulas": [
     "z(g) = W(g) h(g−1) + b(g)\nh(g) = f(z(g))\nwith h(0) = x,  h(G) = o"
    ],
    "traps": [
     "Depth counts weight layers incl. output — input layer has no weights.",
     "Dense layer params = (units_in + 1) × units_out — never forget the +1 bias."
    ],
    "q": "A network has input V=4, hidden layers of 8 and 5 units, and 3 output units. How many trainable parameters?",
    "a": "(4+1)×8 + (8+1)×5 + (5+1)×3 = 40 + 45 + 18 = 103. Rule: each dense layer contributes (in+1)×out."
   },
   {
    "id": "fnn-fwd",
    "name": "Forward propagation",
    "note": "Compute z first, apply activation second, feed to next layer. Repeat until output layer, whose activation is chosen by the task (sigmoid: binary, softmax: multiclass, identity: regression).",
    "formulas": [
     "z(1)=W(1)x+b(1) → h(1)=f(z(1)) → z(2)=W(2)h(1)+b(2) → ... → o"
    ],
    "traps": [
     "Apply ReLU AFTER the full linear combination, never element-by-element mid-sum.",
     "오답노트: arithmetic slips and applying ReLU to the wrong quantity."
    ],
    "q": "With W(1)=[[1,−1],[0,2]], b(1)=(0.5,−1), x=(−1,1), ReLU hidden: compute h(1).",
    "a": "z=( 1·(−1)+(−1)·1+0.5, 0·(−1)+2·1−1 ) = (−1.5, 1). ReLU → h(1)=(0, 1). Template: z first → activation second."
   },
   {
    "id": "fnn-loss",
    "name": "Loss functions",
    "note": "Binary classification: BCE with sigmoid output. Multiclass: cross-entropy with softmax. Regression: squared loss with identity output. The loss and the output activation are chosen together.",
    "formulas": [
     "BCE = −1/N Σ [ y log p + (1−y) log(1−p) ]",
     "CE = −Σk yk log(ok)",
     "Squared: ℓ = ½ (y − o)²"
    ],
    "traps": [
     "For a single instance BCE = −[y log p + (1−y) log(1−p)] — no 1/N.",
     "오답노트: forgetting bias term when computing predicted probability."
    ],
    "q": "Forward prop gives o = 0.8022 and the true label is y = 1. Compute the loss.",
    "a": "ℓ = −log(0.8022) = 0.2204. Since y=1 the (1−y) term vanishes."
   },
   {
    "id": "fnn-bp",
    "name": "Backpropagation",
    "note": "Gradients flow backwards using the chain rule. Output layer: δ(G) = o − y for softmax+CE or sigmoid+BCE. Hidden layers: δ(g) = (W(g+1)ᵀ δ(g+1)) ⊙ f′(z(g)). Gradient w.r.t. weights: ∇W(g) = δ(g) h(g−1)ᵀ.",
    "formulas": [
     "δ(G) = o − y\nδ(g) = ( W(g+1)ᵀ δ(g+1) ) ⊙ f′(z(g))\n∂ℓ/∂W(g) = δ(g) h(g−1)ᵀ"
    ],
    "traps": [
     "Hidden-layer gradient uses the DOWNSTREAM weight W(g+1), not the current weight.",
     "Multiply by the local activation derivative f′(z) — for ReLU it is 1 if z>0, else 0.",
     "오답노트: using current weight instead of downstream weight."
    ],
    "q": "Output o=0.8022, y=1, hidden activation h=0.333 feeds the output weight w(3). Compute ∇ℓ(w(3)).",
    "a": "δ = o − y = −0.1978. ∇ℓ(w(3)) = δ · h = −0.1978 × 0.333 ≈ −0.0659 (with tutorial numbers: −0.2671). Chain: (o−y) × input to that weight."
   },
   {
    "id": "fnn-update",
    "name": "Parameter updates",
    "note": "Gradient descent moves parameters against the gradient with step size η. With L2 weight decay the gradient gains a +λw term.",
    "formulas": [
     "w ← w − η ∇ℓ(w)",
     "with decay: w ← w − η( ∇ℓ + λw )"
    ],
    "traps": [
     "오답노트: λ multiplies w and is ADDED to the gradient — never multiply λ by the unpenalised gradient."
    ],
    "q": "w = 0.6, ∇ℓ = −0.2, λ = 0.1, η = 0.5. Compute the weight-decay update.",
    "a": "∇ℓpen = −0.2 + 0.1×0.6 = −0.14. w_new = 0.6 − 0.5×(−0.14) = 0.67."
   }
  ]
 },
 {
  "name": "Training practice",
  "color": "var(--moss)",
  "kids": [
   {
    "id": "tp-prep",
    "name": "Preprocessing",
    "note": "Standardise / normalise inputs so gradient-based training is stable. Split raw data FIRST, then compute scaling parameters from the training set only — otherwise information leaks from validation/test into training.",
    "formulas": [
     "standardise: x' = (x − mean_train) / sd_train"
    ],
    "traps": [
     "Data leakage: scaling with statistics computed on the full dataset.",
     "Unnormalised inputs → some weights get huge gradients → unstable training."
    ],
    "q": "Why must scaling parameters be computed on the training set only?",
    "a": "Otherwise test/validation information leaks into training, so the estimated generalisation performance is optimistically biased. Rule: split first, scale after."
   },
   {
    "id": "tp-split",
    "name": "Train / validation / test",
    "note": "Training data estimates parameters w. Validation data selects hyperparameters λ and monitors overfitting (early stopping). Test data gives one final unbiased estimate of generalisation performance and must never influence any choice.",
    "formulas": [],
    "traps": [
     "If the test set is used to pick λ, it is no longer a test set.",
     "Validation loss, not training loss, drives early stopping and tuning."
    ],
    "q": "Which dataset determines the early-stopping epoch, and why?",
    "a": "The validation set: training loss decreases essentially monotonically, so only the validation loss can reveal when overfitting begins."
   },
   {
    "id": "tp-lc",
    "name": "Learning curves",
    "note": "Plot train and validation loss against epochs. Diagnosis always follows Evidence → diagnosis → fix. See the Curves module for all 10 patterns.",
    "formulas": [],
    "traps": [
     "Train loss ABOVE validation loss throughout → dropout is likely active (loss computed with thinned networks on train)."
    ],
    "q": "Train loss falls steadily; validation loss falls then rises after epoch 30. Diagnose and fix.",
    "a": "Evidence: diverging losses after epoch 30. Diagnosis: overfitting. Fix: early stopping around epoch 30, or stronger regularisation (weight decay / dropout / more data)."
   },
   {
    "id": "tp-opt",
    "name": "Optimisation",
    "note": "GD uses the full dataset per update; SGD one sample; mini-batch a compromise (stable + efficient, exploits vectorisation). Momentum accumulates a velocity; Nesterov looks ahead before computing the gradient; RMSProp scales the step per-parameter by a running average of squared gradients; Adam combines momentum with RMSProp-style scaling; AdamW decouples weight decay from the adaptive step.",
    "formulas": [
     "momentum: v ← αv − η∇ℓ ;  w ← w + v",
     "RMSProp: r ← ρr + (1−ρ)∇ℓ⊙∇ℓ ;  w ← w − η ∇ℓ/(√r + ε)",
     "Adam: biased-corrected momentum m̂ and scale r̂ ;  w ← w − η m̂/(√r̂ + ε)"
    ],
    "traps": [
     "Batch size ↑ → gradient noise ↓ → smoother curves but fewer updates per epoch.",
     "Momentum remembers DIRECTION via velocity — it is not a larger learning rate.",
     "Batches per epoch = ceil(N / batch_size)."
    ],
    "q": "N = 5000, batch size 64. How many parameter updates per epoch?",
    "a": "ceil(5000/64) = 79 updates. Each mini-batch triggers exactly one update."
   },
   {
    "id": "tp-init",
    "name": "Initialization & batch norm",
    "note": "Weights are initialised randomly with small variance scaled to layer size: Glorot/Xavier for tanh/sigmoid, He for ReLU. Batch normalization standardises each layer's pre-activations per mini-batch, then rescales with learnable γ, β — stabilises and speeds up training.",
    "formulas": [
     "He: Var(w) = 2/n_in    Glorot: Var(w) = 2/(n_in+n_out)",
     "BN: ẑ = (z − μ_batch)/√(σ²_batch + ε);  out = γẑ + β"
    ],
    "traps": [
     "All-zero init → identical neurons → no symmetry breaking → network cannot learn.",
     "BN has learnable parameters (γ, β): 2 per unit (plus running stats, not trained)."
    ],
    "q": "Why can a network not be trained with all weights initialised to 0?",
    "a": "All units in a layer compute identical outputs and receive identical gradients, so they remain identical forever — symmetry is never broken."
   },
   {
    "id": "tp-reg",
    "name": "Regularisation",
    "note": "Weight decay (L2) shrinks weights smoothly; L1 pushes weights exactly to zero (sparsity, subgradient ±1/0); early stopping halts at the validation minimum; bagging averages models trained on bootstrap resamples; dropout randomly zeroes units during training — an implicit ensemble of thinned subnetworks; data augmentation enlarges the training set with label-preserving transformations.",
    "formulas": [
     "ℓq(w) = ℓ(w) + λ q(w)",
     "L2: q(w)=½‖w‖² → ∇ = λw",
     "L1: q(w)=Σ|wj| → subgradient sign(wj)"
    ],
    "traps": [
     "Increasing λ shrinks weights and can cause underfitting if too large.",
     "Dropout at TEST time is off — weights/activations rescaled instead.",
     "오답노트: dropout = implicit ensemble of thinned subnetworks."
    ],
    "q": "State one mechanism by which dropout reduces overfitting.",
    "a": "Each mini-batch trains a random thinned subnetwork, so the full network behaves like an ensemble average of exponentially many subnetworks; units cannot co-adapt because any unit may be dropped."
   },
   {
    "id": "tp-tune",
    "name": "Hyperparameter tuning",
    "note": "Hyperparameters λ (depth, width, η, λ_decay, batch size, epochs …) cannot be learned from the training loss; they are selected by comparing validation performance across candidate values — grid search, random search, or informed search.",
    "formulas": [],
    "traps": [
     "Parameters w are learned; hyperparameters λ are chosen. Never say the network 'learns' its learning rate.",
     "Selecting λ on the test set invalidates the test estimate."
    ],
    "q": "Why can the number of hidden units not be chosen by minimising training loss?",
    "a": "Training loss decreases monotonically with model complexity, so it would always pick the largest network — validation performance must be used instead."
   }
  ]
 },
 {
  "name": "Evaluation",
  "color": "var(--sky)",
  "kids": [
   {
    "id": "ev-thresh",
    "name": "Threshold metrics",
    "note": "Fix a threshold τ on predicted probabilities, build the confusion matrix, then compute accuracy, sensitivity (recall/TPR), specificity, precision, F1, FPR.",
    "formulas": [
     "sensitivity = TP/(TP+FN)   specificity = TN/(TN+FP)",
     "precision = TP/(TP+FP)      FPR = FP/(FP+TN) = 1 − specificity",
     "F1 = 2PR/(P+R)"
    ],
    "traps": [
     "오답노트: sensitivity is TP/(TP+FN); FPR is FP/(TN+FP) — do not swap denominators.",
     "오답노트: when reading a metrics table, all cells must come from the SAME threshold row."
    ],
    "q": "TP=40, FN=10, FP=20, TN=30. Compute sensitivity and FPR.",
    "a": "Sensitivity = 40/50 = 0.80. FPR = 20/50 = 0.40. Hook: sensitivity's denominator is the positives row; FPR's is the negatives row."
   },
   {
    "id": "ev-rank",
    "name": "Ranking metrics",
    "note": "ROC curve plots TPR vs FPR across all thresholds; AUC-ROC is the probability a random positive is ranked above a random negative. PR curve plots precision vs recall; AU-PR is preferred under strong class imbalance.",
    "formulas": [
     "AUC-ROC = Pr(score(positive) > score(negative))"
    ],
    "traps": [
     "오답노트: R's prSummary reports AU-PR under the name 'AUC' — do not read it as AU-ROC.",
     "A random classifier has AUC-ROC = 0.5, but baseline AU-PR = prevalence of the positive class."
    ],
    "q": "Why is AU-PR more informative than AUC-ROC when positives are 1% of the data?",
    "a": "FPR uses the huge negative class in its denominator, so ROC barely moves when many false positives occur; precision reacts directly, so PR curves expose poor performance on the rare class."
   },
   {
    "id": "ev-score",
    "name": "Scoring rules",
    "note": "Proper scoring rules evaluate the full predicted probabilities, not thresholded labels — log-loss (cross-entropy) and Brier score. They reward honest, well-calibrated probabilities.",
    "formulas": [
     "Brier = 1/N Σ (pᵢ − yᵢ)²",
     "log-loss = BCE"
    ],
    "traps": [
     "Accuracy ignores probability quality; two models with equal accuracy can have very different log-loss."
    ],
    "q": "Model A predicts 0.51 for every positive; model B predicts 0.99. Same accuracy at τ=0.5 — which has lower log-loss and why?",
    "a": "Model B: −log(0.99) ≪ −log(0.51). Scoring rules reward confident correct probabilities, which thresholded accuracy cannot see."
   },
   {
    "id": "ev-cal",
    "name": "Calibration, ECE, recalibration",
    "note": "A model is calibrated if predicted probability s corresponds to true frequency s: Pr(Y=1 | p̂(x)=s) = s. Assess with reliability diagrams; summarise with ECE (weighted average gap) or MCE (max gap). Fix miscalibration with Platt scaling (fit a logistic on scores, parametric) or isotonic regression (monotone step function, non-parametric, needs more data).",
    "formulas": [
     "ECE = Σm (nm/N) · |acc(Bm) − conf(Bm)|",
     "Perfect: Pr(Y=1 | p̂=s) = s"
    ],
    "traps": [
     "ECE weights each bin by nm/N — never a plain average of gaps.",
     "conf(Bm) = mean predicted probability in the bin; acc(Bm) = observed positive fraction.",
     "Platt = parametric sigmoid; isotonic = flexible but can overfit small data."
    ],
    "q": "Bins: (n=50, acc .60, conf .70), (n=50, acc .90, conf .85). N=100. Compute ECE.",
    "a": "ECE = .5|.60−.70| + .5|.90−.85| = .05 + .025 = 0.075."
   }
  ]
 },
 {
  "name": "CNN",
  "color": "var(--coral)",
  "kids": [
   {
    "id": "cnn-tensor",
    "name": "Image tensor",
    "note": "An image is a W×H×D tensor: width, height, depth (channels; 3 for RGB). Image depth is a property of the DATA — it is not the depth of the network.",
    "formulas": [],
    "traps": [
     "Image depth (channels) ≠ network depth (layers)."
    ],
    "q": "A 32×32 RGB image enters the network. State the input tensor shape.",
    "a": "32 × 32 × 3 — depth 3 refers to colour channels."
   },
   {
    "id": "cnn-conv",
    "name": "Convolution",
    "note": "A k×k×Din filter slides over the input with stride s and padding p; at each position it computes an elementwise product-and-sum → one value of a feature map. One filter → one feature map; the output depth equals the NUMBER of filters. Convolution is translation equivariant: shifting the input shifts the feature map.",
    "formulas": [
     "Wout = ⌊(Win − k + 2p)/s⌋ + 1   (same for H)",
     "params = (k·k·Din + 1) · Dout"
    ],
    "traps": [
     "Output depth = number of filters, not filter size.",
     "Each filter spans the FULL input depth Din.",
     "Equivariant to translation — invariance only comes (approximately) from pooling."
    ],
    "q": "Input 32×32×3, 16 filters of 5×5, stride 1, padding 0. Output shape and parameter count?",
    "a": "Wout = (32−5)/1 + 1 = 28 → 28×28×16. Params = (5·5·3 + 1)·16 = 76·16 = 1216."
   },
   {
    "id": "cnn-relu",
    "name": "ReLU in CNNs",
    "note": "ReLU is applied elementwise to each feature map: values change, shape does not. It introduces nonlinearity between convolutional blocks.",
    "formulas": [
     "ReLU(z) = max(0, z)"
    ],
    "traps": [
     "ReLU never changes tensor dimensions and has no parameters."
    ],
    "q": "A 14×14×32 tensor passes through ReLU. Output shape and added parameters?",
    "a": "14×14×32, zero parameters."
   },
   {
    "id": "cnn-pool",
    "name": "Pooling",
    "note": "Max (or average) pooling summarises each kpool×kpool window per channel, reducing W and H while PRESERVING depth. Gives approximate local translation invariance and no parameters. Backprop through max pooling routes the gradient only to the max element of each window.",
    "formulas": [
     "Wout = ⌊(Win − kpool)/s⌋ + 1 ;  Dout = Din"
    ],
    "traps": [
     "Pooling preserves depth.",
     "Pooling has zero parameters.",
     "Max-pool backprop: gradient goes only to the argmax position."
    ],
    "q": "28×28×16 through 2×2 max pooling, stride 2. Output shape?",
    "a": "(28−2)/2 + 1 = 14 → 14×14×16. Depth unchanged."
   },
   {
    "id": "cnn-flat",
    "name": "Flatten + dense output",
    "note": "Flatten reshapes the final W×H×D tensor into a length W·H·D vector (no parameters), then dense layers map to the output. Dense layers often dominate the total parameter count.",
    "formulas": [
     "flatten size = W · H · D",
     "dense params = (in + 1) · out"
    ],
    "traps": [
     "Flatten has NO parameters.",
     "Check whether the dense layer dwarfs the conv layers in parameter count — professors love this."
    ],
    "q": "7×7×64 flattened into a 128-unit dense layer. Parameters in that dense layer?",
    "a": "Flatten = 3136. Dense = (3136+1)·128 = 401 536 — far more than typical conv layers."
   }
  ]
 },
 {
  "name": "RNN",
  "color": "#c9a3d6",
  "kids": [
   {
    "id": "rnn-seq",
    "name": "Sequence data & text preprocessing",
    "note": "Sequences (text, time series) are processed one step at a time. Text pipeline: tokenise → build vocabulary → map tokens to integers → pad/truncate to fixed length → one-hot or embedding. With one-hot x(t), the product Ux(t) selects a column of U — an H-dimensional embedding of the token.",
    "formulas": [],
    "traps": [
     "Padding makes lengths equal for batching; the model itself is length-invariant through parameter sharing.",
     "Ux(t) with one-hot input = embedding lookup."
    ],
    "q": "Why does the hidden dimension H not depend on sequence length T?",
    "a": "The same recurrence h(t)=f(h(t−1),x(t);w) is applied at every step with shared weights; T only controls how many times it is applied."
   },
   {
    "id": "rnn-simple",
    "name": "Simple RNN",
    "note": "One hidden state h(t) carries a lossy summary of the past. Shared weights: W (hidden→hidden), U (input→hidden), V (hidden→output at final time T, many-to-one).",
    "formulas": [
     "h(t) = tanh( W h(t−1) + U x(t) )",
     "o(T) = g( V h(T) )"
    ],
    "traps": [
     "Use PREVIOUS hidden state h(t−1), not h(t).",
     "Same W, U at every time step — never a different W per step.",
     "Order matters: reversing the sequence changes h(T)."
    ],
    "q": "Scalar RNN: W=0.5, U=1, h(0)=0, inputs x=(1, −1). Compute h(1), h(2) with tanh.",
    "a": "h(1)=tanh(0.5·0+1·1)=tanh(1)=0.7616. h(2)=tanh(0.5·0.7616 −1)=tanh(−0.6192)=−0.5506."
   },
   {
    "id": "rnn-bptt",
    "name": "BPTT & gradient problems",
    "note": "Backpropagation through time unfolds the network across steps. Gradients involve repeated products of recurrent Jacobians ≈ powers of W: norms < 1 → vanishing gradients (long-range dependencies unlearnable); norms > 1 → exploding gradients (fix with gradient clipping).",
    "formulas": [
     "long-range dependence ≈ Wᵗ"
    ],
    "traps": [
     "Vanishing → distant time points stop influencing updates.",
     "Exploding → clip gradients; vanishing → gate the recurrence (LSTM/GRU)."
    ],
    "q": "Explain why a simple RNN struggles with dependencies 100 steps back.",
    "a": "BPTT multiplies ~100 recurrent Jacobians; if their norms are below 1 the gradient decays exponentially (vanishing), so early inputs barely affect the loss gradient — the dependency cannot be learned."
   },
   {
    "id": "rnn-bi",
    "name": "Bidirectional RNN",
    "note": "Two recurrences run over the sequence — forward and backward — and their hidden states are combined, so each position sees both past and future context. Only usable when the full sequence is available (not streaming).",
    "formulas": [],
    "traps": [
     "Doubles the recurrent parameters; unusable for real-time prediction."
    ],
    "q": "When is a bidirectional RNN inappropriate despite better accuracy offline?",
    "a": "Online/streaming prediction: the backward pass needs future inputs that have not arrived yet."
   },
   {
    "id": "rnn-lstm",
    "name": "LSTM",
    "note": "Adds a cell state c(t) — a long-term memory path — controlled by three gates. Forget gate: how much old memory to keep. Input gate: how much new candidate memory to write. Output gate: how much cell state to expose as h(t). The additive cell update helps gradients flow, alleviating (not eliminating) vanishing gradients.",
    "formulas": [
     "ft = σ(Wf xt + Uf ht−1 + bf)\nit = σ(Wi xt + Ui ht−1 + bi)\nc̃t = tanh(Wc xt + Uc ht−1 + bc)\not = σ(Wo xt + Uo ht−1 + bo)\nct = ft ⊙ ct−1 + it ⊙ c̃t\nht = ot ⊙ tanh(ct)"
    ],
    "traps": [
     "Cell state c(t) ≠ hidden state h(t).",
     "Gates use SIGMOID (0–1 amounts); candidate memory uses tanh.",
     "LSTM alleviates vanishing gradients; exploding gradients can still occur.",
     "4 weight blocks → about 4× the parameters of a simple RNN layer."
    ],
    "q": "Which gate controls how much of c(t−1) survives into c(t), and what activation does it use?",
    "a": "The forget gate ft = σ(Wf xt + Uf ht−1 + bf); sigmoid, so each component of the old cell is scaled by a value in (0,1)."
   },
   {
    "id": "rnn-gru",
    "name": "GRU",
    "note": "Simplification of the LSTM: no separate cell state, two gates. Reset gate rt controls how much of h(t−1) enters the candidate; update gate zt balances old state vs candidate. Fewer parameters than LSTM, often faster; relative performance is task-dependent.",
    "formulas": [
     "zt = σ(Wz xt + Uz ht−1 + bz)\nrt = σ(Wr xt + Ur ht−1 + br)\nh̃t = tanh(Wh xt + Uh(rt ⊙ ht−1) + bh)\nht = (1 − zt) ⊙ ht−1 + zt ⊙ h̃t"
    ],
    "traps": [
     "The reset gate acts INSIDE the candidate: Uh(rt ⊙ ht−1).",
     "(1−zt) multiplies the OLD state; zt multiplies the candidate (note convention here follows the course notes).",
     "GRU has no cell state and fewer parameters than LSTM."
    ],
    "q": "In the GRU update ht = (1−zt)⊙ht−1 + zt⊙h̃t, what does zt → 0 mean?",
    "a": "The unit copies its previous state almost unchanged (memory kept, new candidate ignored)."
   }
  ]
 },
 {
  "name": "Keras / R code",
  "color": "var(--dim)",
  "kids": [
   {
    "id": "keras-read",
    "name": "Reading keras3 R code",
    "note": "For any architecture snippet, extract in order: task type (from output units + activation + loss), input shape, each layer's units/filters/kernel/activation, optimiser + learning rate, batch size & epochs, callbacks (early stopping), regularisation. Then compute parameter counts and batches per epoch = ceil(N/batch_size).",
    "formulas": [
     "dense: (in+1)·out    conv: (k·k·Din+1)·Dout"
    ],
    "traps": [
     "layer_dense(units=1, activation='sigmoid') + loss='binary_crossentropy' → binary classification.",
     "units=K + softmax + categorical_crossentropy → K-class.",
     "validation_split reserves a fraction of TRAINING data; it is not the test set."
    ],
    "q": "A model ends in layer_dense(units = 1) with no activation and loss = 'mse'. Task type?",
    "a": "Regression: single linear (identity) output trained with squared error."
   }
  ]
 }
];

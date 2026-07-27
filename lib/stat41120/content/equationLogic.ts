import type { EquationLogicContent } from './types';

export const EQUATION_LOGIC: Record<string, EquationLogicContent> = {
  'forward-prop': {
    id: 'forward-prop',
    formulaId: 'Forward propagation',
    title: 'Forward propagation: z and h',
    equationType: 'definition',
    mainLatex: '\\begin{aligned} z^{(g)} &= W^{(g)} h^{(g-1)} + b^{(g)} \\\\ h^{(g)} &= f\\!\\left(z^{(g)}\\right) \\end{aligned}',
    sourceDescription: 'At each layer g, the network first computes a weighted sum (z), then applies a nonlinear activation (h).',

    terms: [
      { term: 'W^{(g)}', name: 'Weight matrix', meaning: 'Learned parameters mixing the inputs', role: 'Scales each input before summing' },
      { term: 'h^{(g-1)}', name: 'Previous layer output', meaning: 'Activations from the layer before', role: 'Input to this layer' },
      { term: 'b^{(g)}', name: 'Bias', meaning: 'Learned offset added to every pre-activation', role: 'Shifts the activation curve' },
      { term: 'z^{(g)}', name: 'Pre-activation', meaning: 'Linear combination before nonlinearity', role: 'Input to the activation function' },
      { term: 'f', name: 'Activation function', meaning: 'Nonlinear function (ReLU, tanh, sigmoid, etc.)', role: 'Introduces nonlinearity' },
    ],

    visualIntuition: {
      title: 'One neuron at layer g',
      svgOrHtml: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <g id="inputs">
          <circle cx="30" cy="40" r="8" fill="var(--sky)"/>
          <circle cx="30" cy="100" r="8" fill="var(--sky)"/>
          <text x="20" y="145" font-size="12" fill="var(--dim)">h^(g-1)</text>
        </g>
        <g id="weights">
          <line x1="40" y1="40" x2="160" y2="80" stroke="var(--amber)" stroke-width="2"/>
          <line x1="40" y1="100" x2="160" y2="120" stroke="var(--amber)" stroke-width="2"/>
          <text x="90" y="55" font-size="10" fill="var(--amber)">W</text>
          <text x="90" y="115" font-size="10" fill="var(--amber)">W</text>
        </g>
        <g id="sum">
          <circle cx="180" cy="100" r="20" fill="none" stroke="var(--moss)" stroke-width="2"/>
          <text x="170" y="107" font-size="16" fill="var(--moss)">+</text>
          <text x="210" y="95" font-size="10" fill="var(--moss)">+b</text>
        </g>
        <g id="z-label">
          <rect x="165" y="125" width="30" height="20" fill="var(--panel)" stroke="var(--line)"/>
          <text x="170" y="140" font-size="11" font-weight="600">z</text>
        </g>
        <g id="activation">
          <path d="M 250 60 Q 280 100 300 120" stroke="var(--coral)" stroke-width="2" fill="none"/>
          <text x="260" y="45" font-size="11" fill="var(--coral)">f (ReLU, tanh...)</text>
        </g>
        <g id="output">
          <circle cx="320" cy="100" r="12" fill="var(--amber)"/>
          <text x="335" y="105" font-size="11" font-weight="600">h</text>
        </g>
      </svg>`,
      numericExample: {
        inputs: { 'h_dim': 2, 'W': 1, 'b': 0.5 },
        outputs: { 'z': 1.5, 'h': 1.5 },
        explanation: 'With ReLU: z = 1×2 + (-1)×1 + 0.5 = 1.5, so h = ReLU(1.5) = 1.5.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Linear combination',
        fromLatex: 'h^{(g-1)} \\text{ (input to layer g)}',
        toLatex: 'z^{(g)} = W^{(g)} h^{(g-1)} + b^{(g)}',
        explanation: 'Weights W scale the inputs; bias b shifts the result.',
        whyValid: 'This is how neurons compute a weighted sum — standard neural network design.',
        examPhrase: 'Compute the pre-activation z',
        hiddenSteps: [
          'z = w_1 h_1 + w_2 h_2 + ... + w_n h_n + b (matrix form: W·h + b)',
        ],
      },
      {
        stepNum: 2,
        title: 'Apply activation',
        fromLatex: 'z^{(g)}',
        toLatex: 'h^{(g)} = f\\!\\left(z^{(g)}\\right)',
        explanation: 'The activation function introduces nonlinearity, allowing the network to learn complex patterns.',
        whyValid: 'Without activation, stacking layers is just matrix multiplication (still linear). Nonlinearity is essential.',
        examPhrase: 'Apply the activation function',
        hiddenSteps: [
          'f is often ReLU: f(z) = max(0, z)',
          'Or tanh: f(z) = (e^z - e^-z) / (e^z + e^-z)',
          'Or sigmoid: f(z) = 1 / (1 + e^-z)',
        ],
      },
    ],

    examTemplate: {
      statement: 'Given W, h, b, and the activation function f, compute h for the next layer.',
      template: 'z = W·h + b; h = f(z)',
      markingCriteria: [
        'Correctly computes z = W·h + b (weighted sum)',
        'Correctly applies activation f to z',
        'Final answer h is the output of f(z)',
      ],
    },

    traps: [
      'Forgetting the bias b — it shifts the pre-activation and is crucial for learning.',
      'Computing h = W·h + b without applying the activation (skipping nonlinearity).',
      'Applying activation to each term separately, not to the sum (wrong: f(W)·h + f(b)).',
    ],

    recallChecks: [
      {
        prompt: 'What is z in neural networks?',
        answer: 'Pre-activation (weighted sum before applying the activation function)',
        keywords: [['pre-activation', 'pre activation', 'weighted sum'], ['before', 'prior', 'input to']],
      },
      {
        prompt: 'Why is an activation function essential?',
        answer: 'Without it, stacking layers remains linear. Nonlinearity lets the network learn complex patterns.',
        keywords: [['nonlinear', 'nonlinearity'], ['complex'], ['linear'], ['patterns']],
      },
    ],

    relatedDrillIds: [],
  },

  'bce': {
    id: 'bce',
    formulaId: 'BCE',
    title: 'Binary cross-entropy (BCE) loss',
    equationType: 'definition',
    mainLatex: '\\ell = -y \\log(o) - (1-y)\\log(1-o)',
    sourceDescription: 'BCE measures how far the predicted probability o is from the true label y ∈ {0, 1}. It punishes confident wrong predictions strongly.',

    terms: [
      { term: 'y', name: 'True label', meaning: 'Ground truth: 1 (positive class) or 0 (negative class)', role: 'Selects which term to punish' },
      { term: 'o', name: 'Predicted probability', meaning: 'Model output after sigmoid, in (0, 1)', role: 'The prediction we evaluate' },
      { term: '\\log(o)', name: 'Log probability', meaning: 'Natural logarithm of the predicted probability', role: 'Grows large (negative) when o is small' },
      { term: '-y \\log(o)', name: 'Loss for y=1', meaning: 'Only active when true label is 1', role: 'Penalizes predicting < 1 when truth is 1' },
      { term: '-(1-y)\\log(1-o)', name: 'Loss for y=0', meaning: 'Only active when true label is 0', role: 'Penalizes predicting > 0 when truth is 0' },
    ],

    visualIntuition: {
      title: 'How BCE splits into two branches',
      svgOrHtml: `<svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
        <text x="20" y="30" font-size="14" font-weight="600">y = 1 (true class)</text>
        <path d="M 100 50 L 150 100 L 140 150" stroke="var(--sky)" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
        <text x="110" y="120" font-size="11" fill="var(--sky)">loss = -log(o)</text>
        <circle cx="150" cy="150" r="40" fill="none" stroke="var(--moss)" stroke-width="2"/>
        <text x="130" y="160" font-size="12" font-weight="600">BCE</text>

        <text x="240" y="30" font-size="14" font-weight="600">y = 0 (false)</text>
        <path d="M 300 50 L 250 100 L 260 150" stroke="var(--coral)" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>
        <text x="240" y="120" font-size="11" fill="var(--coral)">loss = -log(1-o)</text>

        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <polygon points="0,0 10,5 0,10" fill="var(--dim)"/>
          </marker>
        </defs>
      </svg>`,
      numericExample: {
        inputs: { 'y': 1, 'o': 0.8 },
        outputs: { 'loss': 0.223, 'result': 0.223 },
        explanation: 'If y=1 and o=0.8: loss = -log(0.8) ≈ 0.223. Correct prediction with high confidence has low loss.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Start with the two-class problem',
        fromLatex: '\\text{True label: } y \\in \\{0, 1\\}',
        toLatex: '\\text{We need loss for both y=0 and y=1 cases}',
        explanation: 'Binary classification has two outcomes; BCE handles both with a single formula.',
        whyValid: 'Using one formula instead of an if-else makes learning smooth and differentiable.',
        examPhrase: 'Set up the loss for both classes',
      },
      {
        stepNum: 2,
        title: 'Loss for y=1',
        fromLatex: 'y = 1',
        toLatex: '\\ell_1 = -\\log(o)',
        explanation: 'When truth is 1, we want o close to 1. The term -log(o) grows very large (negative) if o is small.',
        whyValid: 'log is monotonic: log(0.99) ≈ −0.01, log(0.5) ≈ −0.69. Large error → large loss.',
        examPhrase: 'When y=1, the loss is -log(o)',
      },
      {
        stepNum: 3,
        title: 'Loss for y=0',
        fromLatex: 'y = 0',
        toLatex: '\\ell_0 = -\\log(1-o)',
        explanation: 'When truth is 0, we want o close to 0 (so 1-o close to 1). The term -log(1-o) punishes large o.',
        whyValid: 'If o=0.9 when truth is 0: -log(1-0.9)=-log(0.1)≈2.3 (high penalty).',
        examPhrase: 'When y=0, the loss is -log(1-o)',
      },
      {
        stepNum: 4,
        title: 'Combine into one formula',
        fromLatex: '\\ell_1 = -\\log(o), \\quad \\ell_0 = -\\log(1-o)',
        toLatex: '\\ell = y \\cdot (-\\log(o)) + (1-y) \\cdot (-\\log(1-o))',
        explanation: 'Use y as a switch: when y=1, only -log(o) survives (middle term is 0); when y=0, only -log(1-o) survives.',
        whyValid: 'y·ℓ₁ + (1−y)·ℓ₀ automatically selects the right term.',
        examPhrase: 'Rewrite as: ℓ = -y log(o) - (1-y) log(1-o)',
      },
    ],

    examTemplate: {
      statement: 'A model predicts o=0.7 for a positive example (y=1). Compute the BCE loss.',
      template: 'ℓ = -1·log(0.7) - 0·log(0.3) = -log(0.7) ≈ 0.357',
      markingCriteria: [
        'Identifies that y=1 means only the first term survives',
        'Correctly computes -log(0.7)',
        'Final answer is approximately 0.357',
      ],
    },

    traps: [
      'Forgetting the negative sign: log(0.7) > 0, but loss must be positive → need the minus.',
      'Using both terms when y=1: the second term should be 0, not -log(1-o).',
      'Confusing log (natural logarithm) with log₁₀ (base-10) — use natural log.',
    ],

    recallChecks: [
      {
        prompt: 'For y=1, which term remains in BCE?',
        answer: '-log(o)',
        keywords: [['log', 'logarithm'], ['o']],
      },
      {
        prompt: 'Why does BCE punish confident wrong predictions?',
        answer: 'Because log(p) grows very negative when p is small, so -log(p) is large.',
        keywords: [['log', 'logarithm'], ['small', 'negative'], ['large']],
      },
    ],

    relatedDrillIds: [],
  },

  'softmax': {
    id: 'softmax',
    formulaId: 'Softmax',
    title: 'Softmax: from logits to probabilities',
    equationType: 'definition',
    mainLatex: 'o_k = \\frac{\\exp(z_k)}{\\sum_{s=1}^{K}\\exp(z_s)}',
    sourceDescription: 'Softmax converts raw neural network outputs (logits z) into a probability distribution over K classes.',

    terms: [
      { term: 'z_k', name: 'Logit for class k', meaning: 'Raw output of the network for class k', role: 'Input to softmax' },
      { term: '\\exp(z_k)', name: 'Exponential', meaning: 'e raised to the power z_k', role: 'Makes all terms positive' },
      { term: '\\sum_{s=1}^{K}\\exp(z_s)', name: 'Partition function', meaning: 'Sum of all exponentials', role: 'Normalizes to a probability' },
      { term: 'o_k', name: 'Class probability', meaning: 'Probability assigned to class k', role: 'Output in (0, 1)' },
    ],

    visualIntuition: {
      title: 'Softmax flow: logits → exponentials → probabilities',
      svgOrHtml: `<svg viewBox="0 0 500 120" xmlns="http://www.w3.org/2000/svg">
        <g id="stage1">
          <text x="20" y="30" font-size="12" font-weight="600">Logits</text>
          <circle cx="40" cy="50" r="12" fill="var(--sky)"/>
          <text x="35" y="56" font-size="10">z₁</text>
          <circle cx="40" cy="85" r="12" fill="var(--sky)"/>
          <text x="35" y="91" font-size="10">z₂</text>
        </g>
        <path d="M 60 60 L 100 60" stroke="var(--line)" stroke-width="1" marker-end="url(#arrowhead)"/>
        <g id="stage2">
          <text x="105" y="30" font-size="12" font-weight="600">Exponentials</text>
          <circle cx="125" cy="50" r="16" fill="var(--amber)"/>
          <text x="115" y="56" font-size="9">e^z₁</text>
          <circle cx="125" cy="85" r="18" fill="var(--amber)"/>
          <text x="115" y="92" font-size="9">e^z₂</text>
        </g>
        <path d="M 145 60 L 190 60" stroke="var(--line)" stroke-width="1" marker-end="url(#arrowhead)"/>
        <g id="stage3">
          <text x="195" y="30" font-size="12" font-weight="600">Probabilities</text>
          <circle cx="225" cy="50" r="16" fill="var(--moss)"/>
          <text x="213" y="56" font-size="9">o₁</text>
          <circle cx="225" cy="85" r="16" fill="var(--moss)"/>
          <text x="213" y="91" font-size="9">o₂</text>
          <text x="250" y="70" font-size="10" fill="var(--dim)">(sum to 1)</text>
        </g>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <polygon points="0,0 10,5 0,10" fill="var(--dim)"/>
          </marker>
        </defs>
      </svg>`,
      numericExample: {
        inputs: { 'z1': 1, 'z2': 0, 'exp_z1': 2.718, 'exp_z2': 1 },
        outputs: { 'total': 3.718, 'o1': 0.731, 'o2': 0.269 },
        explanation: 'With z=(1,0): e^z=(2.718,1), sum=3.718, o=(0.731,0.269). Probabilities sum to 1.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Make all logits positive',
        fromLatex: 'z = (z_1, ..., z_K) \\in \\mathbb{R}^K',
        toLatex: '\\exp(z) = (e^{z_1}, ..., e^{z_K})',
        explanation: 'Exponential is always positive, so all terms become strictly positive.',
        whyValid: 'exp is monotonic and maps ℝ → (0,∞). A logit of 100 becomes e^100 (huge); a logit of -100 becomes e^-100 (tiny).',
        examPhrase: 'Compute e^z for each class',
      },
      {
        stepNum: 2,
        title: 'Normalize to sum to 1',
        fromLatex: '\\exp(z) = (e^{z_1}, ..., e^{z_K})',
        toLatex: 'o_k = \\frac{e^{z_k}}{\\sum_s e^{z_s}}',
        explanation: 'Dividing each exponential by the total sum forces all o_k to sum to 1, making them a valid probability distribution.',
        whyValid: '∑_s o_s = (∑_s e^z_s) / (∑_s e^z_s) = 1. Probability rule satisfied.',
        examPhrase: 'Divide e^z_k by the sum of all exponentials',
        hiddenSteps: [
          'Total = e^z₁ + e^z₂ + ... + e^z_K',
          'o_k = e^z_k / Total',
        ],
      },
    ],

    examTemplate: {
      statement: 'Given logits z=(2, 1, 0) for 3 classes, compute softmax probabilities.',
      template: 'e^z = (e², e, 1) ≈ (7.39, 2.72, 1); total ≈ 11.11; o ≈ (0.665, 0.245, 0.090)',
      markingCriteria: [
        'Correctly computes exponentials of each logit',
        'Sums all exponentials correctly',
        'Divides each exponential by the sum',
        'Probabilities sum to 1 (or very close)',
      ],
    },

    traps: [
      'Forgetting the exponential: just normalizing z to sum to 1 loses the softness (ties in z give equal probability).',
      'Computing e^(∑z) instead of ∑(e^z) — these are very different due to exponential nonlinearity.',
      'Forgetting to verify the probabilities sum to 1 as a sanity check.',
    ],

    recallChecks: [
      {
        prompt: 'Why do we use exponentials in softmax?',
        answer: 'To make all logits positive, so we can divide by a sum and create probabilities.',
        keywords: [['positive'], ['divide', 'normalize'], ['probability']],
      },
      {
        prompt: 'What should the softmax probabilities sum to?',
        answer: '1 (exactly, or very close numerically)',
        keywords: [['1', 'one']],
      },
    ],

    relatedDrillIds: [],
  },

  'cross-entropy': {
    id: 'cross-entropy',
    formulaId: 'Cross-entropy',
    title: 'Cross-entropy (multiclass) loss',
    equationType: 'definition',
    mainLatex: '\\ell = -\\sum_{k=1}^{K} y_k \\log(o_k)',
    sourceDescription: 'The multiclass generalisation of BCE. With a one-hot target y, cross-entropy measures how much probability mass the model assigned to the true class.',

    terms: [
      { term: 'y_k', name: 'One-hot target component', meaning: '1 for the true class, 0 for every other class', role: 'Selects which term survives the sum' },
      { term: 'o_k', name: 'Predicted probability for class k', meaning: 'Softmax output — probability the model assigns to class k', role: 'What we are evaluating' },
      { term: '\\log(o_k)', name: 'Log probability', meaning: 'Grows very negative as o_k → 0', role: 'Source of the penalty' },
      { term: '\\sum_{k=1}^{K}', name: 'Sum over classes', meaning: 'Adds up the contribution from every class', role: 'Collapses the vector into one scalar loss' },
    ],

    visualIntuition: {
      title: 'One-hot target kills every term except the true class',
      svgOrHtml: `<svg viewBox="0 0 420 150" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="20" font-size="12" fill="var(--dim)">y = (0, 1, 0)</text>
        <g>
          <rect x="20" y="40" width="50" height="60" fill="none" stroke="var(--faint)" stroke-width="1.5"/>
          <text x="35" y="75" font-size="11" fill="var(--faint)">y₁=0</text>
          <rect x="90" y="40" width="50" height="60" fill="#3a3320" stroke="var(--amber)" stroke-width="2"/>
          <text x="103" y="75" font-size="11" fill="var(--amber)" font-weight="700">y₂=1</text>
          <rect x="160" y="40" width="50" height="60" fill="none" stroke="var(--faint)" stroke-width="1.5"/>
          <text x="175" y="75" font-size="11" fill="var(--faint)">y₃=0</text>
        </g>
        <text x="20" y="118" font-size="10" fill="var(--faint)">0 · log(o₁) = 0</text>
        <text x="90" y="118" font-size="10" fill="var(--amber)" font-weight="700">−1 · log(o₂) survives</text>
        <text x="160" y="118" font-size="10" fill="var(--faint)">0 · log(o₃) = 0</text>
        <text x="20" y="140" font-size="11" fill="var(--ink)">ℓ = −log(o₂)  — only the true-class probability matters</text>
      </svg>`,
      numericExample: {
        inputs: { 'y2_true_class_prob': 0.5 },
        outputs: { 'loss': 0.693 },
        explanation: 'If the model assigns 0.5 probability to the true class: ℓ = −log(0.5) = 0.693 nats.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Start from the general multiclass penalty',
        fromLatex: '\\text{penalise low probability on the TRUE class only}',
        toLatex: '\\ell = -\\sum_{k=1}^{K} y_k \\log(o_k)',
        explanation: 'We want a single number that is small when the model is confident and correct, large when it is confident and wrong.',
        whyValid: 'This is the natural multiclass extension of BCE — BCE is exactly this formula with K=2.',
        examPhrase: 'Write the general cross-entropy sum',
      },
      {
        stepNum: 2,
        title: 'Apply the one-hot target',
        fromLatex: 'y = (0, ..., 1, ..., 0) \\text{ — 1 at the true class } k^*',
        toLatex: '\\ell = -y_{k^*}\\log(o_{k^*}) = -\\log(o_{k^*})',
        explanation: 'Every term with y_k=0 vanishes. Only the true class k* contributes.',
        whyValid: 'Multiplying by 0 removes a term entirely; multiplying by 1 leaves it unchanged.',
        examPhrase: 'Only the true-class term survives — all others multiply by zero',
      },
    ],

    examTemplate: {
      statement: 'Given softmax output o=(0.7, 0.2, 0.1) and one-hot target y=(0,1,0), compute the cross-entropy loss.',
      template: 'ℓ = −log(o₂) = −log(0.2) ≈ 1.609',
      markingCriteria: [
        'Identifies that only the true-class term (index 2) survives',
        'Correctly computes −log(0.2)',
        'States the numeric answer ≈ 1.609',
      ],
    },

    traps: [
      'Summing over all classes as if every y_k mattered — only the true-class term is non-zero.',
      'Forgetting the negative sign — log of a probability in (0,1) is negative, loss must be positive.',
      'Confusing cross-entropy (uses true one-hot y) with entropy (uses the model\'s own distribution twice).',
    ],

    recallChecks: [
      {
        prompt: 'For y=(0,1,0), which term remains in the cross-entropy sum?',
        answer: '−y₂ log(o₂) = −log(o₂), the true-class term',
        keywords: [['log'], ['o2', 'o₂', 'true', 'class']],
      },
      {
        prompt: 'Why do the other terms vanish?',
        answer: 'Because their y_k = 0, and anything multiplied by 0 is 0.',
        keywords: [['0', 'zero'], ['multipl']],
      },
    ],

    relatedDrillIds: [],
  },

  'softmax-ce-derivative': {
    id: 'softmax-ce-derivative',
    formulaId: 'Softmax + CE derivative',
    title: 'Softmax + cross-entropy derivative',
    equationType: 'chain-rule',
    mainLatex: '\\frac{\\partial \\ell}{\\partial z_k} = o_k - y_k',
    sourceDescription: 'This deceptively simple result hides a real chain-rule derivation: z_k affects EVERY output o_j through the softmax denominator, not just o_k. We must sum over all j.',

    terms: [
      { term: 'z_k', name: 'Logit k', meaning: 'The pre-softmax score for class k', role: 'What we differentiate with respect to' },
      { term: '\\partial o_j / \\partial z_k', name: 'Softmax Jacobian entry', meaning: 'How much o_j changes when z_k changes', role: 'Local derivative — different for j=k vs j≠k' },
      { term: 'o_j(\\mathbf{1}_{j=k}-o_k)', name: 'Jacobian formula', meaning: 'Combines the "self" term and the "coupling through the denominator" term', role: 'The core identity that makes the derivation work' },
      { term: '\\sum_j y_j = 1', name: 'One-hot constraint', meaning: 'The target vector always sums to exactly 1', role: 'The algebraic trick that collapses the sum' },
      { term: 'o_k - y_k', name: 'Final gradient', meaning: 'Prediction minus target', role: 'Remarkably simple final result of a genuinely coupled derivative' },
    ],

    visualIntuition: {
      title: 'z_k does NOT only affect o_k — it affects every output through the shared denominator',
      svgOrHtml: `<svg viewBox="0 0 420 170" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="85" r="16" fill="var(--amber)"/>
        <text x="30" y="90" font-size="11" font-weight="700">z_k</text>
        <circle cx="220" cy="30" r="14" fill="var(--sky)"/><text x="212" y="35" font-size="10">o₁</text>
        <circle cx="220" cy="85" r="16" fill="var(--moss)"/><text x="208" y="90" font-size="10" font-weight="700">o_k</text>
        <circle cx="220" cy="140" r="14" fill="var(--sky)"/><text x="212" y="145" font-size="10">o₃</text>
        <path d="M 56 80 C 130 40 170 32 206 30" stroke="var(--coral)" stroke-width="1.6" fill="none" marker-end="url(#a2)"/>
        <path d="M 56 85 L 204 85" stroke="var(--moss)" stroke-width="2" fill="none" marker-end="url(#a2)"/>
        <path d="M 56 90 C 130 130 170 138 206 140" stroke="var(--coral)" stroke-width="1.6" fill="none" marker-end="url(#a2)"/>
        <text x="90" y="20" font-size="9" fill="var(--coral)">via shared denominator Σₛ exp(zₛ)</text>
        <circle cx="340" cy="85" r="18" fill="none" stroke="var(--dim)" stroke-width="2"/>
        <text x="328" y="90" font-size="11">ℓ</text>
        <path d="M 234 30 C 280 40 300 60 324 78" stroke="var(--dim)" stroke-width="1.3" fill="none" marker-end="url(#a2)"/>
        <path d="M 236 85 L 320 85" stroke="var(--dim)" stroke-width="1.3" fill="none" marker-end="url(#a2)"/>
        <path d="M 234 140 C 280 130 300 110 324 92" stroke="var(--dim)" stroke-width="1.3" fill="none" marker-end="url(#a2)"/>
        <defs><marker id="a2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0,0 8,4 0,8" fill="var(--dim)"/></marker></defs>
      </svg>`,
      numericExample: {
        inputs: { 'o_k': 0.2, 'y_k': 1 },
        outputs: { 'gradient': -0.8 },
        explanation: 'o=(0.7,0.2,0.1), y=(0,1,0): ∂ℓ/∂z₂ = o₂ − y₂ = 0.2 − 1 = −0.8. The negative sign pushes z₂ UP (increase confidence in the true class).',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Write the loss as a function of every o_j',
        fromLatex: '\\ell = -\\sum_{k} y_k \\log(o_k)',
        toLatex: '\\ell = -\\sum_{j} y_j \\log(o_j)',
        explanation: 'Relabel the summation index to j so it does not clash with the k we differentiate against.',
        whyValid: 'Pure notation — the sum still runs over all classes.',
        examPhrase: 'Rewrite the loss with dummy index j',
      },
      {
        stepNum: 2,
        title: 'Recall the softmax Jacobian',
        fromLatex: 'o_j = \\frac{e^{z_j}}{\\sum_s e^{z_s}}',
        toLatex: '\\frac{\\partial o_j}{\\partial z_k} = o_j\\left(\\mathbf{1}_{j=k} - o_k\\right)',
        explanation: 'Because every o_j shares the SAME denominator ∑ₛ e^zₛ, changing z_k changes that denominator and therefore changes every o_j, not just o_k.',
        whyValid: 'Quotient rule on o_j = e^{z_j}/∑e^{z_s}: if j=k, the numerator also depends on z_k (extra +o_j term); if j≠k, only the denominator depends on z_k.',
        examPhrase: 'State the softmax Jacobian: ∂o_j/∂z_k = o_j(𝟙_{j=k} − o_k)',
        hiddenSteps: [
          'Case j=k: ∂o_k/∂z_k = o_k(1-o_k) — self term',
          'Case j≠k: ∂o_j/∂z_k = -o_j o_k — coupling term through the shared denominator',
          'Both cases are captured by o_j(𝟙_{j=k} − o_k)',
        ],
      },
      {
        stepNum: 3,
        title: 'Apply the chain rule, summing over ALL j',
        fromLatex: '\\frac{\\partial \\ell}{\\partial z_k} = -\\sum_j y_j \\frac{\\partial \\log(o_j)}{\\partial z_k}',
        toLatex: '\\frac{\\partial \\ell}{\\partial z_k} = -\\sum_j \\frac{y_j}{o_j}\\,o_j(\\mathbf{1}_{j=k}-o_k)',
        explanation: 'Because z_k influences every o_j (step 2), the chain rule must sum the contribution through EVERY j — not just j=k.',
        whyValid: 'Multivariable chain rule: dℓ/dz_k = ∑_j (∂ℓ/∂o_j)(∂o_j/∂z_k). ∂ℓ/∂o_j = −y_j/o_j from differentiating −y_j log(o_j).',
        examPhrase: 'Sum over j because z_k affects every output through the denominator',
      },
      {
        stepNum: 4,
        title: 'Cancel o_j and simplify',
        fromLatex: '-\\sum_j \\frac{y_j}{o_j}\\,o_j(\\mathbf{1}_{j=k}-o_k)',
        toLatex: '-\\sum_j y_j(\\mathbf{1}_{j=k}-o_k) = -y_k + o_k\\sum_j y_j',
        explanation: 'The o_j in the numerator and denominator cancel, leaving y_j(𝟙_{j=k} − o_k). Split the sum: the 𝟙_{j=k} term picks out only y_k; the −o_k term factors out since it does not depend on j.',
        whyValid: 'Algebraic simplification + the definition of the indicator function 𝟙_{j=k}.',
        examPhrase: 'Cancel o_j, split the sum using the indicator function',
        hiddenSteps: [
          '∑_j y_j·𝟙_{j=k} = y_k (only the j=k term survives)',
          '∑_j y_j·(−o_k) = −o_k ∑_j y_j (o_k does not depend on j, factor it out)',
        ],
      },
      {
        stepNum: 5,
        title: 'Use the one-hot constraint ∑y_j = 1',
        fromLatex: '-y_k + o_k\\sum_j y_j',
        toLatex: '\\frac{\\partial \\ell}{\\partial z_k} = -y_k + o_k \\cdot 1 = o_k - y_k',
        explanation: 'Since y is a one-hot (or any valid probability) vector, ∑_j y_j = 1 exactly. Substituting gives the clean final result.',
        whyValid: 'This is THE key simplification — without it, the o_k·∑y_j term would not collapse to just o_k.',
        examPhrase: 'Use ∑ⱼ yⱼ = 1 to get the final answer: o_k − y_k',
      },
    ],

    examTemplate: {
      statement: 'Softmax outputs o=(0.7, 0.2, 0.1); one-hot target y=(0,1,0). Give ∂ℓ/∂z₂, and briefly justify why you do not need to differentiate softmax separately for each class.',
      template: '∂ℓ/∂z₂ = o₂ − y₂ = 0.2 − 1 = −0.8. (This holds because z₂ affects every o_j through the shared denominator; summing the chain rule over j and using ∑y_j=1 collapses to o_k − y_k.)',
      markingCriteria: [
        'States that the identity holds ONLY for combined softmax+CE (not softmax alone)',
        'Mentions that z_k affects all outputs, not just o_k, via the shared denominator',
        'Correctly computes o_k − y_k numerically',
      ],
    },

    traps: [
      'Treating o_k − y_k as "obvious" without being able to justify WHY — this loses derivation marks even if the numeric answer is right.',
      'Forgetting that this identity is for the COMBINED softmax+CE loss — softmax alone has a much messier Jacobian.',
      'Not summing over j in the chain rule — z_k affects every output, so skipping the sum silently drops the coupling terms.',
    ],

    recallChecks: [
      {
        prompt: 'Why must we sum over j when computing ∂ℓ/∂z_k for softmax+CE?',
        answer: 'Because z_k affects every output o_j (through the shared denominator ∑exp(z_s)), not just o_k, so the chain rule needs a contribution from every j.',
        keywords: [['every', 'all', 'each'], ['denominator', 'shared', 'normali'], ['chain rule', 'sum']],
      },
      {
        prompt: 'What identity about y makes the final simplification to o_k − y_k work?',
        answer: '∑_j y_j = 1 (the one-hot / probability vector sums to 1).',
        keywords: [['sum', '∑'], ['1', 'one'], ['y']],
      },
    ],

    relatedDrillIds: ['d-sm1'],
  },

  'backprop-delta': {
    id: 'backprop-delta',
    formulaId: 'Hidden-layer delta',
    title: 'Backpropagation: hidden-layer error δ',
    equationType: 'chain-rule',
    mainLatex: '\\delta^{(g)} = \\left(\\left(W^{(g+1)}\\right)^\\top \\delta^{(g+1)}\\right) \\odot f\'\\!\\left(z^{(g)}\\right)',
    sourceDescription: 'Once the output-layer error δ^(G) = o − y is known, this recursion propagates the error BACKWARD, layer by layer, using the chain rule.',

    terms: [
      { term: '\\delta^{(g)}', name: 'Error signal at layer g', meaning: '∂ℓ/∂z^(g) — how much the loss changes per unit change in the pre-activation', role: 'What we are computing at this layer' },
      { term: '\\delta^{(g+1)}', name: 'Error signal one layer downstream', meaning: 'Already computed (we work backward from the output)', role: 'Carries the error from later in the network' },
      { term: 'W^{(g+1)}', name: 'DOWNSTREAM weight matrix', meaning: 'The weights connecting layer g to layer g+1', role: 'Routes the downstream error back to each hidden unit — NOT the current-layer weight' },
      { term: '\\left(W^{(g+1)}\\right)^\\top', name: 'Transposed downstream weights', meaning: 'Reverses the direction of the forward-pass matrix multiply', role: 'Sends error backward along the same connections used forward' },
      { term: 'f\'(z^{(g)})', name: 'Local activation derivative', meaning: 'ReLU\' = 1 if z>0 else 0; sigmoid\'=o(1-o); tanh\'=1-tanh²', role: 'Gates how much error passes through this neuron' },
      { term: '\\odot', name: 'Elementwise (Hadamard) product', meaning: 'Multiply corresponding entries, not matrix multiply', role: 'Combines the routed error with the local gate, per-unit' },
    ],

    visualIntuition: {
      title: 'Error flows BACKWARD through the DOWNSTREAM weight — the classic trap is using the wrong weight',
      svgOrHtml: `<svg viewBox="0 0 420 160" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="18" font-size="11" fill="var(--dim)">layer g (hidden)</text>
        <circle cx="60" cy="90" r="16" fill="var(--panel2)" stroke="var(--amber)" stroke-width="2"/>
        <text x="50" y="95" font-size="10">δ^(g)</text>
        <text x="230" y="18" font-size="11" fill="var(--dim)">layer g+1</text>
        <circle cx="260" cy="60" r="14" fill="var(--panel2)" stroke="var(--moss)" stroke-width="2"/>
        <text x="248" y="65" font-size="9">δ^(g+1)</text>
        <circle cx="260" cy="120" r="14" fill="var(--panel2)" stroke="var(--moss)" stroke-width="2"/>
        <text x="248" y="125" font-size="9">δ^(g+1)</text>
        <path d="M 246 62 L 78 86" stroke="var(--coral)" stroke-width="2.4" fill="none" marker-end="url(#a3)"/>
        <path d="M 246 118 L 78 94" stroke="var(--coral)" stroke-width="2.4" fill="none" marker-end="url(#a3)"/>
        <text x="130" y="55" font-size="10" fill="var(--coral)" font-weight="700">flows via W^(g+1)ᵀ — DOWNSTREAM weight</text>
        <rect x="30" y="115" width="60" height="24" fill="#18242a" stroke="var(--sky)" rx="4"/>
        <text x="36" y="131" font-size="9" fill="var(--sky)">× f'(z^(g))</text>
        <defs><marker id="a3" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto"><polygon points="0,0 9,4.5 0,9" fill="var(--coral)"/></marker></defs>
      </svg>`,
      numericExample: {
        inputs: { 'w_next': 0.5, 'delta_next': -0.2, 'relu_gate': 1 },
        outputs: { 'delta_g': -0.1 },
        explanation: 'δ^(g) = w_next × δ_next × f\'(z) = 0.5 × (−0.2) × 1 = −0.1 (using the DOWNSTREAM weight w_next, not any current-layer weight).',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Start from the known downstream error',
        fromLatex: '\\delta^{(g+1)} = \\frac{\\partial \\ell}{\\partial z^{(g+1)}} \\quad \\text{(already computed)}',
        toLatex: '\\text{We want } \\delta^{(g)} = \\frac{\\partial \\ell}{\\partial z^{(g)}}',
        explanation: 'Backprop works backward: we already have the error one layer ahead and want to push it one layer back.',
        whyValid: 'This is the definition of the backward pass — start at the output where δ^(G)=o−y is known directly.',
        examPhrase: 'State that δ^(g+1) is already known from the previous backward step',
      },
      {
        stepNum: 2,
        title: 'z^(g+1) depends on h^(g), which depends on z^(g)',
        fromLatex: 'z^{(g+1)} = W^{(g+1)} h^{(g)} + b^{(g+1)}, \\quad h^{(g)} = f(z^{(g)})',
        toLatex: '\\frac{\\partial z^{(g+1)}}{\\partial h^{(g)}} = W^{(g+1)}, \\quad \\frac{\\partial h^{(g)}}{\\partial z^{(g)}} = f\'(z^{(g)})',
        explanation: 'This is exactly the forward-pass equation for layer g+1, read in reverse to see the dependency chain.',
        whyValid: 'z^(g+1) is a linear function of h^(g), so its derivative w.r.t. h^(g) is simply the weight matrix W^(g+1).',
        examPhrase: 'Identify the two links in the chain: W^(g+1) and f\'(z^(g))',
      },
      {
        stepNum: 3,
        title: 'Apply the chain rule through the full path',
        fromLatex: '\\delta^{(g)} = \\frac{\\partial \\ell}{\\partial z^{(g)}} = \\frac{\\partial \\ell}{\\partial z^{(g+1)}} \\cdot \\frac{\\partial z^{(g+1)}}{\\partial h^{(g)}} \\cdot \\frac{\\partial h^{(g)}}{\\partial z^{(g)}}',
        toLatex: '\\delta^{(g)} = \\left(\\left(W^{(g+1)}\\right)^\\top \\delta^{(g+1)}\\right) \\odot f\'(z^{(g)})',
        explanation: 'The transpose appears because we are going backward: forward, W maps h^(g)→z^(g+1); backward, we need Wᵀ to map an error at z^(g+1) back to a per-unit error at h^(g).',
        whyValid: 'Standard result: for z=Wh, the vector-Jacobian product ∂ℓ/∂h = Wᵀ(∂ℓ/∂z). The elementwise ⊙f\'(z^(g)) then converts the h-error into a z-error.',
        examPhrase: 'Write the transpose of the DOWNSTREAM weight matrix, times δ^(g+1), elementwise-multiplied by f\'(z^(g))',
      },
    ],

    examTemplate: {
      statement: 'A hidden unit at layer g feeds forward into a unit at layer g+1 with weight w_next=0.5. The downstream error is δ^(g+1)=−0.2 and the hidden unit uses ReLU with z>0. Compute δ^(g).',
      template: 'δ^(g) = w_next × δ^(g+1) × f\'(z^(g)) = 0.5 × (−0.2) × 1 = −0.1 (using the DOWNSTREAM weight, and ReLU\'(z)=1 since z>0).',
      markingCriteria: [
        'Uses the DOWNSTREAM weight W^(g+1), not any weight belonging to layer g itself',
        'Correctly applies f\'(z^(g)) — states which activation derivative rule was used',
        'Numeric answer −0.1',
      ],
    },

    traps: [
      'PERSONAL MISTAKE TO FIX: using the CURRENT layer\'s weight instead of the DOWNSTREAM weight W^(g+1). The error flows back through the weights that carried it FORWARD into the next layer.',
      'Forgetting the elementwise ⊙ and instead doing a matrix multiply with f\'(z) — f\'(z) acts per-unit, not as a matrix.',
      'Using the wrong activation derivative — ReLU\'(z) = 1 if z>0 else 0, NOT the value of h itself.',
    ],

    recallChecks: [
      {
        prompt: 'Which weight is used to compute a hidden-layer gradient: the current layer\'s weight, or the downstream weight?',
        answer: 'The downstream weight W^(g+1) — the one connecting this layer to the NEXT layer.',
        keywords: [['downstream', 'next', 'forward'], ['weight']],
      },
      {
        prompt: 'Why does the transpose of W^(g+1) appear in the backward formula?',
        answer: 'Forward, W maps hidden activations to the next layer\'s pre-activation; backward, we need the transpose to route the error signal back to each hidden unit.',
        keywords: [['transpose', 'reverse', 'backward'], ['forward', 'map']],
      },
    ],

    relatedDrillIds: ['d-grad2', 'd-bp-free'],
  },

  'weight-gradient': {
    id: 'weight-gradient',
    formulaId: 'Weight gradient',
    title: 'Gradient for a single weight',
    equationType: 'chain-rule',
    mainLatex: '\\frac{\\partial \\ell}{\\partial W^{(g)}} = \\delta^{(g)}\\left(h^{(g-1)}\\right)^\\top',
    sourceDescription: 'Once δ^(g) (the error at layer g) is known, the gradient for the weight connecting any edge is simply "delta times the activation entering that edge".',

    terms: [
      { term: '\\delta^{(g)}', name: 'Error at the RECEIVING neuron', meaning: 'How much the loss changes per unit change in this neuron\'s pre-activation', role: 'The "blame" assigned to the neuron that this weight feeds into' },
      { term: 'h^{(g-1)}', name: 'Activation entering the edge', meaning: 'The output of the previous layer — what actually flows across this specific weight', role: 'The "signal strength" carried by this weight' },
      { term: '\\left(h^{(g-1)}\\right)^\\top', name: 'Transposed activation vector', meaning: 'Makes the outer product δ·hᵀ produce a matrix matching W\'s shape', role: 'Ensures dimensions line up for every weight in the matrix at once' },
    ],

    visualIntuition: {
      title: 'gradient = delta (at the receiving end) × input (entering the edge)',
      svgOrHtml: `<svg viewBox="0 0 380 130" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="65" r="16" fill="var(--panel2)" stroke="var(--sky)" stroke-width="2"/>
        <text x="35" y="70" font-size="10" fill="var(--sky)">h^(g-1)</text>
        <path d="M 66 65 L 290 65" stroke="var(--amber)" stroke-width="3" marker-end="url(#a4)"/>
        <text x="150" y="55" font-size="12" fill="var(--amber)" font-weight="700">W (this edge)</text>
        <circle cx="310" cy="65" r="16" fill="var(--panel2)" stroke="var(--coral)" stroke-width="2"/>
        <text x="298" y="70" font-size="10" fill="var(--coral)">δ^(g)</text>
        <text x="60" y="110" font-size="12" fill="var(--ink)">∂ℓ/∂W = δ^(g) · h^(g-1)</text>
        <defs><marker id="a4" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto"><polygon points="0,0 10,5 0,10" fill="var(--amber)"/></marker></defs>
      </svg>`,
      numericExample: {
        inputs: { 'delta': -0.1, 'h_prev': 0.5 },
        outputs: { 'gradient': -0.05 },
        explanation: '∂ℓ/∂W = δ × h = −0.1 × 0.5 = −0.05. Small activation entering the edge means a small gradient, even with sizable error.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Start from z = Wh + b',
        fromLatex: 'z^{(g)} = W^{(g)} h^{(g-1)} + b^{(g)}',
        toLatex: '\\frac{\\partial z^{(g)}}{\\partial W^{(g)}} = h^{(g-1)}',
        explanation: 'z is linear in W, so differentiating the linear map with respect to the weight leaves exactly the activation it was multiplying.',
        whyValid: 'For z = Wx, ∂z/∂W = x (standard matrix-calculus identity for a linear layer).',
        examPhrase: 'Differentiate z with respect to W: get h^(g-1)',
      },
      {
        stepNum: 2,
        title: 'Chain rule with the already-known δ',
        fromLatex: '\\frac{\\partial \\ell}{\\partial W^{(g)}} = \\frac{\\partial \\ell}{\\partial z^{(g)}} \\cdot \\frac{\\partial z^{(g)}}{\\partial W^{(g)}} = \\delta^{(g)} \\cdot h^{(g-1)}',
        toLatex: '\\frac{\\partial \\ell}{\\partial W^{(g)}} = \\delta^{(g)}\\left(h^{(g-1)}\\right)^\\top',
        explanation: 'δ^(g) is already known from backprop. Multiply it by the activation entering the edge (transposed to make an outer product, giving one gradient value per weight entry).',
        whyValid: 'The chain rule combines the "downstream blame" δ with the "local sensitivity" h^(g-1) to give the full gradient.',
        examPhrase: 'Multiply δ^(g) by h^(g-1)ᵀ (outer product) to get the full weight-gradient matrix',
      },
    ],

    examTemplate: {
      statement: 'A binary-output network has o=0.9, y=1. The highlighted output weight receives hidden activation h=0.5. Compute ∇ℓ(w) for this weight.',
      template: 'δ = o − y = 0.9 − 1 = −0.1. ∇ℓ(w) = δ · h = −0.1 × 0.5 = −0.05.',
      markingCriteria: [
        'Correctly computes δ (output error, or uses given hidden-layer δ)',
        'Multiplies δ by the ACTIVATION ENTERING the specific edge, not some other neuron\'s activation',
        'Numeric answer −0.05',
      ],
    },

    traps: [
      'Using the activation LEAVING the weight (the receiving neuron\'s h) instead of the activation ENTERING it.',
      'Forgetting that for a specific single weight w_ij, the gradient is δ_i × h_j — i is the receiving index, j is the sending index.',
      'Mixing up which δ belongs to which layer when a network has multiple hidden layers.',
    ],

    recallChecks: [
      {
        prompt: 'Gradient for one weight edge = ?',
        answer: 'delta at the receiving neuron × activation entering that edge',
        keywords: [['delta', 'δ'], ['activation', 'input', 'entering']],
      },
    ],

    relatedDrillIds: ['d-grad1'],
  },

  'weight-decay': {
    id: 'weight-decay',
    formulaId: 'Weight decay (L2)',
    title: 'Weight decay (L2 regularisation)',
    equationType: 'penalty',
    mainLatex: '\\begin{aligned}\n\\ell_{\\text{pen}} &= \\ell + \\lambda\\frac{1}{2}\\lVert w\\rVert_2^2 \\\\\n\\nabla\\ell_{\\text{pen}} &= \\nabla\\ell + \\lambda w \\\\\nw_{\\text{new}} &= w - \\eta(\\nabla\\ell + \\lambda w)\n\\end{aligned}',
    sourceDescription: 'L2 regularisation adds a penalty proportional to the squared weight magnitude, discouraging large weights and reducing overfitting.',

    terms: [
      { term: '\\ell', name: 'Original (unpenalised) loss', meaning: 'The task loss — e.g. BCE or cross-entropy', role: 'What we are actually trying to minimise for accuracy' },
      { term: '\\lambda', name: 'Regularisation strength', meaning: 'A hyperparameter controlling how much the penalty matters', role: 'Larger λ → stronger pull toward zero' },
      { term: '\\frac{1}{2}\\lVert w\\rVert_2^2', name: 'L2 penalty term', meaning: 'Half the sum of squared weights', role: 'Grows quadratically with weight magnitude' },
      { term: '\\lambda w', name: 'Penalty\'s gradient contribution', meaning: 'The derivative of the penalty term with respect to w', role: 'Extra gradient that ADDS to the ordinary gradient — pulls w toward 0' },
      { term: '\\nabla\\ell_{\\text{pen}}', name: 'Total (penalised) gradient', meaning: 'Ordinary gradient PLUS the penalty gradient', role: 'What is actually used in the update step' },
    ],

    visualIntuition: {
      title: 'Two arrows combine: the task gradient and the shrinkage-toward-zero gradient',
      svgOrHtml: `<svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="100" x2="380" y2="100" stroke="var(--line)"/>
        <circle cx="200" cy="100" r="4" fill="var(--faint)"/>
        <text x="192" y="118" font-size="10" fill="var(--faint)">w=0</text>
        <circle cx="300" cy="100" r="6" fill="var(--ink)"/>
        <text x="292" y="80" font-size="10">current w</text>
        <path d="M 300 100 L 260 100" stroke="var(--sky)" stroke-width="2.5" marker-end="url(#a5)"/>
        <text x="230" y="90" font-size="9" fill="var(--sky)">∇ℓ (task gradient)</text>
        <path d="M 300 105 L 210 105" stroke="var(--coral)" stroke-width="2.5" marker-end="url(#a5)"/>
        <text x="240" y="125" font-size="9" fill="var(--coral)">λw (shrinkage, toward 0)</text>
        <defs><marker id="a5" markerWidth="9" markerHeight="9" refX="4.5" refY="4.5" orient="auto"><polygon points="0,0 9,4.5 0,9" fill="var(--dim)"/></marker></defs>
      </svg>`,
      numericExample: {
        inputs: { 'w': 0.6, 'grad_l': -0.2, 'lambda': 0.1, 'eta': 0.5 },
        outputs: { 'penalised_grad': -0.14, 'w_new': 0.67 },
        explanation: '∇ℓ_pen = −0.2 + 0.1×0.6 = −0.14. w_new = 0.6 − 0.5×(−0.14) = 0.67.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Add the penalty to the loss',
        fromLatex: '\\ell',
        toLatex: '\\ell_{\\text{pen}} = \\ell + \\lambda \\frac{1}{2}\\lVert w \\rVert_2^2',
        explanation: 'We want the optimiser to minimise BOTH the task loss and the weight magnitude.',
        whyValid: 'Adding a non-negative penalty term to the objective is the standard way to encode a soft constraint.',
        examPhrase: 'Define the penalised loss as ℓ + λ·½‖w‖²',
      },
      {
        stepNum: 2,
        title: 'Differentiate the penalty term',
        fromLatex: '\\frac{1}{2}\\lVert w \\rVert_2^2 = \\frac{1}{2}\\sum_j w_j^2',
        toLatex: '\\frac{\\partial}{\\partial w_j}\\left(\\frac{1}{2}w_j^2\\right) = w_j \\quad \\Rightarrow \\quad \\nabla\\left(\\frac{1}{2}\\lVert w \\rVert_2^2\\right) = w',
        explanation: 'Basic power-rule differentiation: d/dx(½x²) = x. The ½ was chosen specifically so the derivative comes out clean as just w (no factor of 2).',
        whyValid: 'd/dx(x²) = 2x, so d/dx(½x²) = x. This is exactly why the ½ is conventionally included in the penalty definition.',
        examPhrase: 'Differentiate ½‖w‖² to get w (the ½ cancels the 2 from the power rule)',
      },
      {
        stepNum: 3,
        title: 'ADD the penalty gradient — do not multiply',
        fromLatex: '\\nabla\\ell_{\\text{pen}} = \\nabla\\ell + \\lambda \\nabla\\left(\\frac{1}{2}\\lVert w\\rVert_2^2\\right)',
        toLatex: '\\nabla\\ell_{\\text{pen}} = \\nabla\\ell + \\lambda w',
        explanation: 'The gradient of a SUM is the SUM of gradients. λw is an extra additive term, not a scaling of ∇ℓ.',
        whyValid: 'Linearity of differentiation: d/dw(ℓ + λ·½w²) = dℓ/dw + λw.',
        examPhrase: 'ADD λw to the original gradient — never multiply λ by ∇ℓ',
      },
      {
        stepNum: 4,
        title: 'Plug into the gradient-descent update',
        fromLatex: 'w_{\\text{new}} = w - \\eta \\nabla\\ell_{\\text{pen}}',
        toLatex: 'w_{\\text{new}} = w - \\eta(\\nabla\\ell + \\lambda w)',
        explanation: 'The standard gradient descent step, but using the penalised gradient instead of the plain one.',
        whyValid: 'This is just substitution of the result from step 3 into the ordinary update rule.',
        examPhrase: 'Substitute the penalised gradient into w ← w − η∇ℓ_pen',
      },
    ],

    examTemplate: {
      statement: 'w=0.6, ∇ℓ=−0.2, λ=0.1, η=0.5. Perform one weight-decay update step.',
      template: '∇ℓ_pen = ∇ℓ + λw = −0.2 + 0.1×0.6 = −0.14. w_new = w − η·∇ℓ_pen = 0.6 − 0.5×(−0.14) = 0.67.',
      markingCriteria: [
        'ADDS λw to ∇ℓ (does not multiply λ by ∇ℓ)',
        'Correctly computes the penalised gradient −0.14',
        'Correctly applies the update rule to get w_new = 0.67',
      ],
    },

    traps: [
      'PERSONAL MISTAKE TO FIX: multiplying λ by the unpenalised gradient (λ·∇ℓ) instead of ADDING λw to it. The penalty term contributes its OWN separate gradient contribution.',
      'Forgetting the ½ in the penalty definition, which would double the gradient contribution to 2λw.',
      'Applying weight decay to biases — conventionally only weights (not biases) are regularised.',
    ],

    recallChecks: [
      {
        prompt: 'What term does L2 weight decay ADD to the gradient?',
        answer: 'λw — added to the ordinary gradient ∇ℓ, not multiplied with it.',
        keywords: [['λw', 'lambda w', 'lambda·w'], ['add', 'plus', '+']],
      },
      {
        prompt: 'Why does the penalty use ½‖w‖² instead of just ‖w‖²?',
        answer: 'So that differentiating gives exactly w (the ½ cancels the 2 from the power rule), keeping the gradient contribution clean as λw.',
        keywords: [['half', '½', '1/2'], ['derivative', 'differentiat'], ['cancel', 'clean']],
      },
    ],

    relatedDrillIds: ['d-wd1'],
  },

  'cnn-output-dim': {
    id: 'cnn-output-dim',
    formulaId: 'CNN output dims',
    title: 'CNN convolution output dimension',
    equationType: 'dimension',
    mainLatex: 'W_{\\text{out}} = \\left\\lfloor\\frac{W_{\\text{in}}-k+2p}{s}\\right\\rfloor + 1',
    sourceDescription: 'Counts how many valid positions a k×k kernel can occupy as it slides across a (possibly padded) input of width W_in with stride s.',

    terms: [
      { term: 'W_{\\text{in}}', name: 'Input width', meaning: 'The spatial width of the input feature map', role: 'Starting size before convolution' },
      { term: 'k', name: 'Kernel size', meaning: 'Width of the square filter', role: 'How much space the filter occupies at each position' },
      { term: '2p', name: 'Total padding added', meaning: 'p pixels of zero-padding on EACH side (left and right)', role: 'Expands the effective input width by 2p total' },
      { term: 's', name: 'Stride', meaning: 'How many pixels the kernel jumps between positions', role: 'Controls how densely the kernel samples the input' },
      { term: '\\lfloor \\cdot \\rfloor', name: 'Floor (round down)', meaning: 'Discards any incomplete final kernel position', role: 'Ensures we only count positions where the kernel fully fits' },
      { term: '+1', name: 'Count the first position', meaning: 'The kernel\'s starting position (index 0) is itself one valid placement', role: 'Off-by-one correction — without it we would undercount by exactly one' },
    ],

    visualIntuition: {
      title: 'Sliding a kernel: count valid placements along one dimension',
      svgOrHtml: `<svg viewBox="0 0 380 140" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="16" font-size="10" fill="var(--dim)">W_in = 5, k = 3, s = 1, p = 0</text>
        <g>
          ${[0,1,2,3,4].map(i => `<rect x="${20+i*30}" y="30" width="28" height="28" fill="none" stroke="var(--line)"/>`).join('')}
        </g>
        <g>
          <rect x="20" y="70" width="88" height="24" fill="#3a3320" stroke="var(--amber)" stroke-width="2"/>
          <text x="45" y="87" font-size="10" fill="var(--amber)">pos 1</text>
        </g>
        <g>
          <rect x="50" y="100" width="88" height="24" fill="none" stroke="var(--sky)" stroke-width="1.5" stroke-dasharray="3,2"/>
          <text x="75" y="117" font-size="10" fill="var(--sky)">pos 2</text>
        </g>
        <text x="20" y="135" font-size="11" fill="var(--ink)">3 valid positions → W_out = ⌊(5−3+0)/1⌋+1 = 3</text>
      </svg>`,
      numericExample: {
        inputs: { 'W_in': 32, 'k': 5, 'p': 0, 's': 1 },
        outputs: { 'W_out': 28 },
        explanation: '⌊(32−5+0)/1⌋+1 = ⌊27⌋+1 = 27+1 = 28.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Pad the input',
        fromLatex: 'W_{\\text{in}}',
        toLatex: 'W_{\\text{padded}} = W_{\\text{in}} + 2p',
        explanation: 'Padding adds p zero-pixels on each side, so the total width grows by 2p (p on the left, p on the right).',
        whyValid: 'This is the definition of symmetric padding — used to control output size or preserve edge information.',
        examPhrase: 'Add 2p to the input width for the padded size',
      },
      {
        stepNum: 2,
        title: 'Find the last valid starting position',
        fromLatex: 'W_{\\text{padded}} = W_{\\text{in}}+2p, \\quad \\text{kernel width } k',
        toLatex: '\\text{last start} = W_{\\text{padded}} - k',
        explanation: 'The kernel must fit entirely inside the padded input, so its starting position can range from 0 up to (padded width − k).',
        whyValid: 'If the kernel starts any later than (W_padded − k), part of it would fall outside the input.',
        examPhrase: 'The kernel\'s last valid start is at position (W_padded − k)',
      },
      {
        stepNum: 3,
        title: 'Count positions given the stride',
        fromLatex: '\\text{last start} = W_{\\text{in}}+2p-k',
        toLatex: '\\text{number of jumps} = \\left\\lfloor\\frac{W_{\\text{in}}-k+2p}{s}\\right\\rfloor',
        explanation: 'Dividing the total travel distance by the stride tells us how many stride-sized jumps fit; floor because a partial jump does not count.',
        whyValid: 'If the kernel moves in steps of size s, the number of complete steps it can take is the total distance divided by s, rounded down.',
        examPhrase: 'Divide by stride s and floor the result to count the number of jumps',
      },
      {
        stepNum: 4,
        title: 'Add 1 for the starting position itself',
        fromLatex: '\\text{number of jumps}',
        toLatex: 'W_{\\text{out}} = \\left\\lfloor\\frac{W_{\\text{in}}-k+2p}{s}\\right\\rfloor + 1',
        explanation: 'Jumps count TRANSITIONS between positions. The very first position (before any jump) is also valid, so we add 1.',
        whyValid: 'Classic fencepost / off-by-one reasoning: N jumps produce N+1 positions (think of fence POSTS vs fence SECTIONS).',
        examPhrase: 'Add +1 — the first placement counts even with zero jumps',
      },
    ],

    examTemplate: {
      statement: 'Input width 32, kernel size 5, padding 0, stride 1. Give the output width.',
      template: 'W_out = ⌊(32−5+2·0)/1⌋+1 = ⌊27⌋+1 = 28.',
      markingCriteria: [
        'Correctly substitutes into the formula (padding as 2p, not p)',
        'Applies the floor BEFORE adding 1 (not after)',
        'Numeric answer 28',
      ],
    },

    traps: [
      'Writing padding as +p instead of +2p — padding is added to BOTH sides.',
      'Adding 1 before flooring: ⌊x⌋+1 ≠ ⌊x+1⌋ in general — always floor first.',
      'Applying this formula to width only and forgetting height needs the identical (usually equal) calculation.',
    ],

    recallChecks: [
      {
        prompt: 'Why is there a +1 in the CNN output dimension formula?',
        answer: 'Because the first kernel position (before any stride jumps) is itself a valid placement — N jumps produce N+1 total positions.',
        keywords: [['first', 'start'], ['position', 'placement'], ['jump']],
      },
      {
        prompt: 'Why is padding written as 2p, not p, in the numerator?',
        answer: 'Padding is added symmetrically — p pixels on each side — so the total width grows by 2p.',
        keywords: [['both', 'each', 'two'], ['side']],
      },
    ],

    relatedDrillIds: ['d-cnn1', 'd-conv1'],
  },

  'cnn-params': {
    id: 'cnn-params',
    formulaId: 'CNN parameters',
    title: 'CNN convolution parameter count',
    equationType: 'dimension',
    mainLatex: '\\#\\text{params} = (k \\cdot k \\cdot D_{\\text{in}} + 1) \\times D_{\\text{out}}',
    sourceDescription: 'Counts the total trainable weights + biases in a convolutional layer, given the kernel size, input depth, and number of filters.',

    terms: [
      { term: 'k \\cdot k', name: 'Kernel spatial size', meaning: 'Width × height of one filter', role: 'How many spatial weight positions each filter has' },
      { term: 'D_{\\text{in}}', name: 'Input depth', meaning: 'Number of channels in the input (e.g. 3 for RGB)', role: 'Each filter must span the FULL input depth' },
      { term: 'k \\cdot k \\cdot D_{\\text{in}}', name: 'Weights in ONE filter', meaning: 'Total learnable weights inside a single 3D filter volume', role: 'The size of one filter\'s weight tensor' },
      { term: '+1', name: 'Bias per filter', meaning: 'Each filter has exactly one additional bias term', role: 'Added once per filter, not once per weight' },
      { term: 'D_{\\text{out}}', name: 'Number of filters (output depth)', meaning: 'How many independent filters this layer learns', role: 'Multiplies the per-filter parameter count' },
    ],

    visualIntuition: {
      title: 'Each filter spans the FULL input depth; D_out filters are independent copies',
      svgOrHtml: `<svg viewBox="0 0 380 150" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="16" font-size="10" fill="var(--dim)">one filter: k×k×D_in volume + 1 bias</text>
        <g transform="translate(20,30)">
          <rect x="0" y="0" width="40" height="40" fill="#2a3a3d" stroke="var(--sky)"/>
          <rect x="8" y="-8" width="40" height="40" fill="#233236" stroke="var(--sky)"/>
          <rect x="16" y="-16" width="40" height="40" fill="#1c2a2d" stroke="var(--sky)"/>
          <text x="0" y="60" font-size="9" fill="var(--sky)">k × k × D_in</text>
        </g>
        <text x="130" y="15" font-size="14" fill="var(--dim)">+1 bias</text>
        <circle cx="145" cy="30" r="8" fill="var(--amber)"/>
        <text x="180" y="30" font-size="12">→ one filter's params</text>
        <text x="10" y="110" font-size="10" fill="var(--dim)">repeat for D_out independent filters:</text>
        ${[0,1,2].map(i => `<rect x="${20+i*35}" y="120" width="26" height="26" fill="none" stroke="var(--moss)" stroke-width="1.5"/>`).join('')}
        <text x="130" y="137" font-size="11" fill="var(--moss)">× D_out</text>
      </svg>`,
      numericExample: {
        inputs: { 'k': 5, 'D_in': 3, 'D_out': 16 },
        outputs: { 'per_filter': 76, 'total': 1216 },
        explanation: 'One filter: 5×5×3+1 = 76. Total: 76 × 16 filters = 1216 parameters.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Count weights in ONE filter',
        fromLatex: '\\text{filter shape: } k \\times k \\times D_{\\text{in}}',
        toLatex: '\\text{weights per filter} = k \\cdot k \\cdot D_{\\text{in}}',
        explanation: 'A convolutional filter is a 3D volume — it must span the entire depth of the input, not just one channel.',
        whyValid: 'Convolution slides the filter spatially (width, height) but sums across ALL input channels at each position, so the filter needs a weight for every (row, col, channel) triple.',
        examPhrase: 'One filter has k×k×D_in weights — it spans the FULL input depth',
      },
      {
        stepNum: 2,
        title: 'Add the bias',
        fromLatex: 'k \\cdot k \\cdot D_{\\text{in}}',
        toLatex: '(k \\cdot k \\cdot D_{\\text{in}} + 1)',
        explanation: 'Each filter produces one output feature map, and that entire feature map shares ONE bias value.',
        whyValid: 'Bias is added after the convolution sum, once per output value, but the SAME bias is reused at every spatial position (weight sharing).',
        examPhrase: 'Add exactly +1 bias per filter (not per weight, not per output pixel)',
      },
      {
        stepNum: 3,
        title: 'Multiply by the number of filters',
        fromLatex: '(k \\cdot k \\cdot D_{\\text{in}} + 1)',
        toLatex: '\\#\\text{params} = (k \\cdot k \\cdot D_{\\text{in}} + 1) \\times D_{\\text{out}}',
        explanation: 'Each of the D_out filters is an independent, separately-learned set of weights, so their parameter counts simply add (equivalently, multiply since they are identical in size).',
        whyValid: 'D_out filters are not shared with each other — the layer learns D_out completely separate weight volumes.',
        examPhrase: 'Multiply by D_out — the number of independent filters',
      },
    ],

    examTemplate: {
      statement: 'A conv layer has 5×5 kernels, input depth 3, and 16 filters. Count the parameters.',
      template: '5×5×3+1 = 76 weights+bias per filter. 76 × 16 = 1216 total parameters.',
      markingCriteria: [
        'Filter volume correctly includes D_in (not just k×k)',
        '+1 bias applied per FILTER, not per weight',
        'Multiplies by D_out for the final total (1216)',
      ],
    },

    traps: [
      'Forgetting D_in in the filter volume — a filter is k×k×D_in, not just k×k.',
      'Adding +1 per WEIGHT instead of per FILTER — there is exactly one bias per filter, however large k×k×D_in is.',
      'Confusing D_in (this layer\'s input depth) with D_out (this layer\'s own output depth / filter count).',
    ],

    recallChecks: [
      {
        prompt: 'Why does the filter depth always equal D_in?',
        answer: 'Because convolution sums across the entire input depth at each spatial position — a filter must have a weight for every input channel to do that sum.',
        keywords: [['depth', 'channel'], ['sum', 'span', 'entire', 'full']],
      },
      {
        prompt: 'How many biases does one filter have, regardless of kernel size?',
        answer: 'Exactly 1 — one bias per filter, shared across every spatial position of its output feature map.',
        keywords: [['1', 'one']],
      },
    ],

    relatedDrillIds: ['d-cnn2'],
  },

  'pooling-dim': {
    id: 'pooling-dim',
    formulaId: 'Pooling',
    title: 'Pooling output dimension',
    equationType: 'dimension',
    mainLatex: 'W_{\\text{out}} = \\left\\lfloor\\frac{W_{\\text{in}}-k_{\\text{pool}}}{s}\\right\\rfloor + 1, \\qquad D_{\\text{out}}=D_{\\text{in}}',
    sourceDescription: 'Pooling slides a window across each feature map independently, exactly like convolution spatially — but with NO learnable weights and NO mixing across channels.',

    terms: [
      { term: 'k_{\\text{pool}}', name: 'Pooling window size', meaning: 'Width of the pooling window (e.g. 2×2)', role: 'Same role as kernel size k in convolution' },
      { term: 'D_{\\text{out}}=D_{\\text{in}}', name: 'Depth is UNCHANGED', meaning: 'Pooling never merges or creates channels', role: 'Distinguishes pooling from convolution, which can change depth via D_out filters' },
      { term: '\\text{no padding term}', name: 'No 2p in this formula', meaning: 'Pooling is typically applied without padding', role: 'Simpler than the convolution formula — same floor+1 logic, minus the +2p' },
    ],

    visualIntuition: {
      title: 'Pooling acts independently on EACH channel — depth never changes',
      svgOrHtml: `<svg viewBox="0 0 360 130" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="16" font-size="10" fill="var(--dim)">3 input channels → 3 output channels (same depth)</text>
        ${[0,1,2].map(i => `
          <g transform="translate(${20+i*110},30)">
            <rect x="0" y="0" width="80" height="80" fill="none" stroke="var(--line)"/>
            <rect x="10" y="10" width="30" height="30" fill="#3a3320" stroke="var(--amber)"/>
            <text x="12" y="50" font-size="9" fill="var(--amber)">max</text>
            <text x="20" y="100" font-size="9" fill="var(--dim)">channel ${i+1}</text>
          </g>`).join('')}
      </svg>`,
      numericExample: {
        inputs: { 'W_in': 28, 'k_pool': 2, 's': 2 },
        outputs: { 'W_out': 14 },
        explanation: '⌊(28−2)/2⌋+1 = ⌊13⌋+1 = 14. No padding term — pooling typically uses p=0.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Same sliding-window logic as convolution',
        fromLatex: 'W_{\\text{out}} = \\left\\lfloor\\frac{W_{\\text{in}}-k+2p}{s}\\right\\rfloor + 1 \\text{ (conv formula)}',
        toLatex: 'W_{\\text{out}} = \\left\\lfloor\\frac{W_{\\text{in}}-k_{\\text{pool}}}{s}\\right\\rfloor + 1 \\text{ (drop padding, rename k)}',
        explanation: 'Pooling counts valid window placements exactly like convolution — same fencepost +1 logic — just without a learnable filter and usually without padding.',
        whyValid: 'The geometry of "how many times can a window of size k_pool slide across width W_in with stride s" is identical to the convolution case.',
        examPhrase: 'Reuse the conv output-size formula, drop the padding term',
      },
      {
        stepNum: 2,
        title: 'Depth stays the same',
        fromLatex: 'D_{\\text{in}} \\text{ independent channels}',
        toLatex: 'D_{\\text{out}} = D_{\\text{in}}',
        explanation: 'Pooling processes each channel completely independently — there is no mixing across depth and no set of "filters" to change the channel count.',
        whyValid: 'Unlike convolution (which sums across D_in to produce D_out NEW channels), pooling has no weights at all — it just reduces each channel spatially.',
        examPhrase: 'State that pooling preserves depth exactly: D_out = D_in',
      },
    ],

    examTemplate: {
      statement: 'A 28×28×64 feature map is max-pooled with a 2×2 window and stride 2. Give the output shape.',
      template: 'W_out = ⌊(28−2)/2⌋+1 = 14. D_out = D_in = 64. Output shape: 14×14×64.',
      markingCriteria: [
        'Uses the pooling formula (no 2p term)',
        'States explicitly that depth is preserved (64 stays 64)',
        'States that pooling has ZERO trainable parameters',
      ],
    },

    traps: [
      'Applying the convolution formula\'s +2p term to pooling — pooling normally has no padding.',
      'Forgetting to state D_out = D_in explicitly — this is a common one-line exam trap.',
      'Believing pooling has parameters (it does not — max/average pooling are fixed, non-learned operations).',
    ],

    recallChecks: [
      {
        prompt: 'Does pooling change the depth of a feature map?',
        answer: 'No — D_out = D_in always. Pooling acts independently per channel and has no filters to create new channels.',
        keywords: [['no'], ['depth', 'channel'], ['same', 'unchanged', 'preserv']],
      },
    ],

    relatedDrillIds: ['d-cnn3'],
  },

  'flatten': {
    id: 'flatten',
    formulaId: 'Flatten',
    title: 'Flatten operation',
    equationType: 'dimension',
    mainLatex: '\\text{flatten size} = W \\times H \\times D',
    sourceDescription: 'Between the convolutional part and the dense (fully-connected) part of a CNN, the 3D feature map tensor is reshaped into a single 1D vector.',

    terms: [
      { term: 'W \\times H \\times D', name: 'Feature map volume', meaning: 'Width × height × depth of the final conv/pool output', role: 'Total number of scalar values to be reshaped' },
      { term: '\\text{flatten size}', name: 'Length of the output vector', meaning: 'Simply the count of all elements in the 3D tensor, laid out in 1D', role: 'The input dimension to the first dense layer' },
    ],

    visualIntuition: {
      title: 'Reshape, don\'t learn — flatten has zero trainable parameters',
      svgOrHtml: `<svg viewBox="0 0 360 120" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(20,20)">
          <rect x="0" y="0" width="50" height="50" fill="#2a3a3d" stroke="var(--sky)"/>
          <rect x="8" y="-8" width="50" height="50" fill="#233236" stroke="var(--sky)"/>
          <rect x="16" y="-16" width="50" height="50" fill="#1c2a2d" stroke="var(--sky)"/>
          <text x="0" y="70" font-size="10" fill="var(--sky)">W × H × D</text>
        </g>
        <path d="M 130 30 L 190 30" stroke="var(--dim)" stroke-width="2" marker-end="url(#a6)"/>
        <text x="135" y="20" font-size="9" fill="var(--dim)">reshape</text>
        <g transform="translate(210,15)">
          ${[0,1,2,3,4,5].map(i => `<rect x="0" y="${i*8}" width="60" height="6" fill="#3a3320" stroke="var(--amber)" stroke-width="0.5"/>`).join('')}
          <text x="0" y="70" font-size="10" fill="var(--amber)">1D vector (W·H·D long)</text>
        </g>
        <defs><marker id="a6" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0,0 8,4 0,8" fill="var(--dim)"/></marker></defs>
      </svg>`,
      numericExample: {
        inputs: { 'W': 7, 'H': 7, 'D': 64 },
        outputs: { 'flatten_size': 3136 },
        explanation: '7 × 7 × 64 = 3136. This becomes the INPUT SIZE for the next dense layer.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Count total elements in the 3D tensor',
        fromLatex: '\\text{tensor shape: } W \\times H \\times D',
        toLatex: '\\text{total elements} = W \\times H \\times D',
        explanation: 'A 3D tensor with these dimensions simply contains W×H×D individual numbers, regardless of their spatial arrangement.',
        whyValid: 'Basic counting — the volume of a rectangular box is the product of its three side lengths.',
        examPhrase: 'Multiply width × height × depth to get the flatten size',
      },
      {
        stepNum: 2,
        title: 'No parameters are learned',
        fromLatex: '\\text{flatten}: \\mathbb{R}^{W \\times H \\times D} \\to \\mathbb{R}^{WHD}',
        toLatex: '\\#\\text{params} = 0',
        explanation: 'Flattening only reshapes — no weights or biases are involved, so it contributes nothing to the parameter count.',
        whyValid: 'This is a pure reshape operation (like NumPy\'s .reshape() or .flatten()), not a learned transformation.',
        examPhrase: 'State explicitly: flatten has zero trainable parameters',
      },
    ],

    examTemplate: {
      statement: 'The final conv block outputs a 7×7×64 feature map. Compute the flatten size and the parameter count of a following dense layer with 128 units.',
      template: 'Flatten size = 7×7×64 = 3136. Dense layer params = (3136+1)×128 = 401,536.',
      markingCriteria: [
        'Correctly computes 7×7×64 = 3136',
        'States flatten itself has 0 parameters',
        'Correctly computes the FOLLOWING dense layer\'s parameter count using (input+1)×units',
      ],
    },

    traps: [
      'Believing flatten itself has trainable parameters — it does not, it is purely a reshape.',
      'Forgetting that the flatten size becomes the INPUT size to the next dense layer\'s parameter formula.',
      'Underestimating how large the following dense layer\'s parameter count can be — it often dominates the entire model\'s parameter budget.',
    ],

    recallChecks: [
      {
        prompt: 'How many trainable parameters does the flatten operation itself have?',
        answer: '0 — flatten is a pure reshape with no learned weights.',
        keywords: [['0', 'zero', 'none']],
      },
    ],

    relatedDrillIds: [],
  },

  'lstm-equations': {
    id: 'lstm-equations',
    formulaId: 'LSTM gates',
    title: 'LSTM cell equations',
    equationType: 'gate',
    mainLatex: '\\begin{aligned}\nf_t &= \\sigma(W_f x_t + U_f h_{t-1} + b_f) \\\\\ni_t &= \\sigma(W_i x_t + U_i h_{t-1} + b_i) \\\\\n\\tilde c_t &= \\tanh(W_c x_t + U_c h_{t-1} + b_c) \\\\\no_t &= \\sigma(W_o x_t + U_o h_{t-1} + b_o) \\\\\nc_t &= f_t \\odot c_{t-1} + i_t \\odot \\tilde c_t \\\\\nh_t &= o_t \\odot \\tanh(c_t)\n\\end{aligned}',
    sourceDescription: 'The LSTM was designed to fix the vanishing-gradient problem of simple RNNs by adding an explicit cell state c_t that flows through mostly ADDITIVE (rather than multiplicative) updates, plus gates that control what enters and leaves it.',

    terms: [
      { term: 'f_t', name: 'Forget gate', meaning: 'Sigmoid output in (0,1), one value per memory dimension', role: 'Decides how much of c_{t-1} to KEEP' },
      { term: 'i_t', name: 'Input gate', meaning: 'Sigmoid output in (0,1)', role: 'Decides how much of the new candidate c̃_t to WRITE' },
      { term: '\\tilde c_t', name: 'Candidate memory', meaning: 'tanh output in (−1,1) — proposed new content', role: 'What COULD be added to memory, before gating' },
      { term: 'o_t', name: 'Output gate', meaning: 'Sigmoid output in (0,1)', role: 'Decides how much of c_t to EXPOSE as h_t' },
      { term: 'c_t', name: 'Cell state', meaning: 'The internal long-term memory, updated additively', role: 'Persists across time steps, mostly protected from vanishing gradients' },
      { term: 'h_t', name: 'Hidden state', meaning: 'The externally visible, gated view of c_t', role: 'What gets passed to the next time step\'s gates and to the output layer' },
    ],

    visualIntuition: {
      title: 'Three sigmoid gates (valves) + one tanh candidate, combined additively on the cell-state highway',
      svgOrHtml: `<svg viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="16" font-size="10" fill="var(--dim)">cell state highway (mostly additive → gradients survive)</text>
        <line x1="20" y1="40" x2="380" y2="40" stroke="var(--moss)" stroke-width="4"/>
        <text x="10" y="55" font-size="10" fill="var(--moss)">c_{t-1}</text>
        <text x="360" y="55" font-size="10" fill="var(--moss)">c_t</text>
        <circle cx="130" cy="40" r="12" fill="var(--panel2)" stroke="var(--amber)" stroke-width="2"/>
        <text x="122" y="45" font-size="12">×</text>
        <text x="115" y="65" font-size="9" fill="var(--amber)">f_t (forget)</text>
        <circle cx="230" cy="40" r="12" fill="var(--panel2)" stroke="var(--sky)" stroke-width="2"/>
        <text x="222" y="45" font-size="12">+</text>
        <text x="200" y="65" font-size="9" fill="var(--sky)">i_t ⊙ c̃_t (write)</text>
        <rect x="290" y="90" width="60" height="24" fill="#18242a" stroke="var(--coral)" rx="4"/>
        <text x="296" y="106" font-size="9" fill="var(--coral)">o_t × tanh(c_t) = h_t</text>
      </svg>`,
      numericExample: {
        inputs: { 'f_t': 0.5, 'c_prev': 0.8, 'i_t': 0.7, 'c_tilde': 0.4, 'o_t': 0.9 },
        outputs: { 'c_t': 0.68, 'h_t': 0.532 },
        explanation: 'c_t = 0.5×0.8 + 0.7×0.4 = 0.68. h_t = 0.9×tanh(0.68) ≈ 0.9×0.591 ≈ 0.532.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Compute all three gates from the same inputs',
        fromLatex: 'x_t, \\; h_{t-1}',
        toLatex: 'f_t = \\sigma(W_f x_t{+}U_f h_{t-1}{+}b_f), \\; i_t = \\sigma(\\ldots), \\; o_t = \\sigma(\\ldots)',
        explanation: 'All three gates read the SAME two inputs (current input, previous hidden state) but through DIFFERENT weight matrices, so they learn different behaviours.',
        whyValid: 'Sigmoid squashes any real number into (0,1), which is exactly the range needed for a "how much" gating value.',
        examPhrase: 'All gates are sigmoid functions of x_t and h_{t-1}, with their OWN separate weights',
      },
      {
        stepNum: 2,
        title: 'Propose a candidate for new memory',
        fromLatex: 'x_t, \\; h_{t-1}',
        toLatex: '\\tilde c_t = \\tanh(W_c x_t + U_c h_{t-1} + b_c)',
        explanation: 'The candidate uses tanh (not sigmoid) because it represents actual CONTENT to be written, which can be positive or negative.',
        whyValid: 'tanh outputs (−1,1), suitable for representing signed memory content, whereas sigmoid (0,1) is only suitable for gating "how much".',
        examPhrase: 'The candidate uses tanh, not sigmoid, because it represents signed content',
      },
      {
        stepNum: 3,
        title: 'Update the cell state ADDITIVELY',
        fromLatex: 'c_{t-1}, \\; f_t, \\; i_t, \\; \\tilde c_t',
        toLatex: 'c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde c_t',
        explanation: 'Old memory is scaled (not replaced) by f_t, and new memory is scaled by i_t, then the two are ADDED.',
        whyValid: 'This additive combination is the KEY design choice: gradients flowing back through + are not repeatedly multiplied and shrunk, unlike the simple RNN\'s fully-multiplicative recurrence.',
        examPhrase: 'The cell update is additive: kept-old PLUS gated-new',
      },
      {
        stepNum: 4,
        title: 'Expose a gated view as the hidden state',
        fromLatex: 'c_t, \\; o_t',
        toLatex: 'h_t = o_t \\odot \\tanh(c_t)',
        explanation: 'c_t is squashed through tanh first (bounding it to (−1,1)), then the output gate decides how much of that to reveal externally.',
        whyValid: 'c_t itself is unbounded internal memory; h_t must be a bounded, externally-usable signal — hence the extra tanh + gate.',
        examPhrase: 'h_t = output gate times tanh of the cell state — c_t and h_t are DIFFERENT objects',
      },
    ],

    examTemplate: {
      statement: 'Write down the full set of LSTM equations and explain why the cell-state update alleviates vanishing gradients.',
      template: 'f_t=σ(...), i_t=σ(...), c̃_t=tanh(...), o_t=σ(...), c_t=f_t⊙c_{t-1}+i_t⊙c̃_t, h_t=o_t⊙tanh(c_t). The additive c_t update means gradients backpropagating through time are not repeatedly multiplied by weight matrices (as in a simple RNN); they largely pass through the + node with only elementwise gating, so they vanish far more slowly.',
      markingCriteria: [
        'All 6 equations written correctly with correct gate/candidate activations (sigmoid vs tanh)',
        'Explicitly distinguishes c_t (internal) from h_t (exposed)',
        'Explains the additive update as the mechanism that alleviates (not eliminates) vanishing gradients',
      ],
    },

    traps: [
      'c_t is NOT h_t — writing them as equal loses marks even if all 6 equations are otherwise correct.',
      'Using sigmoid for the candidate c̃_t or tanh for a gate — gates are always sigmoid, the candidate is always tanh.',
      'Claiming LSTM completely SOLVES vanishing gradients — it only ALLEVIATES the problem; exploding gradients remain possible.',
    ],

    recallChecks: [
      {
        prompt: 'Which gate controls how much of the OLD cell state survives?',
        answer: 'The forget gate f_t.',
        keywords: [['forget'], ['f_t', 'f t']],
      },
      {
        prompt: 'Why does the LSTM use an ADDITIVE cell-state update instead of a multiplicative one (like the simple RNN\'s recurrence)?',
        answer: 'Because gradients flowing backward through addition are not repeatedly shrunk by multiplication with weight matrices, so they survive much longer through time — alleviating vanishing gradients.',
        keywords: [['additive', 'add', 'sum'], ['gradient'], ['vanish', 'shrink', 'multipl']],
      },
    ],

    relatedDrillIds: ['d-lstm1', 'd-rnn1'],
  },

  'gru-equations': {
    id: 'gru-equations',
    formulaId: 'GRU gates',
    title: 'GRU cell equations',
    equationType: 'gate',
    mainLatex: '\\begin{aligned}\nz_t &= \\sigma(W_z x_t + U_z h_{t-1} + b_z) \\\\\nr_t &= \\sigma(W_r x_t + U_r h_{t-1} + b_r) \\\\\n\\tilde h_t &= \\tanh\\!\\left(W_h x_t + U_h(r_t\\odot h_{t-1}) + b_h\\right) \\\\\nh_t &= (1-z_t)\\odot h_{t-1} + z_t\\odot \\tilde h_t\n\\end{aligned}',
    sourceDescription: 'The GRU simplifies the LSTM by merging the forget and input gates into a single update gate, and dropping the separate cell state entirely — memory lives only in h_t.',

    terms: [
      { term: 'z_t', name: 'Update gate', meaning: 'Sigmoid in (0,1) — the single "old vs new" dial', role: 'Replaces the LSTM\'s forget+input gate PAIR with one gate' },
      { term: 'r_t', name: 'Reset gate', meaning: 'Sigmoid in (0,1)', role: 'Controls how much of h_{t-1} enters the CANDIDATE computation — acts INSIDE the tanh' },
      { term: 'r_t \\odot h_{t-1}', name: 'Reset-filtered past state', meaning: 'The previous state, scaled down by the reset gate, before being used to build the candidate', role: 'Lets the candidate "forget" the past when building something new' },
      { term: '\\tilde h_t', name: 'Candidate hidden state', meaning: 'tanh output — the proposed new state', role: 'What COULD replace h_{t-1}, before blending' },
      { term: '(1-z_t)', name: 'Old-state weight', meaning: 'The complement of the update gate', role: 'How much of h_{t-1} is KEPT in the final blend' },
    ],

    visualIntuition: {
      title: 'h_{t-1} splits three ways — no separate cell state, just one blended h_t',
      svgOrHtml: `<svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="18" font-size="10" fill="var(--dim)">h_{t-1} splits: old-path / reset-gated candidate-path / gate inputs</text>
        <circle cx="40" cy="70" r="14" fill="var(--panel2)" stroke="var(--sky)" stroke-width="2"/>
        <text x="28" y="75" font-size="9">h_{t-1}</text>
        <path d="M 54 65 L 260 40" stroke="var(--moss)" stroke-width="2" marker-end="url(#a7)"/>
        <text x="140" y="35" font-size="9" fill="var(--moss)">old path × (1−z_t)</text>
        <path d="M 54 75 L 150 100" stroke="var(--coral)" stroke-width="2" marker-end="url(#a7)"/>
        <text x="80" y="115" font-size="9" fill="var(--coral)">× r_t → candidate</text>
        <rect x="150" y="85" width="60" height="24" fill="#18242a" stroke="var(--coral)" rx="4"/>
        <text x="156" y="101" font-size="8" fill="var(--coral)">tanh → h̃_t</text>
        <circle cx="280" cy="55" r="14" fill="var(--panel2)" stroke="var(--amber)" stroke-width="2"/>
        <text x="272" y="60" font-size="12">+</text>
        <text x="300" y="55" font-size="10">h_t</text>
        <defs><marker id="a7" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><polygon points="0,0 8,4 0,8" fill="var(--dim)"/></marker></defs>
      </svg>`,
      numericExample: {
        inputs: { 'z_t': 0.3, 'h_prev': 0.5, 'h_tilde': 0.9 },
        outputs: { 'h_t': 0.62 },
        explanation: 'h_t = (1−0.3)×0.5 + 0.3×0.9 = 0.35 + 0.27 = 0.62.',
      },
    },

    derivationSteps: [
      {
        stepNum: 1,
        title: 'Compute the two gates',
        fromLatex: 'x_t, \\; h_{t-1}',
        toLatex: 'z_t = \\sigma(\\ldots), \\quad r_t = \\sigma(\\ldots)',
        explanation: 'Unlike LSTM\'s three gates, GRU needs only two: an update gate (old-vs-new) and a reset gate (how much past enters the candidate).',
        whyValid: 'GRU merges LSTM\'s forget+input roles into the single update gate z_t, reducing parameters while keeping the essential "how much to change" control.',
        examPhrase: 'Compute z_t (update) and r_t (reset), both sigmoid, both functions of x_t and h_{t-1}',
      },
      {
        stepNum: 2,
        title: 'Build the candidate using the RESET-filtered past state',
        fromLatex: 'r_t, \\; h_{t-1}, \\; x_t',
        toLatex: '\\tilde h_t = \\tanh\\!\\left(W_h x_t + U_h(r_t \\odot h_{t-1}) + b_h\\right)',
        explanation: 'Notice the reset gate multiplies h_{t-1} INSIDE the tanh, before it contributes to the candidate — this is different from how LSTM gates work (they gate AFTER computing quantities).',
        whyValid: 'When r_t≈0, the term r_t⊙h_{t-1}≈0, so the candidate is built almost entirely from the new input x_t — effectively "forgetting" the past for this candidate.',
        examPhrase: 'The reset gate sits INSIDE the candidate\'s tanh, scaling h_{t-1} before it is used',
      },
      {
        stepNum: 3,
        title: 'Blend old and new using the update gate',
        fromLatex: 'h_{t-1}, \\; \\tilde h_t, \\; z_t',
        toLatex: 'h_t = (1-z_t)\\odot h_{t-1} + z_t\\odot \\tilde h_t',
        explanation: 'This is a convex combination (weights sum to 1): z_t=0 keeps the old state entirely; z_t=1 replaces it entirely with the candidate.',
        whyValid: '(1-z_t) + z_t = 1 always, so h_t is always a weighted average between old and new — never overshoots either extreme.',
        examPhrase: 'h_t is a convex blend: (1−z_t) on the old state, z_t on the candidate',
      },
    ],

    examTemplate: {
      statement: 'Write down the full set of GRU equations, and explain the difference between the reset gate and the update gate.',
      template: 'z_t=σ(...), r_t=σ(...), h̃_t=tanh(W_h x_t + U_h(r_t⊙h_{t-1}) + b_h), h_t=(1−z_t)⊙h_{t-1}+z_t⊙h̃_t. The reset gate r_t controls how much of the past enters the CANDIDATE (acts inside the tanh); the update gate z_t controls the final old-vs-new BLEND of the actual state.',
      markingCriteria: [
        'All 4 equations correct, including the reset gate INSIDE the candidate\'s tanh term',
        'Clearly distinguishes reset gate (shapes the candidate) from update gate (blends old/new)',
        'States explicitly that GRU has NO separate cell state',
      ],
    },

    traps: [
      'Confusing which gate does what: the RESET gate shapes the candidate; the UPDATE gate blends old-vs-new — swapping these is the most common GRU mistake.',
      'Believing GRU has a cell state c_t like LSTM — it does not; h_t alone carries all memory.',
      'Writing h_t = z_t⊙h_{t-1} + (1-z_t)⊙h̃_t (weights swapped) — it is (1-z_t) on the OLD state and z_t on the CANDIDATE.',
    ],

    recallChecks: [
      {
        prompt: 'If z_t ≈ 0, what happens to h_t?',
        answer: 'h_t ≈ h_{t-1} — the old state is almost entirely kept (since (1−z_t)≈1 and z_t≈0).',
        keywords: [['old', 'previous', 'h_{t-1}', 'kept', 'keep']],
      },
      {
        prompt: 'Does the GRU have a separate cell state like the LSTM?',
        answer: 'No — the GRU has no cell state; h_t alone carries both the memory and the output.',
        keywords: [['no'], ['cell state', 'c_t']],
      },
      {
        prompt: 'Which gate acts INSIDE the candidate\'s tanh function?',
        answer: 'The reset gate r_t — it scales h_{t-1} before it contributes to the candidate h̃_t.',
        keywords: [['reset'], ['r_t', 'r t']],
      },
    ],

    relatedDrillIds: ['d-gru1', 'd-rnn1'],
  },
};

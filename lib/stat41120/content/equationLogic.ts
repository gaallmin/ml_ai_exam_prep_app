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
};

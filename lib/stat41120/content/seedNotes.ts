// The 6 initial 오답노트 entries from stat41120_sprint.html seedNotes(), verbatim.
// Inserted into Supabase once per user (app_state key 'seededWrongNotes').

export interface SeedNote {
  sourceId: string; topic: string; wk: string; wrong: string;
  rule: string; hook: string; trigger: string; src: string;
}

export const SEED_NOTES: SeedNote[] = [
  { sourceId: "seed-n1", topic: "Weight decay", wk: "Regularisation gap",
    wrong: "Multiplied λ by the unpenalised gradient instead of adding λw.",
    rule: "∇ℓpen = ∇ℓ + λw, then w ← w − η∇ℓpen.",
    hook: "ADD λw. Penalty enters as a term, not a factor.",
    trigger: "'An L2 regularization term is applied during training.'", src: "tutorial 2" },
  { sourceId: "seed-n2", topic: "Learning curves", wk: "Diagnosis gap",
    wrong: "Diagnosed overfitting but missed the dropout pattern.",
    rule: "Training loss > validation loss throughout → dropout likely.",
    hook: "train above val = thinned networks at work.",
    trigger: "Train curve sitting above the validation curve.", src: "tutorial" },
  { sourceId: "seed-n3", topic: "Forward propagation", wk: "Formula memory gap",
    wrong: "Arithmetic and ReLU application errors mid-calculation.",
    rule: "z first → activation second → next layer. Write every intermediate value.",
    hook: "Never apply ReLU before finishing the sum.",
    trigger: "'Perform a forward propagation calculation.'", src: "tutorial 1" },
  { sourceId: "seed-n4", topic: "Backpropagation", wk: "Derivation logic gap",
    wrong: "Used the current weight instead of the downstream weight in the hidden-layer gradient.",
    rule: "δ(g) = (W(g+1)ᵀ δ(g+1)) ⊙ f′(z(g)) — downstream weight + local activation derivative.",
    hook: "gradient flows BACK through the next layer's weights.",
    trigger: "Gradient for a hidden (non-output) weight.", src: "tutorial 1" },
  { sourceId: "seed-n5", topic: "Dropout", wk: "Concept gap",
    wrong: "Needs consolidation.",
    rule: "Dropout = implicit ensemble of thinned subnetworks; test time rescales instead of dropping.",
    hook: "train: drop. test: rescale.",
    trigger: "'Explain how dropout regularises.'", src: "lecture" },
  { sourceId: "seed-n6", topic: "Momentum", wk: "Optimisation gap",
    wrong: "Needs consolidation.",
    rule: "v ← αv − η∇ℓ; w ← w + v. Momentum remembers direction using velocity.",
    hook: "velocity = memory of direction, not a bigger step.",
    trigger: "'What does momentum change about SGD?'", src: "lecture" }
];

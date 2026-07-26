// Extracted verbatim from stat41120_sprint.html — do not paraphrase.
import type { CurvePattern } from './types';

export const CURVES: CurvePattern[] = [
 {
  "name": "Overfitting",
  "ev": "Training loss keeps decreasing; validation loss decreases then increases; gap widens with epochs.",
  "dx": "Overfitting: model fits training noise; generalisation degrades.",
  "fix": "Early stopping at validation minimum; add weight decay/dropout; more data or augmentation.",
  "tmpl": "Evidence: diverging train/val losses after epoch E. Diagnosis: overfitting. Fix: early stopping ≈ E or stronger regularisation.",
  "wrong": "'The model is underfitting because validation loss is high' — the DIRECTION of the gap matters, not the level alone.",
  "shape": "over"
 },
 {
  "name": "Underfitting",
  "ev": "Both train and validation losses plateau at a high level; small gap.",
  "dx": "Underfitting: model too simple or over-regularised to capture the signal.",
  "fix": "Increase capacity (width/depth), reduce λ, train longer, better features.",
  "tmpl": "Evidence: both losses high and flat, small gap. Diagnosis: underfitting. Fix: increase capacity or reduce regularisation.",
  "wrong": "Adding MORE regularisation — that worsens underfitting.",
  "shape": "under"
 },
 {
  "name": "Early-stopping point",
  "ev": "Validation loss reaches a clear minimum then rises while training loss still falls.",
  "dx": "The validation minimum marks the best generalisation epoch.",
  "fix": "Stop (or restore weights) at the validation minimum — early stopping acts as regularisation.",
  "tmpl": "Evidence: val minimum at epoch E then rising. Diagnosis: overfitting past E. Fix: early stopping at E.",
  "wrong": "Stopping at the TRAINING loss minimum — training loss has no minimum before the end.",
  "shape": "over"
 },
 {
  "name": "Dropout signature",
  "ev": "Training loss sits ABOVE validation loss throughout training.",
  "dx": "Dropout (or strong train-time noise): training loss is computed on thinned subnetworks, validation on the full network.",
  "fix": "Nothing is wrong — expected under dropout; consider reporting full-network training loss.",
  "tmpl": "Evidence: train loss > val loss at every epoch. Diagnosis: dropout active during training. Fix: expected behaviour.",
  "wrong": "'Data leakage' or 'the validation set is too easy' — check dropout first. (오답노트 entry)",
  "shape": "dropout"
 },
 {
  "name": "Noisy curves",
  "ev": "Both losses zigzag heavily epoch to epoch while trending downward.",
  "dx": "High-variance gradient estimates: small batch size (or high learning rate).",
  "fix": "Increase batch size or reduce learning rate; consider averaging/smoothing for reporting.",
  "tmpl": "Evidence: strongly oscillating losses. Diagnosis: stochastic gradient noise from small batches. Fix: larger batch or smaller η.",
  "wrong": "Calling noise 'overfitting' — noise is symmetric jitter, overfitting is a systematic gap.",
  "shape": "noisy"
 },
 {
  "name": "Learning rate too low",
  "ev": "Loss decreases very slowly and almost linearly; no plateau reached in the epoch budget.",
  "dx": "Step size too small: training underway but inefficient.",
  "fix": "Increase η (often ×10), or use momentum/Adam.",
  "tmpl": "Evidence: painfully slow, steady decrease. Diagnosis: η too low. Fix: increase η or use adaptive optimiser.",
  "wrong": "'Model too simple' — capacity is fine; the optimiser just moves too slowly.",
  "shape": "slow"
 },
 {
  "name": "Learning rate too high",
  "ev": "Loss oscillates wildly or diverges upward.",
  "dx": "Steps overshoot the minimum; updates unstable.",
  "fix": "Reduce η (often ÷10); learning-rate schedules; gradient clipping for RNNs.",
  "tmpl": "Evidence: oscillating/exploding loss. Diagnosis: η too high. Fix: reduce η.",
  "wrong": "Adding more epochs — divergence does not fix itself.",
  "shape": "diverge"
 },
 {
  "name": "Over-regularised",
  "ev": "Large λ: both losses high, training loss unusually high, tiny gap.",
  "dx": "Regularisation so strong the model underfits.",
  "fix": "Reduce λ or dropout rate.",
  "tmpl": "Evidence: high flat losses under large λ. Diagnosis: over-regularisation → underfitting. Fix: reduce λ.",
  "wrong": "Increasing model size while keeping the huge λ.",
  "shape": "under"
 },
 {
  "name": "Well-regularised",
  "ev": "Both losses decrease to a low plateau with a small, stable gap.",
  "dx": "Good bias–variance balance; regularisation about right.",
  "fix": "Nothing — possibly fine-tune around current λ.",
  "tmpl": "Evidence: low losses, small stable gap. Diagnosis: appropriate regularisation. Fix: none needed.",
  "wrong": "Chasing zero training loss — that invites overfitting.",
  "shape": "good"
 },
 {
  "name": "Widening gap",
  "ev": "Gap between train and validation loss grows steadily with epochs even if val loss has not turned upward yet.",
  "dx": "Early-stage overfitting: variance building up.",
  "fix": "Watch for the val minimum; prepare early stopping; consider regularisation.",
  "tmpl": "Evidence: monotonically widening gap. Diagnosis: increasing overfitting. Fix: regularise or stop early.",
  "wrong": "Ignoring the gap because val loss 'is still going down'.",
  "shape": "over"
 }
];

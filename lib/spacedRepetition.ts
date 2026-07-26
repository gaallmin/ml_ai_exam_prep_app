// Same schedule as the HTML app:
// new mistake → due in 20 minutes; repeated mistake → tomorrow;
// recalled once → tomorrow; recalled twice → mastered.
export const MIN20 = 20 * 60 * 1000;
export const DAY = 24 * 3600 * 1000;

export function nextDueAfterMistake(count: number, now = Date.now()): number {
  return now + (count > 1 ? DAY : MIN20);
}
export function nextDueAfterRecall(correctStreak: number, now = Date.now()): { due: number; mastered: boolean } {
  if (correctStreak >= 2) return { due: now, mastered: true };
  return { due: now + DAY, mastered: false };
}

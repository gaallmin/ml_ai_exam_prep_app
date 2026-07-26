'use client';
import { getSupabase } from '@/lib/supabase/client';
import type { Drill, Mark } from '@/lib/stat41120/content/types';

export async function insertDrillAttempt(
  userId: string, drill: Drill, mark: Mark, userAnswer: string
): Promise<void> {
  const { error } = await getSupabase().from('drill_attempts').insert({
    user_id: userId,
    drill_id: drill.id,
    topic: drill.topic,
    weakness_type: drill.wk,
    question: drill.q,
    user_answer: userAnswer,
    mark,
    model_answer: drill.sol ?? drill.model ?? null,
    rule: drill.rule,
    hook: drill.hook,
    trigger: drill.trigger,
  });
  if (error) throw error;
}

export async function loadRecentAttempts(userId: string, limit = 200) {
  const { data, error } = await getSupabase()
    .from('drill_attempts')
    .select('drill_id, mark, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(r => ({
    qid: r.drill_id as string,
    mark: r.mark as Mark,
    ts: new Date(r.created_at as string).getTime(),
  }));
}

export async function insertSavedAnswer(userId: string, row: {
  source: string; topic: string; question: string;
  user_answer: string; model_answer?: string; mark?: string;
}): Promise<void> {
  const { error } = await getSupabase().from('saved_answers').insert({ user_id: userId, ...row });
  if (error) throw error;
}

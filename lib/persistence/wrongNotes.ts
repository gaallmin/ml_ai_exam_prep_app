'use client';
import { getSupabase } from '@/lib/supabase/client';
import type { WrongNote } from '@/lib/stat41120/content/types';
import { SEED_NOTES } from '@/lib/stat41120/content/seedNotes';

function rowToNote(r: any): WrongNote {
  return {
    id: r.id,
    sourceId: r.source_id,
    topic: r.topic,
    wk: r.weakness_type ?? '',
    wrong: r.wrong ?? '',
    rule: r.rule ?? '',
    hook: r.hook ?? '',
    trigger: r.trigger ?? '',
    src: r.source ?? '',
    count: r.count ?? 1,
    correctStreak: r.correct_streak ?? 0,
    last: new Date(r.last_seen_at).getTime(),
    due: new Date(r.due_at).getTime(),
    mastered: !!r.mastered,
  };
}

export async function loadWrongNotes(userId: string): Promise<WrongNote[]> {
  const { data, error } = await getSupabase()
    .from('wrong_notes').select('*').eq('user_id', userId).order('created_at');
  if (error) throw error;
  return (data ?? []).map(rowToNote);
}

export async function seedWrongNotesOnce(userId: string): Promise<WrongNote[]> {
  const now = new Date().toISOString();
  const rows = SEED_NOTES.map(s => ({
    user_id: userId,
    source_id: s.sourceId,
    topic: s.topic,
    weakness_type: s.wk,
    wrong: s.wrong,
    rule: s.rule,
    hook: s.hook,
    trigger: s.trigger,
    source: s.src,
    count: 1,
    correct_streak: 0,
    last_seen_at: now,
    due_at: now,
    mastered: false,
  }));
  const { data, error } = await getSupabase().from('wrong_notes').insert(rows).select('*');
  if (error) throw error;
  return (data ?? []).map(rowToNote);
}

export async function insertWrongNote(userId: string, n: Omit<WrongNote, 'id'>): Promise<WrongNote> {
  const { data, error } = await getSupabase().from('wrong_notes').insert({
    user_id: userId,
    source_id: n.sourceId,
    topic: n.topic,
    weakness_type: n.wk,
    wrong: n.wrong,
    rule: n.rule,
    hook: n.hook,
    trigger: n.trigger,
    source: n.src,
    count: n.count,
    correct_streak: n.correctStreak,
    last_seen_at: new Date(n.last).toISOString(),
    due_at: new Date(n.due).toISOString(),
    mastered: n.mastered,
  }).select('*').single();
  if (error) throw error;
  return rowToNote(data);
}

export async function updateWrongNote(userId: string, n: WrongNote): Promise<void> {
  const { error } = await getSupabase().from('wrong_notes').update({
    count: n.count,
    correct_streak: n.correctStreak,
    last_seen_at: new Date(n.last).toISOString(),
    due_at: new Date(n.due).toISOString(),
    mastered: n.mastered,
    wrong: n.wrong,
    updated_at: new Date().toISOString(),
  }).eq('id', n.id).eq('user_id', userId);
  if (error) throw error;
}

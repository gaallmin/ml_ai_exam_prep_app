'use client';
import { getSupabase } from '@/lib/supabase/client';

export async function loadAppState(userId: string): Promise<Record<string, any>> {
  const { data, error } = await getSupabase()
    .from('app_state').select('key, value').eq('user_id', userId);
  if (error) throw error;
  const out: Record<string, any> = {};
  for (const row of data ?? []) out[row.key] = row.value;
  return out;
}

export async function upsertAppState(userId: string, key: string, value: unknown): Promise<void> {
  const { error } = await getSupabase()
    .from('app_state')
    .upsert({ user_id: userId, key, value, updated_at: new Date().toISOString() }, { onConflict: 'user_id,key' });
  if (error) throw error;
}

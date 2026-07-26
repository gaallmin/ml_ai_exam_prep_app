'use client';
// useSprintStore — replaces the HTML app's global `S` object + save()/loadState().
// Optimistic updates: local state changes immediately, then syncs to Supabase.
import { create } from 'zustand';
import type { Drill, DrillAttempt, FormulaStatus, Mark, WrongNote } from '@/lib/stat41120/content/types';
import { nextDueAfterMistake, nextDueAfterRecall, MIN20 } from '@/lib/spacedRepetition';
import { loadAppState, upsertAppState } from '@/lib/persistence/appState';
import { insertDrillAttempt, loadRecentAttempts, insertSavedAnswer } from '@/lib/persistence/drills';
import { loadWrongNotes, seedWrongNotesOnce, insertWrongNote, updateWrongNote } from '@/lib/persistence/wrongNotes';

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error';

// One Structure Lab (RNN/LSTM/GRU visualiser) answer attempt.
export interface StructureAttempt {
  qid: string;
  model: string;             // 'rnn' | 'lstm' | 'gru'
  mode: string;              // 'watch' | 'trace' | 'exam'
  step: number | null;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  mark: Mark;
  wk: string;                // weakness type
  hook: string;
  trigger: string;
}

interface SprintStore {
  userId: string | null;
  loaded: boolean;
  syncStatus: SyncStatus;

  wrongNotes: WrongNote[];
  drillHistory: DrillAttempt[];
  sprintChecks: Record<string, boolean>;
  visited: Record<string, boolean>;
  formulaProgress: Record<string, FormulaStatus>;

  loadUserState: (userId: string) => Promise<void>;
  markTopicVisited: (topicId: string) => void;
  toggleSprintCheck: (dayItemKey: string, on: boolean) => void;
  markFormulaStatus: (formulaId: string, status: FormulaStatus) => void;
  saveDrillAttempt: (drill: Drill, mark: Mark, userAnswer: string) => void;
  addOrUpdateWrongNote: (drill: Drill, mark: Mark) => void;
  creditWrongNote: (drill: Drill) => void;
  selfMarkWrongNote: (noteId: string, recalled: boolean) => void;
  saveFreeResponse: (drill: Drill, userAnswer: string, mark: Mark) => void;
  saveCalculation: (topic: string, question: string, answer: string) => void;
  saveStructureAttempt: (p: StructureAttempt) => void;
  addManualWrongNote: (n: Omit<WrongNote, 'id'>) => void;
  reset: () => void;
}

function track(set: (p: Partial<SprintStore>) => void, p: Promise<unknown>) {
  set({ syncStatus: 'saving' });
  p.then(() => set({ syncStatus: 'saved' }))
   .catch(() => set({ syncStatus: 'error' }));
}

export const useSprintStore = create<SprintStore>((set, get) => ({
  userId: null,
  loaded: false,
  syncStatus: 'idle',
  wrongNotes: [],
  drillHistory: [],
  sprintChecks: {},
  visited: {},
  formulaProgress: {},

  loadUserState: async (userId) => {
    set({ userId, loaded: false });
    const [appState, attempts] = await Promise.all([
      loadAppState(userId),
      loadRecentAttempts(userId),
    ]);
    let notes = await loadWrongNotes(userId);
    if (!appState['seededWrongNotes']?.done && notes.length === 0) {
      notes = await seedWrongNotesOnce(userId);
      await upsertAppState(userId, 'seededWrongNotes', { done: true });
    }
    set({
      wrongNotes: notes,
      drillHistory: attempts,
      sprintChecks: appState['sprintChecks'] ?? {},
      visited: appState['visited'] ?? {},
      formulaProgress: appState['formulaProgress'] ?? {},
      loaded: true,
      syncStatus: 'idle',
    });
  },

  markTopicVisited: (topicId) => {
    const { userId, visited } = get();
    if (visited[topicId]) return;
    const next = { ...visited, [topicId]: true };
    set({ visited: next });
    if (userId) track(set, upsertAppState(userId, 'visited', next));
  },

  toggleSprintCheck: (key, on) => {
    const { userId, sprintChecks } = get();
    const next = { ...sprintChecks };
    if (on) next[key] = true; else delete next[key];
    set({ sprintChecks: next });
    if (userId) track(set, upsertAppState(userId, 'sprintChecks', next));
  },

  markFormulaStatus: (formulaId, status) => {
    const { userId, formulaProgress } = get();
    const next = { ...formulaProgress, [formulaId]: status };
    set({ formulaProgress: next });
    if (userId) track(set, upsertAppState(userId, 'formulaProgress', next));
  },

  saveDrillAttempt: (drill, mark, userAnswer) => {
    const { userId } = get();
    set({ drillHistory: [{ qid: drill.id, mark, ts: Date.now() }, ...get().drillHistory] });
    if (userId) track(set, insertDrillAttempt(userId, drill, mark, userAnswer));
    if (mark === 'Correct') get().creditWrongNote(drill);
    else get().addOrUpdateWrongNote(drill, mark);
  },

  addOrUpdateWrongNote: (drill, mark) => {
    const { userId, wrongNotes } = get();
    const now = Date.now();
    const existing = wrongNotes.find(n => n.sourceId === drill.id);
    if (existing) {
      const updated: WrongNote = {
        ...existing,
        count: existing.count + 1,
        correctStreak: 0,
        mastered: false,
        last: now,
        due: nextDueAfterMistake(existing.count + 1, now),
      };
      set({ wrongNotes: wrongNotes.map(n => n.id === updated.id ? updated : n) });
      if (userId) track(set, updateWrongNote(userId, updated));
    } else {
      const local: WrongNote = {
        id: 'local-' + now,
        sourceId: drill.id,
        topic: drill.topic,
        wk: drill.wk,
        wrong: mark === 'Partially correct' ? 'Partially correct — see rule.' : 'Answered incorrectly in drill.',
        rule: drill.rule, hook: drill.hook, trigger: drill.trigger, src: 'drill',
        count: 1, correctStreak: 0, last: now, due: now + MIN20, mastered: false,
      };
      set({ wrongNotes: [...wrongNotes, local] });
      if (userId) {
        track(set, insertWrongNote(userId, local).then(saved => {
          set({ wrongNotes: get().wrongNotes.map(n => n.id === local.id ? saved : n) });
        }));
      }
    }
  },

  creditWrongNote: (drill) => {
    const { userId, wrongNotes } = get();
    const n = wrongNotes.find(x => x.sourceId === drill.id);
    if (!n || n.mastered) return;
    const now = Date.now();
    const streak = (n.correctStreak ?? 0) + 1;
    const { due, mastered } = nextDueAfterRecall(streak, now);
    const updated: WrongNote = { ...n, correctStreak: streak, last: now, due, mastered };
    set({ wrongNotes: wrongNotes.map(x => x.id === n.id ? updated : x) });
    if (userId) track(set, updateWrongNote(userId, updated));
  },

  selfMarkWrongNote: (noteId, recalled) => {
    const { userId, wrongNotes } = get();
    const n = wrongNotes.find(x => x.id === noteId);
    if (!n) return;
    const now = Date.now();
    let updated: WrongNote;
    if (recalled) {
      const streak = (n.correctStreak ?? 0) + 1;
      const { due, mastered } = nextDueAfterRecall(streak, now);
      updated = { ...n, correctStreak: streak, last: now, due, mastered };
    } else {
      updated = { ...n, count: n.count + 1, correctStreak: 0, mastered: false, last: now, due: now + MIN20 };
    }
    set({ wrongNotes: wrongNotes.map(x => x.id === noteId ? updated : x) });
    if (userId && !noteId.startsWith('local-')) track(set, updateWrongNote(userId, updated));
  },

  saveFreeResponse: (drill, userAnswer, mark) => {
    const { userId } = get();
    if (userId) track(set, insertSavedAnswer(userId, {
      source: 'drill-free', topic: drill.topic, question: drill.q,
      user_answer: userAnswer, model_answer: drill.model ?? '', mark,
    }));
  },

  saveCalculation: (topic, question, answer) => {
    const { userId } = get();
    if (userId) track(set, insertSavedAnswer(userId, {
      source: 'cnn-calculator', topic, question, user_answer: answer,
    }));
  },

  saveStructureAttempt: (p) => {
    const { userId, wrongNotes } = get();
    const now = Date.now();
    if (userId) {
      track(set, insertSavedAnswer(userId, {
        source: `structure-lab:${p.model}:${p.mode}`,
        topic: `${p.model.toUpperCase()} Structure Lab`,
        question: p.step != null ? `[step ${p.step + 1}] ${p.question}` : p.question,
        user_answer: p.userAnswer,
        model_answer: p.correctAnswer,
        mark: p.mark,
      }));
    }
    const srcId = `sl:${p.qid}`;
    const existing = wrongNotes.find(n => n.sourceId === srcId);
    if (p.mark === 'Correct') {
      if (!existing || existing.mastered) return;
      const streak = (existing.correctStreak ?? 0) + 1;
      const { due, mastered } = nextDueAfterRecall(streak, now);
      const updated: WrongNote = { ...existing, correctStreak: streak, last: now, due, mastered };
      set({ wrongNotes: wrongNotes.map(n => n.id === updated.id ? updated : n) });
      if (userId && !updated.id.startsWith('local-')) track(set, updateWrongNote(userId, updated));
      return;
    }
    const wrongText = `Q: ${p.question} — answered "${p.userAnswer}". Correct: ${p.correctAnswer}`;
    if (existing) {
      const updated: WrongNote = {
        ...existing,
        wrong: wrongText,
        count: existing.count + 1,
        correctStreak: 0,
        mastered: false,
        last: now,
        due: nextDueAfterMistake(existing.count + 1, now),
      };
      set({ wrongNotes: wrongNotes.map(n => n.id === updated.id ? updated : n) });
      if (userId && !updated.id.startsWith('local-')) track(set, updateWrongNote(userId, updated));
    } else {
      get().addManualWrongNote({
        sourceId: srcId,
        topic: `${p.model.toUpperCase()} structure`,
        wk: p.wk,
        wrong: wrongText,
        rule: p.correctAnswer,
        hook: p.hook,
        trigger: p.trigger,
        src: `structure-lab:${p.mode}`,
        count: 1, correctStreak: 0, last: now, due: now + MIN20, mastered: false,
      });
    }
  },

  addManualWrongNote: (n) => {
    const { userId, wrongNotes } = get();
    const local: WrongNote = { ...n, id: 'local-' + Date.now() };
    set({ wrongNotes: [...wrongNotes, local] });
    if (userId) {
      track(set, insertWrongNote(userId, local).then(saved => {
        set({ wrongNotes: get().wrongNotes.map(x => x.id === local.id ? saved : x) });
      }));
    }
  },

  reset: () => set({
    userId: null, loaded: false, syncStatus: 'idle',
    wrongNotes: [], drillHistory: [], sprintChecks: {}, visited: {}, formulaProgress: {},
  }),
}));

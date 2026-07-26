# STAT41120 Exam Sprint — deployable version

The exam-memory recovery platform migrated from the single-file `stat41120_sprint.html`
into Next.js (App Router, TypeScript) with Supabase persistence, so progress —
오답노트, drill history, sprint checkboxes, visited topic cards, formula recall
status, free-responses and saved CNN calculations — syncs across sessions and devices.

All course content (Big Picture Map, Formula Bank, learning-curve patterns, drills,
visualiser steps, 5-day sprint plan, seed 오답노트 entries) was extracted verbatim
from the HTML into `lib/stat41120/content/`.

## Stack

- Next.js 14 App Router + TypeScript
- CSS lifted directly from the HTML (`app/globals.css`) — no Tailwind, same tired-brain dark UI
- Supabase: email/password auth, Postgres, Row Level Security
- Zustand store (`lib/store.ts`) with optimistic updates + "Saving… / Saved / Offline" indicator
- Deployable to Vercel; the frontend uses only the anon key (no service role key anywhere)

## Setup

1. **Create a Supabase project** at https://supabase.com (free tier is fine).
2. **Run the SQL migrations** in the Supabase dashboard → SQL editor, in order:
   - `supabase/migrations/0001_schema.sql` (tables + signup trigger for `profiles`)
   - `supabase/migrations/0002_rls.sql` (RLS on every table, own-rows-only policies)
3. **Auth settings** (dashboard → Authentication → Providers): Email is enabled by default.
   Optional: disable "Confirm email" for instant signup while testing.
4. **Copy credentials** from Project Settings → API:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Locally:
   ```bash
   cp .env.local.example .env.local   # paste your two values
   npm install
   npm run dev                        # http://localhost:3000
   ```
6. Sign up, log in — the 6 seed 오답노트 entries are inserted once per user
   (guarded by `app_state` key `seededWrongNotes`).

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New Project** → import the repo. Framework auto-detects Next.js.
3. In the Vercel project → Settings → Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy (or redeploy after adding the vars).
5. Optional: in Supabase → Authentication → URL Configuration, set the Site URL
   to your Vercel URL so email-confirmation links redirect correctly.

## What persists where

| State                     | Storage                                        |
|---------------------------|------------------------------------------------|
| visited topic cards       | `app_state` key `visited` (jsonb)              |
| sprint checkboxes         | `app_state` key `sprintChecks`                 |
| formula recall status     | `app_state` key `formulaProgress`              |
| seed-notes-done flag      | `app_state` key `seededWrongNotes`             |
| every drill attempt       | `drill_attempts` (one row per answer)          |
| 오답노트                   | `wrong_notes` (spaced-repetition fields)       |
| free-responses, CNN calcs | `saved_answers`                                |
| tab, drill queue, reveals, animation steps | React state only (never saved) |

Spaced repetition (unchanged from the HTML): new mistake → due in 20 min;
repeated mistake → tomorrow; recalled once → tomorrow; recalled twice → `mastered = true`.
(The HTML used `due = Infinity` for mastered, which doesn't survive JSON — the
boolean column fixes that.)

## Notes

- `starred_items` from the original spec was skipped for MVP; the Final Sheet
  already compiles all formulas + traps + active hooks automatically.
- No AI marking: free-response questions are self-marked against the model answer,
  exactly as in the HTML version.

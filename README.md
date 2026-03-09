# Habit League

Habit League is a mobile-first PWA for private habit competitions. Users create weekly categories, assign point budgets to goals, and compete on shared league leaderboards.

## Local development

1. Install dependencies:

```bash
npm install
```

2. Copy env variables:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run dev -- --hostname 0.0.0.0 --port 3000
```

4. Open `http://localhost:3000` on your Mac or `http://<your-local-ip>:3000` on your phone.

## Supabase setup

- Create a Supabase project.
- Add values from your project to `.env.local`.
- Run `supabase/schema.sql` in the Supabase SQL editor.
- If you already ran an earlier version of the schema, also run `supabase/league-onboarding.sql`.
- If you already ran the schema before weekly planner CRUD, also run `supabase/planner-crud.sql`.
- If you already ran the schema before shared leaderboard updates, also run `supabase/shared-leaderboard.sql`.
- Enable email/password auth and magic links in Supabase Auth.

## Local auth shortcuts

- Use email + password as the default auth flow, with magic links as a backup.
- For local UI work without a real session, set `DEV_AUTH_BYPASS=true` in `.env.local` and open `/app` in development mode.
- The bypass only works in local development and does not perform real database writes.

## Project docs

- Product plan: `docs/mvp-plan.md`
- Backend wiring notes: `docs/supabase-wiring.md`
- Schema source: `supabase/schema.sql`

## Current state

- Branded landing page
- Mock app dashboard and weekly setup flows
- PWA metadata and install assets
- Supabase client scaffolding and starter schema

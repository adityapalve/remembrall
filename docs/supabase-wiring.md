## Supabase wiring map

### What lives where
- `supabase/schema.sql`: source of truth for tables, enums, policies, and triggers.
- `lib/supabase/client.ts`: browser client for auth actions and interactive reads.
- `lib/supabase/server.ts`: server-side client for App Router pages, loaders, and actions.
- `lib/supabase/database.types.ts`: typed table contracts used by the app.
- `.env.example`: required public environment variables for local setup.

### Core schema decisions
- `profiles` extends `auth.users` and stores display name + timezone.
- `leagues` and `league_members` model private friend groups.
- `league_weeks` snapshots each scoring week per league.
- `user_week_plans` keeps one editable weekly plan per user.
- `plan_categories` and `plan_habits` are weekly, user-owned records so categories can change week to week.
- `habit_logs` stores progress per day.
- `weekly_scores` caches leaderboard totals.
- `health_connections` is the future bridge for Apple Health sync from a native companion app.

### Manual tracking now
- Habit rows default to `tracking_source = 'manual'`.
- The PWA creates categories, habits, and daily logs directly.
- Weekly score calculation can run in the app first, then move to an edge function or DB job.

### Apple Health later
- `tracking_source = 'apple_health'` marks habits that should be fulfilled by synced data.
- `goal_metric` already supports `steps` and `sleep_hours` in addition to manual metrics.
- `health_connections` stores connection state only; actual HealthKit reads must happen in a native iOS app.
- The native app would sync summarized daily values into `habit_logs` or a separate ingestion table later.

### What you need to wire up in Supabase
1. Create a Supabase project.
2. Copy `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` into `.env.local`.
3. Run the SQL in `supabase/schema.sql` in the Supabase SQL editor.
4. If you already ran the original schema before this league flow work, also run `supabase/league-onboarding.sql`.
5. If you already ran the schema before weekly planner CRUD, also run `supabase/planner-crud.sql`.
6. If you already ran the schema before shared leaderboard updates, also run `supabase/shared-leaderboard.sql`.
7. Enable email/password auth and optionally keep magic links enabled as a backup.
8. Add your local URL and deployed URL to the auth redirect settings.

### Dev-only bypass
- Set `DEV_AUTH_BYPASS=true` in `.env.local`.
- This only activates in `NODE_ENV=development`.
- It gives `/app` a local demo user and demo league so you can keep building the planner and leaderboard UI when auth providers are rate-limited.
- It does not create a real Supabase session, so create/join league actions still need a real login.

### What still needs wiring in the app
1. Improve habit logging UX for one-tap binary and increment flows.
2. Add week rollover and copy-last-week setup.
3. Add post-week recap and rank movement history.
4. Optionally move some dashboard aggregations behind materialized or cached views later.

### Recommended implementation order
1. Create/join league flow.
3. Weekly plan CRUD.
4. Daily logging.
5. Leaderboard aggregation.
6. Invite links and install polish.

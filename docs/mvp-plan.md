## Habit League MVP Plan

### Product goal
- Ship a mobile-first PWA that lets friends create private leagues, set weekly habits with point budgets, and compete on a shared leaderboard.

### Phase 1 deliverables
- Responsive marketing page with clear install and onboarding story.
- Auth entry points for create account, join league, and continue with invite code.
- Core app shell with dashboard, weekly setup, and leaderboard views.
- Mock domain model for users, leagues, habits, logging, and weekly rankings.
- PWA metadata for installability on iPhone and desktop.

### Product rules
- Users choose their own categories each week.
- Each user receives a fixed weekly point budget to keep leagues fair.
- Habit points are earned proportionally against the weekly target.
- Rankings are calculated per league, per week, in the member's timezone.
- Weekly setup should support copying the previous week in a later iteration.

### Initial technical approach
- Framework: Next.js App Router with TypeScript.
- Styling: Tailwind CSS v4 with a custom visual system.
- Data layer for now: typed mock data in `lib/mock-data.ts`.
- Backend target: Supabase auth + Postgres + row-level security.
- Deployment target: Vercel with PWA install metadata.

### Implementation order
1. Establish the app structure, branding, and landing experience.
2. Create typed models for leagues, habits, progress, and leaderboards.
3. Build dashboard and weekly planning views against mock data.
4. Add auth and persistence with Supabase.
5. Add invite links, scoring calculations, and live updates.
6. Add offline support and notification hooks.

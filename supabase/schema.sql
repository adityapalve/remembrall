create extension if not exists pgcrypto;

create type public.league_member_role as enum ('owner', 'member');
create type public.league_week_status as enum ('draft', 'active', 'closed');
create type public.goal_metric as enum ('count', 'duration_minutes', 'binary', 'steps', 'sleep_hours');
create type public.tracking_source as enum ('manual', 'apple_health');
create type public.connection_status as enum ('disconnected', 'connected', 'error');

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, timezone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'UTC'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  invite_code text not null unique,
  weekly_point_budget integer not null default 100 check (weekly_point_budget > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.league_members (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.league_member_role not null default 'member',
  joined_at timestamptz not null default now(),
  unique (league_id, user_id)
);

create table public.league_invites (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues (id) on delete cascade,
  code text not null unique,
  created_by uuid not null references public.profiles (id) on delete cascade,
  expires_at timestamptz,
  max_uses integer,
  use_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.league_weeks (
  id uuid primary key default gen_random_uuid(),
  league_id uuid not null references public.leagues (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  status public.league_week_status not null default 'draft',
  created_at timestamptz not null default now(),
  unique (league_id, start_date),
  check (end_date >= start_date)
);

create table public.user_week_plans (
  id uuid primary key default gen_random_uuid(),
  league_week_id uuid not null references public.league_weeks (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  point_budget integer not null check (point_budget > 0),
  points_allocated integer not null default 0 check (points_allocated >= 0),
  is_locked boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (league_week_id, user_id)
);

create table public.plan_categories (
  id uuid primary key default gen_random_uuid(),
  user_week_plan_id uuid not null references public.user_week_plans (id) on delete cascade,
  name text not null,
  color text not null default '#ffd8bf',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.plan_habits (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.plan_categories (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  metric_type public.goal_metric not null default 'count',
  tracking_source public.tracking_source not null default 'manual',
  target_value numeric not null check (target_value > 0),
  point_value integer not null check (point_value > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  plan_habit_id uuid not null references public.plan_habits (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  log_date date not null,
  progress_value numeric not null default 0 check (progress_value >= 0),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (plan_habit_id, log_date)
);

create table public.health_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  provider text not null,
  status public.connection_status not null default 'disconnected',
  last_synced_at timestamptz,
  external_subject_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table public.weekly_scores (
  id uuid primary key default gen_random_uuid(),
  league_week_id uuid not null references public.league_weeks (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  total_points integer not null default 0,
  rank integer,
  updated_at timestamptz not null default now(),
  unique (league_week_id, user_id)
);

create index league_members_user_id_idx on public.league_members (user_id);
create index league_weeks_league_id_idx on public.league_weeks (league_id);
create index user_week_plans_user_id_idx on public.user_week_plans (user_id);
create index plan_categories_user_week_plan_id_idx on public.plan_categories (user_week_plan_id);
create index plan_habits_user_id_idx on public.plan_habits (user_id);
create index habit_logs_user_id_idx on public.habit_logs (user_id);
create index habit_logs_plan_habit_id_idx on public.habit_logs (plan_habit_id);
create index weekly_scores_league_week_id_idx on public.weekly_scores (league_week_id);

create or replace function public.is_league_member(target_league_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.league_members lm
    where lm.league_id = target_league_id and lm.user_id = auth.uid()
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.redeem_league_invite(invite_code_input text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_row public.league_invites;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select *
  into invite_row
  from public.league_invites
  where upper(code) = upper(invite_code_input)
  limit 1;

  if not found then
    raise exception 'Invite code not found';
  end if;

  if invite_row.expires_at is not null and invite_row.expires_at < now() then
    raise exception 'Invite code has expired';
  end if;

  if invite_row.max_uses is not null and invite_row.use_count >= invite_row.max_uses then
    raise exception 'Invite code has reached its limit';
  end if;

  if exists (
    select 1
    from public.league_members
    where league_id = invite_row.league_id and user_id = auth.uid()
  ) then
    return invite_row.league_id;
  end if;

  insert into public.league_members (league_id, user_id, role)
  values (invite_row.league_id, auth.uid(), 'member')
  on conflict (league_id, user_id) do nothing;

  update public.league_invites
  set use_count = use_count + 1
  where id = invite_row.id;

  return invite_row.league_id;
end;
$$;

create or replace function public.ensure_current_league_week(target_league_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  week_start date := date_trunc('week', now())::date;
  week_end date := (date_trunc('week', now()) + interval '6 days')::date;
  week_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  if not public.is_league_member(target_league_id) then
    raise exception 'Not a league member';
  end if;

  select id
  into week_id
  from public.league_weeks
  where league_id = target_league_id and start_date = week_start
  limit 1;

  if week_id is null then
    insert into public.league_weeks (league_id, start_date, end_date, status)
    values (target_league_id, week_start, week_end, 'active')
    on conflict (league_id, start_date) do update set end_date = excluded.end_date
    returning id into week_id;
  end if;

  return week_id;
end;
$$;

create or replace function public.ensure_user_week_plan(target_league_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  week_id uuid;
  plan_id uuid;
  budget integer;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  week_id := public.ensure_current_league_week(target_league_id);

  select weekly_point_budget
  into budget
  from public.leagues
  where id = target_league_id;

  insert into public.user_week_plans (league_week_id, user_id, point_budget)
  values (week_id, auth.uid(), budget)
  on conflict (league_week_id, user_id) do nothing;

  select id
  into plan_id
  from public.user_week_plans
  where league_week_id = week_id and user_id = auth.uid()
  limit 1;

  return plan_id;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create trigger profiles_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

create trigger leagues_updated_at
before update on public.leagues
for each row execute procedure public.touch_updated_at();

create trigger user_week_plans_updated_at
before update on public.user_week_plans
for each row execute procedure public.touch_updated_at();

create trigger plan_habits_updated_at
before update on public.plan_habits
for each row execute procedure public.touch_updated_at();

create trigger habit_logs_updated_at
before update on public.habit_logs
for each row execute procedure public.touch_updated_at();

create trigger health_connections_updated_at
before update on public.health_connections
for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.leagues enable row level security;
alter table public.league_members enable row level security;
alter table public.league_invites enable row level security;
alter table public.league_weeks enable row level security;
alter table public.user_week_plans enable row level security;
alter table public.plan_categories enable row level security;
alter table public.plan_habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.health_connections enable row level security;
alter table public.weekly_scores enable row level security;

create policy "profiles are viewable by authenticated users"
on public.profiles for select
to authenticated
using (true);

create policy "users manage their own profile"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "league members can read leagues"
on public.leagues for select
to authenticated
using (public.is_league_member(id) or owner_id = auth.uid());

create policy "authenticated users can create leagues"
on public.leagues for insert
to authenticated
with check (auth.uid() = owner_id);

create policy "league owners can update leagues"
on public.leagues for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

create policy "league members can read memberships"
on public.league_members for select
to authenticated
using (public.is_league_member(league_id));

create policy "league owners add members"
on public.league_members for insert
to authenticated
with check (
  exists (
    select 1 from public.leagues l
    where l.id = league_id and l.owner_id = auth.uid()
  )
);

create policy "league members can read invites"
on public.league_invites for select
to authenticated
using (public.is_league_member(league_id));

create policy "league owners manage invites"
on public.league_invites for all
to authenticated
using (
  exists (
    select 1 from public.leagues l
    where l.id = league_id and l.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.leagues l
    where l.id = league_id and l.owner_id = auth.uid()
  )
);

create policy "league members can read weeks"
on public.league_weeks for select
to authenticated
using (public.is_league_member(league_id));

create policy "league owners manage weeks"
on public.league_weeks for all
to authenticated
using (
  exists (
    select 1 from public.leagues l
    where l.id = league_id and l.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.leagues l
    where l.id = league_id and l.owner_id = auth.uid()
  )
);

create policy "users read their own week plans"
on public.user_week_plans for select
to authenticated
using (auth.uid() = user_id);

create policy "users create their own week plans"
on public.user_week_plans for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users update their own week plans"
on public.user_week_plans for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage their own categories"
on public.plan_categories for all
to authenticated
using (
  exists (
    select 1 from public.user_week_plans uwp
    where uwp.id = user_week_plan_id and uwp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.user_week_plans uwp
    where uwp.id = user_week_plan_id and uwp.user_id = auth.uid()
  )
);

create policy "users manage their own habits"
on public.plan_habits for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage their own logs"
on public.habit_logs for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users manage their own health connections"
on public.health_connections for all
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "league members can read weekly scores"
on public.weekly_scores for select
to authenticated
using (
  exists (
    select 1
    from public.league_weeks lw
    where lw.id = league_week_id and public.is_league_member(lw.league_id)
  )
);

create policy "service role manages weekly scores"
on public.weekly_scores for all
to service_role
using (true)
with check (true);

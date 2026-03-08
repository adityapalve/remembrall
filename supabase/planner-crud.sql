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

create or replace function public.recompute_weekly_scores(target_league_week_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_league_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select league_id
  into target_league_id
  from public.league_weeks
  where id = target_league_week_id;

  if target_league_id is null then
    raise exception 'League week not found';
  end if;

  if not public.is_league_member(target_league_id) then
    raise exception 'Not a league member';
  end if;

  delete from public.weekly_scores
  where league_week_id = target_league_week_id;

  insert into public.weekly_scores (league_week_id, user_id, total_points, rank)
  with week_window as (
    select id, league_id, start_date, end_date
    from public.league_weeks
    where id = target_league_week_id
  ),
  member_totals as (
    select
      lm.user_id,
      coalesce(
        sum(
          round(
            least(
              coalesce(progress.progress_value, 0) / nullif(ph.target_value, 0),
              1
            ) * ph.point_value
          )
        ),
        0
      )::integer as total_points
    from week_window ww
    join public.league_members lm on lm.league_id = ww.league_id
    left join public.user_week_plans uwp
      on uwp.league_week_id = ww.id and uwp.user_id = lm.user_id
    left join public.plan_categories pc
      on pc.user_week_plan_id = uwp.id
    left join public.plan_habits ph
      on ph.category_id = pc.id
    left join (
      select hl.plan_habit_id, sum(hl.progress_value) as progress_value
      from public.habit_logs hl
      join week_window ww2 on hl.log_date between ww2.start_date and ww2.end_date
      group by hl.plan_habit_id
    ) progress on progress.plan_habit_id = ph.id
    group by lm.user_id
  ),
  ranked as (
    select
      target_league_week_id as league_week_id,
      user_id,
      total_points,
      dense_rank() over (order by total_points desc, user_id asc) as rank
    from member_totals
  )
  select league_week_id, user_id, total_points, rank
  from ranked;
end;
$$;

drop policy if exists "league members can read week plans" on public.user_week_plans;
create policy "league members can read week plans"
on public.user_week_plans for select
to authenticated
using (
  exists (
    select 1
    from public.league_weeks lw
    where lw.id = league_week_id and public.is_league_member(lw.league_id)
  )
);

drop policy if exists "league members can read categories" on public.plan_categories;
create policy "league members can read categories"
on public.plan_categories for select
to authenticated
using (
  exists (
    select 1
    from public.user_week_plans uwp
    join public.league_weeks lw on lw.id = uwp.league_week_id
    where uwp.id = user_week_plan_id and public.is_league_member(lw.league_id)
  )
);

drop policy if exists "league members can read habits" on public.plan_habits;
create policy "league members can read habits"
on public.plan_habits for select
to authenticated
using (
  exists (
    select 1
    from public.plan_categories pc
    join public.user_week_plans uwp on uwp.id = pc.user_week_plan_id
    join public.league_weeks lw on lw.id = uwp.league_week_id
    where pc.id = category_id and public.is_league_member(lw.league_id)
  )
);

drop policy if exists "league members can read logs" on public.habit_logs;
create policy "league members can read logs"
on public.habit_logs for select
to authenticated
using (
  exists (
    select 1
    from public.plan_habits ph
    join public.plan_categories pc on pc.id = ph.category_id
    join public.user_week_plans uwp on uwp.id = pc.user_week_plan_id
    join public.league_weeks lw on lw.id = uwp.league_week_id
    where ph.id = plan_habit_id and public.is_league_member(lw.league_id)
  )
);

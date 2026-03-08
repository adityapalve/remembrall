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

drop policy if exists "league members can read leagues" on public.leagues;

create policy "league members can read leagues"
on public.leagues for select
to authenticated
using (public.is_league_member(id) or owner_id = auth.uid());

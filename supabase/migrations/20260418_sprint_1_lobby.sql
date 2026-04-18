create extension if not exists pgcrypto;

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  phase text not null default 'lobby',
  theme text,
  top_n integer not null default 5,
  host_id uuid,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  avatar text,
  is_host boolean not null default false,
  is_afk boolean not null default false,
  joined_at timestamptz not null default now()
);

create unique index if not exists players_room_user_key
on public.players (room_id, user_id);

create unique index if not exists players_room_lower_name_key
on public.players (room_id, lower(name));

alter table public.rooms
  add constraint rooms_host_id_fkey
  foreign key (host_id) references public.players(id)
  deferrable initially deferred;

alter table public.rooms enable row level security;
alter table public.players enable row level security;

drop policy if exists "rooms are readable by code" on public.rooms;
create policy "rooms are readable by code"
on public.rooms
for select
using (true);

drop policy if exists "authenticated users create rooms" on public.rooms;
create policy "authenticated users create rooms"
on public.rooms
for insert
to authenticated
with check (true);

drop policy if exists "hosts can update rooms" on public.rooms;
create policy "hosts can update rooms"
on public.rooms
for update
to authenticated
using (
  exists (
    select 1
    from public.players
    where players.room_id = rooms.id
      and players.id = rooms.host_id
      and players.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.players
    where players.room_id = rooms.id
      and players.id = rooms.host_id
      and players.user_id = auth.uid()
  )
);

drop policy if exists "players can read their room" on public.players;
create policy "players can read their room"
on public.players
for select
to authenticated
using (
  exists (
    select 1
    from public.players as membership
    where membership.room_id = players.room_id
      and membership.user_id = auth.uid()
  )
);

drop policy if exists "users insert their own player rows" on public.players;
create policy "users insert their own player rows"
on public.players
for insert
to authenticated
with check (user_id = auth.uid());

# Sprint 1 Lobby Design

**Date:** 2026-04-18
**Scope:** Create room, join room, authenticated player identity, and realtime lobby flow.

## Goal

Allow users to create a room, join an existing room by code, and see a realtime lobby backed by Supabase Auth anonymous sessions and room/player persistence.

## Decisions Locked

- Use **Server Actions** for room creation, room joining, and lobby start.
- Use **Supabase Auth anonymous** in Sprint 1, not local-only identity.
- Use **SSR for the current room page** and client containers for interactive lobby behavior.
- Reattach a returning player automatically by `auth.uid()` when possible.
- Keep identity in Supabase Auth; `localStorage` is only for light UX state if needed later.

## Recommended Architecture

### Home flow

`src/app/page.tsx` remains a thin route entry point. It renders a client container for the home flow. That container ensures an anonymous Supabase session exists before calling any room actions.

The home screen exposes two actions:

- create room
- join room by code

The form state and navigation stay in the client container. Validation and mutations happen in Server Actions.

### Room flow

`src/app/room/[code]/page.tsx` performs the initial room fetch on the server and renders the room entry surface for the current phase.

In Sprint 1, the phase handling is effectively limited to lobby. The room page still reads the real phase value so the routing surface is compatible with future sprints, but only the lobby experience needs to be implemented now.

### Feature boundaries

Follow Tomato Architecture and keep responsibilities narrow:

- `features/room/actions/` for create/join/start server actions
- `features/room/components/` for home and lobby containers/screens
- `features/room/lib/` for room-code generation and room mapping helpers
- `shared/hooks/` for auth/session and realtime hooks
- `shared/schemas/` for room form schemas

Screens stay presentation-only. Containers own hooks, actions, optimistic UI state, and navigation.

## Identity Model

### Canonical identity

Player identity is defined by `auth.uid()` from Supabase Auth anonymous sessions.

User-entered `name` is not the identity key. It is a display attribute attached to the player row.

### Reattach behavior

When `join-room` runs, it must first look for an existing `players` row in the target room for the current `auth.uid()`.

- If found, return that player and reuse the existing room membership.
- If not found, validate join conditions and create a new player row.

This prevents duplicate player rows on refresh or accidental repeat joins by the same authenticated session.

### Local state

Sprint 1 should not depend on `localStorage` as the source of truth for player identity. If local persistence is used at all, it should be limited to lightweight convenience values such as a previously typed display name.

## Data Model Changes

### Players table

Add an auth binding column:

```sql
alter table players add column user_id uuid not null;
```

Add a uniqueness rule per room:

```sql
create unique index players_room_id_user_id_key
on players (room_id, user_id);
```

This is required to make reattach behavior safe under concurrent requests.

### Room and player invariants

- one room has one host
- host is the first player inserted for the room
- one authenticated user can have only one player in a given room
- room joins are only allowed while `rooms.phase = 'lobby'`
- room joins are capped at 10 players

## Server Actions

### `create-room`

Responsibilities:

- ensure authenticated anonymous session exists
- validate display name with Zod
- generate a unique 4-character room code
- create room row in `lobby`
- create host player row linked to `auth.uid()`
- return `{ code, roomId, playerId }`

If room code generation collides, retry server-side before failing.

### `join-room`

Responsibilities:

- ensure authenticated anonymous session exists
- validate input with Zod
- look up room by code
- if same `auth.uid()` already has a player in this room, return that player
- otherwise validate:
  - room exists
  - phase is `lobby`
  - name is not duplicated in the room
  - room has fewer than 10 players
- create player row
- return `{ roomId, playerId, code }`

### `start-suggesting`

Responsibilities:

- verify caller is the host
- verify room still has at least 2 players
- update phase from `lobby` to `suggesting`

Sprint 1 only needs the transition to be correct. The next phase UI can remain a placeholder or redirect surface until Sprint 2 work begins.

## Realtime Strategy

Use a shared hook, `use-realtime-room`, built with TanStack Query plus Supabase Realtime.

Behavior:

- initial room state fetched through `useQuery`
- subscribe to changes for `rooms` and `players`
- invalidate the room query on relevant inserts or updates

This keeps the lobby synchronized for all connected players without manual polling.

The query key should be stable and scoped by room code or room id. The hook must only own synchronization concerns, not presentation logic.

## UI Surfaces

### Home

Home needs:

- create-room form
- join-room form
- visible validation errors
- loading states while actions run
- redirect to `/room/[code]` on success

The pixel UI primitives from Sprint 0 remain the visual baseline.

### Lobby

Lobby needs:

- room code display with copy action
- player list with host badge and “you” distinction
- host-only start button
- disabled start button when fewer than 2 players
- realtime updates as players join

Keep the screen focused. Sprint 1 does not need guessing/ranking UI fragments in the lobby.

## RLS Direction

Sprint 1 should move toward rules that align with authenticated anonymous users:

- `players.user_id = auth.uid()` for inserts owned by the current user
- reads scoped to the room the user belongs to
- room creation and phase changes still guarded in Server Actions

The exact SQL can be implemented in the plan, but the important design constraint is that RLS and Server Action validation must agree on the same identity model.

## Error Handling

Expected user-facing failures:

- room code does not exist
- room is no longer in lobby
- duplicate display name in same room
- room is full
- host action attempted by non-host

These should return explicit UI-friendly messages, not raw database errors.

## Testing And Verification

Sprint 1 is complete only if it demonstrates:

- room creation creates a host and valid lobby room
- room code uniqueness works
- joining a room succeeds from a second session
- joining with same `auth.uid()` reattaches instead of duplicating
- duplicate display names fail
- joining a non-lobby room fails
- host start action changes phase
- realtime lobby updates reflect player changes

Verification should include:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

If realtime behavior is not covered by automated tests yet, it still needs manual verification before calling Sprint 1 complete.

## Risks And Mitigations

- **Auth/session drift:** if auth is initialized inconsistently on client and server, room actions will create mismatched identities.
  Mitigation: centralize anonymous session bootstrap and use the same identity everywhere.

- **Duplicate players under race conditions:** refreshes or repeated join requests can produce duplicates.
  Mitigation: unique `(room_id, user_id)` constraint plus server-side reattach logic.

- **RLS mismatch with action logic:** permissive action code with restrictive RLS, or the reverse, will cause hard-to-debug failures.
  Mitigation: design and test both around `auth.uid()` from the start.

- **Realtime overfetching:** invalidating too broadly can cause unnecessary rerenders.
  Mitigation: scope query keys tightly to the active room.

## Success Criteria

- authenticated anonymous users can create and join rooms
- room membership is stable across refresh for the same authenticated session
- lobby updates in realtime as players join
- host can start the room
- non-host cannot start the room
- the implementation cleanly supports Sprint 2 without reworking identity or routing

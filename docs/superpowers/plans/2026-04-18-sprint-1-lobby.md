# Sprint 1 Lobby Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement room creation, room joining, anonymous-auth identity, and realtime lobby behavior for Sprint 1.

**Architecture:** Keep routing in App Router pages, move room rules into testable service modules, and use thin Server Actions as the bridge from the UI to Supabase. The room page performs SSR for the room shell while a client container hydrates realtime lobby state through TanStack Query plus Supabase Realtime.

**Tech Stack:** Next.js 16.2, React 19, Supabase Auth anonymous, Supabase Realtime, TanStack Query, React Hook Form, Zod, Vitest.

---

### Task 1: Add Test Harness

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`

- [ ] Add Vitest dependencies and scripts
- [ ] Write a failing smoke test command
- [ ] Make the test runner execute in this repo

### Task 2: Implement Room Domain Schemas And Services

**Files:**
- Create: `src/shared/schemas/room.schema.ts`
- Create: `src/features/room/lib/generate-room-code.ts`
- Create: `src/features/room/lib/room-service.ts`
- Create: `tests/features/room/generate-room-code.test.ts`
- Create: `tests/features/room/room-service.test.ts`

- [ ] Write failing tests for room code generation, create-room, join-room reattach, duplicate names, and host start rules
- [ ] Implement minimal domain logic to make those tests pass
- [ ] Re-run the focused tests until green

### Task 3: Add Supabase Adapters And Server Actions

**Files:**
- Create: `src/features/room/lib/room-repository.ts`
- Create: `src/features/room/actions/create-room.ts`
- Create: `src/features/room/actions/join-room.ts`
- Create: `src/features/room/actions/start-suggesting.ts`
- Modify: `src/shared/lib/supabase/server.ts`

- [ ] Adapt the room service to the Supabase-backed repository
- [ ] Add authenticated Server Actions that read `auth.uid()`
- [ ] Keep action files thin and error messages UI-friendly

### Task 4: Build Home Flow

**Files:**
- Create: `src/shared/hooks/use-anonymous-auth.ts`
- Create: `src/features/room/components/home-container.tsx`
- Create: `src/features/room/components/home-screen.tsx`
- Modify: `src/app/page.tsx`
- Create: `tests/features/room/home-screen.test.tsx`

- [ ] Write a failing UI test for the home actions shell
- [ ] Implement anonymous auth bootstrap, create/join forms, and action handling
- [ ] Redirect to `/room/[code]` after success

### Task 5: Build Room SSR And Realtime Lobby

**Files:**
- Create: `src/app/room/[code]/page.tsx`
- Create: `src/app/room/[code]/loading.tsx`
- Create: `src/shared/hooks/use-realtime-room.ts`
- Create: `src/features/room/components/lobby-container.tsx`
- Create: `src/features/room/components/lobby-screen.tsx`
- Create: `src/features/room/components/player-list.tsx`
- Create: `src/features/room/components/room-code-chip.tsx`
- Create: `src/features/room/components/room-phase-router.tsx`
- Create: `tests/features/room/lobby-screen.test.tsx`

- [ ] Write failing lobby rendering tests
- [ ] Implement SSR room page with current room fetch
- [ ] Implement realtime query hook and lobby UI
- [ ] Add host-only start action wiring

### Task 6: Add Database Migration And Final Validation

**Files:**
- Create: `supabase/migrations/20260418_sprint_1_lobby.sql`
- Modify: `.env.example`
- Modify: `CLAUDE.md`

- [ ] Add migration SQL for `players.user_id`, uniqueness, and baseline RLS direction
- [ ] Document any new environment expectations
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm build`, and targeted tests

## Self-Review

- Spec coverage: identity, reattach, SSR room page, Server Actions, realtime lobby, and host start are all represented.
- Placeholder scan: no implementation areas are left as generic TODOs.
- Type consistency: all planned file paths follow the project kebab-case convention and current Sprint 0 structure.

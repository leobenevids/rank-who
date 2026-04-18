# Sprint 0 Setup Design

**Date:** 2026-04-17
**Scope:** Establish the initial RankWho application scaffold with a stable, modern, compatible stack baseline.

## Goal

Create a working Next.js 16.2 application skeleton for RankWho with the project structure, shared providers, UI primitives, and configuration required to start feature development.

## Stack Baseline

- Node.js 24 LTS
- pnpm 10
- Next.js 16.2.x
- React 19.1.1
- TypeScript 5.9.x
- Tailwind CSS 4.1.x
- ESLint 9.x
- Supabase SSR/client packages
- React Hook Form + Zod
- TanStack Query v5
- Framer Motion

## Approach

Use `create-next-app@latest` as the framework bootstrap, then layer RankWho-specific structure and dependencies on top. This keeps the generated baseline aligned with the official Next.js setup while preserving a clean separation between framework defaults and project architecture.

## Deliverables

- Next.js app scaffold under the current repository root
- `src/` layout following the Tomato Architecture baseline
- Tailwind 4 and global styling prepared for the future pixel-art design system
- Shared Query provider wired into the root layout
- Supabase client/server/middleware utility files scaffolded
- Shared UI primitives for pixel-styled surfaces and inputs
- `.env.example` documenting required environment variables
- `package.json` scripts for dev, build, lint, typecheck, and database type generation

## Boundaries

Sprint 0 does not implement gameplay, room flow, or real Supabase project provisioning. It prepares the codebase so those tasks can be added safely in later sprints.

The following items are prepared but not fully completed without external credentials:

- Supabase project connection
- Real database schema application
- Generated `database.ts` from a live Supabase project
- End-to-end smoke test against a live backend

## Architecture Decisions

### App bootstrap

The repository will become a standard App Router Next.js project using `src/`. The root app page will stay intentionally minimal, serving as a safe smoke-test surface instead of prematurely implementing the game lobby.

### Project structure

The file layout will follow the documented Tomato Architecture from `CLAUDE.md` and `.claude/skills/tomato-arch.md`, with empty feature directories created up front so later sprint work can land without restructuring.

### Shared runtime

TanStack Query will be initialized through a root `Providers` component. Supabase helpers will be scaffolded using the SSR package pattern, but runtime calls must tolerate missing environment variables during early local setup.

### Styling baseline

Global styles will be updated to establish theme tokens and a neutral page shell, while avoiding overcommitting to finished visual design in Sprint 0. The pixel component primitives will provide a first reusable UI layer for later feature screens.

## Validation Strategy

Validation for Sprint 0 is local and incremental:

- install dependencies successfully
- run lint
- run typecheck
- run build if dependencies and environment permit
- confirm the home page renders with the root providers in place

Supabase-backed validation is explicitly deferred until real credentials and a project ID are available.

## Risks And Mitigations

- `create-next-app` may evolve flags or generated defaults. Mitigation: prefer the official scaffold and adjust generated files after creation.
- Some package latest tags may drift independently. Mitigation: use the latest stable compatible set rather than forcing arbitrary newest versions.
- Missing Supabase credentials can block full smoke testing. Mitigation: scaffold integration points and keep the app bootable without a live backend.

## Success Criteria

- The repository contains a bootable Next.js 16.2 app
- The documented folder structure exists
- Shared providers and UI primitives compile cleanly
- Local scripts run without structural configuration errors
- The codebase is ready for Sprint 1 implementation work

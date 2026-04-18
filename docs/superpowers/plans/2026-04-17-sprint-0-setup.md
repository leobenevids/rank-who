# Sprint 0 Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the initial RankWho application scaffold with Next.js 16.2, the shared project structure, base dependencies, and bootable local runtime.

**Architecture:** Start from the official Next.js App Router scaffold, then layer in the documented Tomato Architecture, shared runtime providers, and reusable pixel UI primitives. Keep external backend integration prepared but non-blocking so the app remains locally bootable without Supabase credentials.

**Tech Stack:** Node.js 24 LTS, pnpm 10, Next.js 16.2.x, React 19.1.1, TypeScript 5.9.x, Tailwind CSS 4.1.x, Supabase SSR, TanStack Query v5, React Hook Form, Zod, Framer Motion.

---

### Task 1: Bootstrap The Next.js App

**Files:**
- Create: `package.json`
- Create: `pnpm-lock.yaml`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `eslint.config.mjs`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Scaffold the app with the official generator**

Run: `pnpm create next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --yes`

Expected: a complete App Router project is generated in the repository root.

- [ ] **Step 2: Inspect generated files**

Run: `rg --files`

Expected: `package.json`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, and TypeScript config files are present.

- [ ] **Step 3: Normalize generated files to the RankWho baseline**

Update the generated app shell to keep the home page minimal and neutral for smoke testing, without adding game logic yet.

- [ ] **Step 4: Run lint on the scaffold**

Run: `pnpm lint`

Expected: PASS.

### Task 2: Install The Project Dependency Baseline

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Add runtime dependencies**

Run: `pnpm add @radix-ui/react-slot class-variance-authority clsx tailwind-merge framer-motion @supabase/supabase-js @supabase/ssr react-hook-form @hookform/resolvers zod @tanstack/react-query`

Expected: dependencies are added successfully.

- [ ] **Step 2: Add development dependencies**

Run: `pnpm add -D @tanstack/react-query-devtools @types/node supabase`

Expected: dev dependencies are added successfully.

- [ ] **Step 3: Initialize shadcn/ui**

Run: `pnpm dlx shadcn@latest init -y`

Expected: base shadcn configuration files are created or updated without breaking the project.

- [ ] **Step 4: Re-run lint after dependency installation**

Run: `pnpm lint`

Expected: PASS.

### Task 3: Create The RankWho Directory Structure

**Files:**
- Create: `src/features/room/components/.gitkeep`
- Create: `src/features/room/hooks/.gitkeep`
- Create: `src/features/room/actions/.gitkeep`
- Create: `src/features/room/lib/.gitkeep`
- Create: `src/features/suggesting/components/.gitkeep`
- Create: `src/features/suggesting/hooks/.gitkeep`
- Create: `src/features/suggesting/actions/.gitkeep`
- Create: `src/features/suggesting/lib/.gitkeep`
- Create: `src/features/picking/components/.gitkeep`
- Create: `src/features/picking/hooks/.gitkeep`
- Create: `src/features/picking/actions/.gitkeep`
- Create: `src/features/picking/lib/.gitkeep`
- Create: `src/features/ranking/components/.gitkeep`
- Create: `src/features/ranking/hooks/.gitkeep`
- Create: `src/features/ranking/actions/.gitkeep`
- Create: `src/features/ranking/lib/.gitkeep`
- Create: `src/features/guessing/components/.gitkeep`
- Create: `src/features/guessing/hooks/.gitkeep`
- Create: `src/features/guessing/actions/.gitkeep`
- Create: `src/features/guessing/lib/.gitkeep`
- Create: `src/features/results/components/.gitkeep`
- Create: `src/features/results/hooks/.gitkeep`
- Create: `src/features/results/actions/.gitkeep`
- Create: `src/features/results/lib/.gitkeep`
- Create: `src/shared/components/ui/.gitkeep`
- Create: `src/shared/hooks/.gitkeep`
- Create: `src/shared/lib/supabase/.gitkeep`
- Create: `src/shared/schemas/.gitkeep`
- Create: `src/shared/types/.gitkeep`

- [ ] **Step 1: Create the feature and shared directory tree**

Run: PowerShell commands to create the documented directories inside `src/`.

Expected: the Tomato Architecture scaffold exists and matches the documented shape.

- [ ] **Step 2: Add placeholder keep files where needed**

Use empty `.gitkeep` files so the directories are preserved even before Sprint 1 implementation.

- [ ] **Step 3: Verify the tree**

Run: `Get-ChildItem -Recurse src`

Expected: all feature and shared directories are present.

### Task 4: Add Shared Runtime Providers And Utilities

**Files:**
- Create: `src/app/providers.tsx`
- Create: `src/shared/lib/query-client.ts`
- Create: `src/shared/lib/utils.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Add a query client factory**

Create `src/shared/lib/query-client.ts` with a stable QueryClient factory suitable for App Router client providers.

- [ ] **Step 2: Add a root providers component**

Create `src/app/providers.tsx` as a client component that mounts `QueryClientProvider` and optionally React Query Devtools in development.

- [ ] **Step 3: Add shared utility helper**

Create `src/shared/lib/utils.ts` with the standard `cn()` class merge helper built from `clsx` and `tailwind-merge`.

- [ ] **Step 4: Wire providers into the root layout**

Update `src/app/layout.tsx` so the application tree renders inside `<Providers>`.

- [ ] **Step 5: Run typecheck**

Run: `pnpm exec tsc --noEmit`

Expected: PASS.

### Task 5: Scaffold Supabase Integration Points

**Files:**
- Create: `src/shared/lib/supabase/client.ts`
- Create: `src/shared/lib/supabase/server.ts`
- Create: `src/shared/lib/supabase/middleware.ts`
- Create: `middleware.ts`
- Create: `.env.example`

- [ ] **Step 1: Add environment variable contract**

Create `.env.example` with:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 2: Add browser Supabase client helper**

Create a helper that reads the public URL and anon key and throws a clear error only when the client is actually instantiated without configuration.

- [ ] **Step 3: Add server Supabase helper**

Create the SSR server helper using `@supabase/ssr` and Next.js `cookies()`.

- [ ] **Step 4: Add middleware helper and root middleware**

Create the shared middleware helper and a root `middleware.ts` that delegates to it for session refresh wiring.

- [ ] **Step 5: Run lint**

Run: `pnpm lint`

Expected: PASS.

### Task 6: Add Base Pixel UI Primitives

**Files:**
- Create: `src/shared/components/ui/pixel-box.tsx`
- Create: `src/shared/components/ui/pixel-btn.tsx`
- Create: `src/shared/components/ui/pixel-input.tsx`
- Create: `src/shared/components/ui/progress-blocks.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add theme tokens to global CSS**

Extend `src/app/globals.css` with project color variables, font variables, and a neutral pixel-inspired page baseline.

- [ ] **Step 2: Implement `pixel-box.tsx`**

Create a reusable framed surface component for later screens.

- [ ] **Step 3: Implement `pixel-btn.tsx`**

Create a typed button primitive with variants and disabled/loading-friendly styling.

- [ ] **Step 4: Implement `pixel-input.tsx`**

Create a typed input primitive compatible with future React Hook Form usage.

- [ ] **Step 5: Implement `progress-blocks.tsx`**

Create a lightweight visual progress indicator for waiting states.

- [ ] **Step 6: Run typecheck**

Run: `pnpm exec tsc --noEmit`

Expected: PASS.

### Task 7: Prepare Scripts And The Home Smoke-Test Surface

**Files:**
- Modify: `package.json`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Verify package scripts**

Ensure `package.json` exposes:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "db:types": "supabase gen types typescript --project-id SEU_PROJECT_ID > src/shared/types/database.ts"
  }
}
```

- [ ] **Step 2: Build a minimal home page**

Update `src/app/page.tsx` to render a simple RankWho shell using the shared pixel components so the app boot confirms the shared layer compiles.

- [ ] **Step 3: Run lint and typecheck**

Run:
- `pnpm lint`
- `pnpm typecheck`

Expected: PASS on both commands.

### Task 8: Run Smoke Validation

**Files:**
- No file changes required

- [ ] **Step 1: Run the production build**

Run: `pnpm build`

Expected: PASS, unless blocked by missing external credentials.

- [ ] **Step 2: Run the dev server smoke test**

Run: `pnpm dev`

Expected: the application starts locally and serves the minimal home page.

- [ ] **Step 3: Record external blockers explicitly**

If live Supabase validation cannot run, note that `database.ts` generation and live select tests remain pending until credentials and project ID are available.

## Self-Review

- Spec coverage: the plan covers bootstrap, dependencies, structure, providers, Supabase scaffolding, UI primitives, scripts, and smoke validation.
- Placeholder scan: external Supabase-dependent work is explicitly marked as blocked by credentials instead of left ambiguous.
- Type consistency: all referenced files, packages, and script names match the approved Sprint 0 design.

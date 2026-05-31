# Plan: Make Tool Glossary Follow Functional Naming Pattern

## Problem

The tool glossary (`toolKnowledge.ts`) uses commercial brand names as primary labels for many entries, while the wizard (`conversationalFlow.ts`) follows a functional naming convention (e.g. `'Push-to-deploy cloud'` with `'(e.g. Vercel, Netlify)'` in the description). Per CLAUDE.md rule: *"Do not reference brand names as primary labels — use functional category names with `(e.g. ...)` in the `desc` field"*.

Additionally, several commercial services referenced in the wizard options have no tool glossary entry at all.

## Changes

### A. Update existing `toolKnowledge.ts` entries — change `name` to functional, keep brand in `tagline`/`what`

| ID | Current `name` | New `name` | New `tagline` |
|---|---|---|---|
| `vercel` | `'Vercel'` | `'Serverless Edge Platform'` | `'Push-to-deploy cloud platform for frontend and fullstack (e.g. Vercel)'` |
| `railway` | `'Railway / Render'` | `'Container PaaS'` | `'Managed container platform — always-on servers (e.g. Railway, Render)'` |
| `supabase` | `'Supabase'` | `'Backend-as-a-Service (BaaS)'` | `'Open-source Firebase alternative — managed Postgres + auth + storage (e.g. Supabase)'` |
| `supabase_auth` | `'Supabase Auth'` | `'Platform Auth SDK'` | `'Authentication built into your BaaS platform (e.g. Supabase Auth)'` |
| `clerk` | `'Clerk'` | `'Managed Auth Service'` | `'Drop-in auth with pre-built UI components (e.g. Clerk)'` |
| `sentry` | `'Sentry'` | `'Error Monitoring Service'` | `'Real-time error tracking and performance monitoring (e.g. Sentry)'` |

> **Not changing**: `nextjs` (open-source framework, not a commercial platform), `mongodb` (database name is also the generic term), `react`/`vue`/`svelte` (open-source libraries).

### B. Add missing tool glossary entries for services referenced in the wizard

| ID | `name` | `tagline` |
|---|---|---|
| `planetscale` | `'Serverless MySQL'` | `'Branch-based MySQL database for serverless apps (e.g. PlanetScale)'` |
| `neon` | `'Serverless Postgres'` | `'Auto-scaling Postgres that pauses when idle (e.g. Neon)'` |
| `turso` | `'Edge SQLite'` | `'SQLite replicated globally at the edge (e.g. Turso)'` |
| `stripe` | `'Payment Gateway'` | `'Online payment processing for internet businesses (e.g. Stripe)'` |
| `lemon_squeezy` | `'Merchant of Record'` | `'Global tax-compliant payment processing (e.g. Lemon Squeezy, Paddle)'` |

### C. Update `TOOL_GROUPS` in `LearnMore.tsx` to include new entries

Add the new IDs to the appropriate groups:
- `'Database'` group: add `'planetscale'`, `'neon'`, `'turso'`
- `'Backend'` group: add `'stripe'`, `'lemon_squeezy'`

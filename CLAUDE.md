# CLAUDE.md — Web_flow: Full-Stack Decision Map & Stack Builder

## What this app does

A **stack decision wizard** for vibe-coders and developers. The user answers branching questions about their project (app type, hosting, database, auth, frontend, backend, styling, AI, payments). The app generates two outputs: a **ready-to-paste AI prompt** for Cursor/Claude/ChatGPT, and a **shell setup command script** to bootstrap the project.

Built with React + Vite + Tailwind. Pure frontend — no backend, no server, no API calls. Runs fully in the browser.

---

## Tab flow

| Tab | Component | Purpose |
|---|---|---|
| Flow | `ConversationalFlow.tsx` | Branching wizard — one question at a time, state persisted to localStorage |
| Graphs | `VisualFlowchart.tsx` | Mermaid diagram of the chosen stack + full ecosystem map |
| Builder | `Vibecoder.tsx` | Improvement checklists → generates the final AI prompt |
| Learn | `LearnMore.tsx` | Tool glossary drawer + learning roadmap |

`App.tsx` holds `wizardAnswers: AnswerMap` in state and passes it to `VisualFlowchart` and `Vibecoder` as read-only props. Both tabs are consumers — they do not write answers back.

---

## Key files

| File | Role |
|---|---|
| `src/data/conversationalFlow.ts` | All questions, options, branching (`next` maps), compat rules, `getNextQuestion()`, `getCompatSignal()` |
| `src/components/ConversationalFlow.tsx` | Wizard UI, history breadcrumb, results panel, setup command generator (`getSetupCommands()`), AI prompt (`getAIPrompt()`) |
| `src/components/Vibecoder.tsx` | Improvement checklists, `buildBasePrompt()`, `promptSnippet` functions |
| `src/components/VisualFlowchart.tsx` | Per-stack Mermaid diagram + full ecosystem map (`FULL_MAP_DEFINITION`) |
| `src/data/predefinedStacks.ts` | Static stack presets used in `LearnMore` and `Header` count |
| `src/data/toolKnowledge.ts` | Tool glossary entries — `what`, `why`, `beginner`, `alternatives`, `usedWith` |

---

## AnswerMap — the data contract

```ts
type AnswerMap = Record<string, string | string[]>
```

All question IDs and their valid answer IDs:

| Key | Valid values |
|---|---|
| `app_type` | `saas`, `realtime`, `dashboard`, `ecommerce`, `ai_app`, `landing` |
| `deploy_target` | `vercel`, `railway`, `vps`, `supabase_hosting`, `aws` |
| `db_for_vercel` | `supabase`, `planetscale`, `neon`, `turso`, `mongodb_atlas` |
| `db_general` | `postgres_self`, `supabase`, `mysql_self`, `mongodb_atlas`, `sqlite` |
| `auth_supabase` | `supabase_auth_yes`, `supabase_auth_no` |
| `auth_strategy` | `email_password`, `oauth_only`, `email_plus_oauth`, `magic_link`, `no_auth` |
| `email_verification` | `verify_required`, `verify_optional` |
| `auth_providers` | `string[]` — `google`, `github`, `discord` |
| `auth_library` | `nextauth`, `clerk`, `better_auth`, `supabase_auth_lib`, `custom_jwt` |
| `frontend_choice` | `nextjs`, `react_vite`, `sveltekit`, `vue_nuxt`, `vanilla` |
| `backend_choice` | `nextjs_api`, `sveltekit_api`, `express_node`, `fastapi_py`, `go_backend`, `supabase_edge` |
| `styling_choice` | `tailwind`, `shadcn`, `shadcn_svelte`, `nuxt_ui`, `css_modules`, `bootstrap` |
| `ai_integration` | `no_ai`, `llm_chat`, `rag_vector`, `agents` |
| `payments` | `no_payments`, `stripe`, `lemon_squeezy` |

---

## Compatibility system (`compat`)

Every `FlowOption` has an optional `compat?: CompatibilityRule[]`. Rules are evaluated by `getCompatSignal(opt, answers)` which returns `recommended | incompatible | neutral`.

`OptionCard` in `ConversationalFlow.tsx` calls `getCompatSignal` and renders:
- Green border + "✓ Best match" badge + reason text → `recommended`
- Red border + dimmed opacity + "✗ Not recommended" + "⚠ reason" → `incompatible`
- Default styling → `neutral`

Rules fire when **all** `when` conditions match (AND logic). First matching rule wins.

---

## `promptSnippet` — framework-aware functions

`CheckItem.promptSnippet` is `(answers: AnswerMap) => string`. It reads `answers['frontend_choice']`, `answers['backend_choice']`, and the DB key to return the correct library name for the user's chosen stack.

**Do not write `promptSnippet` as a plain string.** Every item must be a function. Framework mapping:

| Concern | Next.js | SvelteKit | Vue/Nuxt | React/Vite |
|---|---|---|---|---|
| Fonts | `next/font/google` | `@fontsource/*` | `@nuxtjs/i18n` / link tag | `<link>` tag |
| Animations | Framer Motion | `svelte/transition` | `<Transition>` / @vueuse/motion | Framer Motion |
| Toasts | sonner | svelte-sonner | vue-toastification | sonner |
| Confirm dialog | shadcn AlertDialog | bits-ui Dialog | Nuxt UI Modal | generic modal |
| Breadcrumb | shadcn + usePathname | `$page.url.pathname` | `useRoute()` | URL split |
| i18n | next-intl | paraglide-js | @nuxtjs/i18n | /locales JSON |
| Charts | recharts | layerchart | vue-chartjs | recharts |
| Images | next/image | @sveltejs/enhanced-img | NuxtImg | native lazy |
| Rate limiting | Redis middleware | based on backend choice | | |

---

## Branching rules (read before editing `conversationalFlow.ts`)

- `next` map: key = answer `id`, value = next question `id`. Use `'*'` as fallback.
- `FLOW_START = 'project_name'` — always the entry point.
- `'done'` sentinel in `next` → `getNextQuestion()` returns `null`.
- Context-sensitive skips in `getNextQuestion()`:
  - `deploy_target === 'supabase_hosting'` skips `backend_choice` → goes to `styling_choice`
  - `auth_supabase === 'supabase_auth_yes'` skips `auth_library`
  - `app_type === 'landing' | 'dashboard'` skips `ai_integration` and `payments`

---

## Setup command generator (`getSetupCommands()`)

Lives in `ConversationalFlow.tsx` inside `ResultsPanel`. Generates shell commands based on the full `AnswerMap`. All option IDs must be handled here — when you add a new option to `conversationalFlow.ts`, add the corresponding install commands here too.

Current coverage: all frontend init commands, all DB clients (including `turso`, `planetscale`, `mongodb_atlas` with Python support), all auth libraries (`nextauth` with per-frontend adapter, `clerk` with per-frontend SDK, `better_auth`, `supabase_auth_lib`, `custom_jwt`), all styling init (`shadcn`, `shadcn_svelte`, `nuxt_ui`, `tailwind`), AI SDKs (JS and Python), payments (`stripe` with Python, `lemon_squeezy`).

---

## Dev setup

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint       # tsc --noEmit
npm run build      # production build to /dist
```

No backend. No env vars required for the wizard. `.env.local` only needed if Gemini AI generation features are active.

---

## Design system

| Token | Value |
|---|---|
| Background | `#F4F4F5` (off-white canvas) |
| Text / headers | `#18181B` (charcoal) |
| Accent | `#2563EB` (blue-600) |
| Code / metadata | `font-mono` |
| Min readable font | `0.875rem` (14px) — `0.75rem` only for badges/labels |
| Line height | 1.5 minimum on all body text |

---

## What NOT to do

- Do not add a backend server — intentionally frontend-only
- Do not use CommonJS `require()` — ESM throughout
- Do not write `promptSnippet` as a plain string — must be `(answers: AnswerMap) => string`
- Do not add a new option ID to `FLOW_QUESTIONS` without: (1) wiring its `next` map, (2) adding compat rules, (3) handling it in `getSetupCommands()`
- Do not reference brand names as primary labels — use functional category names with `(e.g. ...)` in the `desc` field
- `StackComparisonMatrix.tsx` was deleted — do not recreate it; the predefined stacks are shown in `LearnMore` instead

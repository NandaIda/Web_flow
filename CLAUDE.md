# CLAUDE.md — Web_flow: Full-Stack Decision Map & Stack Builder

## What this app does

This is a **stack decision wizard** — a tool that helps developers choose and configure their tech stack through a guided conversational flow, then generates a ready-to-paste AI prompt (for Cursor, Claude, ChatGPT) based on their choices.

It is a **React + Vite + Tailwind** single-page app hosted on AI Studio / Node.js. It has no backend of its own — it is a pure frontend utility.

---

## User flow (tabs in order)

1. **Flow** (`ConversationalFlow.tsx`) — branching wizard. User answers questions one at a time. Each answer determines the next question via the `next` map in `conversationalFlow.ts`.
2. **Graphs** (`VisualFlowchart.tsx`) — renders a Mermaid diagram of the chosen stack topology based on wizard answers.
3. **Builder / Vibecoder** (`Vibecoder.tsx`) — shows improvement checklists (UI, UX, Security, Perf, Personalization). Checked items inject `promptSnippet` strings into the final AI prompt. The prompt is built by `buildBasePrompt()` in `Vibecoder.tsx`.
4. **Learn** (`LearnMore.tsx`) — glossary of tools with a tool-knowledge drawer, and a learning roadmap.

State flows: `App.tsx` holds `wizardAnswers: AnswerMap` and passes it down to `VisualFlowchart` and `Vibecoder`. Both are read-only consumers of the wizard output.

---

## Key files and their roles

| File | Role |
|---|---|
| `src/data/conversationalFlow.ts` | All wizard questions, options, branching logic, `getNextQuestion()` |
| `src/components/ConversationalFlow.tsx` | Wizard UI — renders questions, history, answer cards |
| `src/components/Vibecoder.tsx` | Checklist UI + `buildBasePrompt()` — generates the AI prompt |
| `src/components/VisualFlowchart.tsx` | Mermaid diagram of the chosen stack |
| `src/data/predefinedStacks.ts` | Static stack presets shown in a comparison matrix |
| `src/data/toolKnowledge.ts` | Tool glossary entries used in LearnMore and flowchart tooltips |
| `src/App.tsx` | Tab routing, state wiring, layout |

---

## The cross-check problem (core known issue)

`buildBasePrompt()` in `Vibecoder.tsx` appends improvement `promptSnippet` strings **unconditionally** — regardless of which frontend the user chose. This produces incorrect output when the user picks a non-React frontend.

**The problem**: checklist items contain React/Next.js-specific library names hardcoded in their `promptSnippet` field. When a user picks SvelteKit or Vue+Nuxt as their frontend, the generated prompt incorrectly instructs them to use React-only tools.

**Known mismatches by frontend**:

| `promptSnippet` content | Only valid for `frontend_choice` |
|---|---|
| `next/image`, `next/font` | `nextjs` |
| `Framer Motion` | `nextjs`, `react_vite` |
| `shadcn AlertDialog`, `shadcn Breadcrumb` | `nextjs`, `react_vite` |
| `react-hot-toast`, `sonner` (React) | `nextjs`, `react_vite` |
| `react-dropzone` | `nextjs`, `react_vite` |
| `next-intl` | `nextjs` |
| `tailwind.config.ts` (TS config) | `nextjs`, `react_vite` (not Svelte's JS config) |
| `recharts` | `nextjs`, `react_vite` (Svelte has `layerchart`, `svelte-chartjs`) |

**Correct equivalents for SvelteKit**:
- `svelte-sonner` for toasts
- `svelte/transition` or `@motionone/svelte` for animations
- `shadcn-svelte` or `bits-ui` for components
- `@sveltejs/enhanced-img` for image optimization
- Auth.js SvelteKit adapter (not Next.js adapter)
- `svelte-i18n` or `paraglide-js` for i18n

**When fixing**: the `promptSnippet` field on `CheckItem` should either:
- Be replaced with a function `(answers: AnswerMap) => string` that returns the correct library name, OR
- The `buildBasePrompt()` function should apply a mapping layer before injecting snippets, keyed on `answers['frontend_choice']`

---

## Branching logic rules (important for edits to `conversationalFlow.ts`)

- `next` map: key is the answer `id`, value is the next question `id`. Use `'*'` as fallback.
- `getNextQuestion()` in `conversationalFlow.ts` contains **context-sensitive skips** — read these before adding new questions:
  - Supabase BaaS hosting skips `backend_choice` → goes straight to `styling_choice`
  - Supabase Auth (built-in) skips `auth_library`
  - `landing` and `dashboard` app types skip `ai_integration` and `payments`
- `FLOW_START = 'project_name'` — always the entry point
- `'done'` is a terminal sentinel in `next` maps — `getNextQuestion()` returns `null` for it

---

## Data model: `AnswerMap`

```ts
type AnswerMap = Record<string, string | string[]>
```

Key question IDs that drive prompt generation in `buildBasePrompt()`:

| Key | Type | Notes |
|---|---|---|
| `project_name` | `string` | |
| `project_description` | `string` | |
| `app_type` | `string` | `saas`, `realtime`, `dashboard`, `ecommerce`, `ai_app`, `landing` |
| `deploy_target` | `string` | `vercel`, `railway`, `vps`, `supabase_hosting`, `aws` |
| `db_for_vercel` | `string` | set when `deploy_target === 'vercel'` |
| `db_general` | `string` | set otherwise |
| `auth_strategy` | `string` | `email_password`, `oauth_only`, `email_plus_oauth`, `magic_link`, `no_auth` |
| `auth_library` | `string` | `nextauth`, `clerk`, `better_auth`, `supabase_auth_lib`, `custom_jwt` |
| `auth_providers` | `string[]` | multi-select: `google`, `github`, `discord` |
| `email_verification` | `string` | `verify_required`, `verify_optional` |
| `frontend_choice` | `string` | `nextjs`, `react_vite`, `sveltekit`, `vue_nuxt`, `vanilla` |
| `backend_choice` | `string` | `nextjs_api`, `express_node`, `fastapi_py`, `go_backend`, `supabase_edge` |
| `styling_choice` | `string` | `tailwind`, `shadcn`, `css_modules`, `bootstrap` |
| `ai_integration` | `string` | `no_ai`, `llm_chat`, `rag_vector`, `agents` |
| `payments` | `string` | `no_payments`, `stripe`, `lemon_squeezy` |

---

## Dev setup

```bash
npm install
# Set GEMINI_API_KEY in .env.local
npm run dev   # runs on http://localhost:3000
```

No backend server. Vite serves everything. The Gemini API key is only needed if AI features are active — the wizard itself runs fully offline.

---

## Design system

- Background: `#F4F4F5` (off-white)
- Headers/text: `#18181B` (charcoal)
- Accent: `#2563EB` (blue-600)
- Font: sans-serif body, `font-mono` for specs and code snippets
- Minimum font size: `0.875rem` (14px) for any user-readable text; `0.75rem` (12px) for labels/badges only
- All layouts must be mobile-first responsive

---

## What NOT to do

- Do not add a separate backend server — this app is intentionally frontend-only
- Do not use CommonJS `require()` — ESM throughout
- Do not hardcode React/Next.js library names in `promptSnippet` strings without a frontend-aware mapping
- Do not add questions to `FLOW_QUESTIONS` without also wiring them into the `next` map of their predecessor and updating `getNextQuestion()` if they need context-sensitive skips

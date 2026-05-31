# Full-Stack Decision Map & Stack Builder

A guided wizard that helps developers choose the right tech stack and generates a production-ready AI prompt (for Cursor, Claude, or ChatGPT) based on their answers.

## What it does

1. **Stack Wizard** — branching conversational flow. Asks questions about app type, deployment target, database, auth, frontend, backend, and styling. Each answer determines the next question.
2. **Visual Flowchart** — renders a Mermaid diagram of the chosen stack architecture.
3. **Prompt Builder (Vibecoder)** — improvement checklists (UI, UX, Security, Performance, Personalization). Checked items are injected into a generated AI prompt ready to paste into any AI coding tool.
4. **Learn** — tool glossary and learning roadmap for each technology in the wizard.

## Tech stack

- **React 19 + Vite** — frontend only, no backend server
- **Tailwind CSS v4** — utility styling
- **Motion (Framer Motion)** — page transitions and animations
- **Mermaid** — flowchart rendering
- **Lucide React** — icons
- **TypeScript** throughout

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

No backend required. The wizard runs entirely in the browser. The Gemini API key in `.env.local` is only needed if AI generation features are enabled.

```bash
cp .env.example .env.local
# Add your GEMINI_API_KEY if needed
```

## Project structure

```
src/
  components/
    ConversationalFlow.tsx   # wizard UI and branching renderer
    VisualFlowchart.tsx      # Mermaid diagram of chosen stack
    Vibecoder.tsx            # checklist + AI prompt builder
    LearnMore.tsx            # tool glossary and roadmap
    Header.tsx
    TabsNavigation.tsx
    Footer.tsx
  data/
    conversationalFlow.ts    # all questions, options, and branching logic
    predefinedStacks.ts      # static stack comparison presets
    toolKnowledge.ts         # tool glossary entries
  App.tsx                    # tab routing and state wiring
```

## Known limitation: cross-framework prompt accuracy

The prompt builder currently injects improvement snippets (e.g. `next/image`, `Framer Motion`, `shadcn`) without checking which frontend the user chose. If you pick **SvelteKit** or **Vue + Nuxt**, some generated prompt lines will incorrectly reference React/Next.js-specific libraries.

This is a tracked issue — see `CLAUDE.md` for the full mapping of which snippets apply to which frontends and the planned fix.

## Build

```bash
npm run build    # outputs to /dist
npm run preview  # preview the production build
```

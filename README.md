# Full-Stack Decision Map & Stack Builder

A wizard that turns stack decisions into a production-ready AI prompt and shell setup script. Answer questions about your project, get a prompt you can paste straight into Cursor, Claude, or ChatGPT.

## Who it's for

Anyone who wants to build a web app but doesn't want to spend hours researching which tools go together — especially vibe-coders who rely on AI to write the code but still need to make foundational decisions before the AI can help effectively.

## What it does

**1. Stack Wizard (Flow tab)**
Branching questions, one at a time: app type → hosting → database → auth → frontend → backend → styling → AI → payments. Each answer shapes the next question. Previous choices are remembered — go back and change anything.

As you answer, every subsequent option shows a **Best Match** or **Not Recommended** badge based on what you've already chosen. Pick SvelteKit and shadcn/ui turns red. Pick Next.js and it turns green. The wizard knows which tools are compatible.

**2. Visual Diagram (Graphs tab)**
Renders a Mermaid flowchart of your specific chosen stack. Also shows a full ecosystem map of all possible paths from frontend to production.

**3. Prompt Builder (Builder tab)**
Improvement checklists across five categories: UI, UX, Personalization, Security, Performance. Check what you want. The AI prompt on the right updates live — and every snippet uses the correct library for your chosen framework (not hardcoded React/Next.js names regardless of what you picked).

Copy the prompt. Paste into any AI coding tool. Start building.

**4. Learn tab**
Tool glossary with plain-English explanations of every technology in the wizard: what it is, why it exists, beginner advice, difficulty rating, and what it pairs with.

## Tech stack

- React 19 + Vite — SPA, no backend
- Tailwind CSS v4
- Motion (Framer Motion) — transitions
- Mermaid — diagram rendering
- TypeScript throughout

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
```

No backend required. No API keys needed for the wizard itself.

## Project structure

```
src/
  components/
    ConversationalFlow.tsx   # wizard UI, history, results, setup commands
    Vibecoder.tsx            # checklist + AI prompt builder
    VisualFlowchart.tsx      # Mermaid diagrams
    LearnMore.tsx            # tool glossary and roadmap
    Header.tsx / Footer.tsx / TabsNavigation.tsx
  data/
    conversationalFlow.ts    # all questions, options, branching, compat rules
    predefinedStacks.ts      # static stack presets
    toolKnowledge.ts         # tool glossary content
  App.tsx
```

## Build

```bash
npm run build      # output to /dist
npm run lint       # TypeScript type check
```

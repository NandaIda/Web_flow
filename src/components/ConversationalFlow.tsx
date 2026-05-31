import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { getMermaid } from '../utils/mermaid';
import {
  ArrowRight, Check, ChevronRight, AlertTriangle, CheckCircle2,
  Copy, Terminal, Layers, FileCode2, RotateCcw, ChevronDown,
  Map, BookOpen, Clock, Code2, Link2, ExternalLink, XCircle, BookMarked
} from 'lucide-react';
import { LEARNING_ROADMAP } from '../data/toolKnowledge';
import {
  FLOW_QUESTIONS, FLOW_START, getNextQuestion, getCompatSignal,
  AnswerMap, FlowQuestion, FlowOption
} from '../data/conversationalFlow';

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface HistoryEntry {
  questionId: string;
  answer: string | string[];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getLimitColor(limit: string): string {
  const lower = limit.toLowerCase();
  if (lower.includes('break') || lower.includes('not suitable') || lower.includes('lock') || lower.includes('lost'))
    return 'text-red-700 bg-red-50 border-red-200';
  if (lower.includes('cost') || lower.includes('fee') || lower.includes('$') || lower.includes('pause'))
    return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-zinc-600 bg-zinc-50 border-zinc-200';
}

// ─── OPTION CARD ──────────────────────────────────────────────────────────────

function OptionCard({
  opt,
  selected,
  multiSelected,
  isMulti,
  onClick,
  answers,
}: {
  key?: React.Key;
  opt: FlowOption;
  selected: boolean;
  multiSelected: boolean;
  isMulti: boolean;
  onClick: () => void;
  answers: AnswerMap;
}) {
  const [expanded, setExpanded] = useState(false);
  const active = isMulti ? multiSelected : selected;
  const compat = getCompatSignal(opt, answers);
  const isIncompat = compat.signal === 'incompatible';
  const isRecommended = compat.signal === 'recommended';

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded border-2 p-4 transition-all select-none group ${
        active
          ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-600/10'
          : isIncompat
          ? 'border-red-200 bg-red-50/40 hover:border-red-300 opacity-70'
          : isRecommended
          ? 'border-emerald-300 bg-emerald-50/40 hover:border-emerald-400 hover:shadow-sm'
          : 'border-[#D4D4D8] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-400 dark:hover:border-zinc-500 hover:shadow-sm'
      }`}
    >
      {/* header row */}
      <div className="flex items-start gap-3">
        {opt.icon && (
          <span className="text-xl shrink-0 mt-0.5">{opt.icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-extrabold text-base ${active ? 'text-blue-900' : isIncompat ? 'text-red-800' : 'text-zinc-900'}`}>
              {opt.label}
            </span>
            {/* compat badge — shown instead of static badge when a signal applies */}
            {isRecommended && !active && (
              <span className="text-xs bg-emerald-100 border border-emerald-400 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                ✓ Best match
              </span>
            )}
            {isIncompat && !active && (
              <span className="text-xs bg-red-100 border border-red-300 text-red-700 px-1.5 py-0.5 rounded font-bold">
                ✗ Not recommended
              </span>
            )}
            {!isRecommended && !isIncompat && opt.badge && (
              <span className="text-xs bg-emerald-50 border border-emerald-300 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">
                {opt.badge}
              </span>
            )}
            {active && (
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{opt.desc}</p>
          {/* compat reason line */}
          {compat.reason && !active && (
            <p className={`text-xs mt-1.5 font-medium leading-relaxed ${isIncompat ? 'text-red-600' : 'text-emerald-700'}`}>
              {isIncompat ? '⚠ ' : '→ '}{compat.reason}
            </p>
          )}
        </div>
      </div>

      {/* limits/advantages — always show 1 limit, rest behind toggle */}
      {((opt.limits && opt.limits.length > 0) || (opt.advantages && opt.advantages.length > 0)) && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          {/* advantages */}
          {opt.advantages?.slice(0, expanded ? 99 : 2).map((a, i) => (
            <div key={i} className="flex items-start gap-1.5 text-sm text-emerald-700 font-medium leading-relaxed">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span>{a}</span>
            </div>
          ))}
          {/* limits */}
          {opt.limits?.slice(0, expanded ? 99 : 1).map((l, i) => (
            <div key={i} className={`flex items-start gap-1.5 text-sm px-2 py-1 rounded border leading-relaxed ${getLimitColor(l)}`}>
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>{l}</span>
            </div>
          ))}

          {/* show more toggle */}
          {((opt.limits && opt.limits.length > 1) || (opt.advantages && opt.advantages.length > 2)) && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
              className="text-xs text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5"
            >
              <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              {expanded ? 'Show less' : `Show all details (${(opt.limits?.length ?? 0) + (opt.advantages?.length ?? 0)} total)`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── ASK AI PROMPT ───────────────────────────────────────────────────────────

function AskAIPrompt({ prompt, handleCopyClipboard }: { prompt: string; handleCopyClipboard: (t: string) => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    handleCopyClipboard(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-1">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        <BookMarked className="h-3.5 w-3.5" />
        Not sure? Copy a prompt to ask your AI
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded p-3 flex flex-col gap-2">
          <p className="text-xs text-blue-800 leading-relaxed font-mono">{prompt}</p>
          <button
            onClick={handleCopy}
            className="self-start flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded transition-all"
          >
            {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy prompt</>}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── QUESTION PANEL ───────────────────────────────────────────────────────────

function QuestionPanel({
  question,
  onAnswer,
  existingAnswer,
  answers,
  onKeyboardSelect,
}: {
  question: FlowQuestion;
  onAnswer: (answer: string | string[]) => void;
  existingAnswer?: string | string[];
  answers: AnswerMap;
  onKeyboardSelect?: (handler: (idx: number) => void) => void;
}) {
  const [textVal, setTextVal] = useState<string>(
    typeof existingAnswer === 'string' ? existingAnswer : ''
  );
  const [multiSel, setMultiSel] = useState<string[]>(
    Array.isArray(existingAnswer) ? existingAnswer : []
  );
  const [singleSel, setSingleSel] = useState<string>(
    typeof existingAnswer === 'string' && question.type === 'single' ? existingAnswer : ''
  );

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (question.type === 'text' || question.type === 'textarea') {
      (inputRef.current as HTMLElement)?.focus();
    }
  }, [question.id]);

  // Register keyboard select handler so the parent can trigger number key presses
  useEffect(() => {
    if (question.type === 'single' && onKeyboardSelect) {
      onKeyboardSelect((idx: number) => {
        const opt = question.options?.[idx];
        if (opt) handleSingleClick(opt.id);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id, question.type]);

  const handleSingleClick = (id: string) => {
    setSingleSel(id);
    // auto-advance on single select after tiny delay for visual feedback
    setTimeout(() => onAnswer(id), 120);
  };

  const toggleMulti = (id: string) => {
    setMultiSel(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  if (question.type === 'text') {
    return (
      <div className="flex flex-col gap-3">
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          className="bg-white dark:bg-zinc-800 border-2 border-[#D4D4D8] dark:border-zinc-600 focus:border-blue-500 text-gray-950 dark:text-zinc-100 font-bold placeholder-gray-400 dark:placeholder-zinc-500 py-3 px-4 text-base rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          value={textVal}
          onChange={e => setTextVal(e.target.value)}
          placeholder={question.placeholder}
          onKeyDown={e => { if (e.key === 'Enter' && textVal.trim()) onAnswer(textVal.trim()); }}
        />
        <button
          disabled={!textVal.trim()}
          onClick={() => onAnswer(textVal.trim())}
          className="self-start px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-sm rounded flex items-center gap-2 transition-all"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (question.type === 'textarea') {
    return (
      <div className="flex flex-col gap-3">
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          className="bg-white dark:bg-zinc-800 border-2 border-[#D4D4D8] dark:border-zinc-600 focus:border-blue-500 text-gray-950 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 py-3 px-4 text-sm rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed"
          rows={3}
          value={textVal}
          onChange={e => setTextVal(e.target.value)}
          placeholder={question.placeholder}
        />
        <button
          disabled={!textVal.trim()}
          onClick={() => onAnswer(textVal.trim())}
          className="self-start px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-sm rounded flex items-center gap-2 transition-all"
        >
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (question.type === 'single') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {question.options?.map(opt => (
          <OptionCard
            key={opt.id}
            opt={opt}
            selected={singleSel === opt.id}
            multiSelected={false}
            isMulti={false}
            onClick={() => handleSingleClick(opt.id)}
            answers={answers}
          />
        ))}
      </div>
    );
  }

  if (question.type === 'multi') {
    return (
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options?.map(opt => (
            <OptionCard
              key={opt.id}
              opt={opt}
              selected={false}
              multiSelected={multiSel.includes(opt.id)}
              isMulti={true}
              onClick={() => toggleMulti(opt.id)}
              answers={answers}
            />
          ))}
        </div>
        <button
          disabled={multiSel.length === 0}
          onClick={() => onAnswer(multiSel)}
          className="self-start px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-extrabold text-sm rounded flex items-center gap-2 transition-all mt-1"
        >
          Continue ({multiSel.length} selected) <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return null;
}

// ─── RESULTS PANEL ────────────────────────────────────────────────────────────

// ─── PERSONALISED LEARNING PATH ──────────────────────────────────────────────

interface LearnStep {
  topic: string;
  time: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  resource: string;
  resourceLabel: string;
}

function getLearningPath(answers: AnswerMap): LearnStep[] {
  const steps: LearnStep[] = [];
  const frontend = answers['frontend_choice'] as string;
  const backend = answers['backend_choice'] as string;
  const db = (answers['db_for_vercel'] || answers['db_general']) as string;
  const auth = answers['auth_strategy'] as string;
  const authLib = answers['auth_library'] as string;
  const deploy = answers['deploy_target'] as string;
  const ai = answers['ai_integration'] as string;

  // Step 1: Frontend
  const frontendResources: Record<string, { topic: string; url: string; label: string; time: string; diff: LearnStep['difficulty'] }> = {
    nextjs: { topic: 'Next.js fundamentals', url: 'https://nextjs.org/learn', label: 'Next.js official tutorial (free)', time: '6–8 hrs', diff: 'Intermediate' },
    react_vite: { topic: 'React basics', url: 'https://react.dev/learn', label: 'React.dev official guide (free)', time: '4–6 hrs', diff: 'Beginner' },
    sveltekit: { topic: 'SvelteKit fundamentals', url: 'https://learn.svelte.dev', label: 'learn.svelte.dev (interactive, free)', time: '4–6 hrs', diff: 'Beginner' },
    vue_nuxt: { topic: 'Vue + Nuxt basics', url: 'https://vuejs.org/tutorial/', label: 'Vue.js interactive tutorial (free)', time: '4–6 hrs', diff: 'Beginner' },
    vanilla: { topic: 'HTML, CSS & JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Learn', label: 'MDN Web Docs (free)', time: '10–20 hrs', diff: 'Beginner' },
  };
  const fe = frontendResources[frontend];
  if (fe) steps.push({ topic: fe.topic, time: fe.time, difficulty: fe.diff, resource: fe.url, resourceLabel: fe.label });

  // Step 2: Styling
  const stylingResources: Record<string, LearnStep> = {
    tailwind: { topic: 'Tailwind CSS', time: '2–3 hrs', difficulty: 'Beginner', resource: 'https://tailwindcss.com/docs', resourceLabel: 'Tailwind docs (free)' },
    shadcn: { topic: 'shadcn/ui components', time: '1–2 hrs', difficulty: 'Beginner', resource: 'https://ui.shadcn.com/docs', resourceLabel: 'shadcn/ui docs (free)' },
    shadcn_svelte: { topic: 'shadcn-svelte components', time: '1–2 hrs', difficulty: 'Beginner', resource: 'https://www.shadcn-svelte.com/docs', resourceLabel: 'shadcn-svelte docs (free)' },
    nuxt_ui: { topic: 'Nuxt UI components', time: '1–2 hrs', difficulty: 'Beginner', resource: 'https://ui.nuxt.com/getting-started', resourceLabel: 'Nuxt UI docs (free)' },
  };
  const styling = answers['styling_choice'] as string;
  const st = stylingResources[styling];
  if (st) steps.push(st);

  // Step 3: Backend / API
  if (backend === 'express_node') {
    steps.push({ topic: 'Express.js API basics', time: '3–4 hrs', difficulty: 'Intermediate', resource: 'https://expressjs.com/en/starter/hello-world.html', resourceLabel: 'Express.js docs (free)' });
  } else if (backend === 'fastapi_py') {
    steps.push({ topic: 'FastAPI with Python', time: '4–6 hrs', difficulty: 'Intermediate', resource: 'https://fastapi.tiangolo.com/tutorial/', resourceLabel: 'FastAPI tutorial (free)' });
  }

  // Step 4: Database
  const dbResources: Record<string, LearnStep> = {
    supabase: { topic: 'Supabase database & auth', time: '2–3 hrs', difficulty: 'Beginner', resource: 'https://supabase.com/docs/guides/getting-started', resourceLabel: 'Supabase getting started (free)' },
    postgres_self: { topic: 'PostgreSQL with Prisma ORM', time: '3–4 hrs', difficulty: 'Intermediate', resource: 'https://www.prisma.io/learn', resourceLabel: 'Prisma learn (free)' },
    neon: { topic: 'Neon Postgres + Prisma', time: '2–3 hrs', difficulty: 'Intermediate', resource: 'https://neon.tech/docs/get-started-with-neon/connect-neon', resourceLabel: 'Neon quickstart (free)' },
    mongodb_atlas: { topic: 'MongoDB Atlas basics', time: '2–3 hrs', difficulty: 'Beginner', resource: 'https://www.mongodb.com/docs/atlas/getting-started/', resourceLabel: 'MongoDB Atlas quickstart (free)' },
  };
  const dbStep = dbResources[db];
  if (dbStep) steps.push(dbStep);

  // Step 5: Auth
  if (auth !== 'no_auth') {
    const authResources: Record<string, LearnStep> = {
      nextauth: { topic: 'Auth.js setup & OAuth', time: '2–3 hrs', difficulty: 'Intermediate', resource: 'https://authjs.dev/getting-started', resourceLabel: 'Auth.js docs (free)' },
      clerk: { topic: 'Clerk auth integration', time: '1–2 hrs', difficulty: 'Beginner', resource: 'https://clerk.com/docs/quickstarts/nextjs', resourceLabel: 'Clerk quickstart (free)' },
      better_auth: { topic: 'BetterAuth setup', time: '2–3 hrs', difficulty: 'Intermediate', resource: 'https://www.better-auth.com/docs/installation', resourceLabel: 'BetterAuth docs (free)' },
    };
    const authStep = authResources[authLib];
    if (authStep) steps.push(authStep);
    else if (answers['auth_supabase'] === 'supabase_auth_yes') {
      steps.push({ topic: 'Supabase Auth', time: '1–2 hrs', difficulty: 'Beginner', resource: 'https://supabase.com/docs/guides/auth', resourceLabel: 'Supabase Auth docs (free)' });
    }
  }

  // Step 6: AI (if applicable)
  if (ai === 'llm_chat') {
    steps.push({ topic: 'Vercel AI SDK for streaming chat', time: '2–3 hrs', difficulty: 'Intermediate', resource: 'https://sdk.vercel.ai/docs/getting-started', resourceLabel: 'Vercel AI SDK docs (free)' });
  } else if (ai === 'rag_vector') {
    steps.push({ topic: 'RAG with LangChain', time: '4–6 hrs', difficulty: 'Advanced', resource: 'https://python.langchain.com/docs/tutorials/rag/', resourceLabel: 'LangChain RAG tutorial (free)' });
  }

  // Step 7: Deploy
  const deployResources: Record<string, LearnStep> = {
    vercel: { topic: 'Deploy to Vercel', time: '30 min', difficulty: 'Beginner', resource: 'https://vercel.com/docs/getting-started-with-vercel', resourceLabel: 'Vercel getting started (free)' },
    railway: { topic: 'Deploy to Railway', time: '1 hr', difficulty: 'Beginner', resource: 'https://docs.railway.app/getting-started', resourceLabel: 'Railway getting started (free)' },
    vps: { topic: 'Linux server setup (Nginx + PM2)', time: '4–6 hrs', difficulty: 'Advanced', resource: 'https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu', resourceLabel: 'DigitalOcean server guide (free)' },
    supabase_hosting: { topic: 'Supabase project setup', time: '1 hr', difficulty: 'Beginner', resource: 'https://supabase.com/docs/guides/getting-started', resourceLabel: 'Supabase getting started (free)' },
  };
  const depStep = deployResources[deploy];
  if (depStep) steps.push(depStep);

  return steps;
}

// ─── COMPATIBILITY SCANNER ───────────────────────────────────────────────────

interface CompatIssue {
  severity: 'error' | 'warning';
  title: string;
  fix: string;
}

function scanCompatibility(answers: AnswerMap): CompatIssue[] {
  const issues: CompatIssue[] = [];
  const frontend = answers['frontend_choice'] as string;
  const authLib = answers['auth_library'] as string;
  const db = (answers['db_for_vercel'] || answers['db_general']) as string;
  const appType = answers['app_type'] as string;
  const deploy = answers['deploy_target'] as string;
  const backend = answers['backend_choice'] as string;
  const styling = answers['styling_choice'] as string;
  const ai = answers['ai_integration'] as string;

  if (authLib === 'clerk' && (frontend === 'sveltekit' || frontend === 'vue_nuxt')) {
    issues.push({ severity: 'error', title: 'Clerk has no official SDK for your frontend', fix: 'Switch auth library to Auth.js or BetterAuth — both have native support for SvelteKit and Vue/Nuxt.' });
  }
  if (db === 'sqlite' && ['saas', 'ecommerce', 'realtime'].includes(appType)) {
    issues.push({ severity: 'error', title: 'SQLite can\'t handle concurrent users in production', fix: 'Switch to PostgreSQL (self-hosted or Supabase) — SQLite is only reliable for single-user or prototype apps.' });
  }
  if (authLib === 'custom_jwt' && ['saas', 'ecommerce'].includes(appType)) {
    issues.push({ severity: 'warning', title: 'Hand-written JWT auth is high risk for a production app', fix: 'Use Auth.js, BetterAuth, or Clerk — they handle token rotation, session expiry, and edge cases that are easy to miss.' });
  }
  if (styling === 'shadcn' && (frontend === 'sveltekit' || frontend === 'vue_nuxt')) {
    issues.push({ severity: 'error', title: 'shadcn/ui is React-only — won\'t work with your frontend', fix: 'Use shadcn-svelte for SvelteKit, or Nuxt UI / shadcn-vue for Vue/Nuxt.' });
  }
  if (backend === 'supabase_edge' && (appType === 'realtime' || ai === 'agents' || ai === 'rag_vector')) {
    issues.push({ severity: 'warning', title: 'BaaS edge functions time out before realtime/AI tasks finish', fix: 'Switch to a separate Node.js server (Express on Railway) — it stays running for WebSockets and long AI responses.' });
  }
  if (deploy === 'vercel' && appType === 'realtime') {
    issues.push({ severity: 'error', title: 'Vercel drops WebSocket connections — realtime won\'t work', fix: 'Switch hosting to Railway or a VPS — they keep server connections alive.' });
  }
  if (deploy === 'vercel' && (ai === 'agents' || ai === 'rag_vector')) {
    issues.push({ severity: 'warning', title: 'Serverless functions may time out on long AI tasks', fix: 'Consider Railway or VPS for your backend to avoid 10–30s function timeouts during AI processing.' });
  }
  if (backend === 'nextjs_api' && (frontend === 'sveltekit' || frontend === 'vue_nuxt' || frontend === 'react_vite')) {
    issues.push({ severity: 'error', title: 'Next.js API routes require a Next.js frontend', fix: 'Switch backend to Express.js (Node server) or use your framework\'s built-in routes.' });
  }
  if (backend === 'sveltekit_api' && frontend !== 'sveltekit') {
    issues.push({ severity: 'error', title: 'SvelteKit server routes only work inside a SvelteKit project', fix: 'Switch backend to Express.js or the built-in routes for your chosen framework.' });
  }
  return issues;
}

// Jargon replacements for plain-English mode
function simplifyPrompt(text: string): string {
  return text
    .replace(/cursor-based pagination/gi, 'load-more-as-you-scroll')
    .replace(/PgBouncer/gi, 'database connection manager')
    .replace(/pgvector/gi, 'AI search index')
    .replace(/SSR/gi, 'server-rendered pages')
    .replace(/SSG/gi, 'pre-built static pages')
    .replace(/CSR/gi, 'browser-rendered pages')
    .replace(/hydration/gi, 'page initialization')
    .replace(/serverless functions?/gi, 'cloud functions')
    .replace(/edge functions?/gi, 'fast cloud functions')
    .replace(/connection pooling/gi, 'database connection reuse')
    .replace(/cold starts?/gi, 'startup delay')
    .replace(/JWT tokens?/gi, 'login tokens')
    .replace(/OAuth/gi, 'social login (Google, GitHub, etc.)')
    .replace(/ACID compliance/gi, 'reliable data saving')
    .replace(/boilerplate/gi, 'starter code')
    .replace(/route handler/gi, 'API endpoint')
    .replace(/middleware/gi, 'request handler')
    .replace(/ORM/gi, 'database query tool')
    .replace(/\(e\.g\. [^)]+\)/gi, '') // strip "e.g. X" asides
    .replace(/\(e\.g[^)]+\)/gi, '');
}

function ResultsPanel({
  answers,
  history,
  onRestart,
  onEditAnswer,
  onViewDiagram,
  handleCopyClipboard,
}: {
  answers: AnswerMap;
  history: HistoryEntry[];
  onRestart: () => void;
  onEditAnswer: (historyIndex: number) => void;
  onViewDiagram?: () => void;
  handleCopyClipboard: (text: string) => void;
}) {
  const [copied, setCopied] = useState<'prompt' | 'commands' | 'share' | null>(null);
  const [plainEnglish, setPlainEnglish] = useState(true);
  const [compatExpanded, setCompatExpanded] = useState(true);
  const compatIssues = scanCompatibility(answers);

  const handleShare = () => {
    const url = encodeAnswersToURL(answers);
    navigator.clipboard.writeText(url);
    handleCopyClipboard(url);
    setCopied('share');
    setTimeout(() => setCopied(null), 2000);
    // Also update the browser URL without reloading
    window.history.replaceState(null, '', url);
  };

  const projectName = (answers['project_name'] as string) || 'My App';
  const projectDesc = (answers['project_description'] as string) || '';
  const appType = answers['app_type'] as string;
  const deploy = answers['deploy_target'] as string;
  const db = (answers['db_for_vercel'] || answers['db_general']) as string;
  const auth = (answers['auth_strategy'] || (answers['auth_supabase'] === 'supabase_auth_yes' ? 'supabase_auth' : '')) as string;
  const authLib = answers['auth_library'] as string;
  const providers = answers['auth_providers'];
  const emailVerify = answers['email_verification'] as string;
  const frontend = answers['frontend_choice'] as string;
  const backend = answers['backend_choice'] as string;
  const styling = answers['styling_choice'] as string;
  const ai = answers['ai_integration'] as string;
  const payments = answers['payments'] as string;

  // ── label helpers ────────────────────────────────────────────────────────
  const label = (questionId: string, answerId: string) => {
    const q = FLOW_QUESTIONS[questionId];
    return q?.options?.find(o => o.id === answerId)?.label || answerId;
  };

  const deployLabel = deploy ? label('deploy_target', deploy) : '–';
  const dbLabel = db ? (label('db_for_vercel', db) || label('db_general', db)) : '–';
  const frontendLabel = frontend ? label('frontend_choice', frontend) : '–';
  const backendLabel = backend ? label('backend_choice', backend) : '–';
  const stylingLabel = styling ? label('styling_choice', styling) : '–';
  const authLabel = auth ? label('auth_strategy', auth) : '–';
  const authLibLabel = authLib ? label('auth_library', authLib) : '–';
  const providerList = Array.isArray(providers) ? providers.join(', ') : '';
  const aiLabel = ai ? label('ai_integration', ai) : '–';
  const paymentsLabel = payments ? label('payments', payments) : '–';

  // ── setup commands ───────────────────────────────────────────────────────
  const getSetupCommands = () => {
    const lines: string[] = [];
    const isNext = frontend === 'nextjs';
    const isSvelte = frontend === 'sveltekit';
    const isReactVite = frontend === 'react_vite';
    const isPython = backend === 'fastapi_py';
    const isGo = backend === 'go_backend';

    lines.push(`# ── Initialize ${projectName} ──────────────────────────────`);

    if (isNext) {
      lines.push(`npx create-next-app@latest ${projectName.toLowerCase().replace(/\s+/g, '-')} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`);
      lines.push(`cd ${projectName.toLowerCase().replace(/\s+/g, '-')}`);
    } else if (isSvelte) {
      lines.push(`npx sv create ${projectName.toLowerCase().replace(/\s+/g, '-')}`);
      lines.push(`cd ${projectName.toLowerCase().replace(/\s+/g, '-')}`);
    } else if (isReactVite) {
      lines.push(`npm create vite@latest ${projectName.toLowerCase().replace(/\s+/g, '-')} -- --template react-ts`);
      lines.push(`cd ${projectName.toLowerCase().replace(/\s+/g, '-')}`);
      lines.push(`npm install`);
    } else if (isPython) {
      lines.push(`mkdir ${projectName.toLowerCase().replace(/\s+/g, '-')} && cd ${projectName.toLowerCase().replace(/\s+/g, '-')}`);
      lines.push(`python3 -m venv venv && source venv/bin/activate`);
      lines.push(`pip install fastapi uvicorn[standard] sqlalchemy psycopg2-binary python-dotenv`);
    } else if (isGo) {
      lines.push(`mkdir ${projectName.toLowerCase().replace(/\s+/g, '-')} && cd ${projectName.toLowerCase().replace(/\s+/g, '-')}`);
      lines.push(`go mod init github.com/yourusername/${projectName.toLowerCase().replace(/\s+/g, '-')}`);
      lines.push(`go get github.com/gin-gonic/gin`);
    }

    // DB deps
    if (db === 'supabase') {
      if (!isPython && !isGo) {
        lines.push(`\n# ── Managed Postgres + BaaS client ─────────────────────`);
        lines.push(`npm install @supabase/supabase-js`);
        if (isNext) lines.push(`npm install @supabase/ssr`);
        if (isSvelte) lines.push(`npm install @supabase/ssr`);
      }
    } else if (db === 'postgres_self' || db === 'neon') {
      if (!isPython && !isGo) {
        lines.push(`\n# ── Postgres / Prisma ───────────────────────────────────`);
        lines.push(`npm install prisma @prisma/client`);
        lines.push(`npx prisma init --datasource-provider postgresql`);
      }
    } else if (db === 'planetscale') {
      if (!isPython && !isGo) {
        lines.push(`\n# ── Serverless MySQL / Drizzle ──────────────────────────`);
        lines.push(`npm install drizzle-orm @planetscale/database`);
        lines.push(`npm install -D drizzle-kit`);
      }
    } else if (db === 'turso') {
      if (!isPython && !isGo) {
        lines.push(`\n# ── Edge SQLite / Turso ─────────────────────────────────`);
        lines.push(`npm install @libsql/client drizzle-orm`);
        lines.push(`npm install -D drizzle-kit`);
      }
    } else if (db === 'mongodb_atlas') {
      if (!isPython && !isGo) {
        lines.push(`\n# ── Managed Document DB / Mongoose ─────────────────────`);
        lines.push(`npm install mongoose`);
      } else if (isPython) {
        lines.push(`\n# ── Managed Document DB / Motor ────────────────────────`);
        lines.push(`pip install motor`);
      }
    }

    // Auth deps
    if (auth !== 'supabase_auth' && auth !== 'no_auth') {
      if (authLib === 'nextauth') {
        lines.push(`\n# ── Auth.js ─────────────────────────────────────────────`);
        if (isNext) {
          lines.push(`npm install next-auth@beta @auth/prisma-adapter`);
        } else if (isSvelte) {
          lines.push(`npm install @auth/sveltekit`);
        } else {
          lines.push(`npm install @auth/core`);
        }
      } else if (authLib === 'clerk') {
        lines.push(`\n# ── Hosted Auth Service ─────────────────────────────────`);
        if (isNext) {
          lines.push(`npm install @clerk/nextjs`);
        } else if (isReactVite) {
          lines.push(`npm install @clerk/clerk-react`);
        } else {
          lines.push(`# No official SDK for this frontend — use BetterAuth instead`);
        }
      } else if (authLib === 'better_auth') {
        lines.push(`\n# ── BetterAuth ──────────────────────────────────────────`);
        lines.push(`npm install better-auth`);
      } else if (authLib === 'supabase_auth_lib') {
        lines.push(`\n# ── BaaS Auth SDK ───────────────────────────────────────`);
        lines.push(`npm install @supabase/supabase-js`);
        if (isNext) lines.push(`npm install @supabase/ssr`);
        if (isSvelte) lines.push(`npm install @supabase/ssr`);
      } else if (authLib === 'custom_jwt') {
        lines.push(`\n# ── Custom JWT ──────────────────────────────────────────`);
        lines.push(`npm install jose`);
      }
    }

    // Styling
    if (styling === 'shadcn') {
      if (isNext || isReactVite) {
        lines.push(`\n# ── shadcn/ui ───────────────────────────────────────────`);
        lines.push(`npx shadcn@latest init`);
        lines.push(`npx shadcn@latest add button card input label`);
      }
    } else if (styling === 'shadcn_svelte') {
      lines.push(`\n# ── shadcn-svelte ───────────────────────────────────────`);
      lines.push(`npx shadcn-svelte@latest init`);
      lines.push(`npx shadcn-svelte@latest add button card input`);
    } else if (styling === 'nuxt_ui') {
      lines.push(`\n# ── Nuxt UI ─────────────────────────────────────────────`);
      lines.push(`npm install @nuxt/ui`);
      lines.push(`# Add @nuxt/ui to modules in nuxt.config.ts`);
    } else if (styling === 'tailwind' && isReactVite) {
      lines.push(`\n# ── Tailwind CSS (Vite) ─────────────────────────────────`);
      lines.push(`npm install -D tailwindcss postcss autoprefixer`);
      lines.push(`npx tailwindcss init -p`);
    }

    // AI
    if (ai === 'llm_chat' || ai === 'rag_vector' || ai === 'agents') {
      if (isPython) {
        lines.push(`\n# ── AI (Python) ─────────────────────────────────────────`);
        lines.push(`pip install openai langchain`);
        if (ai === 'rag_vector') lines.push(`pip install langchain-community chromadb`);
        if (ai === 'agents')     lines.push(`pip install langgraph`);
      } else {
        lines.push(`\n# ── AI SDK ──────────────────────────────────────────────`);
        lines.push(`npm install ai @ai-sdk/openai`);
        if (ai === 'rag_vector') {
          lines.push(`# Add pgvector to your Postgres DB:`);
          lines.push(`# CREATE EXTENSION IF NOT EXISTS vector;`);
        }
      }
    }

    // Payments
    if (payments === 'stripe') {
      lines.push(`\n# ── Payment Gateway ─────────────────────────────────────`);
      if (isPython) {
        lines.push(`pip install stripe`);
      } else {
        lines.push(`npm install stripe`);
        if (isNext || isReactVite) lines.push(`npm install @stripe/stripe-js`);
      }
    } else if (payments === 'lemon_squeezy') {
      lines.push(`\n# ── Merchant of Record ──────────────────────────────────`);
      if (!isPython && !isGo) lines.push(`npm install @lemonsqueezy/lemonsqueezy.js`);
    }

    lines.push(`\n# ── Environment variables ───────────────────────────────`);
    lines.push(`cp .env.example .env.local`);
    lines.push(`# Fill in your keys: DATABASE_URL, AUTH_SECRET, etc.`);
    lines.push(`\n# ── Start dev server ────────────────────────────────────`);
    if (isPython) {
      lines.push(`uvicorn main:app --reload`);
    } else if (isGo) {
      lines.push(`go run main.go`);
    } else {
      lines.push(`npm run dev`);
    }

    return lines.join('\n');
  };

  // ── AI prompt ────────────────────────────────────────────────────────────
  const getAIPrompt = () => {
    const providerStr = providerList ? ` supporting OAuth via ${providerList}` : '';
    const verifyStr = emailVerify === 'verify_required' ? ' with mandatory email verification on signup' : '';
    const aiStr = ai && ai !== 'no_ai' ? `\n- AI Integration: ${aiLabel}` : '';
    const payStr = payments && payments !== 'no_payments' ? `\n- Payments: ${paymentsLabel}` : '';

    return `You are helping me build a web application called "${projectName}".

Project description: ${projectDesc || '(not specified)'}

Technical Stack:
- Frontend: ${frontendLabel}
- Backend: ${backendLabel}
- Database: ${dbLabel}
- Styling: ${stylingLabel}
- Auth: ${authLabel}${providerStr}${verifyStr}
- Auth Library: ${authLibLabel}
- Deployment target: ${deployLabel}${aiStr}${payStr}

App type: ${appType || 'web app'}

Your task:
1. Generate the initial file/folder structure for this project
2. List the exact npm install commands needed
3. Create a working boilerplate with:
   - Database connection setup
   - Auth configuration (${authLabel})
   - One example protected route
   - One example public API endpoint
   - Environment variable template (.env.example)

Be specific and production-aware. Call out any gotchas for the chosen stack (e.g. serverless function timeout limits, connection pooling requirements, cold start latency). Use TypeScript where applicable.`;
  };

  const copy = (type: 'prompt' | 'commands') => {
    const raw = type === 'prompt' ? getAIPrompt() : getSetupCommands();
    const text = type === 'prompt' && plainEnglish ? simplifyPrompt(raw) : raw;
    navigator.clipboard.writeText(text);
    handleCopyClipboard(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const stackRows = [
    { label: 'App Type', value: appType ? label('app_type', appType) : '–', icon: '🏗️' },
    { label: 'Deploy Target', value: deployLabel, icon: '🚀' },
    { label: 'Database', value: dbLabel, icon: '🗄️' },
    { label: 'Frontend', value: frontendLabel, icon: '⚛️' },
    { label: 'Backend', value: backendLabel, icon: '⚙️' },
    { label: 'Styling', value: stylingLabel, icon: '🎨' },
    { label: 'Authentication', value: authLabel, icon: '🔐' },
    ...(providerList ? [{ label: 'OAuth Providers', value: providerList, icon: '🔑' }] : []),
    ...(authLib ? [{ label: 'Auth Library', value: authLibLabel, icon: '📦' }] : []),
    ...(emailVerify ? [{ label: 'Email Verify', value: emailVerify === 'verify_required' ? 'Required' : 'Not required', icon: '📧' }] : []),
    ...(ai ? [{ label: 'AI Integration', value: aiLabel, icon: '🤖' }] : []),
    ...(payments ? [{ label: 'Payments', value: paymentsLabel, icon: '💳' }] : []),
  ].filter(r => r.value !== '–' && r.value);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* header */}
      <div className="bg-gradient-to-r from-[#18181B] to-zinc-800 text-white p-5 rounded shadow-md">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">✓ Stack complete</span>
              <span className="text-xs text-gray-500">·</span>
              <span className="text-xs font-mono text-blue-400 uppercase tracking-widest">Edit any answer below</span>
            </div>
            <h2 className="text-xl font-black tracking-tight">{projectName}</h2>
            {projectDesc && (
              <p className="text-sm text-gray-400 mt-0.5 max-w-xl leading-relaxed line-clamp-2">{projectDesc}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs border border-zinc-600 hover:border-zinc-400 text-gray-300 hover:text-white font-bold px-3 py-2 rounded transition-all"
            >
              {copied === 'share' ? <><Check className="h-3.5 w-3.5 text-emerald-400" /> Link copied!</> : <><Link2 className="h-3.5 w-3.5" /> Share stack</>}
            </button>
            {onViewDiagram && (
              <button
                onClick={onViewDiagram}
                className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-2 rounded transition-all"
              >
                <ArrowRight className="h-3.5 w-3.5" /> View Diagram
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm('Start over? All your answers will be cleared.')) onRestart();
              }}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-200 transition-all underline underline-offset-2"
            >
              <RotateCcw className="h-3 w-3" /> Start over
            </button>
          </div>
        </div>
      </div>

      {/* COMPATIBILITY BANNER */}
      {compatIssues.length === 0 ? (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded text-sm text-emerald-800 font-medium">
          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          Stack looks compatible — no conflicts detected.
        </div>
      ) : (
        <div className={`border rounded overflow-hidden ${compatIssues.some(i => i.severity === 'error') ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'}`}>
          <button
            onClick={() => setCompatExpanded(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <span className={`flex items-center gap-2 text-sm font-bold ${compatIssues.some(i => i.severity === 'error') ? 'text-red-800' : 'text-amber-800'}`}>
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {compatIssues.length} compatibility issue{compatIssues.length > 1 ? 's' : ''} found — click to {compatExpanded ? 'hide' : 'view'}
            </span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${compatExpanded ? 'rotate-180' : ''}`} />
          </button>
          {compatExpanded && (
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-red-200">
              {compatIssues.map((issue, i) => (
                <div key={i} className="flex flex-col gap-1 pt-3">
                  <div className={`flex items-start gap-2 text-sm font-bold ${issue.severity === 'error' ? 'text-red-800' : 'text-amber-800'}`}>
                    {issue.severity === 'error' ? <XCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />}
                    {issue.title}
                  </div>
                  <div className="text-sm text-gray-700 ml-6">→ {issue.fix}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PRIMARY CTA — AI Prompt */}
      <div className="bg-[#0F0F11] border border-zinc-800 rounded p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <FileCode2 className="h-4 w-4 text-blue-400" /> AI Prompt — paste into Cursor / Claude / ChatGPT
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            {/* plain-English toggle */}
            <button
              onClick={() => setPlainEnglish(v => !v)}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded border transition-all ${
                plainEnglish
                  ? 'bg-emerald-900 border-emerald-600 text-emerald-300'
                  : 'bg-zinc-800 border-zinc-600 text-gray-400 hover:border-zinc-500'
              }`}
              title={plainEnglish ? 'Switch to technical mode' : 'Switch to plain English mode'}
            >
              {plainEnglish ? '📖 Plain English' : '⚙️ Technical'}
            </button>
            <button
              onClick={() => copy('prompt')}
              className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded transition-all"
            >
              {copied === 'prompt' ? (
                <><Check className="h-4 w-4" /> Copied!</>
              ) : (
                <><Copy className="h-4 w-4" /> Copy Prompt</>
              )}
            </button>
          </div>
        </div>
        <textarea
          readOnly
          className="w-full h-52 bg-[#18181B] text-emerald-300 p-4 text-sm font-mono leading-relaxed rounded border border-zinc-800 focus:outline-none resize-none select-all"
          value={plainEnglish ? simplifyPrompt(getAIPrompt()) : getAIPrompt()}
        />
        <p className="text-sm text-gray-500 italic leading-relaxed">
          💡 Copy this and paste into Cursor Composer, Claude, or ChatGPT to scaffold your project. Then use the <strong className="text-gray-400">Vibecoder</strong> tab to add feature improvements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* terminal setup commands */}
        <div className="bg-[#0F0F11] border border-zinc-800 rounded p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-emerald-400" /> Setup Commands
            </h3>
            <button
              onClick={() => copy('commands')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-2.5 py-1 rounded transition-all"
            >
              {copied === 'commands' ? (
                <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied!</>
              ) : (
                <><Copy className="h-3.5 w-3.5" /> Copy</>
              )}
            </button>
          </div>
          <pre className="text-sm font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap break-words max-h-64 overflow-y-auto scrollbar-thin">
            {getSetupCommands()}
          </pre>
        </div>

        {/* blueprint summary */}
        <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-5 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-blue-600" /> Stack Summary
          </h3>
          <div className="divide-y divide-gray-100">
            {stackRows.map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span>{row.icon}</span> {row.label}
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 text-right max-w-[55%]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PERSONALISED LEARNING PATH */}
      {(() => {
        const path = getLearningPath(answers);
        if (path.length === 0) return null;
        const diffColor = (d: LearnStep['difficulty']) =>
          d === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
          d === 'Intermediate' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-red-50 text-red-700 border-red-200';
        return (
          <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-blue-600" />
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-600">Your Learning Path</h3>
              <span className="text-xs text-gray-400 font-normal">— ordered by what to learn first</span>
            </div>
            <div className="flex flex-col gap-3">
              {path.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xs font-black w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-zinc-900">{step.topic}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded border font-bold ${diffColor(step.difficulty)}`}>{step.difficulty}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="h-3 w-3" />{step.time}</span>
                    </div>
                    <a
                      href={step.resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <ExternalLink className="h-3 w-3" />{step.resourceLabel}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* EDITABLE ANSWERS */}
      <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border-b border-[#D4D4D8] dark:border-zinc-700">
          <span className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-zinc-400 flex items-center gap-1.5">
            ✎ Your choices — click any row to edit
          </span>
          <span className="text-xs text-gray-400 italic hidden sm:block">Downstream answers are preserved as defaults</span>
        </div>
        <div className="divide-y divide-gray-100">
          {history.map((entry, i) => {
            const q = FLOW_QUESTIONS[entry.questionId];
            const ansDisplay = Array.isArray(entry.answer)
              ? entry.answer.map(a => q?.options?.find(o => o.id === a)?.label || a).join(', ')
              : (q?.options?.find(o => o.id === entry.answer)?.label || entry.answer as string);
            return (
              <button
                key={i}
                onClick={() => onEditAnswer(i)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 transition-all group text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-zinc-400 w-5 shrink-0">#{i + 1}</span>
                  <span className="text-sm text-gray-500 truncate max-w-[180px] hidden sm:block">{q?.question}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-sm font-bold text-zinc-800 group-hover:text-blue-700 text-right max-w-[200px] truncate">
                    {ansDisplay}
                  </span>
                  <span className="text-xs text-blue-400 font-bold opacity-50 group-hover:opacity-100 transition-opacity">✎</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Builds a live mermaid diagram from whatever answers exist so far
function buildLiveDiagram(answers: AnswerMap): string {
  const label = (qId: string, aId: string) =>
    FLOW_QUESTIONS[qId]?.options?.find(o => o.id === aId)?.label || aId;

  const name   = (answers['project_name'] as string) || '?';
  const deploy = answers['deploy_target'] as string;
  const db     = (answers['db_for_vercel'] || answers['db_general']) as string;
  const auth   = answers['auth_strategy'] as string;
  const front  = answers['frontend_choice'] as string;
  const back   = answers['backend_choice'] as string;
  const style  = answers['styling_choice'] as string;
  const ai     = answers['ai_integration'] as string;
  const pay    = answers['payments'] as string;
  const appT   = answers['app_type'] as string;

  const safe = (s: string) => `"${s.replace(/"/g, "'").replace(/\n/g, ' ').slice(0, 40)}"`;

  const nodes: string[] = [];
  const edges: string[] = [];
  const styles: string[] = [
    'classDef project fill:#18181B,color:#fff,stroke:#18181B,font-weight:bold',
    'classDef done fill:#065F46,color:#fff,stroke:#065F46',
    'classDef fe fill:#DBEAFE,color:#1E40AF,stroke:#93C5FD',
    'classDef be fill:#DCFCE7,color:#166534,stroke:#86EFAC',
    'classDef db fill:#EDE9FE,color:#5B21B6,stroke:#C4B5FD',
    'classDef auth fill:#FEE2E2,color:#991B1B,stroke:#FCA5A5',
    'classDef dp fill:#FEF3C7,color:#92400E,stroke:#FCD34D',
    'classDef st fill:#FCE7F3,color:#9D174D,stroke:#F9A8D4',
    'classDef ai fill:#F0FDFA,color:#065F46,stroke:#6EE7B7',
    'classDef pay fill:#FFF7ED,color:#7C2D12,stroke:#FCD34D',
  ];

  nodes.push(`  A[${safe('📝 ' + name)}]:::project`);

  if (appT) {
    nodes.push(`  B[${safe('🏗️ ' + label('app_type', appT))}]:::fe`);
    edges.push('  A --> B');
  }

  if (front) {
    nodes.push(`  C[${safe('⚛️ ' + label('frontend_choice', front))}]:::fe`);
    edges.push(appT ? '  B --> C' : '  A --> C');
  }

  if (style) {
    nodes.push(`  CS[${safe('🎨 ' + label('styling_choice', style))}]:::st`);
    edges.push(front ? '  C --> CS' : appT ? '  B --> CS' : '  A --> CS');
  }

  if (deploy) {
    nodes.push(`  D[${safe('🚀 ' + label('deploy_target', deploy))}]:::dp`);
    edges.push(front ? '  C --> D' : appT ? '  B --> D' : '  A --> D');
  }

  if (db) {
    const dbLabel = FLOW_QUESTIONS['db_for_vercel']?.options?.find(o => o.id === db)?.label
      || FLOW_QUESTIONS['db_general']?.options?.find(o => o.id === db)?.label || db;
    nodes.push(`  E[${safe('🗄️ ' + dbLabel)}]:::db`);
    edges.push(deploy ? '  D --> E' : front ? '  C --> E' : '  A --> E');
  }

  if (back) {
    nodes.push(`  F[${safe('⚙️ ' + label('backend_choice', back))}]:::be`);
    edges.push(db ? '  E --> F' : deploy ? '  D --> F' : front ? '  C --> F' : '  A --> F');
  }

  if (auth) {
    nodes.push(`  G[${safe('🔐 ' + label('auth_strategy', auth))}]:::auth`);
    edges.push(back ? '  F --> G' : db ? '  E --> G' : '  A --> G');
  }

  if (ai && ai !== 'no_ai') {
    nodes.push(`  H[${safe('🤖 ' + label('ai_integration', ai))}]:::ai`);
    edges.push(auth ? '  G --> H' : back ? '  F --> H' : '  A --> H');
  }

  if (pay && pay !== 'no_payments') {
    nodes.push(`  I[${safe('💳 ' + label('payments', pay))}]:::pay`);
    const last = ai && ai !== 'no_ai' ? 'H' : auth ? 'G' : back ? 'F' : db ? 'E' : 'A';
    edges.push(`  ${last} --> I`);
  }

  if (nodes.length <= 1) {
    return `flowchart TD\n  A[${safe('📝 ' + name)}]:::project\n  ${styles.join('\n  ')}`;
  }

  return ['flowchart TD', ...nodes, ...edges, ...styles].join('\n');
}

// Which roadmap step is most relevant to the current question
function getRoadmapHighlight(questionId: string): number {
  const map: Record<string, number> = {
    project_name: 1,
    project_description: 1,
    app_type: 1,
    deploy_target: 11,
    db_for_vercel: 8,
    db_general: 8,
    auth_supabase: 10,
    auth_strategy: 10,
    email_verification: 10,
    auth_providers: 10,
    auth_library: 10,
    frontend_choice: 3,
    backend_choice: 7,
    styling_choice: 5,
    ai_integration: 7,
    payments: 9,
  };
  return map[questionId] ?? 1;
}

// ─── LIVE MINI MERMAID ────────────────────────────────────────────────────────

function MiniMermaid({ definition }: { definition: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !definition) return;
    while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);
    getMermaid()
      .then(m => m.render(`live-${Date.now()}`, definition))
      .then(({ svg }) => {
        if (!ref.current) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgNode = doc.documentElement;
        svgNode.querySelectorAll('script').forEach(s => s.remove());
        while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);
        ref.current.appendChild(document.adoptNode(svgNode));
      })
      .catch(() => {});
  }, [definition]);

  return (
    <div
      ref={ref}
      className="w-full overflow-auto [&_svg]:max-w-full [&_svg]:h-auto [&_svg]:max-h-72"
    />
  );
}

// ─── LIVE ROADMAP MINI ────────────────────────────────────────────────────────

function MiniRoadmap({ highlightStep, answeredCount }: { highlightStep: number; answeredCount: number }) {
  return (
    <div className="flex flex-col gap-1.5 py-1">
      {LEARNING_ROADMAP.map(step => {
        const isActive = step.step === highlightStep;
        const isDone = step.step < highlightStep && answeredCount > 2;
        return (
          <div
            key={step.step}
            className={`flex items-start gap-2.5 px-2 py-2 rounded transition-all ${
              isActive ? 'bg-blue-50 border border-blue-200' :
              isDone   ? 'opacity-50' : 'opacity-70'
            }`}
          >
            <span className={`text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              isActive ? 'bg-blue-600 text-white' :
              isDone   ? 'bg-emerald-500 text-white' :
              'bg-gray-200 text-gray-500'
            }`}>
              {isDone ? '✓' : step.step}
            </span>
            <div className="min-w-0">
              <div className={`text-sm font-bold leading-snug ${isActive ? 'text-blue-900' : 'text-zinc-700'}`}>
                {step.title}
              </div>
              {isActive && (
                <div className="text-xs text-blue-600 mt-0.5 leading-tight">{step.estimatedTime}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── ECOSYSTEM MINI ───────────────────────────────────────────────────────────

const ECOSYSTEM_LAYERS = [
  { label: 'Frontend', color: 'bg-blue-100 text-blue-800', tools: ['React', 'Next.js', 'Vue', 'Svelte'] },
  { label: 'Build', color: 'bg-indigo-100 text-indigo-800', tools: ['Vite', 'Angular CLI'] },
  { label: 'Styling', color: 'bg-pink-100 text-pink-800', tools: ['Tailwind', 'shadcn/ui', 'Bootstrap'] },
  { label: 'API', color: 'bg-green-100 text-green-800', tools: ['REST', 'GraphQL', 'tRPC', 'WebSocket'] },
  { label: 'Backend', color: 'bg-emerald-100 text-emerald-800', tools: ['Express', 'FastAPI', 'Django', 'Gin', 'Axum'] },
  { label: 'Database', color: 'bg-purple-100 text-purple-800', tools: ['PostgreSQL', 'MySQL', 'MongoDB', 'SQLite', 'Managed BaaS DB'] },
  { label: 'Auth', color: 'bg-red-100 text-red-800', tools: ['Auth.js', 'Hosted Auth Service', 'BaaS Auth', 'JWT'] },
  { label: 'Deploy', color: 'bg-orange-100 text-orange-800', tools: ['Serverless Edge', 'Container PaaS', 'VPS', 'Enterprise Cloud'] },
  { label: 'Process', color: 'bg-yellow-100 text-yellow-800', tools: ['PM2', 'systemd', 'Docker', 'Gunicorn'] },
  { label: 'Proxy', color: 'bg-cyan-100 text-cyan-800', tools: ['Nginx', 'Caddy', 'Cloudflare'] },
  { label: 'Monitor', color: 'bg-gray-100 text-gray-800', tools: ['Sentry', 'Grafana', 'PM2 logs'] },
];

function getHighlightedLayer(questionId: string): string {
  const map: Record<string, string> = {
    frontend_choice: 'Frontend',
    styling_choice: 'Styling',
    backend_choice: 'Backend',
    db_for_vercel: 'Database',
    db_general: 'Database',
    auth_strategy: 'Auth',
    auth_supabase: 'Auth',
    auth_library: 'Auth',
    auth_providers: 'Auth',
    email_verification: 'Auth',
    deploy_target: 'Deploy',
    ai_integration: 'Backend',
    payments: 'Backend',
  };
  return map[questionId] || '';
}

function MiniEcosystem({ highlightLayer, answers }: { highlightLayer: string; answers: AnswerMap }) {
  // Collect chosen tool labels for highlighting
  const chosenLabels = new Set<string>();
  const labelFn = (qId: string, aId: string) =>
    FLOW_QUESTIONS[qId]?.options?.find(o => o.id === aId)?.label?.split(' ')[0] || '';

  if (answers['frontend_choice']) chosenLabels.add(labelFn('frontend_choice', answers['frontend_choice'] as string));
  if (answers['styling_choice']) chosenLabels.add(labelFn('styling_choice', answers['styling_choice'] as string));
  if (answers['backend_choice']) chosenLabels.add(labelFn('backend_choice', answers['backend_choice'] as string));
  if (answers['deploy_target']) chosenLabels.add(labelFn('deploy_target', answers['deploy_target'] as string));
  const db = answers['db_for_vercel'] || answers['db_general'];
  if (db) chosenLabels.add(labelFn('db_for_vercel', db as string) || labelFn('db_general', db as string));

  return (
    <div className="flex flex-col gap-1.5">
      {ECOSYSTEM_LAYERS.map(layer => {
        const isActive = layer.label === highlightLayer;
        return (
          <div key={layer.label} className={`rounded p-2 transition-all ${isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
            <div className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded w-fit mb-1.5 ${layer.color}`}>
              {layer.label}
            </div>
            <div className="flex flex-wrap gap-1">
              {layer.tools.map(tool => {
                const isChosen = [...chosenLabels].some(c => tool.toLowerCase().startsWith(c.toLowerCase()) || c.toLowerCase().startsWith(tool.toLowerCase().split('/')[0]));
                return (
                  <span
                    key={tool}
                    className={`text-[10px] px-1.5 py-0.5 rounded border transition-all ${
                      isChosen
                        ? 'bg-blue-600 text-white border-blue-600 font-bold'
                        : isActive
                        ? 'bg-white border-blue-200 text-blue-700'
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    {tool}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── FLOATING LIVE PANEL ──────────────────────────────────────────────────────

type LivePanelTab = 'diagram' | 'ecosystem' | 'roadmap';

function LivePanel({
  answers,
  questionId,
  answeredCount,
}: {
  answers: AnswerMap;
  questionId: string;
  answeredCount: number;
}) {
  const [tab, setTab] = useState<LivePanelTab>('diagram');
  const diagram = useMemo(() => buildLiveDiagram(answers), [answers]);
  const roadmapStep = getRoadmapHighlight(questionId);
  const ecoLayer = getHighlightedLayer(questionId);
  const projectName = (answers['project_name'] as string) || '';

  const tabs: { id: LivePanelTab; label: string; icon: React.ReactNode }[] = [
    { id: 'diagram', label: 'Your Stack', icon: <Layers className="h-3 w-3" /> },
    { id: 'ecosystem', label: 'Ecosystem', icon: <Map className="h-3 w-3" /> },
    { id: 'roadmap', label: 'Roadmap', icon: <BookOpen className="h-3 w-3" /> },
  ];

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded-lg shadow-sm overflow-hidden sticky top-28">
      {/* panel header */}
      <div className="bg-[#18181B] text-white px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-xs font-mono text-blue-400 uppercase tracking-widest">Live Preview</div>
          <div className="text-base font-black truncate max-w-[180px]">
            {projectName || 'Your Stack'}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-gray-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {answeredCount} answered
        </div>
      </div>

      {/* sub tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold transition-all ${
              tab === t.id
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* panel body */}
      <div className="overflow-y-auto max-h-[calc(100vh-220px)] p-3">
        {tab === 'diagram' && (
          <div className="flex flex-col gap-2">
            {answeredCount === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Layers className="h-8 w-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Your stack diagram will appear here as you answer questions</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 text-center">Updates with each answer ↓</p>
                <MiniMermaid definition={diagram} />
              </>
            )}
          </div>
        )}

        {tab === 'ecosystem' && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-400">
              {ecoLayer ? `↳ Currently deciding: ${ecoLayer}` : 'The full web dev ecosystem'}
            </p>
            <MiniEcosystem highlightLayer={ecoLayer} answers={answers} />
          </div>
        )}

        {tab === 'roadmap' && (
          <div className="flex flex-col gap-1">
            <p className="text-xs text-gray-400">↳ Relevant learning step highlighted</p>
            <MiniRoadmap highlightStep={roadmapStep} answeredCount={answeredCount} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HISTORY BREADCRUMB ───────────────────────────────────────────────────────

function HistoryBreadcrumb({
  history,
  onGoBack,
}: {
  history: HistoryEntry[];
  onGoBack: (index: number) => void;
}) {
  if (history.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap text-xs text-gray-500 mb-1">
      {history.map((entry, i) => {
        const q = FLOW_QUESTIONS[entry.questionId];
        const answerDisplay = Array.isArray(entry.answer)
          ? entry.answer.map(a => q?.options?.find(o => o.id === a)?.label || a).join(', ')
          : (q?.options?.find(o => o.id === entry.answer)?.label || entry.answer);
        const shortAnswer = answerDisplay.length > 22 ? answerDisplay.slice(0, 20) + '…' : answerDisplay;
        return (
          <React.Fragment key={i}>
            <button
              onClick={() => onGoBack(i)}
              className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 px-2 py-0.5 rounded text-xs font-medium text-zinc-700 transition-all"
              title={`Go back to: ${q?.question}`}
            >
              {shortAnswer}
            </button>
            {i < history.length - 1 && (
              <ChevronRight className="h-3 w-3 text-gray-400 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── RECOMMENDED STACKS ──────────────────────────────────────────────────────
// Pre-filled AnswerMaps for common project archetypes.
// Labels shown to the user are plain English — they map to answer IDs internally.

interface StackPreset {
  id: string;
  emoji: string;
  title: string;
  example: string;
  why: string;
  answers: AnswerMap;
}

const STACK_PRESETS: StackPreset[] = [
  {
    id: 'saas_mvp',
    emoji: '🏢',
    title: 'SaaS / Web App',
    example: 'e.g. project manager, CRM, invoicing tool',
    why: 'Next.js + Supabase + Vercel is the fastest path to a working SaaS — one platform for database and auth, push-to-deploy hosting.',
    answers: {
      app_type: 'saas',
      deploy_target: 'vercel',
      db_for_vercel: 'supabase',
      auth_supabase: 'supabase_auth_yes',
      email_verification: 'verify_required',
      frontend_choice: 'nextjs',
      backend_choice: 'nextjs_api',
      styling_choice: 'shadcn',
      ai_integration: 'no_ai',
      payments: 'stripe',
    },
  },
  {
    id: 'stock_screener',
    emoji: '📈',
    title: 'Dashboard / Data Tool',
    example: 'e.g. stock screener, analytics panel, internal admin',
    why: 'React Vite + Express + Railway gives you a fast dashboard frontend and a flexible backend for data fetching — no SEO needed for internal tools.',
    answers: {
      app_type: 'dashboard',
      deploy_target: 'railway',
      db_general: 'postgres_self',
      auth_strategy: 'oauth_only',
      auth_providers: ['google'],
      auth_library: 'better_auth',
      frontend_choice: 'react_vite',
      backend_choice: 'express_node',
      styling_choice: 'shadcn',
      ai_integration: 'no_ai',
      payments: 'no_payments',
    },
  },
  {
    id: 'ai_chat',
    emoji: '🤖',
    title: 'AI-powered App',
    example: 'e.g. AI chat bot, document Q&A, writing assistant',
    why: 'Next.js + Neon + Railway keeps the AI streaming responses alive without serverless timeouts. Neon Postgres stores conversation history.',
    answers: {
      app_type: 'ai_app',
      deploy_target: 'railway',
      db_general: 'supabase',
      auth_strategy: 'email_plus_oauth',
      auth_providers: ['google'],
      auth_library: 'better_auth',
      frontend_choice: 'nextjs',
      backend_choice: 'express_node',
      styling_choice: 'shadcn',
      ai_integration: 'llm_chat',
      payments: 'no_payments',
    },
  },
  {
    id: 'ecommerce',
    emoji: '🛍️',
    title: 'Online Store / Marketplace',
    example: 'e.g. product shop, digital downloads, subscription box',
    why: 'Next.js handles SEO-critical product pages; Supabase stores products and orders; Stripe manages payments without touching card data.',
    answers: {
      app_type: 'ecommerce',
      deploy_target: 'vercel',
      db_for_vercel: 'supabase',
      auth_supabase: 'supabase_auth_yes',
      email_verification: 'verify_required',
      frontend_choice: 'nextjs',
      backend_choice: 'nextjs_api',
      styling_choice: 'shadcn',
      ai_integration: 'no_ai',
      payments: 'stripe',
    },
  },
  {
    id: 'landing',
    emoji: '📄',
    title: 'Landing Page / Blog / Portfolio',
    example: 'e.g. product landing, personal site, newsletter',
    why: 'Next.js static pages load instantly and rank in Google. Vercel hosts them for free. No database needed.',
    answers: {
      app_type: 'landing',
      deploy_target: 'vercel',
      frontend_choice: 'nextjs',
      styling_choice: 'tailwind',
    },
  },
  {
    id: 'realtime',
    emoji: '⚡',
    title: 'Realtime / Collaborative App',
    example: 'e.g. live chat, multiplayer, collaborative editor',
    why: 'Express on Railway keeps live connections open. Serverless platforms kill WebSocket connections — a persistent server is required here.',
    answers: {
      app_type: 'realtime',
      deploy_target: 'railway',
      db_general: 'postgres_self',
      auth_strategy: 'email_plus_oauth',
      auth_providers: ['google'],
      auth_library: 'better_auth',
      frontend_choice: 'react_vite',
      backend_choice: 'express_node',
      styling_choice: 'shadcn',
      ai_integration: 'no_ai',
      payments: 'no_payments',
    },
  },
];

// ─── MODE SELECTOR SCREEN ────────────────────────────────────────────────────

function ModeSelector({ onSelectPreset, onChooseManually }: {
  onSelectPreset: (preset: StackPreset) => void;
  onChooseManually: () => void;
}) {
  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100 leading-tight">What are you building?</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          Pick your project type and we'll recommend the right tools — then you can tweak anything.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STACK_PRESETS.map(preset => (
          <button
            key={preset.id}
            onClick={() => onSelectPreset(preset)}
            className="text-left p-5 bg-white dark:bg-zinc-900 border-2 border-[#D4D4D8] dark:border-zinc-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group flex flex-col gap-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{preset.emoji}</span>
              <div>
                <div className="font-black text-base text-zinc-900 group-hover:text-blue-700 transition-colors">
                  {preset.title}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">{preset.example}</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-2 mt-1">
              {preset.why}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
              Use this stack <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onChooseManually}
          className="text-sm text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
        >
          I'd rather answer all questions myself →
        </button>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface ConversationalFlowProps {
  handleCopyClipboard: (text: string) => void;
  onComplete?: (answers: AnswerMap) => void;
  onViewDiagram?: () => void;
}

const LS_KEY = 'webflow_wizard_state';

function loadState(): { history: HistoryEntry[]; answers: AnswerMap; currentQuestionId: string; done: boolean } | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveState(state: { history: HistoryEntry[]; answers: AnswerMap; currentQuestionId: string; done: boolean }) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
}

// ─── URL SHARE ENCODING ───────────────────────────────────────────────────────

function encodeAnswersToURL(answers: AnswerMap): string {
  try {
    const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(answers))));
    const url = new URL(window.location.href);
    url.searchParams.set('stack', encoded);
    return url.toString();
  } catch { return window.location.href; }
}

function decodeAnswersFromURL(): AnswerMap | null {
  try {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('stack');
    if (!encoded) return null;
    return JSON.parse(decodeURIComponent(escape(atob(encoded))));
  } catch { return null; }
}

function buildHistoryFromAnswers(answers: AnswerMap): HistoryEntry[] {
  const builtHistory: HistoryEntry[] = [];
  let qId: string | null = FLOW_START;
  const visited = new Set<string>();
  while (qId && !visited.has(qId)) {
    visited.add(qId);
    const answer = answers[qId];
    if (answer === undefined) break;
    builtHistory.push({ questionId: qId, answer });
    qId = getNextQuestion(qId, answer, answers);
  }
  return builtHistory;
}

export default function ConversationalFlow({ handleCopyClipboard, onComplete, onViewDiagram }: ConversationalFlowProps) {
  // Check for shared stack in URL first, then fall back to localStorage
  const sharedAnswers = decodeAnswersFromURL();
  const saved = sharedAnswers ? null : loadState();

  const [mode, setMode] = useState<'select' | 'wizard'>(() => {
    if (sharedAnswers) return 'wizard';
    if (saved && (saved.done || saved.history.length > 0)) return 'wizard';
    return 'select';
  });
  const [history, setHistory] = useState<HistoryEntry[]>(() =>
    sharedAnswers ? buildHistoryFromAnswers(sharedAnswers) : (saved?.history ?? [])
  );
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(saved?.currentQuestionId ?? FLOW_START);
  const [answers, setAnswers] = useState<AnswerMap>(sharedAnswers ?? saved?.answers ?? {});
  const [done, setDone] = useState(sharedAnswers ? true : (saved?.done ?? false));
  const bottomRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const keyboardSelectRef = useRef<((idx: number) => void) | null>(null);

  // Sync to localStorage; fire onComplete exactly once when done transitions to true
  useEffect(() => {
    saveState({ history, answers, currentQuestionId, done });
    if (done && !completedRef.current) {
      completedRef.current = true;
      onComplete?.(answers);
    }
    if (!done) completedRef.current = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, answers, currentQuestionId, done]);

  // scroll to newest question
  useEffect(() => {
    if (!done) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  }, [currentQuestionId, done]);

  // Keyboard navigation: number keys 1-9 select options, Backspace goes back
  useEffect(() => {
    if (done) return;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const digit = parseInt(e.key, 10);
      if (!isNaN(digit) && digit >= 1 && digit <= 9) {
        keyboardSelectRef.current?.(digit - 1);
      }
      if (e.key === 'Backspace' && history.length > 0) {
        handleGoBack(history.length - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, history.length, currentQuestionId]);

  const handleAnswer = (answer: string | string[]) => {
    let curAnswers = { ...answers, [currentQuestionId]: answer };
    let curHistory = [...history, { questionId: currentQuestionId, answer }];

    // Auto-replay preserved downstream answers along the new chain
    let nextId = getNextQuestion(currentQuestionId, answer, curAnswers);
    while (nextId && curAnswers[nextId] !== undefined) {
      const preserved = curAnswers[nextId];
      curHistory = [...curHistory, { questionId: nextId, answer: preserved }];
      const furtherNext = getNextQuestion(nextId, preserved, curAnswers);
      nextId = furtherNext;
    }

    setAnswers(curAnswers);
    setHistory(curHistory);

    if (!nextId) {
      setDone(true);
    } else {
      setCurrentQuestionId(nextId);
    }
  };

  const handleGoBack = (toIndex: number) => {
    const targetEntry = history[toIndex];
    const newHistory = history.slice(0, toIndex);
    // Keep all answers (including downstream) so they can be used as defaults
    // when replaying the chain — only strip the history entries, not the answers
    setHistory(newHistory);
    setAnswers({ ...answers });
    setCurrentQuestionId(targetEntry.questionId);
    setDone(false);
  };

  const handleRestart = () => {
    setHistory([]);
    setAnswers({});
    setCurrentQuestionId(FLOW_START);
    setDone(false);
    setMode('select');
    try { localStorage.removeItem(LS_KEY); } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPreset = (preset: StackPreset) => {
    const presetAnswers = preset.answers;
    setAnswers(presetAnswers);
    setHistory(buildHistoryFromAnswers(presetAnswers));
    setDone(true);
    setMode('wizard');
    onComplete?.(presetAnswers);
  };

  const currentQuestion = FLOW_QUESTIONS[currentQuestionId];
  // Estimate remaining by counting reachable questions from the current point
  const totalEstimate = history.length + (done ? 0 : Object.keys(FLOW_QUESTIONS).length / 3);
  const progress = done ? 100 : Math.min(95, Math.round((history.length / Math.max(history.length + 3, 10)) * 100));

  if (mode === 'select') {
    return (
      <ModeSelector
        onSelectPreset={handleSelectPreset}
        onChooseManually={() => setMode('wizard')}
      />
    );
  }

  if (done) {
    return (
      <ResultsPanel
        answers={answers}
        history={history}
        onRestart={() => { handleRestart(); onComplete?.({}); }}
        onEditAnswer={(i) => handleGoBack(i)}
        onViewDiagram={onViewDiagram}
        handleCopyClipboard={handleCopyClipboard}
      />
    );
  }

  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start" id="conversational-flow">

      {/* LEFT: questions column */}
      <div className="flex flex-col gap-5 min-w-0">

        {/* progress bar */}
        <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-4 flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono text-gray-500">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-700 uppercase tracking-widest">Stack Builder</span>
              <button
                onClick={() => setMode('select')}
                className="text-blue-500 hover:text-blue-700 font-normal normal-case tracking-normal underline underline-offset-2 transition-colors"
              >
                ← change project type
              </button>
            </div>
            <span>{history.length} answered · ~{Math.max(0, 12 - history.length)} left</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <HistoryBreadcrumb history={history} onGoBack={handleGoBack} />
        </div>

        {/* current question */}
        <motion.div
          key={currentQuestionId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="bg-white dark:bg-zinc-900 border-2 border-blue-600 rounded-lg p-6 shadow-md flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Question {history.length + 1}
              </span>
              {history.length > 0 && (
                <button
                  onClick={() => handleGoBack(history.length - 1)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-400 px-2 py-0.5 rounded transition-all"
                >
                  ← Back
                </button>
              )}
            </div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-snug">
              {currentQuestion?.question}
            </h2>
            {currentQuestion?.hint && (
              <p className="text-base text-gray-500 leading-relaxed">{currentQuestion.hint}</p>
            )}
            {currentQuestion?.askAI && (
              <AskAIPrompt prompt={currentQuestion.askAI} handleCopyClipboard={handleCopyClipboard} />
            )}
          </div>

          <QuestionPanel
            question={currentQuestion}
            onAnswer={handleAnswer}
            existingAnswer={answers[currentQuestionId]}
            answers={answers}
            onKeyboardSelect={(handler) => { keyboardSelectRef.current = handler; }}
          />
          {currentQuestion?.type === 'single' && currentQuestion.options && currentQuestion.options.length > 1 && (
            <p className="text-xs text-gray-400 text-center">
              Press <kbd className="bg-gray-100 border border-gray-300 rounded px-1 py-0.5 font-mono text-[10px]">1</kbd>–<kbd className="bg-gray-100 border border-gray-300 rounded px-1 py-0.5 font-mono text-[10px]">{Math.min(currentQuestion.options.length, 9)}</kbd> to select · <kbd className="bg-gray-100 border border-gray-300 rounded px-1 py-0.5 font-mono text-[10px]">⌫</kbd> to go back
            </p>
          )}
        </motion.div>

        <div ref={bottomRef} />
      </div>

      {/* RIGHT: live floating panel — hidden on mobile, shown on lg */}
      <div className="hidden lg:block">
        <LivePanel
          answers={answers}
          questionId={currentQuestionId}
          answeredCount={history.length}
        />
      </div>

      {/* MOBILE: floating "View Stack" button */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setMobilePanelOpen(true)}
          className="flex items-center gap-2 bg-[#18181B] text-white font-bold px-4 py-3 rounded-full shadow-xl text-sm"
        >
          <Layers className="h-4 w-4" /> View stack ({history.length})
        </button>
      </div>

      {/* MOBILE: slide-up drawer */}
      {mobilePanelOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobilePanelOpen(false)} />
          <div className="relative bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-black text-zinc-900 text-sm">Live Stack Preview</span>
              <button onClick={() => setMobilePanelOpen(false)} className="text-gray-400 hover:text-gray-700 p-1">✕</button>
            </div>
            <div className="p-4">
              <LivePanel
                answers={answers}
                questionId={currentQuestionId}
                answeredCount={history.length}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

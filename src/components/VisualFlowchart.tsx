import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getMermaid } from '../utils/mermaid';
import {
  Copy, Check, X, BookOpen, Map, ChevronRight,
  ArrowRight, Lightbulb, Clock, Code2, Layers, Compass
} from 'lucide-react';
import { TOOL_KNOWLEDGE, LEARNING_ROADMAP, ToolInfo } from '../data/toolKnowledge';
import { AnswerMap, FLOW_QUESTIONS } from '../data/conversationalFlow';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function categoryColor(cat: ToolInfo['category']): string {
  switch (cat) {
    case 'frontend':  return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'backend':   return 'bg-green-100 text-green-800 border-green-200';
    case 'database':  return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'auth':      return 'bg-red-100 text-red-800 border-red-200';
    case 'deployment':return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'process':   return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'proxy':     return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'monitoring':return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'styling':   return 'bg-pink-100 text-pink-800 border-pink-200';
    case 'build':     return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'payments':  return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default:          return 'bg-zinc-100 text-zinc-800 border-zinc-200';
  }
}

function difficultyColor(d: ToolInfo['difficulty']) {
  if (d === 'Beginner') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (d === 'Intermediate') return 'text-amber-700 bg-amber-50 border-amber-200';
  return 'text-red-700 bg-red-50 border-red-200';
}

function roadmapCatColor(cat: string) {
  switch (cat) {
    case 'frontend': return 'border-blue-400 bg-blue-50';
    case 'backend': return 'border-green-400 bg-green-50';
    case 'database': return 'border-purple-400 bg-purple-50';
    case 'deployment': return 'border-orange-400 bg-orange-50';
    case 'fullstack': return 'border-indigo-400 bg-indigo-50';
    default: return 'border-gray-300 bg-gray-50';
  }
}

// ─── TOOL DETAIL DRAWER ───────────────────────────────────────────────────────

function ToolDrawer({ tool, onClose }: { tool: ToolInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-fade-in">
        {/* header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tool.emoji}</span>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">{tool.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded border font-bold mt-1 inline-block ${categoryColor(tool.category)}`}>
                {tool.category.toUpperCase()}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* tagline */}
          <p className="text-sm font-semibold text-gray-500 italic">{tool.tagline}</p>

          {/* what */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> What is it?
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">{tool.what}</p>
          </div>

          {/* why */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> Why does it exist?
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">{tool.why}</p>
          </div>

          {/* beginner advice */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-1.5 flex items-center gap-1.5">
              👋 Beginner Tip
            </h3>
            <p className="text-base text-blue-900 leading-relaxed">{tool.beginner}</p>
          </div>

          {/* difficulty + alternatives */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Difficulty</h3>
              <span className={`text-xs px-2 py-1 rounded border font-bold ${difficultyColor(tool.difficulty)}`}>
                {tool.difficulty}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Alternatives</h3>
              <div className="flex flex-wrap gap-1">
                {tool.alternatives.map(a => (
                  <span key={a} className="text-xs bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded text-zinc-700">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* used with */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2">Commonly used with</h3>
            <div className="flex flex-wrap gap-1.5">
              {tool.usedWith.map(u => (
                <span key={u} className="text-xs bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-blue-700 font-medium">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MERMAID DIAGRAM ─────────────────────────────────────────────────────────

function MermaidChart({ definition, id }: { definition: string; id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ref.current) return;
    setError('');
    setLoading(true);
    while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);

    getMermaid()
      .then(m => m.render(`mermaid-${id}-${Date.now()}`, definition))
      .then(({ svg }) => {
        if (!ref.current) return;
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgNode = doc.documentElement;
        svgNode.querySelectorAll('script').forEach(s => s.remove());
        while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);
        ref.current.appendChild(document.adoptNode(svgNode));
        setLoading(false);
      })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, [definition, id]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-sm text-red-700 font-mono">
        Diagram error: {error}
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center py-10 text-sm text-gray-400">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2" />
          Rendering diagram…
        </div>
      )}
      <div
        ref={ref}
        className="w-full overflow-auto flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
      />
    </>
  );
}

// ─── STACK RESULT DIAGRAM ─────────────────────────────────────────────────────

function buildStackDiagram(answers: AnswerMap): string {
  const label = (questionId: string, answerId: string) => {
    const q = FLOW_QUESTIONS[questionId];
    return q?.options?.find(o => o.id === answerId)?.label || answerId;
  };

  const projectName = (answers['project_name'] as string) || 'My App';
  const frontend = answers['frontend_choice'] as string;
  const backend = answers['backend_choice'] as string;
  const db = (answers['db_for_vercel'] || answers['db_general']) as string;
  const auth = answers['auth_strategy'] as string;
  const deploy = answers['deploy_target'] as string;
  const styling = answers['styling_choice'] as string;

  const fl = frontend ? label('frontend_choice', frontend) : 'React';
  const bl = backend ? label('backend_choice', backend) : 'Express';
  const dbl = db ? (label('db_for_vercel', db) || label('db_general', db)) : 'PostgreSQL';
  const al = auth ? label('auth_strategy', auth) : 'Auth';
  const dl = deploy ? label('deploy_target', deploy) : 'Deploy';
  const sl = styling ? label('styling_choice', styling) : 'Tailwind CSS';

  const safe = (s: string) => `"${s.replace(/"/g, "'")}"`;

  let lines = [
    `flowchart TD`,
    `  A[${safe('📝 ' + projectName)}]:::project --> B[${safe('🖥️ Frontend: ' + fl)}]:::frontend`,
    `  B --> C[${safe('🎨 Styling: ' + sl)}]:::styling`,
    `  B --> D[${safe('🔌 API: REST / JSON')}]:::api`,
    `  D --> E[${safe('⚙️ Backend: ' + bl)}]:::backend`,
    `  E --> F[${safe('🗄️ Database: ' + dbl)}]:::database`,
    `  E --> G[${safe('🔐 Auth: ' + al)}]:::auth`,
    `  E --> H[${safe('🚀 Deploy: ' + dl)}]:::deploy`,
    ``,
    `  classDef project fill:#18181B,color:#fff,stroke:#18181B`,
    `  classDef frontend fill:#DBEAFE,color:#1E40AF,stroke:#93C5FD`,
    `  classDef styling fill:#FCE7F3,color:#9D174D,stroke:#F9A8D4`,
    `  classDef api fill:#F0FDF4,color:#166534,stroke:#86EFAC`,
    `  classDef backend fill:#DCFCE7,color:#166534,stroke:#86EFAC`,
    `  classDef database fill:#EDE9FE,color:#5B21B6,stroke:#C4B5FD`,
    `  classDef auth fill:#FEE2E2,color:#991B1B,stroke:#FCA5A5`,
    `  classDef deploy fill:#FEF3C7,color:#92400E,stroke:#FCD34D`,
  ];

  return lines.join('\n');
}

// ─── FULL ECOSYSTEM MAP ───────────────────────────────────────────────────────

const FULL_MAP_DEFINITION = `flowchart TD
  START["🚀 Start: Build a Web App"]:::start

  START --> FE["Frontend Framework"]:::layer
  FE --> FE1["⚛️ React + Vite SPA"]:::fe
  FE --> FE2["▲ Next.js"]:::fe
  FE --> FE3["🔶 SvelteKit"]:::fe
  FE --> FE4["💚 Vue + Nuxt"]:::fe
  FE --> FE5["🌐 Vanilla HTML/JS"]:::fe

  FE1 --> STYLE["Styling"]:::layer
  FE2 --> STYLE
  FE3 --> STYLE
  FE4 --> STYLE
  STYLE --> S1["🎨 Tailwind CSS"]:::tool
  STYLE --> S2["🧩 shadcn/ui — React"]:::tool
  STYLE --> S3["🔶 shadcn-svelte"]:::tool
  STYLE --> S4["💚 Nuxt UI"]:::tool
  STYLE --> S5["📄 CSS Modules"]:::tool
  STYLE --> S6["🅱️ Bootstrap"]:::tool

  STYLE --> BACK["Backend / API"]:::layer
  BACK --> B1["▲ Next.js API Routes"]:::be
  BACK --> B2["🔶 SvelteKit Server Routes"]:::be
  BACK --> B3["🟨 Express.js"]:::be
  BACK --> B4["🐍 FastAPI"]:::be
  BACK --> B5["🐹 Go — Gin / Fiber"]:::be
  BACK --> B6["🟢 BaaS Edge Functions"]:::be

  B1 --> DB["Database"]:::layer
  B2 --> DB
  B3 --> DB
  B4 --> DB
  B5 --> DB
  B6 --> DB
  DB --> D1["🐘 PostgreSQL — self-hosted"]:::db
  DB --> D2["✨ Serverless Postgres"]:::db
  DB --> D3["🟢 Managed Postgres + BaaS"]:::db
  DB --> D4["🪐 Serverless MySQL"]:::db
  DB --> D5["🦅 Edge-Distributed SQLite"]:::db
  DB --> D6["🍃 Managed Document DB"]:::db

  D1 --> AUTH["Authentication"]:::layer
  D2 --> AUTH
  D3 --> AUTH
  D4 --> AUTH
  D5 --> AUTH
  D6 --> AUTH
  AUTH --> AU1["🔒 Auth.js"]:::tool
  AUTH --> AU2["🏮 BetterAuth"]:::tool
  AUTH --> AU3["🧑‍💼 Hosted Auth Service"]:::tool
  AUTH --> AU4["🟢 BaaS Auth SDK"]:::tool
  AUTH --> AU5["🔑 OAuth only"]:::tool
  AUTH --> AU6["🔧 Custom JWT"]:::tool

  AU1 --> PAYMENTS["Payments"]:::layer
  AU2 --> PAYMENTS
  AU3 --> PAYMENTS
  AU4 --> PAYMENTS
  AU5 --> PAYMENTS
  AU6 --> PAYMENTS
  PAYMENTS --> PAY1["💳 Payment Gateway"]:::tool
  PAYMENTS --> PAY2["🍋 Merchant of Record"]:::tool
  PAYMENTS --> PAY3["❌ No Payments"]:::tool

  PAY1 --> DEPLOY["Deployment"]:::layer
  PAY2 --> DEPLOY
  PAY3 --> DEPLOY
  DEPLOY --> DP1["▲ Serverless Edge Hosting"]:::dp
  DEPLOY --> DP2["🚂 Container PaaS"]:::dp
  DEPLOY --> DP3["🖥️ Self-Managed VPS"]:::dp
  DEPLOY --> DP4["🟢 Backend-as-a-Service"]:::dp
  DEPLOY --> DP5["☁️ Enterprise Cloud"]:::dp

  DP3 --> PROC["Process Manager"]:::layer
  PROC --> P1["🔄 PM2"]:::tool
  PROC --> P2["🐧 systemd"]:::tool
  PROC --> P3["🐋 Docker"]:::tool

  P1 --> PROXY["Reverse Proxy"]:::layer
  P2 --> PROXY
  P3 --> PROXY
  PROXY --> PR1["🌐 Nginx"]:::tool
  PROXY --> PR2["🦡 Caddy"]:::tool

  DP1 --> MON["Monitoring"]:::layer
  DP2 --> MON
  PR1 --> MON
  PR2 --> MON
  MON --> M1["🐛 Error Tracking"]:::tool
  MON --> M2["📊 Metrics / Dashboards"]:::tool

  M1 --> DONE["✅ Production App"]:::done
  M2 --> DONE

  classDef start fill:#18181B,color:#fff,stroke:#18181B,font-weight:bold
  classDef done fill:#065F46,color:#fff,stroke:#065F46,font-weight:bold
  classDef layer fill:#F4F4F5,color:#3F3F46,stroke:#D4D4D8,font-weight:bold
  classDef fe fill:#DBEAFE,color:#1E40AF,stroke:#93C5FD
  classDef be fill:#DCFCE7,color:#166534,stroke:#86EFAC
  classDef db fill:#EDE9FE,color:#5B21B6,stroke:#C4B5FD
  classDef dp fill:#FEF3C7,color:#92400E,stroke:#FCD34D
  classDef tool fill:#FFFFFF,color:#18181B,stroke:#D4D4D8
`;

// ─── ECOSYSTEM EXPLORER ───────────────────────────────────────────────────────

const ECOSYSTEM_NODES = [
  { id: 'react', layer: 'Frontend' },
  { id: 'nextjs', layer: 'Frontend' },
  { id: 'vue', layer: 'Frontend' },
  { id: 'svelte', layer: 'Frontend' },
  { id: 'vite', layer: 'Build Tool' },
  { id: 'tailwind', layer: 'Styling' },
  { id: 'shadcn', layer: 'Styling' },
  { id: 'express', layer: 'Backend' },
  { id: 'fastapi', layer: 'Backend' },
  { id: 'django', layer: 'Backend' },
  { id: 'postgres', layer: 'Database' },
  { id: 'mysql', layer: 'Database' },
  { id: 'sqlite', layer: 'Database' },
  { id: 'mongodb', layer: 'Database' },
  { id: 'nextauth', layer: 'Auth' },
  { id: 'clerk', layer: 'Auth' },
  { id: 'supabase_auth', layer: 'Auth' },
  { id: 'vercel', layer: 'Deploy' },
  { id: 'railway', layer: 'Deploy' },
  { id: 'vps', layer: 'Deploy' },
  { id: 'supabase', layer: 'Deploy' },
  { id: 'pm2', layer: 'Process' },
  { id: 'systemd', layer: 'Process' },
  { id: 'gunicorn', layer: 'Process' },
  { id: 'uvicorn', layer: 'Process' },
  { id: 'nginx', layer: 'Proxy' },
  { id: 'caddy', layer: 'Proxy' },
  { id: 'sentry', layer: 'Monitoring' },
  { id: 'prisma', layer: 'ORM' },
];

const LAYERS = ['Frontend', 'Build Tool', 'Styling', 'Backend', 'Database', 'Auth', 'Deploy', 'Process', 'Proxy', 'Monitoring', 'ORM'];

const LAYER_COLORS: Record<string, string> = {
  Frontend: 'border-blue-400 bg-blue-50 text-blue-800',
  'Build Tool': 'border-indigo-400 bg-indigo-50 text-indigo-800',
  Styling: 'border-pink-400 bg-pink-50 text-pink-800',
  Backend: 'border-green-400 bg-green-50 text-green-800',
  Database: 'border-purple-400 bg-purple-50 text-purple-800',
  Auth: 'border-red-400 bg-red-50 text-red-800',
  Deploy: 'border-orange-400 bg-orange-50 text-orange-800',
  Process: 'border-yellow-400 bg-yellow-50 text-yellow-800',
  Proxy: 'border-cyan-400 bg-cyan-50 text-cyan-800',
  Monitoring: 'border-gray-400 bg-gray-50 text-gray-800',
  ORM: 'border-violet-400 bg-violet-50 text-violet-800',
};

function EcosystemExplorer({ onToolClick }: { onToolClick: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-gray-500 leading-relaxed">
        Click any tool to learn what it does, why it exists, and when to use it.
      </p>
      {LAYERS.map(layer => {
        const nodes = ECOSYSTEM_NODES.filter(n => n.layer === layer);
        if (nodes.length === 0) return null;
        return (
          <div key={layer} className="flex flex-col gap-2">
            <div className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded border w-fit ${LAYER_COLORS[layer] || 'border-gray-300 bg-gray-50 text-gray-700'}`}>
              {layer}
            </div>
            <div className="flex flex-wrap gap-2">
              {nodes.map(n => {
                const tool = TOOL_KNOWLEDGE[n.id];
                if (!tool) return null;
                return (
                  <button
                    key={n.id}
                    onClick={() => onToolClick(n.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded hover:border-blue-500 hover:shadow-sm transition-all text-sm font-medium text-zinc-700 hover:text-blue-700"
                  >
                    <span>{tool.emoji}</span>
                    <span>{tool.name}</span>
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── ROADMAP ─────────────────────────────────────────────────────────────────

function LearningRoadmap() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {['frontend', 'backend', 'database', 'deployment', 'fullstack'].map(cat => (
          <span key={cat} className={`text-xs font-bold px-2 py-0.5 rounded border ${roadmapCatColor(cat)}`}>
            {cat}
          </span>
        ))}
        <span className="text-xs text-gray-400 self-center">— color-coded by topic</span>
      </div>

      {LEARNING_ROADMAP.map(step => (
        <div
          key={step.step}
          className={`border-l-4 rounded bg-white border border-[#D4D4D8] overflow-hidden transition-all ${roadmapCatColor(step.category)}`}
        >
          <button
            onClick={() => setExpanded(expanded === step.step ? null : step.step)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-50 transition-all"
          >
            <span className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              step.difficulty === 'Beginner' ? 'bg-emerald-500 text-white' :
              step.difficulty === 'Intermediate' ? 'bg-amber-500 text-white' :
              'bg-red-500 text-white'
            }`}>
              {step.step}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-zinc-900">{step.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                <Clock className="h-3 w-3" /> {step.estimatedTime}
                <span className="text-gray-300">·</span>
                <span>{step.difficulty}</span>
              </div>
            </div>
            <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform shrink-0 ${expanded === step.step ? 'rotate-90' : ''}`} />
          </button>

          {expanded === step.step && (
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
              <p className="text-base text-gray-700 leading-relaxed">{step.why}</p>

              <div className="bg-emerald-50 border border-emerald-200 rounded p-3">
                <div className="text-xs font-black text-emerald-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Code2 className="h-3 w-3" /> Mini Project
                </div>
                <p className="text-sm text-emerald-900">{step.miniProject}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {step.tools.map(t => (
                  <span key={t} className="text-xs bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded text-zinc-700 font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── DECISION GUIDE ──────────────────────────────────────────────────────────

interface DecisionScenario {
  emoji: string;
  title: string;
  question: string;
  answer: string;
  stack: { role: string; tool: string; why: string }[];
}

const DECISION_SCENARIOS: DecisionScenario[] = [
  {
    emoji: '📈',
    title: 'Stock screener / data dashboard',
    question: 'I want to build a tool that shows live financial data and lets users filter stocks',
    answer: 'Use React + Express + PostgreSQL on Railway. Dashboards don\'t need SEO, so a pure frontend works great. Express fetches external data APIs and stores results. Railway keeps the server running 24/7.',
    stack: [
      { role: 'Frontend', tool: 'React + Vite', why: 'Fast to build, no SEO needed for internal tools' },
      { role: 'Backend', tool: 'Express.js', why: 'Fetches external APIs, handles data processing' },
      { role: 'Database', tool: 'PostgreSQL', why: 'Stores historical data and user preferences' },
      { role: 'Auth', tool: 'Google login (OAuth)', why: 'Easiest login for a tool — no passwords to manage' },
      { role: 'Hosting', tool: 'Railway', why: 'Keeps your server running, easy to deploy' },
    ],
  },
  {
    emoji: '🏢',
    title: 'SaaS tool (project manager, CRM, invoicing)',
    question: 'I want to build a web app that multiple teams can sign up for and pay monthly',
    answer: 'Use Next.js + Supabase + Vercel + Stripe. Supabase gives you database and login in one dashboard. Next.js handles SEO and server logic. Stripe handles subscriptions.',
    stack: [
      { role: 'Frontend + Backend', tool: 'Next.js', why: 'Handles pages and API in one project, great for SEO' },
      { role: 'Database + Auth', tool: 'Supabase', why: 'Database and login in one dashboard — fastest to set up' },
      { role: 'Payments', tool: 'Stripe', why: 'Handles subscriptions, trials, and invoices' },
      { role: 'Hosting', tool: 'Vercel', why: 'Push to GitHub and it deploys automatically' },
    ],
  },
  {
    emoji: '🤖',
    title: 'AI chat app or writing assistant',
    question: 'I want to build an app that lets users chat with an AI or ask questions about their documents',
    answer: 'Use Next.js + Railway + an AI API (OpenAI/Anthropic). Railway keeps your server running so AI responses can stream without getting cut off. Serverless platforms time out on long AI responses.',
    stack: [
      { role: 'Frontend + Backend', tool: 'Next.js', why: 'Clean UI and server logic in one project' },
      { role: 'AI', tool: 'OpenAI / Anthropic API', why: 'Powers the chat — pay per use, no GPU needed' },
      { role: 'Database', tool: 'Supabase', why: 'Stores conversation history and user accounts' },
      { role: 'Hosting', tool: 'Railway', why: 'Keeps connections alive for streaming AI responses' },
    ],
  },
  {
    emoji: '🛍️',
    title: 'Online store or marketplace',
    question: 'I want to sell products online with a cart, checkout, and order management',
    answer: 'Use Next.js + Supabase + Stripe + Vercel. Next.js serves product pages fast (good for Google rankings). Stripe handles payments without you touching card data.',
    stack: [
      { role: 'Frontend + Backend', tool: 'Next.js', why: 'Product pages rank on Google, handles checkout flow' },
      { role: 'Database + Auth', tool: 'Supabase', why: 'Stores products, orders, and customer accounts' },
      { role: 'Payments', tool: 'Stripe', why: 'Handles card payments, refunds, and fraud — you never touch card numbers' },
      { role: 'Hosting', tool: 'Vercel', why: 'Global CDN makes product pages load fast worldwide' },
    ],
  },
  {
    emoji: '📄',
    title: 'Landing page, blog, or portfolio',
    question: 'I just need a website to explain my product or showcase my work',
    answer: 'Use Next.js + Vercel. No database needed for a simple site. Pages are pre-built so they load in milliseconds and rank well on Google.',
    stack: [
      { role: 'Framework', tool: 'Next.js', why: 'Pre-builds pages for instant loading and Google visibility' },
      { role: 'Styling', tool: 'Tailwind CSS', why: 'Design system built-in — no need to write CSS from scratch' },
      { role: 'Hosting', tool: 'Vercel', why: 'Free tier, automatic HTTPS, global fast loading' },
    ],
  },
  {
    emoji: '⚡',
    title: 'Live chat or multiplayer app',
    question: 'I want users to see each other\'s actions in real time, like a chat or collaborative tool',
    answer: 'Use React + Express + Railway. Live connections require a server that stays open — serverless platforms (like Vercel\'s free tier) close connections after a few seconds, which breaks real-time features.',
    stack: [
      { role: 'Frontend', tool: 'React + Vite', why: 'Fast to update UI in real time as messages arrive' },
      { role: 'Backend', tool: 'Express.js + Socket.io', why: 'Keeps connections open for live message delivery' },
      { role: 'Database', tool: 'PostgreSQL', why: 'Stores message history and user data' },
      { role: 'Hosting', tool: 'Railway', why: 'Runs your server 24/7 — required for live connections' },
    ],
  },
];

function DecisionGuide() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-base text-gray-500 leading-relaxed">
        Not sure what tools to use? Pick your situation and see exactly what stack to build with — and why.
      </p>
      <div className="flex flex-col gap-2">
        {DECISION_SCENARIOS.map((scenario, i) => (
          <div
            key={i}
            className={`border rounded overflow-hidden transition-all ${
              open === i ? 'border-blue-400 shadow-sm' : 'border-[#D4D4D8]'
            } bg-white`}
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-50 transition-all"
            >
              <span className="text-2xl shrink-0">{scenario.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-zinc-900">{scenario.title}</div>
                <div className="text-xs text-gray-400 mt-0.5 italic truncate">"{scenario.question}"</div>
              </div>
              <ChevronRight className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${open === i ? 'rotate-90' : ''}`} />
            </button>

            {open === i && (
              <div className="px-4 pb-4 flex flex-col gap-4 border-t border-gray-100 pt-3">
                <p className="text-base text-gray-700 leading-relaxed">{scenario.answer}</p>

                <div className="flex flex-col gap-2">
                  <div className="text-xs font-black uppercase tracking-wider text-gray-400">Recommended stack</div>
                  {scenario.stack.map((s, j) => (
                    <div key={j} className="flex items-start gap-3 text-sm">
                      <span className="text-xs font-bold text-gray-400 w-28 shrink-0 pt-0.5">{s.role}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-zinc-900">{s.tool}</span>
                        <span className="text-gray-500 ml-2">— {s.why}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface VisualFlowchartProps {
  answers?: AnswerMap;
  handleCopyClipboard: (text: string) => void;
}

type ChartTab = 'stack' | 'ecosystem' | 'roadmap';
type EcoTab = 'guide' | 'explorer' | 'map';

export default function VisualFlowchart({ answers, handleCopyClipboard }: VisualFlowchartProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>(answers ? 'stack' : 'ecosystem');
  const [ecoTab, setEcoTab] = useState<EcoTab>('guide');
  const [selectedTool, setSelectedTool] = useState<ToolInfo | null>(null);
  const [copied, setCopied] = useState(false);

  const hasStack = answers && Object.keys(answers).length > 0;
  const stackDiagram = hasStack ? buildStackDiagram(answers) : '';

  const handleCopyDiagram = (def: string) => {
    const mermaidCode = '```mermaid\n' + def + '\n```';
    navigator.clipboard.writeText(mermaidCode);
    handleCopyClipboard(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { id: ChartTab; label: string; icon: React.ReactNode }[] = [
    ...(hasStack ? [{ id: 'stack' as ChartTab, label: 'Your Stack Diagram', icon: <Layers className="h-4 w-4" /> }] : []),
    { id: 'ecosystem', label: 'Full Ecosystem Map', icon: <Map className="h-4 w-4" /> },
    { id: 'roadmap', label: 'Learning Roadmap', icon: <BookOpen className="h-4 w-4" /> },
  ];

  return (
    <div className="flex flex-col gap-6" id="visual-flowchart">
      {selectedTool && (
        <ToolDrawer tool={selectedTool} onClose={() => setSelectedTool(null)} />
      )}

      {/* tab bar */}
      <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-1 flex gap-1 self-start">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── YOUR STACK DIAGRAM ─────────────────────────────────────────── */}
      {activeTab === 'stack' && hasStack && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-black text-zinc-900">
                {(answers['project_name'] as string) || 'Your Project'} — Stack Architecture
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Visual overview of the stack you designed</p>
            </div>
            <button
              onClick={() => handleCopyDiagram(stackDiagram)}
              className="flex items-center gap-1.5 text-xs bg-[#18181B] hover:bg-black text-white font-bold px-3 py-1.5 rounded transition-all"
            >
              {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy as Mermaid</>}
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-6 overflow-auto">
            <MermaidChart definition={stackDiagram} id="stack" />
          </div>

          {/* Mermaid code block */}
          <details className="bg-zinc-50 border border-zinc-200 rounded">
            <summary className="px-4 py-2.5 cursor-pointer text-xs font-mono text-gray-600 font-bold hover:bg-zinc-100 rounded">
              View raw Mermaid code (paste into any AI or mermaid.live)
            </summary>
            <pre className="p-4 text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap">
              {stackDiagram}
            </pre>
          </details>
        </div>
      )}

      {/* ── ECOSYSTEM MAP ──────────────────────────────────────────────── */}
      {activeTab === 'ecosystem' && (
        <div className="flex flex-col gap-4">
          {/* ecosystem sub-tabs */}
          <div className="flex gap-1 bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-1 self-start flex-wrap">
            {([
              { id: 'guide' as EcoTab, label: 'When should I use X?', icon: <Compass className="h-3.5 w-3.5" /> },
              { id: 'explorer' as EcoTab, label: 'Tool Explorer', icon: <Lightbulb className="h-3.5 w-3.5" /> },
              { id: 'map' as EcoTab, label: 'Full Map', icon: <Map className="h-3.5 w-3.5" /> },
            ]).map(t => (
              <button
                key={t.id}
                onClick={() => setEcoTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  ecoTab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {ecoTab === 'guide' && (
            <div className="max-w-2xl">
              <DecisionGuide />
            </div>
          )}

          {ecoTab === 'explorer' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">Full Stack Decision Map</h2>
                  <button
                    onClick={() => handleCopyDiagram(FULL_MAP_DEFINITION)}
                    className="flex items-center gap-1.5 text-xs border border-[#D4D4D8] hover:border-gray-400 text-gray-700 font-bold px-2.5 py-1.5 rounded transition-all"
                  >
                    {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy diagram</>}
                  </button>
                </div>
                <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-4 overflow-auto max-h-[600px]">
                  <MermaidChart definition={FULL_MAP_DEFINITION} id="ecosystem" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  🔍 Tool Explorer
                  <span className="text-sm font-normal text-gray-500 ml-2">— click any tool to learn more</span>
                </h2>
                <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-4 overflow-y-auto max-h-[600px]">
                  <EcosystemExplorer onToolClick={id => setSelectedTool(TOOL_KNOWLEDGE[id] || null)} />
                </div>
              </div>
            </div>
          )}

          {ecoTab === 'map' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-zinc-900 dark:text-zinc-100">Full Stack Decision Map</h2>
                <button
                  onClick={() => handleCopyDiagram(FULL_MAP_DEFINITION)}
                  className="flex items-center gap-1.5 text-xs border border-[#D4D4D8] hover:border-gray-400 text-gray-700 font-bold px-2.5 py-1.5 rounded transition-all"
                >
                  {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy diagram</>}
                </button>
              </div>
              <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-4 overflow-auto max-h-[700px]">
                <MermaidChart definition={FULL_MAP_DEFINITION} id="ecosystem-map" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ROADMAP ───────────────────────────────────────────────────── */}
      {activeTab === 'roadmap' && (
        <div className="max-w-2xl flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-black text-zinc-900">Learning Roadmap</h2>
            <p className="text-base text-gray-500 mt-0.5 leading-relaxed">
              The recommended order to learn full-stack web development — from HTML to production deployment.
              Each step includes a mini-project to practice.
            </p>
          </div>
          <LearningRoadmap />
        </div>
      )}
    </div>
  );
}

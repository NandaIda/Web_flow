import React, { useState, useEffect, useRef, useCallback } from 'react';
import mermaid from 'mermaid';
import {
  Copy, Check, X, BookOpen, Map, ChevronRight,
  ArrowRight, Lightbulb, Clock, Code2, Layers
} from 'lucide-react';
import { TOOL_KNOWLEDGE, LEARNING_ROADMAP, ToolInfo } from '../data/toolKnowledge';
import { AnswerMap, FLOW_QUESTIONS } from '../data/conversationalFlow';

// ─── MERMAID INIT ─────────────────────────────────────────────────────────────

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    primaryColor: '#2563EB',
    primaryTextColor: '#18181B',
    primaryBorderColor: '#93C5FD',
    lineColor: '#6B7280',
    secondaryColor: '#F0F9FF',
    background: '#FFFFFF',
    fontSize: '14px',
  },
  flowchart: { curve: 'basis', padding: 20 },
});

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
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto animate-fade-in">
        {/* header */}
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tool.emoji}</span>
            <div>
              <h2 className="text-xl font-black text-zinc-900">{tool.name}</h2>
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
            <p className="text-sm text-gray-700 leading-relaxed">{tool.what}</p>
          </div>

          {/* why */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> Why does it exist?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">{tool.why}</p>
          </div>

          {/* beginner advice */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-700 mb-1.5 flex items-center gap-1.5">
              👋 Beginner Tip
            </h3>
            <p className="text-sm text-blue-900 leading-relaxed">{tool.beginner}</p>
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

  useEffect(() => {
    if (!ref.current) return;
    setError('');
    // Clear previous content safely — no innerHTML
    while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);

    mermaid.render(`mermaid-${id}-${Date.now()}`, definition)
      .then(({ svg }) => {
        if (!ref.current) return;
        // Parse SVG string into a real DOM node via DOMParser (safe — no script execution)
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const svgNode = doc.documentElement;
        // Remove any <script> elements that mermaid might embed
        svgNode.querySelectorAll('script').forEach(s => s.remove());
        // Clear and append the sanitized SVG node
        while (ref.current.firstChild) ref.current.removeChild(ref.current.firstChild);
        ref.current.appendChild(document.adoptNode(svgNode));
      })
      .catch(e => setError(String(e)));
  }, [definition, id]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-mono">
        Diagram error: {error}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="w-full overflow-auto flex justify-center [&_svg]:max-w-full [&_svg]:h-auto"
    />
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

  START --> FE["Frontend Choice"]:::layer
  FE --> FE1["⚛️ React"]:::fe
  FE --> FE2["▲ Next.js"]:::fe
  FE --> FE3["💚 Vue"]:::fe
  FE --> FE4["🔶 Svelte"]:::fe
  FE --> FE5["🌐 Plain HTML"]:::fe

  FE1 --> BUILD["Build Tool"]:::layer
  FE2 --> BUILD
  FE3 --> BUILD
  FE4 --> BUILD
  BUILD --> B1["⚡ Vite"]:::tool
  BUILD --> B2["▲ Next.js CLI"]:::tool
  BUILD --> B3["🔶 SvelteKit"]:::tool

  B1 --> STYLE["Styling"]:::layer
  B2 --> STYLE
  B3 --> STYLE
  STYLE --> S1["🎨 Tailwind CSS"]:::tool
  STYLE --> S2["🧩 shadcn/ui"]:::tool
  STYLE --> S3["📄 CSS Modules"]:::tool

  STYLE --> API["API Layer"]:::layer
  API --> A1["REST API"]:::tool
  API --> A2["GraphQL"]:::tool
  API --> A3["tRPC"]:::tool
  API --> A4["WebSockets"]:::tool

  A1 --> BACK["Backend Runtime"]:::layer
  A2 --> BACK
  A3 --> BACK
  A4 --> BACK
  BACK --> R1["🟨 Node.js / TS"]:::be
  BACK --> R2["🐍 Python"]:::be
  BACK --> R3["🐹 Go"]:::be
  BACK --> R4["⚙️ Rust"]:::be

  R1 --> F1["Express"]:::tool
  R1 --> F2["Fastify"]:::tool
  R1 --> F3["NestJS"]:::tool
  R2 --> F4["FastAPI"]:::tool
  R2 --> F5["Django"]:::tool
  R3 --> F6["Gin"]:::tool
  R4 --> F7["Axum"]:::tool

  F1 --> DB["Database"]:::layer
  F2 --> DB
  F3 --> DB
  F4 --> DB
  F5 --> DB
  F6 --> DB
  F7 --> DB
  DB --> D1["🐘 PostgreSQL"]:::db
  DB --> D2["🍃 MongoDB"]:::db
  DB --> D3["📁 SQLite"]:::db

  D1 --> AUTH["Authentication"]:::layer
  D2 --> AUTH
  D3 --> AUTH
  AUTH --> AU1["🔒 Auth.js"]:::tool
  AUTH --> AU2["🧑‍💼 Clerk"]:::tool
  AUTH --> AU3["🟢 Supabase Auth"]:::tool
  AUTH --> AU4["🔑 OAuth only"]:::tool

  AU1 --> DEPLOY["Deployment"]:::layer
  AU2 --> DEPLOY
  AU3 --> DEPLOY
  AU4 --> DEPLOY
  DEPLOY --> DP1["▲ Vercel"]:::dp
  DEPLOY --> DP2["🚂 Railway"]:::dp
  DEPLOY --> DP3["🖥️ VPS"]:::dp
  DEPLOY --> DP4["🟢 Supabase"]:::dp

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
  MON --> M1["🐛 Sentry"]:::tool
  MON --> M2["📊 Grafana"]:::tool

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
      <p className="text-sm text-gray-500 leading-relaxed">
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
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D4D4D8] rounded hover:border-blue-500 hover:shadow-sm transition-all text-sm font-medium text-zinc-700 hover:text-blue-700"
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
              <p className="text-sm text-gray-700 leading-relaxed">{step.why}</p>

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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface VisualFlowchartProps {
  answers?: AnswerMap;
  handleCopyClipboard: (text: string) => void;
}

type ChartTab = 'stack' | 'ecosystem' | 'roadmap';

export default function VisualFlowchart({ answers, handleCopyClipboard }: VisualFlowchartProps) {
  const [activeTab, setActiveTab] = useState<ChartTab>(answers ? 'stack' : 'ecosystem');
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
      <div className="bg-white border border-[#D4D4D8] rounded p-1 flex gap-1 self-start">
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

          <div className="bg-white border border-[#D4D4D8] rounded p-6 overflow-auto">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* left: diagram */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-zinc-900">Full Stack Decision Map</h2>
              <button
                onClick={() => handleCopyDiagram(FULL_MAP_DEFINITION)}
                className="flex items-center gap-1.5 text-xs border border-[#D4D4D8] hover:border-gray-400 text-gray-700 font-bold px-2.5 py-1.5 rounded transition-all"
              >
                {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy diagram</>}
              </button>
            </div>
            <div className="bg-white border border-[#D4D4D8] rounded p-4 overflow-auto max-h-[600px]">
              <MermaidChart definition={FULL_MAP_DEFINITION} id="ecosystem" />
            </div>
          </div>

          {/* right: explorer */}
          <div className="flex flex-col gap-4">
            <h2 className="text-base font-black text-zinc-900">
              🔍 Tool Explorer
              <span className="text-sm font-normal text-gray-500 ml-2">— click any tool to learn more</span>
            </h2>
            <div className="bg-white border border-[#D4D4D8] rounded p-4 overflow-y-auto max-h-[600px]">
              <EcosystemExplorer onToolClick={id => setSelectedTool(TOOL_KNOWLEDGE[id] || null)} />
            </div>
          </div>
        </div>
      )}

      {/* ── ROADMAP ───────────────────────────────────────────────────── */}
      {activeTab === 'roadmap' && (
        <div className="max-w-2xl flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-black text-zinc-900">Learning Roadmap</h2>
            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">
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

import React, { useState } from 'react';
import { useDebounce } from '../utils/useDebounce';
import { BookOpen, Layers, X, ChevronRight, Lightbulb } from 'lucide-react';
import { PREDEFINED_STACKS } from '../data';
import { TOOL_KNOWLEDGE, LEARNING_ROADMAP, ToolInfo } from '../data/toolKnowledge';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function categoryColor(cat: ToolInfo['category']): string {
  switch (cat) {
    case 'frontend':   return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'backend':    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800';
    case 'database':   return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    case 'auth':       return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'deployment': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    case 'process':    return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
    case 'proxy':      return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    case 'monitoring': return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    case 'styling':    return 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800';
    case 'build':      return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    case 'payments':   return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    default:           return 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
  }
}

function difficultyDot(d: ToolInfo['difficulty']) {
  if (d === 'Beginner')     return 'bg-emerald-500';
  if (d === 'Intermediate') return 'bg-amber-500';
  return 'bg-red-500';
}

function complexityBadge(c: string) {
  if (c === 'Easy')   return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  if (c === 'Medium') return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
}

function roadmapCat(cat: string) {
  switch (cat) {
    case 'frontend':   return 'border-blue-400 bg-blue-50 dark:bg-blue-900/20';
    case 'backend':    return 'border-green-400 bg-green-50 dark:bg-green-900/20';
    case 'database':   return 'border-purple-400 bg-purple-50 dark:bg-purple-900/20';
    case 'deployment': return 'border-orange-400 bg-orange-50 dark:bg-orange-900/20';
    case 'fullstack':  return 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20';
    default:           return 'border-gray-300 bg-gray-50 dark:bg-zinc-800';
  }
}

// ─── TOOL DRAWER ─────────────────────────────────────────────────────────────

function ToolDrawer({ tool, onClose }: { tool: ToolInfo; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3 p-5 border-b border-gray-100 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{tool.emoji}</span>
            <div>
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">{tool.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded border font-bold mt-1 inline-block ${categoryColor(tool.category)}`}>
                {tool.category.toUpperCase()}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300 p-1">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm font-semibold text-gray-400 dark:text-zinc-500 italic">{tool.tagline}</p>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1"><BookOpen className="h-3 w-3" /> What is it?</h3>
            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{tool.what}</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500 mb-1.5 flex items-center gap-1"><Lightbulb className="h-3 w-3" /> Why does it exist?</h3>
            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{tool.why}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded p-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 mb-1">👋 Beginner Tip</h3>
            <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">{tool.beginner}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="text-xs font-black uppercase text-gray-400 dark:text-zinc-500 mb-1.5">Difficulty</h3>
              <span className={`flex items-center gap-1.5 text-xs font-bold`}>
                <span className={`w-2 h-2 rounded-full ${difficultyDot(tool.difficulty)}`} />
                {tool.difficulty}
              </span>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-gray-400 dark:text-zinc-500 mb-1.5">Alternatives</h3>
              <div className="flex flex-wrap gap-1">
                {tool.alternatives.map(a => (
                  <span key={a} className="text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">{a}</span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-gray-400 dark:text-zinc-500 mb-1.5">Used with</h3>
            <div className="flex flex-wrap gap-1.5">
              {tool.usedWith.map(u => (
                <span key={u} className="text-xs bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300 font-medium">{u}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION: STACK COMPARE ───────────────────────────────────────────────────

function StackCompare() {
  const [selected, setSelected] = useState<string | null>('pern');
  const [filter, setFilter] = useState('All');

  const filtered = PREDEFINED_STACKS.filter(s =>
    filter === 'All' ? true : s.complexity === filter
  );
  const active = PREDEFINED_STACKS.find(s => s.id === selected);

  return (
    <div className="flex flex-col gap-4">
      {/* filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {['All', 'Easy', 'Medium', 'Hard'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-bold px-3 py-1.5 rounded border transition-all ${
              filter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* stack list */}
        <div className="flex flex-col gap-2">
          {filtered.map(stack => (
            <button
              key={stack.id}
              onClick={() => setSelected(stack.id)}
              className={`text-left p-3 rounded border transition-all ${
                selected === stack.id
                  ? 'border-blue-600 bg-blue-50 shadow-sm'
                  : 'border-[#D4D4D8] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-400 dark:hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{stack.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${complexityBadge(stack.complexity)}`}>
                  {stack.complexity}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-tight">{stack.idealUse}</p>
            </button>
          ))}
        </div>

        {/* detail panel */}
        {active && (
          <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-5 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100">{active.name}</h3>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1 leading-relaxed">{active.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {[
                ['Frontend', active.frontend],
                ['Backend', active.backend],
                ['Database', active.database],
                ['Auth', active.auth],
                ['Proxy', active.proxy],
                ['Monitor', active.monitoring],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">{k}</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{v}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 dark:border-zinc-700 pt-3">
              <span className="text-xs font-black uppercase text-gray-400 dark:text-zinc-500">Best for</span>
              <p className="text-xs text-gray-700 dark:text-zinc-300 mt-1">{active.idealUse}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SECTION: GLOSSARY ────────────────────────────────────────────────────────

const TOOL_GROUPS: { label: string; ids: string[] }[] = [
  { label: 'Frontend', ids: ['react', 'nextjs', 'vue', 'svelte'] },
  { label: 'Build Tools', ids: ['vite'] },
  { label: 'Styling', ids: ['tailwind', 'shadcn'] },
  { label: 'Backend', ids: ['express', 'fastapi', 'django', 'prisma'] },
  { label: 'Database', ids: ['postgres', 'mysql', 'sqlite', 'mongodb', 'planetscale', 'neon', 'turso'] },
  { label: 'Authentication', ids: ['nextauth', 'clerk', 'supabase_auth'] },
  { label: 'Deployment', ids: ['vercel', 'railway', 'vps', 'supabase'] },
  { label: 'Process & Proxy', ids: ['pm2', 'systemd', 'gunicorn', 'uvicorn', 'nginx', 'caddy'] },
  { label: 'Monitoring', ids: ['sentry'] },
  { label: 'Payments', ids: ['stripe', 'lemon_squeezy'] },
];

function Glossary() {
  const [selected, setSelected] = useState<ToolInfo | null>(null);
  const [searchRaw, setSearchRaw] = useState('');
  const search = useDebounce(searchRaw, 180);

  const filtered = search.trim()
    ? Object.values(TOOL_KNOWLEDGE).filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.includes(search.toLowerCase()) ||
        t.tagline.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  return (
    <>
      {selected && <ToolDrawer tool={selected} onClose={() => setSelected(null)} />}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={searchRaw}
          onChange={e => setSearchRaw(e.target.value)}
          placeholder="Search tools… e.g. Nginx, Prisma, PM2"
          className="bg-white dark:bg-zinc-800 border border-[#D4D4D8] dark:border-zinc-600 focus:border-blue-500 rounded px-3 py-2.5 text-sm focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
        />

        {filtered ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filtered.map(t => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded hover:border-blue-400 hover:shadow-sm transition-all text-left"
              >
                <span className="text-xl">{t.emoji}</span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{t.name}</div>
                  <div className="text-[10px] text-gray-500 dark:text-zinc-400 truncate">{t.tagline}</div>
                </div>
                <ChevronRight className="h-3 w-3 text-gray-300 dark:text-zinc-600 shrink-0 ml-auto" />
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center py-8 text-gray-400 dark:text-zinc-500 text-sm">No tools found for "{searchRaw}"</div>
            )}
          </div>
        ) : (
          TOOL_GROUPS.map(group => (
            <div key={group.label}>
              <div className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-zinc-500 mb-2">{group.label}</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {group.ids.map(id => {
                  const t = TOOL_KNOWLEDGE[id];
                  if (!t) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelected(t)}
                      className="flex items-center gap-2 p-3 bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded hover:border-blue-400 hover:shadow-sm transition-all text-left"
                    >
                      <span className="text-lg shrink-0">{t.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">{t.name}</div>
                        <div className="text-[10px] text-gray-400 dark:text-zinc-500 truncate leading-tight">{t.tagline}</div>
                      </div>
                      <span className={`text-[9px] font-bold px-1 py-0.5 rounded shrink-0 ${difficultyDot(t.difficulty) === 'bg-emerald-500' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'}`}>
                        {t.difficulty.slice(0, 3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

// ─── SECTION: ROADMAP ────────────────────────────────────────────────────────

function FullRoadmap() {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-2">
      {LEARNING_ROADMAP.map(step => (
        <div key={step.step} className={`border-l-4 bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded overflow-hidden ${roadmapCat(step.category)}`}>
          <button
            onClick={() => setExpanded(expanded === step.step ? null : step.step)}
            className="w-full flex items-center gap-3 p-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            <span className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              step.difficulty === 'Beginner' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>{step.step}</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{step.title}</div>
              <div className="text-xs text-gray-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                {step.estimatedTime} · {step.difficulty}
              </div>
            </div>
            <ChevronRight className={`h-4 w-4 text-gray-400 dark:text-zinc-500 shrink-0 transition-transform ${expanded === step.step ? 'rotate-90' : ''}`} />
          </button>
          {expanded === step.step && (
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 dark:border-zinc-700 pt-3">
              <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">{step.why}</p>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded p-3 text-sm text-emerald-900 dark:text-emerald-100">
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 block mb-1">Mini Project</span>
                {step.miniProject}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {step.tools.map(t => (
                  <span key={t} className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded text-zinc-700 dark:text-zinc-300">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

type LearnSection = 'stacks' | 'glossary' | 'roadmap';

const LS_LEARN_KEY = 'webflow_learn_section';

export default function LearnMore() {
  const [section, setSection] = useState<LearnSection>(() => {
    try { return (localStorage.getItem(LS_LEARN_KEY) as LearnSection) || 'stacks'; } catch { return 'stacks'; }
  });

  const switchSection = (s: LearnSection) => {
    setSection(s);
    try { localStorage.setItem(LS_LEARN_KEY, s); } catch {}
  };

  const sections: { id: LearnSection; label: string; desc: string }[] = [
    { id: 'stacks',  label: '🏗️ Stack Comparison', desc: 'Compare predefined stacks side by side' },
    { id: 'glossary', label: '📖 Tool Glossary',    desc: 'Plain-English explanation for every tool' },
    { id: 'roadmap', label: '🗺️ Learning Roadmap',  desc: 'What to learn and in what order' },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* header */}
      <div className="bg-gradient-to-r from-[#18181B] to-zinc-800 text-white p-5 rounded shadow-md">
        <h2 className="text-lg font-black">Read More</h2>
        <p className="text-sm text-gray-300 mt-1">
          Compare stacks, understand every tool in plain English, and follow the recommended learning path.
        </p>
      </div>

      {/* section switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => switchSection(s.id)}
            className={`text-left p-4 rounded border transition-all ${
              section === s.id
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 shadow-sm'
                : 'border-[#D4D4D8] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-gray-400 dark:hover:border-zinc-500'
            }`}
          >
            <div className="font-black text-sm text-zinc-900 dark:text-zinc-100">{s.label}</div>
            <div className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{s.desc}</div>
          </button>
        ))}
      </div>

      {/* section content */}
      {section === 'stacks'  && <StackCompare />}
      {section === 'glossary' && <Glossary />}
      {section === 'roadmap' && <FullRoadmap />}
    </div>
  );
}

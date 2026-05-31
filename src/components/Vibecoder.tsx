import React, { useState, useEffect } from 'react';
import {
  Copy, Check, Sparkles, ChevronDown, ChevronRight,
  AlertTriangle, Lightbulb, Terminal, FileCode2, Palette,
  Shield, Zap, Users, Globe, LayoutDashboard
} from 'lucide-react';
import { AnswerMap, FLOW_QUESTIONS } from '../data/conversationalFlow';

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function label(qId: string, aId: string) {
  return FLOW_QUESTIONS[qId]?.options?.find(o => o.id === aId)?.label || aId;
}

// ─── IMPROVEMENT CHECKLISTS ───────────────────────────────────────────────────

interface CheckItem {
  id: string;
  text: string;
  tip: string;
  promptSnippet: string; // what to add to the AI prompt to get this
  category: 'ui' | 'ux' | 'perf' | 'security' | 'personal';
}

const UI_CHECKLIST: CheckItem[] = [
  {
    id: 'ui-dark',
    text: 'Dark mode support',
    tip: 'Toggle between light and dark theme. Users expect this in modern apps.',
    promptSnippet: 'Include a dark mode toggle using Tailwind dark: classes and a theme stored in localStorage.',
    category: 'ui',
  },
  {
    id: 'ui-mobile',
    text: 'Mobile-first responsive layout',
    tip: 'Design for phone screen first, then scale up. Most users are on mobile.',
    promptSnippet: 'Ensure all layouts are mobile-first responsive using Tailwind sm/md/lg breakpoints.',
    category: 'ui',
  },
  {
    id: 'ui-loading',
    text: 'Loading states & skeleton screens',
    tip: 'Never show a blank page. Show skeleton loaders while data loads.',
    promptSnippet: 'Add skeleton loading states for all data-fetching components using Tailwind animate-pulse.',
    category: 'ui',
  },
  {
    id: 'ui-empty',
    text: 'Empty state designs',
    tip: 'When a list is empty, show a friendly illustration and a CTA — not a blank space.',
    promptSnippet: 'Design empty state components with an icon, message, and call-to-action button for all list views.',
    category: 'ui',
  },
  {
    id: 'ui-toast',
    text: 'Toast / notification feedback',
    tip: 'Every user action (save, delete, error) should show a toast message.',
    promptSnippet: 'Integrate sonner or react-hot-toast for success, error, and info toast notifications on all mutations.',
    category: 'ui',
  },
  {
    id: 'ui-fonts',
    text: 'Custom typography with Google Fonts',
    tip: 'A good font makes the app feel polished. Pick one heading font + one body font.',
    promptSnippet: 'Add Google Fonts (e.g. Inter for body, Sora or Cal Sans for headings) via next/font or a link tag.',
    category: 'ui',
  },
  {
    id: 'ui-animation',
    text: 'Micro-animations on interactions',
    tip: 'Subtle fade-ins, button press effects, and hover transitions make the UI feel alive.',
    promptSnippet: 'Add Framer Motion for page transitions and subtle entrance animations on list items and cards.',
    category: 'ui',
  },
  {
    id: 'ui-brand-color',
    text: 'Custom brand color palette',
    tip: 'Pick 1–2 brand colors and use them consistently. Avoid relying only on default blue.',
    promptSnippet: 'Define a custom Tailwind color palette in tailwind.config.ts with my brand primary and accent colors.',
    category: 'ui',
  },
];

const UX_CHECKLIST: CheckItem[] = [
  {
    id: 'ux-onboarding',
    text: 'Onboarding flow for new users',
    tip: 'First-time users need to understand the app in 10 seconds. Add a welcome step.',
    promptSnippet: 'Create a 3-step onboarding modal that appears on first login. Show key features and allow skip.',
    category: 'ux',
  },
  {
    id: 'ux-search',
    text: 'Search with instant results',
    tip: 'If users can create items, they need to find them fast. Add a search bar with live filtering.',
    promptSnippet: 'Add a search input with debounced live filtering using a controlled state and Array.filter.',
    category: 'ux',
  },
  {
    id: 'ux-confirm',
    text: 'Confirmation dialogs for destructive actions',
    tip: 'Deleting something should always ask "are you sure?". Prevent accidental data loss.',
    promptSnippet: 'Add a shadcn AlertDialog confirmation for all delete operations before making the API call.',
    category: 'ux',
  },
  {
    id: 'ux-keyboard',
    text: 'Keyboard shortcuts',
    tip: 'Power users love shortcuts. Even 2–3 shortcuts (new item, search, close modal) feel professional.',
    promptSnippet: 'Add keyboard shortcuts using useEffect + keydown listeners: Cmd+K for search, Escape to close modals.',
    category: 'ux',
  },
  {
    id: 'ux-breadcrumb',
    text: 'Breadcrumb navigation',
    tip: 'Users should always know where they are in the app hierarchy.',
    promptSnippet: 'Add a breadcrumb component using shadcn Breadcrumb that reflects the current page path.',
    category: 'ux',
  },
];

const PERSONAL_CHECKLIST: CheckItem[] = [
  {
    id: 'p-profile',
    text: 'User profile page',
    tip: 'Let users see and edit their name, avatar, and account settings.',
    promptSnippet: 'Create a /profile page with avatar upload (Supabase storage or Cloudinary), display name, and email change.',
    category: 'personal',
  },
  {
    id: 'p-avatar',
    text: 'Avatar / profile photo upload',
    tip: 'A photo makes the app feel personal. Use initials as fallback.',
    promptSnippet: 'Add avatar upload with drag-and-drop using react-dropzone. Store in Supabase Storage. Show initials if no photo.',
    category: 'personal',
  },
  {
    id: 'p-notifs',
    text: 'In-app notifications',
    tip: 'Let users know when something happens to their account or content.',
    promptSnippet: 'Create a notifications dropdown in the navbar that shows recent activity with read/unread state.',
    category: 'personal',
  },
  {
    id: 'p-lang',
    text: 'Language / locale preference',
    tip: 'If your users are global, let them pick their language.',
    promptSnippet: 'Add next-intl for i18n. Support at least English and one other language. Store preference in user profile.',
    category: 'personal',
  },
  {
    id: 'p-dashboard',
    text: 'Personal dashboard with stats',
    tip: 'Show the user a summary of their activity, recent items, and key numbers.',
    promptSnippet: 'Create a /dashboard page with stat cards (total items, recent activity, usage graph) using recharts.',
    category: 'personal',
  },
];

const SECURITY_CHECKLIST: CheckItem[] = [
  {
    id: 'sec-rate',
    text: 'Rate limiting on API routes',
    tip: 'Without rate limiting, anyone can spam your API 10,000 times a minute.',
    promptSnippet: 'Add rate limiting using @upstash/ratelimit with Redis. Apply to all auth and mutation API routes.',
    category: 'security',
  },
  {
    id: 'sec-env',
    text: 'Environment variable validation at startup',
    tip: 'The app should crash early if required env vars are missing — not fail silently in production.',
    promptSnippet: 'Use zod or t3-env to validate all required environment variables at build time.',
    category: 'security',
  },
  {
    id: 'sec-cors',
    text: 'CORS properly configured',
    tip: 'Only allow your frontend domain to call your API — block everything else.',
    promptSnippet: 'Configure CORS in the API to only allow requests from the production domain and localhost in development.',
    category: 'security',
  },
  {
    id: 'sec-input',
    text: 'Input sanitization & validation',
    tip: 'Never trust user input. Validate all form data server-side before storing it.',
    promptSnippet: 'Use zod schemas to validate all request bodies in API routes. Return 400 with clear error messages on invalid input.',
    category: 'security',
  },
];

const PERF_CHECKLIST: CheckItem[] = [
  {
    id: 'perf-img',
    text: 'Optimized images (WebP + lazy load)',
    tip: 'Images are the #1 cause of slow pages. Use WebP format and only load images in the viewport.',
    promptSnippet: 'Use next/image for all images. Set sizes prop correctly and use WebP format. Add blur placeholder.',
    category: 'perf',
  },
  {
    id: 'perf-cache',
    text: 'API response caching',
    tip: 'Cache frequently read data (e.g. categories, user profile) to reduce DB queries.',
    promptSnippet: 'Add Redis caching for expensive DB queries using @upstash/redis. Cache for 60 seconds with stale-while-revalidate.',
    category: 'perf',
  },
  {
    id: 'perf-pagination',
    text: 'Pagination / infinite scroll',
    tip: 'Never load 1000 items at once. Use cursor-based pagination for large lists.',
    promptSnippet: 'Implement cursor-based pagination on all list endpoints. Use react-intersection-observer for infinite scroll on the frontend.',
    category: 'perf',
  },
];

const ALL_GROUPS = [
  { id: 'ui', label: 'UI Design', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200', items: UI_CHECKLIST },
  { id: 'ux', label: 'User Experience', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', items: UX_CHECKLIST },
  { id: 'personal', label: 'Personalization', icon: LayoutDashboard, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200', items: PERSONAL_CHECKLIST },
  { id: 'security', label: 'Security', icon: Shield, color: 'text-red-600', bg: 'bg-red-50 border-red-200', items: SECURITY_CHECKLIST },
  { id: 'perf', label: 'Performance', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', items: PERF_CHECKLIST },
];

// ─── PROMPT BUILDER ───────────────────────────────────────────────────────────

function buildBasePrompt(answers: AnswerMap, checked: Set<string>): string {
  const name    = (answers['project_name'] as string) || 'My App';
  const desc    = (answers['project_description'] as string) || '';
  const appType = answers['app_type'] as string;
  const deploy  = answers['deploy_target'] as string;
  const db      = (answers['db_for_vercel'] || answers['db_general']) as string;
  const auth    = answers['auth_strategy'] as string;
  const front   = answers['frontend_choice'] as string;
  const back    = answers['backend_choice'] as string;
  const style   = answers['styling_choice'] as string;
  const ai      = answers['ai_integration'] as string;
  const pay     = answers['payments'] as string;
  const lib     = answers['auth_library'] as string;
  const providers = answers['auth_providers'];
  const verify  = answers['email_verification'] as string;

  const lbl = (qId: string, aId: string) =>
    FLOW_QUESTIONS[qId]?.options?.find(o => o.id === aId)?.label || aId;

  const dbLabel = db
    ? (FLOW_QUESTIONS['db_for_vercel']?.options?.find(o => o.id === db)?.label
      || FLOW_QUESTIONS['db_general']?.options?.find(o => o.id === db)?.label || db)
    : '–';

  const providerStr = Array.isArray(providers) && providers.length
    ? ` with ${providers.join(' + ')} OAuth`
    : '';
  const verifyStr = verify === 'verify_required' ? ' (email verification required)' : '';

  // Collect checked improvement snippets
  const extras: string[] = [];
  ALL_GROUPS.forEach(g => {
    g.items.forEach(item => {
      if (checked.has(item.id)) extras.push(`- ${item.promptSnippet}`);
    });
  });

  return `You are helping me build a production-ready web application called "${name}".

Project description:
${desc || '(not provided)'}

── TECHNICAL STACK ──────────────────────────────────────
- App type:      ${appType ? lbl('app_type', appType) : '–'}
- Frontend:      ${front ? lbl('frontend_choice', front) : '–'}
- Styling:       ${style ? lbl('styling_choice', style) : '–'}
- Backend:       ${back ? lbl('backend_choice', back) : '–'}
- Database:      ${dbLabel}
- Auth:          ${auth ? lbl('auth_strategy', auth) : '–'}${providerStr}${verifyStr}
- Auth library:  ${lib ? lbl('auth_library', lib) : '–'}
- Deployment:    ${deploy ? lbl('deploy_target', deploy) : '–'}${ai && ai !== 'no_ai' ? `\n- AI/LLM:        ${lbl('ai_integration', ai)}` : ''}${pay && pay !== 'no_payments' ? `\n- Payments:      ${lbl('payments', pay)}` : ''}

── WHAT I NEED ──────────────────────────────────────────
1. Generate the complete initial file/folder structure
2. List every npm install / pip install command needed
3. Create a working boilerplate with:
   - Database connection + schema (with Prisma or equivalent)
   - Auth configuration (${auth ? lbl('auth_strategy', auth) : 'as specified'})
   - One protected route example
   - One public API endpoint example
   - .env.example with all required variables
4. Call out any production gotchas for this stack
   (e.g. Vercel timeout limits, connection pooling, cold starts)${extras.length ? `

── ADDITIONAL REQUIREMENTS ──────────────────────────────
${extras.join('\n')}` : ''}

Be specific, production-aware, and use TypeScript throughout.
Prefer modern patterns — no class components, no CommonJS require().`;
}

// ─── CHECKLIST GROUP ─────────────────────────────────────────────────────────

function ChecklistGroup({
  group,
  checked,
  onToggle,
}: {
  key?: React.Key;
  group: typeof ALL_GROUPS[0];
  checked: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const Icon = group.icon;
  const doneCount = group.items.filter(i => checked.has(i.id)).length;

  return (
    <div className={`border rounded overflow-hidden ${group.bg}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:opacity-90 transition-all"
      >
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${group.color}`} />
          <span className="font-bold text-base text-zinc-900">{group.label}</span>
          {doneCount > 0 && (
            <span className="text-xs bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded-full">
              {doneCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{doneCount}/{group.items.length} selected</span>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-2 border-t border-current/10">
          {group.items.map(item => {
            const isChecked = checked.has(item.id);
            return (
              <label
                key={item.id}
                className={`flex items-start gap-3 cursor-pointer p-2.5 rounded border transition-all ${
                  isChecked
                    ? 'bg-white border-blue-300 shadow-sm'
                    : 'bg-white/60 border-transparent hover:border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(item.id)}
                  className="mt-0.5 h-4 w-4 accent-blue-600 shrink-0"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-base font-semibold text-zinc-900">{item.text}</span>
                  <span className="text-sm text-gray-500 leading-relaxed">{item.tip}</span>
                  {isChecked && (
                    <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded leading-relaxed mt-1">
                      → will add to prompt: {item.promptSnippet.slice(0, 80)}…
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

function NoStackYet({ onGoToBuilder }: { onGoToBuilder: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
        <Sparkles className="h-8 w-8 text-blue-400" />
      </div>
      <div>
        <h2 className="text-xl font-black text-zinc-900">No stack built yet</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          Complete the Stack Builder first — then come back here to generate your AI prompt and polish the result.
        </p>
      </div>
      <button
        onClick={onGoToBuilder}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded text-sm transition-all flex items-center gap-2"
      >
        Go to Stack Builder →
      </button>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

interface VibecoderProps {
  answers: AnswerMap;
  handleCopyClipboard: (text: string) => void;
  onGoToBuilder: () => void;
}

const LS_CHECKLIST_KEY = 'webflow_vibecoder_checklist';

export default function Vibecoder({ answers, handleCopyClipboard, onGoToBuilder }: VibecoderProps) {
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(LS_CHECKLIST_KEY);
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch { return new Set(); }
  });
  const [copied, setCopied] = useState(false);

  const hasStack = Object.keys(answers).length > 2;

  useEffect(() => {
    try { localStorage.setItem(LS_CHECKLIST_KEY, JSON.stringify([...checked])); } catch {}
  }, [checked]);

  const toggleItem = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const prompt = buildBasePrompt(answers, checked);

  const copy = () => {
    navigator.clipboard.writeText(prompt);
    handleCopyClipboard(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasStack) return <NoStackYet onGoToBuilder={onGoToBuilder} />;

  const projectName = (answers['project_name'] as string) || 'My App';
  const totalChecked = checked.size;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">

      {/* LEFT: checklist */}
      <div className="flex flex-col gap-4">
        <div className="bg-gradient-to-r from-[#18181B] to-zinc-800 text-white p-5 rounded shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg font-black">Vibecoder Prompt Builder</h2>
              <p className="text-sm text-gray-300 mt-0.5 leading-relaxed">
                Your stack for <span className="text-blue-300 font-bold">{projectName}</span> is ready.
                Check the improvements you want — they'll be injected into the AI prompt automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2 text-sm text-amber-800 leading-relaxed">
          <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
          <span>
            <strong>How to use:</strong> Tick the features you want. The prompt on the right updates live.
            Copy it and paste into <strong>Cursor Composer</strong>, <strong>Claude</strong>, or <strong>ChatGPT</strong>.
            Start with your base boilerplate first — then come back to add more features one checklist at a time.
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {ALL_GROUPS.map(group => (
            <ChecklistGroup
              key={group.id}
              group={group}
              checked={checked}
              onToggle={toggleItem}
            />
          ))}
        </div>

        {totalChecked > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800 flex items-center gap-2 leading-relaxed">
            <Check className="h-4 w-4 text-blue-600 shrink-0" />
            <span><strong>{totalChecked} improvement{totalChecked > 1 ? 's' : ''}</strong> added to your prompt. Copy it from the panel →</span>
          </div>
        )}
      </div>

      {/* RIGHT: live prompt */}
      <div className="flex flex-col gap-4 sticky top-28">

        {/* stack summary pill strip */}
        <div className="bg-white border border-[#D4D4D8] rounded p-4 flex flex-col gap-2">
          <div className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Your stack</div>
          <div className="flex flex-wrap gap-1.5">
            {[
              answers['frontend_choice'] && { key: 'frontend_choice', color: 'bg-blue-100 text-blue-800' },
              answers['styling_choice'] && { key: 'styling_choice', color: 'bg-pink-100 text-pink-800' },
              (answers['db_for_vercel'] || answers['db_general']) && {
                key: answers['db_for_vercel'] ? 'db_for_vercel' : 'db_general',
                color: 'bg-purple-100 text-purple-800'
              },
              answers['auth_strategy'] && { key: 'auth_strategy', color: 'bg-red-100 text-red-800' },
              answers['backend_choice'] && { key: 'backend_choice', color: 'bg-green-100 text-green-800' },
              answers['deploy_target'] && { key: 'deploy_target', color: 'bg-orange-100 text-orange-800' },
            ].filter(Boolean).map((item: any) => {
              const val = answers[item.key] as string;
              const l = FLOW_QUESTIONS[item.key]?.options?.find(o => o.id === val)?.label || val;
              return (
                <span key={item.key} className={`text-xs font-bold px-2 py-0.5 rounded ${item.color}`}>
                  {l.split(' (')[0]}
                </span>
              );
            })}
          </div>
        </div>

        {/* prompt textarea */}
        <div className="bg-[#0F0F11] border border-zinc-800 rounded p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <FileCode2 className="h-4 w-4 text-blue-400" /> AI Prompt
              {totalChecked > 0 && (
                <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold">
                  +{totalChecked} extras
                </span>
              )}
            </h3>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded transition-all"
            >
              {copied
                ? <><Check className="h-3.5 w-3.5" /> Copied!</>
                : <><Copy className="h-3.5 w-3.5" /> Copy Prompt</>
              }
            </button>
          </div>

          <textarea
            readOnly
            value={prompt}
            className="w-full h-72 bg-[#18181B] text-emerald-300 p-3 text-sm font-mono leading-relaxed rounded border border-zinc-800 focus:outline-none resize-none select-all"
          />

          <p className="text-xs text-gray-500 italic leading-relaxed">
            💡 Paste this into Cursor Composer (Cmd+I), Claude, or ChatGPT. For big apps, generate the boilerplate first — then add improvements one by one.
          </p>
        </div>

        {/* setup commands mini */}
        <div className="bg-white border border-[#D4D4D8] rounded p-4 flex flex-col gap-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
            <Terminal className="h-4 w-4 text-gray-400" /> Quick start
          </h3>
          <div className="text-sm font-mono text-gray-700 bg-gray-50 rounded p-2 border border-gray-200 leading-relaxed">
            {answers['frontend_choice'] === 'nextjs'
              ? `npx create-next-app@latest ${projectName.toLowerCase().replace(/\s+/g, '-')} --typescript --tailwind --app`
              : answers['frontend_choice'] === 'react_vite'
              ? `npm create vite@latest ${projectName.toLowerCase().replace(/\s+/g, '-')} -- --template react-ts`
              : answers['frontend_choice'] === 'sveltekit'
              ? `npx sv create ${projectName.toLowerCase().replace(/\s+/g, '-')}`
              : `npx create-next-app@latest ${projectName.toLowerCase().replace(/\s+/g, '-')} --typescript --tailwind --app`
            }
          </div>
        </div>
      </div>
    </div>
  );
}

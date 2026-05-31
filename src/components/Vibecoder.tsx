import React, { useState, useEffect } from 'react';
import { useDebounce } from '../utils/useDebounce';
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
  promptSnippet: (answers: AnswerMap) => string;
  category: 'ui' | 'ux' | 'perf' | 'security' | 'personal';
}

// ── per-framework snippet helpers ─────────────────────────────────────────────

function toastSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  if (f === 'sveltekit') return 'Add svelte-sonner for toast notifications on all mutations — import Toaster in your root layout and call toast.success / toast.error from event handlers.';
  if (f === 'vue_nuxt')  return 'Add vue-toastification (or the built-in Nuxt UI toast) for success, error, and info notifications on all mutations.';
  return 'Integrate sonner (or react-hot-toast) for success, error, and info toast notifications on all mutations.';
}

function fontSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  if (f === 'nextjs')    return 'Add Google Fonts (e.g. Inter for body, Sora for headings) via next/font/google — import and apply in the root layout.';
  if (f === 'sveltekit') return 'Add Google Fonts via a <link> tag in app.html or use @fontsource npm packages — e.g. @fontsource/inter for body, @fontsource/sora for headings.';
  if (f === 'vue_nuxt')  return 'Add Google Fonts via nuxt/fonts module or a <link> in nuxt.config — e.g. Inter for body, Sora for headings.';
  return 'Add Google Fonts via a <link> tag in index.html — e.g. Inter for body, Sora for headings. Apply via Tailwind font-sans config.';
}

function animationSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  if (f === 'sveltekit') return 'Use Svelte\'s built-in transition directives (fade, fly, scale) for page transitions and list entrance animations — zero extra dependencies.';
  if (f === 'vue_nuxt')  return 'Use Vue\'s built-in <Transition> and <TransitionGroup> components for page transitions and list animations, or add @vueuse/motion for declarative spring animations.';
  return 'Add Framer Motion (motion/react) for page transitions and entrance animations on list items and cards — wrap elements with <motion.div> and set initial/animate/exit props.';
}

function tailwindConfigSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  if (f === 'sveltekit' || f === 'vue_nuxt') return 'Define a custom color palette in tailwind.config.js (extend.colors) with your brand primary and accent — reference them as bg-brand-500, text-accent-600 throughout.';
  return 'Define a custom color palette in tailwind.config.ts (extend.colors) with your brand primary and accent — reference them as bg-brand-500, text-accent-600 throughout.';
}

function confirmDialogSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  const s = answers['styling_choice'];
  if (f === 'sveltekit') return 'Add a confirmation dialog using bits-ui Dialog (or shadcn-svelte AlertDialog) for all delete operations — only call the delete handler after the user confirms.';
  if (f === 'vue_nuxt')  return 'Add a confirmation dialog using Nuxt UI Modal (or shadcn-vue AlertDialog) for all delete operations — only call the delete handler after the user confirms.';
  if (s === 'shadcn')    return 'Add a shadcn/ui AlertDialog confirmation for all delete operations — only call the API after the user confirms in the dialog.';
  return 'Add a modal confirmation dialog for all delete operations — render it with a state flag and only call the delete API after the user confirms.';
}

function breadcrumbSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  if (f === 'sveltekit') return 'Add a breadcrumb component using the current $page.url.pathname — split the path into segments and render each as a link with a > separator.';
  if (f === 'vue_nuxt')  return 'Add a breadcrumb component using useRoute() — map the matched route segments to labels and render with a > separator.';
  if (f === 'nextjs')    return 'Add a breadcrumb component using shadcn/ui Breadcrumb and usePathname() — split the path into segments and render each as a link.';
  return 'Add a breadcrumb component using the current URL pathname — split into segments and render each as a link with a > separator.';
}

function profileSnippet(answers: AnswerMap): string {
  const db = (answers['db_for_vercel'] || answers['db_general']) as string;
  const storageHint = db === 'supabase'
    ? 'Store avatars in your managed object storage bucket.'
    : 'Store avatars in an object storage bucket (e.g. S3-compatible or Cloudflare R2).';
  return `Create a /profile page with avatar upload, display name, and email change. ${storageHint} Show the user\'s initials as a fallback if no photo is set.`;
}

function avatarSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  const db = (answers['db_for_vercel'] || answers['db_general']) as string;
  const storageHint = db === 'supabase'
    ? 'Store in your managed object storage bucket.'
    : 'Store in an object storage bucket (S3-compatible or Cloudflare R2).';
  if (f === 'sveltekit') return `Add avatar drag-and-drop upload using svelte-dropzone (or a plain <input type="file"> with dragover events). ${storageHint} Show initials if no photo.`;
  if (f === 'vue_nuxt')  return `Add avatar drag-and-drop upload using vue-dropzone or a plain <input type="file"> with @dragover handling. ${storageHint} Show initials if no photo.`;
  return `Add avatar drag-and-drop upload using react-dropzone. ${storageHint} Show initials if no photo.`;
}

function i18nSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  if (f === 'nextjs')    return 'Add next-intl for i18n — place message files under /messages/[locale].json, wrap the root layout with NextIntlClientProvider, and use useTranslations() in components.';
  if (f === 'sveltekit') return 'Add paraglide-js (or svelte-i18n) for i18n — define message files per locale and import the t() helper in components. Store the user\'s locale preference in their profile.';
  if (f === 'vue_nuxt')  return 'Add @nuxtjs/i18n for i18n — configure locales in nuxt.config and use useI18n() / $t() in components. Store the user\'s locale preference in their profile.';
  return 'Add i18n by storing translations in /locales/[lang].json and loading the active locale from localStorage or the user profile. Use a t(key) helper function throughout.';
}

function chartSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  if (f === 'sveltekit') return 'Create a /dashboard page with stat cards and activity graphs using layerchart or svelte-chartjs — both are Svelte-native chart libraries.';
  if (f === 'vue_nuxt')  return 'Create a /dashboard page with stat cards and activity graphs using Chart.js via vue-chartjs, or the built-in Nuxt UI stats components.';
  return 'Create a /dashboard page with stat cards (total items, recent activity, usage graph) using recharts — wrap charts in ResponsiveContainer for fluid sizing.';
}

function rateLimitSnippet(answers: AnswerMap): string {
  const b = answers['backend_choice'];
  if (b === 'fastapi_py') return 'Add rate limiting using slowapi (a FastAPI-compatible rate limiter) with Redis as the backend. Apply to all auth and mutation endpoints via a decorator.';
  if (b === 'go_backend') return 'Add rate limiting using golang.org/x/time/rate or a middleware like go-chi/httprate. Apply to all auth and mutation routes.';
  if (b === 'express_node') return 'Add rate limiting using express-rate-limit with a Redis store (rate-limit-redis). Apply to all auth and mutation routes as middleware.';
  return 'Add rate limiting using a Redis-backed rate limiter. Apply to all auth and mutation API routes — return 429 Too Many Requests when the limit is exceeded.';
}

function envValidationSnippet(answers: AnswerMap): string {
  const b = answers['backend_choice'];
  if (b === 'fastapi_py') return 'Use pydantic-settings to validate all required environment variables at startup — define a Settings class and call Settings() at module load so the app crashes early on missing config.';
  if (b === 'go_backend') return 'Validate required environment variables at startup using a struct with envconfig or godotenv — panic early if any required key is missing.';
  return 'Use zod (or t3-env) to validate all required environment variables at startup — define a schema and call parse() so the server crashes immediately on missing config rather than failing silently in production.';
}

function imageSnippet(answers: AnswerMap): string {
  const f = answers['frontend_choice'];
  if (f === 'nextjs')    return 'Use next/image for all images — set the sizes prop correctly, use WebP format via the default loader, and add placeholder="blur" with blurDataURL for progressive loading.';
  if (f === 'sveltekit') return 'Use @sveltejs/enhanced-img for all images — import via ?enhanced query and set the sizes attribute. It auto-generates WebP and adds a blur placeholder at build time.';
  if (f === 'vue_nuxt')  return 'Use nuxt/image (<NuxtImg>) for all images — set the sizes prop, format="webp", and placeholder for progressive loading.';
  return 'Use native lazy loading (loading="lazy") and serve images as WebP. Add an explicit width and height to prevent layout shift. Use an IntersectionObserver for progressive reveal.';
}

function cacheSnippet(answers: AnswerMap): string {
  const b = answers['backend_choice'];
  if (b === 'fastapi_py') return 'Add Redis caching for expensive DB queries using redis-py (async) — cache serialized Pydantic model responses for 60 seconds with a versioned key, and invalidate on mutation.';
  if (b === 'go_backend') return 'Add Redis caching for expensive DB queries using go-redis — cache JSON-serialized responses for 60 seconds and invalidate on mutation.';
  if (b === 'nextjs')     return 'Use Next.js built-in fetch caching with revalidate: 60 in Server Components for frequently read data, and unstable_cache for DB query memoisation.';
  return 'Add Redis caching for expensive DB queries — cache serialized responses for 60 seconds using a consistent key strategy, and invalidate the key on any mutation to that data.';
}

// ── checklist definitions ─────────────────────────────────────────────────────

const UI_CHECKLIST: CheckItem[] = [
  {
    id: 'ui-dark',
    text: 'Dark mode support',
    tip: 'Toggle between light and dark theme. Users expect this in modern apps.',
    promptSnippet: () => 'Include a dark mode toggle — store the preference in localStorage and apply it via a class on the root element. Use Tailwind dark: variant classes for all themed colors.',
    category: 'ui',
  },
  {
    id: 'ui-mobile',
    text: 'Mobile-first responsive layout',
    tip: 'Design for phone screen first, then scale up. Most users are on mobile.',
    promptSnippet: () => 'Ensure all layouts are mobile-first responsive using Tailwind sm/md/lg breakpoints. No fixed widths below the lg breakpoint.',
    category: 'ui',
  },
  {
    id: 'ui-loading',
    text: 'Loading states & skeleton screens',
    tip: 'Never show a blank page. Show skeleton loaders while data loads.',
    promptSnippet: () => 'Add skeleton loading states for all data-fetching components using Tailwind animate-pulse — match the skeleton shape to the real content so there is no layout shift on load.',
    category: 'ui',
  },
  {
    id: 'ui-empty',
    text: 'Empty state designs',
    tip: 'When a list is empty, show a friendly illustration and a CTA — not a blank space.',
    promptSnippet: () => 'Design empty state components with an icon, a short message, and a call-to-action button for all list and table views.',
    category: 'ui',
  },
  {
    id: 'ui-toast',
    text: 'Toast / notification feedback',
    tip: 'Every user action (save, delete, error) should show a toast message.',
    promptSnippet: toastSnippet,
    category: 'ui',
  },
  {
    id: 'ui-fonts',
    text: 'Custom typography with Google Fonts',
    tip: 'A good font makes the app feel polished. Pick one heading font + one body font.',
    promptSnippet: fontSnippet,
    category: 'ui',
  },
  {
    id: 'ui-animation',
    text: 'Micro-animations on interactions',
    tip: 'Subtle fade-ins, button press effects, and hover transitions make the UI feel alive.',
    promptSnippet: animationSnippet,
    category: 'ui',
  },
  {
    id: 'ui-brand-color',
    text: 'Custom brand color palette',
    tip: 'Pick 1–2 brand colors and use them consistently. Avoid relying only on default blue.',
    promptSnippet: tailwindConfigSnippet,
    category: 'ui',
  },
];

const UX_CHECKLIST: CheckItem[] = [
  {
    id: 'ux-onboarding',
    text: 'Onboarding flow for new users',
    tip: 'First-time users need to understand the app in 10 seconds. Add a welcome step.',
    promptSnippet: () => 'Create a 3-step onboarding modal that appears on first login — store completion state in the user record or localStorage. Show key features and allow skip.',
    category: 'ux',
  },
  {
    id: 'ux-search',
    text: 'Search with instant results',
    tip: 'If users can create items, they need to find them fast. Add a search bar with live filtering.',
    promptSnippet: () => 'Add a search input with debounced live filtering (300ms) using a controlled state variable. Filter client-side with Array.filter when the dataset is small; hit a search API endpoint for larger datasets.',
    category: 'ux',
  },
  {
    id: 'ux-confirm',
    text: 'Confirmation dialogs for destructive actions',
    tip: 'Deleting something should always ask "are you sure?". Prevent accidental data loss.',
    promptSnippet: confirmDialogSnippet,
    category: 'ux',
  },
  {
    id: 'ux-keyboard',
    text: 'Keyboard shortcuts',
    tip: 'Power users love shortcuts. Even 2–3 shortcuts (new item, search, close modal) feel professional.',
    promptSnippet: () => 'Add keyboard shortcuts using a keydown event listener on document: Cmd/Ctrl+K to open search, Escape to close modals. Clean up the listener in the component teardown.',
    category: 'ux',
  },
  {
    id: 'ux-breadcrumb',
    text: 'Breadcrumb navigation',
    tip: 'Users should always know where they are in the app hierarchy.',
    promptSnippet: breadcrumbSnippet,
    category: 'ux',
  },
];

const PERSONAL_CHECKLIST: CheckItem[] = [
  {
    id: 'p-profile',
    text: 'User profile page',
    tip: 'Let users see and edit their name, avatar, and account settings.',
    promptSnippet: profileSnippet,
    category: 'personal',
  },
  {
    id: 'p-avatar',
    text: 'Avatar / profile photo upload',
    tip: 'A photo makes the app feel personal. Use initials as fallback.',
    promptSnippet: avatarSnippet,
    category: 'personal',
  },
  {
    id: 'p-notifs',
    text: 'In-app notifications',
    tip: 'Let users know when something happens to their account or content.',
    promptSnippet: () => 'Create a notifications dropdown in the navbar that shows recent activity with read/unread state. Store notifications in the database and mark them read on click.',
    category: 'personal',
  },
  {
    id: 'p-lang',
    text: 'Language / locale preference',
    tip: 'If your users are global, let them pick their language.',
    promptSnippet: i18nSnippet,
    category: 'personal',
  },
  {
    id: 'p-dashboard',
    text: 'Personal dashboard with stats',
    tip: 'Show the user a summary of their activity, recent items, and key numbers.',
    promptSnippet: chartSnippet,
    category: 'personal',
  },
];

const SECURITY_CHECKLIST: CheckItem[] = [
  {
    id: 'sec-rate',
    text: 'Rate limiting on API routes',
    tip: 'Without rate limiting, anyone can spam your API 10,000 times a minute.',
    promptSnippet: rateLimitSnippet,
    category: 'security',
  },
  {
    id: 'sec-env',
    text: 'Environment variable validation at startup',
    tip: 'The app should crash early if required env vars are missing — not fail silently in production.',
    promptSnippet: envValidationSnippet,
    category: 'security',
  },
  {
    id: 'sec-cors',
    text: 'CORS properly configured',
    tip: 'Only allow your frontend domain to call your API — block everything else.',
    promptSnippet: () => 'Configure CORS to only allow requests from the production domain and localhost in development. Reject requests from unknown origins with a 403.',
    category: 'security',
  },
  {
    id: 'sec-input',
    text: 'Input sanitization & validation',
    tip: 'Never trust user input. Validate all form data server-side before storing it.',
    promptSnippet: () => 'Use zod schemas to validate all request bodies in API routes — parse at the top of each handler and return 400 with a structured error message on invalid input.',
    category: 'security',
  },
];

const PERF_CHECKLIST: CheckItem[] = [
  {
    id: 'perf-img',
    text: 'Optimized images (WebP + lazy load)',
    tip: 'Images are the #1 cause of slow pages. Use WebP format and only load images in the viewport.',
    promptSnippet: imageSnippet,
    category: 'perf',
  },
  {
    id: 'perf-cache',
    text: 'API response caching',
    tip: 'Cache frequently read data (e.g. categories, user profile) to reduce DB queries.',
    promptSnippet: cacheSnippet,
    category: 'perf',
  },
  {
    id: 'perf-pagination',
    text: 'Pagination / infinite scroll',
    tip: 'Never load 1000 items at once. Use cursor-based pagination for large lists.',
    promptSnippet: () => 'Implement cursor-based pagination on all list endpoints — return a nextCursor in each response. On the frontend, trigger the next page fetch when the last item scrolls into view using an IntersectionObserver.',
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
      if (checked.has(item.id)) extras.push(`- ${item.promptSnippet(answers)}`);
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
   (e.g. serverless function timeouts, connection pooling, cold starts)${extras.length ? `

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
  answers,
}: {
  key?: React.Key;
  group: typeof ALL_GROUPS[0];
  checked: Set<string>;
  onToggle: (id: string) => void;
  answers: AnswerMap;
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
          <span className="font-bold text-base text-zinc-900 dark:text-zinc-100">{group.label}</span>
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
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{item.text}</span>
                  <span className="text-sm text-gray-500 leading-relaxed">{item.tip}</span>
                  {isChecked && (
                    <span className="text-xs font-mono text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded leading-relaxed mt-1">
                      → will add to prompt: {item.promptSnippet(answers).slice(0, 80)}…
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
        <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">No stack built yet</h2>
        <p className="text-base text-gray-500 mt-1 max-w-sm">
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

  const debouncedChecked = useDebounce(checked, 150);
  const prompt = buildBasePrompt(answers, debouncedChecked);

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
              <p className="text-base text-gray-300 mt-0.5 leading-relaxed">
                Your stack for <span className="text-blue-300 font-bold">{projectName}</span> is ready.
                Check the improvements you want — they'll be injected into the AI prompt automatically.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded p-3 flex items-start gap-2 text-base text-amber-800 leading-relaxed">
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
              answers={answers}
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
        <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-4 flex flex-col gap-2">
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
        <div className="bg-white dark:bg-zinc-900 border border-[#D4D4D8] dark:border-zinc-700 rounded p-4 flex flex-col gap-2">
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

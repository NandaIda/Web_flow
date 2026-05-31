import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Check, ChevronRight, AlertTriangle, CheckCircle2,
  Copy, Terminal, Layers, FileCode2, RotateCcw, ChevronDown
} from 'lucide-react';
import {
  FLOW_QUESTIONS, FLOW_START, getNextQuestion,
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
}: {
  key?: React.Key;
  opt: FlowOption;
  selected: boolean;
  multiSelected: boolean;
  isMulti: boolean;
  onClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const active = isMulti ? multiSelected : selected;

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded border-2 p-4 transition-all select-none group ${
        active
          ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-600/10'
          : 'border-[#D4D4D8] bg-white hover:border-gray-400 hover:shadow-sm'
      }`}
    >
      {/* header row */}
      <div className="flex items-start gap-3">
        {opt.icon && (
          <span className="text-xl shrink-0 mt-0.5">{opt.icon}</span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-extrabold text-sm ${active ? 'text-blue-900' : 'text-zinc-900'}`}>
              {opt.label}
            </span>
            {opt.badge && (
              <span className="text-[10px] bg-emerald-50 border border-emerald-300 text-emerald-700 px-1.5 py-0.5 rounded font-mono font-bold">
                {opt.badge}
              </span>
            )}
            {active && (
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
            )}
          </div>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">{opt.desc}</p>
        </div>
      </div>

      {/* limits/advantages — always show 1 limit, rest behind toggle */}
      {((opt.limits && opt.limits.length > 0) || (opt.advantages && opt.advantages.length > 0)) && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          {/* advantages */}
          {opt.advantages?.slice(0, expanded ? 99 : 2).map((a, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-emerald-700 font-medium">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span>{a}</span>
            </div>
          ))}
          {/* limits */}
          {opt.limits?.slice(0, expanded ? 99 : 1).map((l, i) => (
            <div key={i} className={`flex items-start gap-1.5 text-xs px-2 py-1 rounded border ${getLimitColor(l)}`}>
              <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
              <span>{l}</span>
            </div>
          ))}

          {/* show more toggle */}
          {((opt.limits && opt.limits.length > 1) || (opt.advantages && opt.advantages.length > 2)) && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(v => !v); }}
              className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5"
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

// ─── QUESTION PANEL ───────────────────────────────────────────────────────────

function QuestionPanel({
  question,
  onAnswer,
  existingAnswer,
}: {
  question: FlowQuestion;
  onAnswer: (answer: string | string[]) => void;
  existingAnswer?: string | string[];
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
          className="bg-white border-2 border-[#D4D4D8] focus:border-blue-500 text-gray-950 font-bold placeholder-gray-400 py-3 px-4 text-base rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
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
          className="bg-white border-2 border-[#D4D4D8] focus:border-blue-500 text-gray-950 placeholder-gray-400 py-3 px-4 text-sm rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none leading-relaxed"
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

function ResultsPanel({
  answers,
  onRestart,
  handleCopyClipboard,
}: {
  answers: AnswerMap;
  onRestart: () => void;
  handleCopyClipboard: (text: string) => void;
}) {
  const [copied, setCopied] = useState<'prompt' | 'commands' | null>(null);

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
  const authLabel = auth === 'supabase_auth' ? 'Supabase Auth' : auth ? label('auth_strategy', auth) : '–';
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
    if (db === 'supabase' || db === 'supabase_hosting') {
      if (!isPython && !isGo) {
        lines.push(`\n# ── Supabase client ─────────────────────────────────────`);
        lines.push(`npm install @supabase/supabase-js`);
        if (isNext) lines.push(`npm install @supabase/ssr`);
      }
    } else if (db === 'postgres_self' || db === 'neon') {
      if (!isPython && !isGo) {
        lines.push(`\n# ── Postgres / Prisma ───────────────────────────────────`);
        lines.push(`npm install prisma @prisma/client`);
        lines.push(`npx prisma init --datasource-provider postgresql`);
      }
    } else if (db === 'planetscale') {
      lines.push(`\n# ── PlanetScale / Drizzle ───────────────────────────────`);
      lines.push(`npm install drizzle-orm @planetscale/database`);
      lines.push(`npm install -D drizzle-kit`);
    } else if (db === 'mongodb_atlas') {
      if (!isPython && !isGo) {
        lines.push(`\n# ── MongoDB / Mongoose ──────────────────────────────────`);
        lines.push(`npm install mongoose`);
      }
    }

    // Auth deps
    if (auth !== 'supabase_auth' && auth !== 'no_auth') {
      if (authLib === 'nextauth' && isNext) {
        lines.push(`\n# ── Auth.js ─────────────────────────────────────────────`);
        lines.push(`npm install next-auth@beta @auth/prisma-adapter`);
      } else if (authLib === 'clerk') {
        lines.push(`\n# ── Clerk ───────────────────────────────────────────────`);
        lines.push(`npm install @clerk/nextjs`);
      } else if (authLib === 'lucia') {
        lines.push(`\n# ── Lucia Auth ──────────────────────────────────────────`);
        lines.push(`npm install lucia oslo`);
      }
    }

    // Styling
    if (styling === 'shadcn' && isNext) {
      lines.push(`\n# ── shadcn/ui ───────────────────────────────────────────`);
      lines.push(`npx shadcn@latest init`);
      lines.push(`npx shadcn@latest add button card input label`);
    } else if (styling === 'tailwind' && isReactVite) {
      lines.push(`\n# ── Tailwind (Vite) ─────────────────────────────────────`);
      lines.push(`npm install -D tailwindcss postcss autoprefixer`);
      lines.push(`npx tailwindcss init -p`);
    }

    // AI
    if (ai === 'llm_chat' || ai === 'rag_vector' || ai === 'agents') {
      lines.push(`\n# ── AI SDK ──────────────────────────────────────────────`);
      lines.push(`npm install ai @ai-sdk/openai`);
      if (ai === 'rag_vector') {
        lines.push(`# Add pgvector extension to your Postgres DB:`);
        lines.push(`# CREATE EXTENSION IF NOT EXISTS vector;`);
      }
    }

    // Payments
    if (payments === 'stripe') {
      lines.push(`\n# ── Stripe ──────────────────────────────────────────────`);
      lines.push(`npm install stripe @stripe/stripe-js`);
    }

    lines.push(`\n# ── Environment variables ───────────────────────────────`);
    lines.push(`cp .env.example .env.local`);
    lines.push(`# Fill in your keys: DATABASE_URL, NEXTAUTH_SECRET, etc.`);
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

Be specific and production-aware. Call out any gotchas for the chosen stack (e.g. Vercel function timeout limits, connection pooling requirements, etc.). Use TypeScript where applicable.`;
  };

  const copy = (type: 'prompt' | 'commands') => {
    const text = type === 'prompt' ? getAIPrompt() : getSetupCommands();
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
      <div className="bg-gradient-to-r from-[#18181B] to-zinc-800 text-white p-6 rounded shadow-md">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-1">Stack Blueprint Ready</p>
            <h2 className="text-2xl font-black tracking-tight">{projectName}</h2>
            {projectDesc && (
              <p className="text-sm text-gray-300 mt-1 max-w-xl leading-relaxed">{projectDesc}</p>
            )}
          </div>
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Start over
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* blueprint summary */}
        <div className="bg-white border border-[#D4D4D8] rounded p-5 flex flex-col gap-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-blue-600" /> Stack Summary
          </h3>
          <div className="divide-y divide-gray-100">
            {stackRows.map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2 text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <span>{row.icon}</span> {row.label}
                </span>
                <span className="font-bold text-zinc-900 text-right max-w-[55%]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

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
          <pre className="text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre-wrap break-words max-h-64 overflow-y-auto scrollbar-thin">
            {getSetupCommands()}
          </pre>
        </div>
      </div>

      {/* AI prompt */}
      <div className="bg-white border border-[#D4D4D8] rounded p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-600 flex items-center gap-1.5">
            <FileCode2 className="h-4 w-4 text-blue-600" /> AI Prompt — paste into Cursor / ChatGPT / Claude
          </h3>
          <button
            onClick={() => copy('prompt')}
            className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded transition-all"
          >
            {copied === 'prompt' ? (
              <><Check className="h-3.5 w-3.5" /> Copied!</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy Prompt</>
            )}
          </button>
        </div>
        <textarea
          readOnly
          className="w-full h-48 bg-[#F4F4F5] text-gray-800 p-4 text-xs font-mono leading-relaxed rounded border border-[#D4D4D8] focus:outline-none resize-none select-all"
          value={getAIPrompt()}
        />
        <p className="text-xs text-gray-500 italic">
          💡 Tip: Select all text in the box above, copy, then paste directly into Cursor Composer or any AI chat.
        </p>
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
              className="bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 px-2 py-0.5 rounded text-[11px] font-medium text-zinc-700 transition-all"
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

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface ConversationalFlowProps {
  handleCopyClipboard: (text: string) => void;
}

export default function ConversationalFlow({ handleCopyClipboard }: ConversationalFlowProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentQuestionId, setCurrentQuestionId] = useState<string>(FLOW_START);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // scroll to newest question
  useEffect(() => {
    if (!done) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 80);
    }
  }, [currentQuestionId, done]);

  const handleAnswer = (answer: string | string[]) => {
    const newAnswers = { ...answers, [currentQuestionId]: answer };
    setAnswers(newAnswers);
    setHistory(prev => [...prev, { questionId: currentQuestionId, answer }]);

    const nextId = getNextQuestion(currentQuestionId, answer, newAnswers);
    if (!nextId) {
      setDone(true);
    } else {
      setCurrentQuestionId(nextId);
    }
  };

  const handleGoBack = (toIndex: number) => {
    const targetEntry = history[toIndex];
    const newHistory = history.slice(0, toIndex);
    const newAnswers = { ...answers };
    // Remove answers for everything from toIndex onwards
    history.slice(toIndex).forEach(e => delete newAnswers[e.questionId]);
    setHistory(newHistory);
    setAnswers(newAnswers);
    setCurrentQuestionId(targetEntry.questionId);
    setDone(false);
  };

  const handleRestart = () => {
    setHistory([]);
    setAnswers({});
    setCurrentQuestionId(FLOW_START);
    setDone(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentQuestion = FLOW_QUESTIONS[currentQuestionId];
  const progress = done ? 100 : Math.round((history.length / 14) * 100); // ~14 questions max

  if (done) {
    return (
      <ResultsPanel
        answers={answers}
        onRestart={handleRestart}
        handleCopyClipboard={handleCopyClipboard}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6" id="conversational-flow">

      {/* progress bar */}
      <div className="bg-white border border-[#D4D4D8] rounded p-4 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono text-gray-500">
          <span className="font-bold text-gray-700 uppercase tracking-widest">Stack Builder</span>
          <span>{history.length} answered · ~{Math.max(0, 12 - history.length)} left</span>
        </div>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{ width: `${Math.min(progress, 95)}%` }}
          />
        </div>
        <HistoryBreadcrumb history={history} onGoBack={handleGoBack} />
      </div>

      {/* current question */}
      <div className="bg-white border-2 border-blue-600 rounded-lg p-6 shadow-md flex flex-col gap-5 animate-fade-in">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Question {history.length + 1}
            </span>
          </div>
          <h2 className="text-xl font-black text-zinc-900 leading-snug">
            {currentQuestion?.question}
          </h2>
          {currentQuestion?.hint && (
            <p className="text-sm text-gray-500 leading-relaxed">{currentQuestion.hint}</p>
          )}
        </div>

        <QuestionPanel
          question={currentQuestion}
          onAnswer={handleAnswer}
          existingAnswer={answers[currentQuestionId]}
        />
      </div>

      <div ref={bottomRef} />
    </div>
  );
}

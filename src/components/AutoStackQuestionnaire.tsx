import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  Database, 
  Coins, 
  Cpu, 
  Terminal, 
  ArrowRight, 
  ChevronRight, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Lightbulb, 
  Gauge,
  HelpCircle,
  FileCode2,
  BookOpen
} from 'lucide-react';
import { StackItem, PREDEFINED_STACKS, WizardAnswers } from '../data';

interface AutoStackQuestionnaireProps {
  setStepChoices: (choices: Record<number, string>) => void;
  setActiveTab: (tab: 'flow' | 'table' | 'graphs' | 'builder') => void;
  handleCopyClipboard: (text: string) => void;
}

export default function AutoStackQuestionnaire({
  setStepChoices,
  setActiveTab,
  handleCopyClipboard
}: AutoStackQuestionnaireProps) {
  // Enhanced interactive wizard inputs
  const [wizardAnswers, setWizardAnswers] = useState<WizardAnswers>({
    appName: 'Vibe SaaS AI',
    appType: 'saas',
    teamExp: 'js-ts',
    hostingGoal: 'hobby',
    stylePrefer: 'tailwind',
    customerTarget: 'growing', // hobby, growing, enterprise
    dataSize: 'small-structured', // small-structured, large-unstructured, heavy-media-files
    budgetLimit: 'low-vps', // zero-free, low-vps, high-managed
    aiRequirement: 'vector-rag', // no-ai, vector-rag, agent-websockets
    devPersona: 'vibe-casual', // vibe-casual, ts-engineer, python-data, indie-hacker, systems-nerd
  });

  const [generatedCustomStack, setGeneratedCustomStack] = useState<StackItem | null>(null);
  
  // Explainer panel toggle state
  const [activeConceptInfo, setActiveConceptInfo] = useState<string | null>(null);
  
  // Prompt copied notification
  const [promptCopied, setPromptCopied] = useState(false);

  // Dynamic recommendations mapper
  useEffect(() => {
    let recommendedId = 'pern';

    // 1. Map primarily based on Developer Persona and skillset
    if (wizardAnswers.devPersona === 'vibe-casual') {
      recommendedId = 'nextjs-fullstack';
    } else if (wizardAnswers.devPersona === 'ts-engineer') {
      recommendedId = 'pern';
    } else if (wizardAnswers.devPersona === 'python-data' || wizardAnswers.teamExp === 'python') {
      recommendedId = wizardAnswers.appType === 'dashboard' ? 'fastapi-react' : 'django-react';
    } else if (wizardAnswers.devPersona === 'indie-hacker') {
      recommendedId = 'php-laravel';
    } else if (wizardAnswers.devPersona === 'systems-nerd') {
      recommendedId = wizardAnswers.dataSize === 'heavy-media-files' ? 'rust-backend' : 'go-backend';
    } else {
      // Fallbacks
      if (wizardAnswers.appType === 'realtime') {
        recommendedId = 'pern'; // great for websockets
      } else if (wizardAnswers.appType === 'blog') {
        recommendedId = 'sveltekit-fullstack';
      }
    }

    const matched = PREDEFINED_STACKS.find(s => s.id === recommendedId) || PREDEFINED_STACKS[0];
    setGeneratedCustomStack(matched);
  }, [wizardAnswers]);

  // Generate dynamic Cursor/AI Coding Prompt based on recommendations
  const generateAIPrompt = () => {
    if (!generatedCustomStack) return '';
    return `Generate a robust, boilerplate full-stack implementation for my web application named "${wizardAnswers.appName}".

Tech Stack Requirements:
- Frontend Framework: ${generatedCustomStack.frontend} styled with ${generatedCustomStack.styles}
- Backend API Run: ${generatedCustomStack.backend} using ${generatedCustomStack.api} APIs
- Database Paradigm: ${generatedCustomStack.database} accessed via ${generatedCustomStack.dbAccess} 
- Session/Auth Setup: ${generatedCustomStack.auth}
- Hosting Target: Ready for deployment to ${generatedCustomStack.deployment} using ${generatedCustomStack.proxy}

Context Details:
- High-level app goal: ${wizardAnswers.appType === 'saas' ? 'Multi-tenant commercial SaaS with Stripe triggers' : wizardAnswers.appType === 'realtime' ? 'Instant real-time sync with high state event frequency' : 'Structured administrative charts and tables'}
- Scale Target: Designed for ${wizardAnswers.customerTarget === 'hobby' ? 'hobbyists / early proof-of-concept setup' : wizardAnswers.customerTarget === 'growing' ? 'growing consumer traffic (1k - 50k customers)' : 'high security corporate enterprise workload'}
- AI/LLM Integration: ${wizardAnswers.aiRequirement === 'no-ai' ? 'Core business CRUD logic' : wizardAnswers.aiRequirement === 'vector-rag' ? 'Includes vector similarity search, document ingestions, and embeddings lookup' : 'Long-running multi-agent streaming queries and live interactive WebSockets'}

Draft the initial file tree layout, configuration file instructions, and step-by-step terminal installation commands for a clean repository initialization.`;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generateAIPrompt());
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  // Dynamic metrics calculations for modern developers/vibecoders
  const hostingCostLabel = (() => {
    if (wizardAnswers.budgetLimit === 'zero-free') return '$0/mo (Free Tiers)';
    if (wizardAnswers.budgetLimit === 'low-vps') {
      let base = 5;
      if (wizardAnswers.customerTarget === 'growing') base += 5;
      if (wizardAnswers.aiRequirement === 'vector-rag') base += 5;
      return `$${base}-$${base + 10}/mo (Linux VPS)`;
    }
    let base = 40;
    if (wizardAnswers.customerTarget === 'enterprise') base += 60;
    if (wizardAnswers.dataSize === 'heavy-media-files') base += 30;
    return `$${base}-$${base + 40}/mo (Managed Cloud)`;
  })();

  const setupTimeLabel = (() => {
    let baseHours = 2; // base casual
    if (wizardAnswers.devPersona === 'ts-engineer') baseHours = 4;
    if (wizardAnswers.devPersona === 'systems-nerd') baseHours = 12;
    if (wizardAnswers.devPersona === 'python-data') baseHours = 6;
    if (wizardAnswers.devPersona === 'indie-hacker') baseHours = 3;

    if (wizardAnswers.budgetLimit === 'low-vps') baseHours += 3;
    if (wizardAnswers.budgetLimit === 'high-managed') baseHours += 8;
    if (wizardAnswers.aiRequirement === 'vector-rag') baseHours += 2;
    if (wizardAnswers.aiRequirement === 'agent-websockets') baseHours += 4;

    if (baseHours < 4) return `${baseHours} Hours (Ultra-rapid)`;
    if (baseHours < 12) return `${baseHours} Hours (Weekend Project)`;
    return `${Math.round(baseHours / 8)} Days (Heavy Setup)`;
  })();

  // Plain-English Definitions for Vibecoders
  const TECH_EXPLAINERS = [
    {
      id: 'db',
      title: 'SQL Relational DB vs NoSQL Document Store',
      concept: 'How your database saves information.',
      desc: 'Use Relational (PostgreSQL, MySQL, SQLite) when information is tightly structured and references other tables (e.g. Users have Orders, Orders have Products). Perfect for SaaS, billing, and strict audits. Use NoSQL (MongoDB, DynamoDB) if your data structures vary frequently or you need flexible single-document schema.',
    },
    {
      id: 'orm',
      title: 'ORM (Object Relational Mapper)',
      concept: 'The bridge between your code and SQL.',
      desc: 'Instead of writing raw SQL database query strings in your server files, an ORM (like Prisma, Drizzle, or Hibernate) lets you define models in TypeScript classes. It automatically creates database tables, gives you safe autocomplete statements, and prevents SQL Injection cyber attacks.',
    },
    {
      id: 'proxy',
      title: 'Reverse Ingress Proxies (Nginx / Caddy)',
      concept: 'The traffic cop standing in front of your server process.',
      desc: 'You should avoid exposing your backend app port (like 3000) directly to the wild web. A reverse proxy (Nginx, Caddy) listens on port 80/443, handles incoming SSL requests, protects against DDoS, caches static files, and neatly forwards the clean traffic to port 3000 internally.',
    },
    {
      id: 'hosting',
      title: 'Serverless (Vercel) vs VPS (Ubuntu Console)',
      concept: 'Where the computer lives.',
      desc: 'Serverless means you deploy files, and cloud providers scale machines up and down on each click. Extreme ease, but can have cold start lags. VPS (Virtual Private Server) is renting a persistent Linux box for $5/month. Superior control and 0ms cold starts, but requires manual configuration.',
    },
  ];

  // Dynamic compatibility alerts
  const checkCompatibilityIssues = () => {
    const alerts = [];
    if (wizardAnswers.budgetLimit === 'zero-free' && wizardAnswers.aiRequirement === 'agent-websockets') {
      alerts.push({
        type: 'warning',
        text: 'Free serverless hosting limits long-running WebSocket channels. Standard Vercel free tiers terminate server functions at 10-30 seconds, breaking live multi-agent streams. Consider a cheap VPS / DigitalOcean container instead.',
      });
    }
    if (wizardAnswers.customerTarget === 'enterprise' && wizardAnswers.hostingGoal === 'hobby') {
      alerts.push({
        type: 'info',
        text: 'Enterprise-grade SLAs require high-availability cloud configurations (AWS/GCP multicontainers) instead of hobby-focused single-point endpoints.',
      });
    }
    if (wizardAnswers.devPersona === 'vibe-casual' && wizardAnswers.dataSize === 'heavy-media-files') {
      alerts.push({
        type: 'warning',
        text: 'Heavy background processing or video rendering can exceed simple serverless memory limits. We suggest delegating files directly to S3 / Supabase Storage buckets.',
      });
    }
    return alerts;
  };

  const compatibilityIssues = checkCompatibilityIssues();

  return (
    <div className="flex flex-col gap-6 animate-fade-in" id="tab-builder-content">
      
      {/* VIBECODER EXPLAINER INTRO RAIL */}
      <div className="bg-gradient-to-r from-[#18181B] via-blue-990 to-[#18181B] text-white p-6 rounded-sm shadow-md border-b-2 border-blue-600">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center text-white font-extrabold shadow-inner" id="adv-sparkle-box">
              <Sparkles className="h-5 w-5 animate-pulse text-yellow-300" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black tracking-tight uppercase flex items-center gap-2 text-white">
                Vibecoder AI Architect Copilot <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded border border-blue-500/50 font-mono">INTELLIGENT DECISION ENGINE</span>
              </h2>
              <p className="text-sm md:text-base text-gray-200 mt-1.5 leading-relaxed">
                Most AI-assisted coders focus on writing prompts, but fail at structuring proper backend processes. 
                Answer 5 simple questions about your product, and we'll design a bulletproof stack tailored with custom prompt templates for Cursor/Vibe Tools!
              </p>
            </div>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-sm border border-white/20 flex flex-col font-mono text-xs text-gray-200">
            <span>ACTIVE ALGORITHMS</span>
            <span className="text-emerald-400 font-bold">● COGNITIVE RECOMMEND</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: THE INTERACTIVE INQUIRIES GAUGE */}
        <div className="lg:col-span-7 flex flex-col gap-6" id="wizard-form-board">
          
          <div className="bg-white border border-[#D4D4D8] p-5 rounded shadow-xs flex flex-col gap-5">
            <h3 className="text-sm md:text-base font-black text-gray-800 uppercase tracking-widest border-b border-gray-150 pb-2.5 flex items-center gap-1.5">
              <Info className="h-4 w-4 text-blue-600" /> Step 1: Input Product Characteristics
            </h3>

            {/* APP NAME ENTRY */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider font-mono">
                  1. App Name
                </label>
                <span className="text-xs text-[#71717A]">Identifies variables inside prompts</span>
              </div>
              <input
                type="text"
                className="bg-[#F4F4F5] border border-[#D4D4D8] text-gray-950 font-bold placeholder-gray-400 py-2.5 px-3.5 text-sm rounded-sm focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all shadow-inner"
                value={wizardAnswers.appName}
                onChange={(e) => setWizardAnswers(prev => ({ ...prev, appName: e.target.value }))}
                id="adv-input-appname"
              />
            </div>

            {/* DEV PERSONA TARGET - CRITICAL FOR VIBECODERS */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider font-mono">
                  2. Coding Style & Vibe
                </label>
                <button 
                  onClick={() => setActiveConceptInfo('persona')}
                  className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  <HelpCircle className="h-3.5 w-3.5" /> What is this?
                </button>
              </div>

              {activeConceptInfo === 'persona' && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm text-blue-900 leading-relaxed mb-1">
                  Your coding style dictates which software structures have the lowest barrier to entry. "Vibecoders" (AI-reliant) prefer zero-setup monolith structures like Next.js, while "Systems Engineers" prefer highly modular, concurrent servers like Go or Rust for raw CPU speed.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'vibe-casual', title: 'Casual Vibecoder', subtitle: 'Hates server configs, wants AI to build fast inside a single unified React/Next directory', icon: '🧠' },
                  { id: 'ts-engineer', title: 'TypeScript Realist', subtitle: 'Loves full type safety both client / server. Prefers standard Express routers with shared type files', icon: '🛡️' },
                  { id: 'python-data', title: 'AI & Python Explorer', subtitle: 'Focuses on PyTorch, Hugging Face, or pandas. Prefers FastAPI / Django backends', icon: '🐍' },
                  { id: 'indie-hacker', title: 'Speed & Ship Hacker', subtitle: 'Needs traditional, out-of-the-box DB auth and features standard in PHP Laravel', icon: '⚡' },
                  { id: 'systems-nerd', title: 'Low-Latency Optimizer', subtitle: 'Wants maximum concurrent execution, compiling directly to Rust or compiled Go binaries', icon: '⚙️' },
                ].map((spec) => (
                  <div
                    key={spec.id}
                    onClick={() => setWizardAnswers(prev => ({ ...prev, devPersona: spec.id as any }))}
                    className={`cursor-pointer p-4 border rounded-sm transition-all flex items-start gap-2.5 text-left hover:shadow-xs hover:border-gray-400 ${
                      wizardAnswers.devPersona === spec.id
                        ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/10'
                        : 'border-[#D4D4D8] bg-white text-gray-600'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{spec.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm md:text-base text-zinc-950">{spec.title}</span>
                      <span className="text-xs md:text-sm text-gray-500 leading-tight mt-1">{spec.subtitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CUSTOMER SIZE TARGET */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider font-mono">
                  3. Scalability & Target Audience
                </label>
                <span className="text-xs font-semibold text-gray-400">Determines server architecture robust needs</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'hobby', label: 'MVP / Handful Users', desc: 'Cheap, rapid release, minor overhead', icon: Users },
                  { id: 'growing', label: '10k - 50k Active SaaS', desc: 'Balanced cost and stable active socket pool', icon: Users },
                  { id: 'enterprise', label: 'Enterprise / High Security', desc: 'Clustered resources, strict isolation protocols', icon: Users },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = wizardAnswers.customerTarget === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setWizardAnswers(prev => ({ ...prev, customerTarget: item.id as any }))}
                      className={`cursor-pointer p-4 border text-center rounded-sm transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 text-zinc-950 font-bold'
                          : 'border-[#D4D4D8] hover:border-gray-400 bg-white text-gray-600'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-xs md:text-sm font-bold">{item.label}</span>
                      <span className="text-xs text-gray-400 mt-1 leading-normal hidden md:block">{item.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* APP TYPE / DATA SIZE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* DATA TYPE VOLUME */}
              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider font-mono">
                  4. Expected Dataset Sizing
                </label>
                <select
                  value={wizardAnswers.dataSize}
                  onChange={(e) => setWizardAnswers(prev => ({ ...prev, dataSize: e.target.value as any }))}
                  className="bg-[#F4F4F5] border border-[#D4D4D8] text-sm md:text-base py-2.5 px-3 focus:outline-hidden focus:border-blue-500 rounded-sm text-gray-900 font-semibold"
                  id="adv-select-datasize"
                >
                  <option value="small-structured">Small Structured Accounts (Users, orders under 50MB)</option>
                  <option value="large-unstructured">Large Flexible JSON (Logs, clickstreams, multi-tenant schemas)</option>
                  <option value="heavy-media-files">Heavy Raw Assets (Images, video pipelines, massive datasets)</option>
                </select>
              </div>

              {/* BUDGET LIMITS */}
              <div className="flex flex-col gap-2">
                <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider font-mono">
                  5. Cost & Deployment Budget
                </label>
                <select
                  value={wizardAnswers.budgetLimit}
                  onChange={(e) => setWizardAnswers(prev => ({ ...prev, budgetLimit: e.target.value as any }))}
                  className="bg-[#F4F4F5] border border-[#D4D4D8] text-sm md:text-base py-2.5 px-3 focus:outline-hidden focus:border-blue-500 rounded-sm text-gray-900 font-semibold"
                  id="adv-select-budget"
                >
                  <option value="zero-free">strictly $0 / Free Cloud Tiers (Render free, Vercel free)</option>
                  <option value="low-vps">Self-hosted Linux VPS ($5-$15/month VPS with full docker control)</option>
                  <option value="high-managed">Managed Cloud Cluster ($50+/month robust server setups)</option>
                </select>
              </div>
            </div>

            {/* AI TECHNOLOGY NEED */}
            <div className="flex flex-col gap-2">
              <label className="text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider font-mono">
                6. AI Framework Integration Needs
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { id: 'no-ai', title: 'Traditional App', subtitle: 'Standard SaaS user accounts & CRUD transactions' },
                  { id: 'vector-rag', title: 'AI Embeddings / RAG', subtitle: 'Requires pgvector storage & semantic text lookup' },
                  { id: 'agent-websockets', title: 'Dynamic AI Agents', subtitle: 'Needs long streaming connections and live JSON webSockets' },
                ].map((ai) => (
                  <div
                    key={ai.id}
                    onClick={() => setWizardAnswers(prev => ({ ...prev, aiRequirement: ai.id as any }))}
                    className={`cursor-pointer p-3 border rounded-sm text-left transition-all hover:bg-zinc-50 ${
                      wizardAnswers.aiRequirement === ai.id 
                        ? 'bg-blue-550 border-blue-600 '
                        : 'border-[#D4D4D8] bg-white'
                    }`}
                  >
                    <div className="font-extrabold text-sm md:text-base text-zinc-950 flex items-center gap-1">
                      {wizardAnswers.aiRequirement === ai.id && <Check className="h-4 w-4 text-blue-600" />}
                      {ai.title}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 leading-normal mt-1">{ai.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* PLAIN ENGLISH CONCEPT EXPLAINERS BAR */}
          <div className="bg-[#EBEBEB] border border-[#D4D4D8] p-5 rounded">
            <h3 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
              <BookOpen className="h-4 w-4 text-blue-600" /> Tech Decoder: Easy English for Vibecoders
            </h3>
            <p className="text-sm md:text-base text-gray-650 mb-4 leading-relaxed font-normal">
              Don't understand what these technical terms mean when coding with AI? Click on a concept below to instantly decode the complexity:
            </p>

            <div className="space-y-2.5">
              {TECH_EXPLAINERS.map((concept) => (
                <details 
                  key={concept.id}
                  className="bg-white border border-[#D4D4D8] p-3.5 rounded group cursor-pointer"
                >
                  <summary className="text-sm md:text-base font-bold text-gray-900 flex items-center justify-between pointer-events-none leading-normal">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      {concept.title}
                    </span>
                    <span className="text-xs text-blue-600 font-mono group-open:hidden">▼ Show translation</span>
                    <span className="text-xs text-gray-500 font-mono hidden group-open:block">▲ Collapse</span>
                  </summary>
                  <div className="mt-2 text-sm md:text-base text-gray-700 leading-relaxed border-t border-gray-100 pt-2 pl-3">
                    <p className="font-extrabold text-xs text-blue-800 mb-1">{concept.concept}</p>
                    {concept.desc}
                  </div>
                </details>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: RECOMMENDED CO-PILOT ANALYSIS */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="wizard-recom-panel">
          
          {/* COMPATIBILITY HEALER CARD */}
          {compatibilityIssues.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-sm" id="alerts-matrix-board">
              <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1 cursor-default">
                <AlertTriangle className="h-4 w-4" /> Compatibility Advisory
              </h4>
              <div className="space-y-2">
                {compatibilityIssues.map((alert, index) => (
                  <p key={index} className="text-[11px] text-amber-900 leading-normal pl-5 list-item">
                    {alert.text}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* DYNAMIC BLUEPRINT REPORT & RATINGS */}
          <div className="bg-[#18181B] text-white p-6 rounded shadow-md border border-slate-800 flex flex-col justify-between" id="report-board">
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                  Target Blueprint Design
                </span>
                <span className="text-xs font-mono text-gray-400">Match Rank #1</span>
              </div>

              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mb-2 flex items-center gap-2">
                {generatedCustomStack ? generatedCustomStack.name : 'Vibe-Recommended Stack'}
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-5">
                {generatedCustomStack ? generatedCustomStack.description : ''}
              </p>

              {/* SPEC SHEET METADATA GRID */}
              {generatedCustomStack && (
                <div className="p-5 bg-[#0F0F11] border border-gray-800 rounded-sm flex flex-col gap-2.5 font-mono text-xs md:text-sm mb-5">
                  <div className="flex justify-between border-b border-gray-800 pb-2 mb-1.5 text-xs md:text-sm">
                    <span className="text-gray-500">PROJECT CORE:</span>
                    <span className="text-blue-400 font-bold">{wizardAnswers.appName}</span>
                  </div>
                  
                  <div className="grid grid-cols-[110px_1fr] gap-x-2 gap-y-2 text-xs md:text-sm text-gray-300">
                    <span className="text-gray-500">Frontend:</span>
                    <span className="font-semibold text-white">{generatedCustomStack.frontend}</span>
                    
                    <span className="text-gray-500">Backend API:</span>
                    <span className="font-semibold text-white">{generatedCustomStack.backend} ({generatedCustomStack.api})</span>

                    <span className="text-gray-500">Styles Vibe:</span>
                    <span className="font-semibold text-white">{generatedCustomStack.styles}</span>
                    
                    <span className="text-gray-500">Database:</span>
                    <span className="font-semibold text-white">{generatedCustomStack.database} ({generatedCustomStack.dbAccess})</span>

                    <span className="text-gray-505">Host Engine:</span>
                    <span className="font-semibold text-white">{generatedCustomStack.deployment}</span>

                    <span className="text-gray-500">Daemon Task:</span>
                    <span className="font-semibold text-white">{generatedCustomStack.runtimeProcess} ({generatedCustomStack.proxy})</span>
                    
                    <span className="text-gray-500">Telemetry:</span>
                    <span className="font-semibold text-emerald-400">{generatedCustomStack.monitoring}</span>
                  </div>
                </div>
              )}

              {/* TRADEOFF GAUGES PANEL */}
              <div className="p-4 bg-zinc-900 border border-slate-800 rounded-sm mb-5">
                <h4 className="text-xs uppercase tracking-wider font-bold text-gray-400 font-mono mb-3 border-b border-zinc-800 pb-2 flex items-center gap-1.5">
                  <Gauge className="h-4.5 w-4.5 text-blue-500" /> Operational Tradeoffs Profile
                </h4>
                
                <div className="space-y-3.5 font-sans text-xs md:text-sm">
                  {/* Time to Market */}
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1.5">
                      <span className="text-gray-400">⚡ Time-To-Market Speed:</span>
                      <span className="font-bold text-emerald-400">
                        {wizardAnswers.devPersona === 'vibe-casual' ? '🚀 Exceptional / Zero-Conf' : wizardAnswers.devPersona === 'ts-engineer' ? '⚡ Rapid Fullstack' : '🛡️ Standard Schedule'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: wizardAnswers.devPersona === 'vibe-casual' ? '95%' : wizardAnswers.devPersona === 'ts-engineer' ? '78%' : '59%' }}
                      />
                    </div>
                  </div>

                  {/* DevOps Overhead */}
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1.5">
                      <span className="text-gray-400">🛠️ DevOps Complexity:</span>
                      <span className="font-black text-amber-400">
                        {wizardAnswers.budgetLimit === 'zero-free' ? '💎 Low / Zero Config' : wizardAnswers.budgetLimit === 'low-vps' ? '🛡️ Medium / Self-Hosted Docker' : '🔥 Complex Orchestration'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500" 
                        style={{ width: wizardAnswers.budgetLimit === 'zero-free' ? '30%' : wizardAnswers.budgetLimit === 'low-vps' ? '65%' : '90%' }}
                      />
                    </div>
                  </div>

                  {/* High Scale Capacity */}
                  <div>
                    <div className="flex justify-between text-xs md:text-sm mb-1.5">
                      <span className="text-gray-400">📈 Peak traffic Scalability:</span>
                      <span className="font-bold text-blue-400">
                        {wizardAnswers.customerTarget === 'enterprise' ? '🔥 Heavy Distributed' : wizardAnswers.customerTarget === 'growing' ? '⚡ Sturdy / Standard scale' : '🌱 Low Scale bounds'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500" 
                        style={{ width: wizardAnswers.customerTarget === 'enterprise' ? '95%' : wizardAnswers.customerTarget === 'growing' ? '70%' : '35%' }}
                      />
                    </div>
                  </div>

                  {/* Dynamic Cost/Speed Estimations Grid */}
                  <div className="border-t border-zinc-800 pt-3 mt-4 grid grid-cols-2 gap-3.5 text-xs md:text-sm font-mono">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Est. Monthly Cost</span>
                      <span className="text-emerald-450 font-extrabold mt-0.5">{hostingCostLabel}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">DevOps Setup Time</span>
                      <span className="text-blue-350 font-extrabold mt-0.5">{setupTimeLabel}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ACTION TRIGGERS */}
            <div className="pt-4 border-t border-slate-800 mt-5 flex flex-col gap-2">
              <button
                onClick={() => {
                  if (!generatedCustomStack) return;
                  // Auto apply properties to the 13 Stepper Flow for users to play with!
                  setStepChoices({
                    1: generatedCustomStack.frontend.toLowerCase().includes('react') ? 'react' : generatedCustomStack.frontend.toLowerCase().includes('vue') ? 'vue' : generatedCustomStack.frontend.toLowerCase().includes('svelte') ? 'svelte' : 'html5',
                    2: 'vite',
                    3: generatedCustomStack.styles.toLowerCase().includes('tailwind') ? 'tailwind' : 'css-modules',
                    4: generatedCustomStack.api.toLowerCase().includes('rest') ? 'rest' : 'websockets',
                    5: generatedCustomStack.backend.toLowerCase().includes('node') ? 'node-ts' : generatedCustomStack.backend.toLowerCase().includes('django') ? 'python' : generatedCustomStack.backend.toLowerCase().includes('fastapi') ? 'python' : generatedCustomStack.backend.toLowerCase().includes('laravel') ? 'php' : 'rust',
                    6: generatedCustomStack.backend.toLowerCase().includes('express') ? 'express' : generatedCustomStack.backend.toLowerCase().includes('django') ? 'django' : generatedCustomStack.backend.toLowerCase().includes('fastapi') ? 'fastapi' : generatedCustomStack.backend.toLowerCase().includes('laravel') ? 'laravel' : 'gin-gonic',
                    7: generatedCustomStack.dbAccess.toLowerCase().includes('prisma') ? 'orm' : 'query-builder',
                    8: generatedCustomStack.database.toLowerCase().includes('postgres') ? 'postgres' : generatedCustomStack.database.toLowerCase().includes('mysql') ? 'mysql' : 'sqlite',
                    9: 'sessions',
                    10: generatedCustomStack.deployment.toLowerCase().includes('render') ? 'paas' : 'vps',
                    11: generatedCustomStack.runtimeProcess.toLowerCase().includes('pm2') ? 'pm2' : 'systemd',
                    12: generatedCustomStack.proxy.toLowerCase().includes('nginx') ? 'nginx' : 'caddy',
                    13: generatedCustomStack.monitoring.toLowerCase().includes('sentry') ? 'sentry' : 'pm2-logs'
                  });
                  alert(`Successfully synchronized Step choices to recommended ${generatedCustomStack.name}! Use the 13-Step tab to inspect individual parameters!`);
                  setActiveTab('flow');
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold uppercase text-sm md:text-base tracking-wide py-3 md:py-3.5 rounded shadow-sm text-center font-sans transition-all cursor-pointer"
                id="adv-btn-apply"
              >
                Port Config to Interactive 13-Step Flow
              </button>
            </div>

          </div>

          {/* AI COPILOT CURSOR PROMPT GENERATOR */}
          <div className="bg-white border border-[#D4D4D8] p-5 rounded shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <FileCode2 className="h-5 w-5 text-blue-600" /> AI Cursor Prompt Helper
              </h4>
              <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-250">
                PROMPT COMPRESSED
              </span>
            </div>

            <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
              Copy this optimized context template and paste it straight into <strong>Cursor Composer</strong>, <strong>vibe coders</strong>, or AI chats. It structures your app safely from scratch with zero boilerplate lag:
            </p>

            <div className="relative">
              <textarea
                readOnly
                className="w-full h-40 bg-[#F4F4F5] text-gray-800 p-4 text-xs md:text-sm font-mono leading-relaxed rounded border border-[#D4D4D8] focus:outline-hidden block scrollbar-thin select-all"
                value={generateAIPrompt()}
                id="adv-textarea-prompt"
              />
              <button
                onClick={handleCopyPrompt}
                className="absolute top-2.5 right-2.5 bg-white hover:bg-gray-50 border border-gray-350 p-2 rounded-sm text-xs font-bold text-gray-700 shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                title="Copy Prompt"
                id="adv-btn-copy-prompt"
              >
                {promptCopied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                     <Copy className="h-4 w-4 text-blue-600" /> Copy Context Prompt
                  </>
                )}
              </button>
            </div>

            <span className="text-xs md:text-sm text-gray-500 font-sans italic flex items-center gap-1.5 leading-normal mt-0.5">
              💡 <strong>Usage Tip:</strong> Pre-structuring your database schemas with AI from the start avoids manual files migrations conflicts later.
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}

/**
 * Conversational Flow Engine
 * Smart branching question logic for the stack wizard.
 * Each question can unlock different next questions based on the answer.
 */

export type AnswerMap = Record<string, string | string[]>;

export interface FlowOption {
  id: string;
  label: string;
  desc: string;
  icon?: string;
  limits?: string[];     // real constraints, shown as warning chips
  advantages?: string[]; // shown as green chips
  badge?: string;
}

export interface FlowQuestion {
  id: string;
  question: string;
  hint?: string;         // small grey context sentence under question
  type: 'single' | 'multi' | 'text' | 'textarea';
  options?: FlowOption[];
  placeholder?: string;
  // determines which question comes next — key is this question's answer id, value is next question id
  // use '*' as fallback when no specific branch matches
  next?: Record<string, string>;
}

// ─── QUESTION REGISTRY ───────────────────────────────────────────────────────

export const FLOW_QUESTIONS: Record<string, FlowQuestion> = {

  project_name: {
    id: 'project_name',
    question: 'What is your project called?',
    hint: 'This will be used to personalise your prompt and blueprint.',
    type: 'text',
    placeholder: 'e.g. TaskFlow, ShopEasy, NoteVault…',
    next: { '*': 'project_description' }
  },

  project_description: {
    id: 'project_description',
    question: 'Describe what your project does in 1–2 sentences.',
    hint: 'Be specific — this shapes the AI prompt quality.',
    type: 'textarea',
    placeholder: 'e.g. A multi-tenant SaaS where teams manage their sprint tasks, with a kanban board and time tracking.',
    next: { '*': 'app_type' }
  },

  app_type: {
    id: 'app_type',
    question: 'What kind of application are you building?',
    hint: 'This determines the right architecture and hosting approach.',
    type: 'single',
    options: [
      {
        id: 'saas',
        label: 'SaaS / Web App',
        icon: '🏢',
        desc: 'Multi-user product with accounts, billing, dashboards',
        advantages: ['Proven scalable model', 'Good for recurring revenue'],
        limits: ['Needs auth + database + payments from day 1']
      },
      {
        id: 'realtime',
        label: 'Realtime / Collaborative',
        icon: '⚡',
        desc: 'Live updates, chat, collaborative editing, websockets',
        advantages: ['High user engagement', 'Modern UX feel'],
        limits: ['Requires a persistent server — serverless platforms (Vercel, Netlify) do not support WebSockets', 'Use Railway, Fly.io, or a VPS instead']
      },
      {
        id: 'dashboard',
        label: 'Dashboard / Admin Tool',
        icon: '📊',
        desc: 'Internal tools, data visualization, analytics panels',
        advantages: ['Internal traffic = low cost', 'Simple auth is fine'],
        limits: ['Usually no public-facing auth needed']
      },
      {
        id: 'ecommerce',
        label: 'E-commerce / Marketplace',
        icon: '🛍️',
        desc: 'Product listings, cart, payments, order management',
        advantages: ['Clear monetization path'],
        limits: ['Payment gateway (Stripe, Paddle, etc.) required', 'Use a payment provider like Stripe to avoid storing card data — they handle PCI compliance for you']
      },
      {
        id: 'ai_app',
        label: 'AI-powered App',
        icon: '🤖',
        desc: 'LLM chat, RAG search, embedding pipelines, agents',
        advantages: ['Cutting-edge product category'],
        limits: ['Long AI responses need streaming — serverless function timeouts (10–30s) can cut them off', 'Vector DB (pgvector, Pinecone, Weaviate) adds cost and complexity']
      },
      {
        id: 'landing',
        label: 'Landing Page / Blog / Portfolio',
        icon: '📄',
        desc: 'Static or mostly-static content site',
        advantages: ['Cheapest to host', 'Near-zero backend needed'],
        limits: ['Limited interactivity without a backend']
      }
    ],
    next: {
      saas: 'deploy_target',
      realtime: 'deploy_target',
      dashboard: 'deploy_target',
      ecommerce: 'deploy_target',
      ai_app: 'deploy_target',
      landing: 'frontend_choice'
    }
  },

  deploy_target: {
    id: 'deploy_target',
    question: 'Where do you want to deploy your app?',
    hint: 'Your hosting choice shapes which database, auth, and backend options make sense. Serverless = less ops work; VPS = full control.',
    type: 'single',
    options: [
      {
        id: 'vercel',
        label: 'Vercel / Netlify',
        icon: '▲',
        desc: 'Serverless edge platforms — zero DevOps, instant Git deploys, global CDN',
        badge: 'Best for frontend-heavy apps',
        advantages: ['Free tier for small projects', 'Auto HTTPS + CDN built-in', 'Zero server config'],
        limits: [
          'Serverless functions timeout at 10–30s depending on plan',
          'No persistent WebSocket connections — not suitable for realtime apps',
          'No file system writes — use object storage (S3, Cloudflare R2) instead',
          'Cold starts can add 200–500ms latency'
        ]
      },
      {
        id: 'railway',
        label: 'Railway / Render / Fly.io',
        icon: '🚂',
        desc: 'Managed container PaaS — runs your full Node/Python/Go server 24/7',
        badge: 'Best for full-stack + APIs',
        advantages: ['Supports WebSockets and long-running processes', 'No server config needed', 'Built-in DB provisioning on Railway'],
        limits: [
          'Free tier sleeps after inactivity on Render (not Railway/Fly)',
          '$5–$20/mo for always-on servers',
          'Less global edge coverage than Vercel/Netlify'
        ]
      },
      {
        id: 'vps',
        label: 'VPS (DigitalOcean / Hetzner / Linode)',
        icon: '🖥️',
        desc: 'Your own Linux server — full control, you manage everything',
        advantages: ['Cheapest long-term ($4–$6/mo Hetzner)', 'Full control — no limits', 'WebSockets, cron, any port'],
        limits: [
          'You set up Nginx, SSL, firewall yourself',
          'Need to manage OS updates and security patches',
          'No auto-scaling without extra work'
        ]
      },
      {
        id: 'supabase_hosting',
        label: 'Managed BaaS (Supabase / Firebase / Appwrite)',
        icon: '🟢',
        desc: 'Backend-as-a-service provides DB + auth + storage — your frontend hosts on any CDN',
        badge: 'Best for solo devs / rapid MVP',
        advantages: ['No backend server to manage', 'DB + Auth + Storage in one dashboard', 'Free tiers available on all three'],
        limits: [
          'Supabase free: 500MB DB, 50k MAU — Firebase/Appwrite have similar limits',
          'Supabase edge functions use Deno (not Node.js); Firebase uses Node',
          'Vendor lock-in — migrating away later is significant effort'
        ]
      },
      {
        id: 'aws',
        label: 'AWS / GCP / Azure',
        icon: '☁️',
        desc: 'Enterprise cloud — EC2, Lambda, RDS, S3, IAM roles',
        advantages: ['Infinite scale', 'Every service imaginable', 'Best for enterprise compliance'],
        limits: [
          'Steep learning curve — IAM alone takes weeks',
          'Bills can spike unexpectedly without budget alerts',
          'Overkill for early-stage products'
        ]
      }
    ],
    next: {
      vercel: 'db_for_vercel',
      railway: 'db_general',
      vps: 'db_general',
      supabase_hosting: 'auth_supabase',
      aws: 'db_general'
    }
  },

  // ── DATABASE BRANCHES ─────────────────────────────────────────────────────

  db_for_vercel: {
    id: 'db_for_vercel',
    question: 'Which database will you use? (serverless-compatible options)',
    hint: 'Serverless platforms need databases that support HTTP connections or connection pooling — standard TCP connections can exhaust limits.',
    type: 'single',
    options: [
      {
        id: 'supabase',
        label: 'Supabase (PostgreSQL + extras)',
        icon: '🟢',
        desc: 'Managed Postgres bundled with auth, realtime subscriptions, storage, and auto-generated APIs',
        badge: 'Good if you want DB + Auth in one place',
        advantages: ['Free tier: 500MB, 2 projects', 'Auth + DB + Storage in one dashboard', 'Row-level security built-in'],
        limits: ['Free tier pauses after 1 week inactivity', 'Connection pooling via PgBouncer required for serverless', 'Vendor lock-in if you use many Supabase-specific features']
      },
      {
        id: 'planetscale',
        label: 'PlanetScale (MySQL)',
        icon: '🪐',
        desc: 'Serverless MySQL with branch-based schema migrations — no downtime deploys',
        advantages: ['HTTP driver works natively in serverless', 'Schema branching prevents migration accidents'],
        limits: ['No foreign key constraints (by design)', 'MySQL dialect only', 'Free tier permanently discontinued — starts $39/mo']
      },
      {
        id: 'neon',
        label: 'Neon (Serverless Postgres)',
        icon: '✨',
        desc: 'Pure Postgres that auto-scales to zero when idle — pay only for what you use',
        badge: 'Good if you want just the database',
        advantages: ['True serverless Postgres — scales to zero cost when idle', 'Free tier: 0.5 GB', 'DB branching for dev/staging environments'],
        limits: ['Scales to zero = cold start on first query (~500ms)', 'No built-in auth or storage — just the database']
      },
      {
        id: 'turso',
        label: 'Turso (SQLite at the edge)',
        icon: '🦅',
        desc: 'Distributed SQLite replicated to 35+ edge regions — ultra-low latency reads',
        advantages: ['< 1ms reads at edge', 'Free tier: 9GB storage, 1B row reads/mo'],
        limits: ['SQLite limitations — limited concurrent writes', 'Less mature ecosystem']
      },
      {
        id: 'mongodb_atlas',
        label: 'MongoDB Atlas',
        icon: '🍃',
        desc: 'Managed NoSQL document database — flexible JSON-like schema',
        advantages: ['Free tier: 512MB', 'Great for flexible/unstructured data', 'Mongoose ORM very popular'],
        limits: ['No ACID transactions across collections', 'Schema flexibility can become a liability at scale']
      }
    ],
    next: { '*': 'auth_strategy' }
  },

  db_general: {
    id: 'db_general',
    question: 'Which database will you use?',
    hint: 'On VPS or Railway, you can run the DB yourself or use a managed service.',
    type: 'single',
    options: [
      {
        id: 'postgres_self',
        label: 'PostgreSQL (self-hosted)',
        icon: '🐘',
        desc: 'Run your own Postgres in Docker on your VPS or Railway container',
        advantages: ['Free', 'Full control, no vendor limits', 'Best ACID compliance'],
        limits: ['You manage backups and upgrades', 'Need connection pooling (PgBouncer) for high concurrency']
      },
      {
        id: 'supabase',
        label: 'Supabase (managed Postgres)',
        icon: '🟢',
        desc: 'Managed Postgres with auth, storage, and realtime built-in — even on VPS deploys',
        advantages: ['Free tier generous', 'Auth + DB in one place'],
        limits: ['Free tier pauses after 1 week idle', 'Extra vendor dependency']
      },
      {
        id: 'mysql_self',
        label: 'MySQL / MariaDB (self-hosted)',
        icon: '🐬',
        desc: 'Classic MySQL — still widely used for web applications',
        advantages: ['Very simple to set up on any VPS', 'Massive hosting compatibility'],
        limits: ['Less powerful JSON support than Postgres', 'Fewer advanced features']
      },
      {
        id: 'mongodb_atlas',
        label: 'MongoDB Atlas (managed)',
        icon: '🍃',
        desc: 'NoSQL document store — works well for fast iteration on flexible schemas',
        advantages: ['No schema migrations needed', 'Free tier available'],
        limits: ['No joins — data modeling requires care', 'Less suitable for financial/relational data']
      },
      {
        id: 'sqlite',
        label: 'SQLite (file-based)',
        icon: '📁',
        desc: 'Embedded DB in a single file — zero setup, great for prototypes',
        advantages: ['Zero config, zero cost', 'Perfect for solo dev MVP'],
        limits: ['No concurrent writes', 'Not suitable for multi-server deployments', 'Data lost if server resets without volume mount']
      }
    ],
    next: { '*': 'auth_strategy' }
  },

  // ── AUTH BRANCHES ─────────────────────────────────────────────────────────

  auth_supabase: {
    id: 'auth_supabase',
    question: 'Your BaaS platform includes built-in auth — will you use it?',
    hint: 'Supabase Auth, Firebase Auth, and Appwrite Auth all support social login, magic links, and email+password out of the box.',
    type: 'single',
    options: [
      {
        id: 'supabase_auth_yes',
        label: 'Yes — use the built-in auth',
        icon: '🟢',
        desc: 'Your BaaS (Supabase / Firebase / Appwrite) handles sessions, JWT tokens, OAuth providers, and email confirmations',
        advantages: ['Zero custom auth code', 'Integrated with your database permissions', 'All providers in one dashboard'],
        limits: ['Locked to your BaaS ecosystem', 'Custom auth flows may need serverless functions']
      },
      {
        id: 'supabase_auth_no',
        label: 'No — I\'ll use a separate auth library',
        icon: '🔧',
        desc: 'Use Auth.js, Clerk, BetterAuth, or custom JWT — connects to your BaaS database independently',
        advantages: ['Full control over auth logic', 'Easier to migrate away from BaaS later'],
        limits: ['More code to write and maintain', 'Easy to introduce security bugs if done manually']
      }
    ],
    next: {
      supabase_auth_yes: 'email_verification',
      supabase_auth_no: 'auth_strategy'
    }
  },

  auth_strategy: {
    id: 'auth_strategy',
    question: 'How will users log in to your app?',
    hint: 'Think about your users — do they expect social login or are they OK with email + password?',
    type: 'single',
    options: [
      {
        id: 'email_password',
        label: 'Email + Password',
        icon: '📧',
        desc: 'Classic credential login — user registers with email, sets a password',
        advantages: ['No dependency on third-party providers', 'Users own their account'],
        limits: ['You must store hashed passwords (bcrypt)', 'Must handle forgot-password flow yourself']
      },
      {
        id: 'oauth_only',
        label: 'Social OAuth only (Google, GitHub)',
        icon: '🔑',
        desc: 'Users sign in via Google or GitHub — no passwords stored on your side',
        advantages: ['Frictionless signup', 'No password resets to handle', 'Trusted identity from provider'],
        limits: ['Users without Google/GitHub are excluded', 'Provider outage = your users can\'t log in']
      },
      {
        id: 'email_plus_oauth',
        label: 'Email + Password AND OAuth',
        icon: '🔐',
        desc: 'Users can choose either — email/password or social login',
        advantages: ['Maximum flexibility for users', 'Higher conversion rates'],
        limits: ['More complex — need to handle account linking', 'Two auth paths to test and maintain']
      },
      {
        id: 'magic_link',
        label: 'Magic Link (passwordless email)',
        icon: '✨',
        desc: 'User enters email, gets a one-time login link — no password needed',
        advantages: ['No password storage at all', 'Very low friction signup'],
        limits: ['Depends on email deliverability', 'Users need access to their inbox every login']
      },
      {
        id: 'no_auth',
        label: 'No authentication needed',
        icon: '🌐',
        desc: 'Public app — no login, no user accounts',
        advantages: ['Much simpler to build', 'Zero auth security concerns'],
        limits: ['No personalization', 'No protected routes']
      }
    ],
    next: {
      email_password: 'email_verification',
      oauth_only: 'auth_providers',
      email_plus_oauth: 'auth_providers',
      magic_link: 'auth_library',
      no_auth: 'frontend_choice'
    }
  },

  email_verification: {
    id: 'email_verification',
    question: 'Should new users verify their email before accessing the app?',
    hint: 'Email verification reduces spam and fake accounts but adds friction.',
    type: 'single',
    options: [
      {
        id: 'verify_required',
        label: 'Yes — require email verification',
        icon: '✅',
        desc: 'Send a confirmation email after signup. Block access until verified.',
        advantages: ['Reduces spam accounts', 'Ensures valid contact email', 'Required for some B2B compliance'],
        limits: ['Adds signup friction', 'Need a reliable email sending service (Resend, SendGrid)']
      },
      {
        id: 'verify_optional',
        label: 'No — allow immediate access',
        icon: '🚀',
        desc: 'User can use the app right away without confirming email',
        advantages: ['Higher signup conversion rate', 'Simpler initial setup'],
        limits: ['More bot/spam accounts', 'Email might be wrong with no way to recover account']
      }
    ],
    next: { '*': 'auth_library' }
  },

  auth_providers: {
    id: 'auth_providers',
    question: 'Which OAuth providers do you want to support?',
    hint: 'You can add more later, but pick what your users expect from day one.',
    type: 'multi',
    options: [
      {
        id: 'google',
        label: 'Google',
        icon: '🔵',
        desc: 'Most popular — nearly everyone has a Google account',
        advantages: ['Highest conversion rate'],
        limits: ['Requires Google Cloud Console setup + verified OAuth app']
      },
      {
        id: 'github',
        label: 'GitHub',
        icon: '⚫',
        desc: 'Great for developer tools and B2B products',
        advantages: ['No setup delay for dev-focused apps'],
        limits: ['Not suitable if your users are non-technical']
      },
      {
        id: 'discord',
        label: 'Discord',
        icon: '🟣',
        desc: 'Perfect for gaming, community tools, creator platforms',
        advantages: ['Strong community fit for gaming/creator niche'],
        limits: ['Niche — not suitable for general B2B SaaS']
      }
    ],
    next: { '*': 'auth_library' }
  },

  auth_library: {
    id: 'auth_library',
    question: 'Which auth library or service will you use?',
    hint: 'Pick the library that handles session management, tokens, and OAuth callbacks for your app.',
    type: 'single',
    options: [
      {
        id: 'nextauth',
        label: 'Auth.js / NextAuth.js',
        icon: '🔒',
        desc: 'The standard for Next.js apps — supports 50+ OAuth providers + credentials',
        badge: 'Recommended for Next.js',
        advantages: ['Huge community', 'Works with any DB via adapters', 'Handles sessions + JWT'],
        limits: ['Config can be complex for custom flows', 'v5 still in beta for some adapters']
      },
      {
        id: 'clerk',
        label: 'Clerk',
        icon: '🧑‍💼',
        desc: 'Drop-in auth UI components + backend — fastest to integrate',
        advantages: ['Pre-built login/signup UI', 'MFA, SSO out of the box', 'Free tier: 10k monthly active users'],
        limits: ['$25/mo when you exceed free tier', 'Less flexible for deeply custom auth flows']
      },
      {
        id: 'better_auth',
        label: 'BetterAuth',
        icon: '🏮',
        desc: 'Modern TypeScript auth library — session-based with plugin system for OAuth, 2FA, and more',
        advantages: ['Full control — no magic', 'Framework-agnostic', 'Actively maintained (Lucia successor)'],
        limits: ['More code to write than Clerk', 'Smaller community than Auth.js']
      },
      {
        id: 'supabase_auth_lib',
        label: 'Supabase Auth (SDK)',
        icon: '🟢',
        desc: 'Use @supabase/auth-helpers to manage sessions even outside of Supabase hosting',
        advantages: ['Works with any hosting', 'Free tier included'],
        limits: ['Still couples your auth to Supabase']
      },
      {
        id: 'custom_jwt',
        label: 'Custom JWT (manual)',
        icon: '🔧',
        desc: 'Hand-write JWT sign/verify logic with jsonwebtoken or jose',
        advantages: ['Zero vendor dependency', 'Deepest control'],
        limits: ['Easy to introduce vulnerabilities', 'You manage token rotation and revocation']
      }
    ],
    next: { '*': 'frontend_choice' }
  },

  // ── FRONTEND ──────────────────────────────────────────────────────────────

  frontend_choice: {
    id: 'frontend_choice',
    question: 'What is your frontend framework?',
    hint: 'Your hosting choice may influence this — serverless platforms pair well with Next.js/SvelteKit, while a VPS lets you run any framework.',
    type: 'single',
    options: [
      {
        id: 'nextjs',
        label: 'Next.js (React)',
        icon: '▲',
        desc: 'Full-stack React framework with SSR, SSG, API routes, and edge functions',
        badge: 'Most popular for SaaS / full-stack',
        advantages: ['App Router = server components = faster pages', 'API routes = no separate backend for simple apps', 'SEO-friendly by default', 'Deploys on Vercel, Railway, VPS, or any Node host'],
        limits: ['Server components add mental overhead', 'Large bundle if not careful with client components']
      },
      {
        id: 'react_vite',
        label: 'React + Vite (SPA)',
        icon: '⚛️',
        desc: 'Single-page React app — pure client-side rendering with separate backend API',
        advantages: ['Fastest dev experience', 'Clear separation of frontend/backend'],
        limits: ['No SSR — SEO requires extra setup (React Router v7 or similar)', 'Separate backend server required']
      },
      {
        id: 'sveltekit',
        label: 'SvelteKit',
        icon: '🔶',
        desc: 'Full-stack Svelte framework — tiny bundles, clean syntax, very fast',
        advantages: ['Smallest bundle sizes', 'No virtual DOM = better performance', 'Excellent developer ergonomics'],
        limits: ['Smaller ecosystem than React', 'Fewer UI component libraries available']
      },
      {
        id: 'vue_nuxt',
        label: 'Vue + Nuxt',
        icon: '💚',
        desc: 'Vue.js with Nuxt for SSR/SSG — popular in European and Asian markets',
        advantages: ['Clean reactive syntax', 'Great official ecosystem (Pinia, Vue Router)'],
        limits: ['Less popular in US job market than React', 'Fewer enterprise UI libraries']
      },
      {
        id: 'vanilla',
        label: 'Vanilla HTML / JS',
        icon: '🌐',
        desc: 'No framework — plain HTML, CSS, JavaScript',
        advantages: ['Zero bundle size', 'No build step needed', 'Perfect for simple landing pages'],
        limits: ['State management is painful at scale', 'No component reuse']
      }
    ],
    next: { '*': 'backend_choice' }
  },

  // ── BACKEND ───────────────────────────────────────────────────────────────

  backend_choice: {
    id: 'backend_choice',
    question: 'What is your backend / server setup?',
    hint: 'Some frontend choices (Next.js, SvelteKit) have API routes built-in — you may not need a separate server.',
    type: 'single',
    options: [
      {
        id: 'nextjs_api',
        label: 'Next.js API Routes (no separate backend)',
        icon: '▲',
        desc: 'Use Next.js Route Handlers / API routes for your backend logic',
        advantages: ['No separate server to deploy', 'Shared TypeScript types', 'Deploy frontend + backend as one'],
        limits: ['Serverless — function timeout varies by platform (10–30s)', 'No persistent in-memory state between requests', 'Not suitable for WebSockets or long-running tasks']
      },
      {
        id: 'express_node',
        label: 'Express.js (Node / TypeScript)',
        icon: '🟨',
        desc: 'Minimal Node.js server — industry standard for REST APIs',
        advantages: ['Enormous ecosystem', 'Simple and flexible', 'Full WebSocket support'],
        limits: ['Single-threaded — CPU-heavy tasks block the event loop', 'You structure everything yourself']
      },
      {
        id: 'fastapi_py',
        label: 'FastAPI (Python)',
        icon: '🐍',
        desc: 'High-performance async Python API with automatic Swagger docs',
        badge: 'Best for AI/ML apps',
        advantages: ['Best for AI/ML integrations', 'Auto-generated API docs', 'Async by default'],
        limits: ['Slower startup than Node.js', 'Python dependency management (venv, poetry) adds complexity']
      },
      {
        id: 'go_backend',
        label: 'Go (Gin / Fiber)',
        icon: '🐹',
        desc: 'Compiled, concurrent Go server — incredibly fast and memory-efficient',
        advantages: ['10–30x less memory than Node.js', 'Handles 100k+ concurrent connections', 'Single binary deploy'],
        limits: ['Verbose error handling', 'Smaller ecosystem', 'Steeper learning curve']
      },
      {
        id: 'supabase_edge',
        label: 'Supabase Edge Functions only',
        icon: '🟢',
        desc: 'Deno-based serverless functions for backend logic — no custom server',
        advantages: ['Integrated with Supabase DB and Auth', 'Deploy in seconds', 'Free tier included'],
        limits: ['Deno runtime — not Node.js', '150ms cold start', 'Limited to Deno-compatible packages']
      }
    ],
    next: { '*': 'styling_choice' }
  },

  styling_choice: {
    id: 'styling_choice',
    question: 'How will you style your frontend?',
    type: 'single',
    options: [
      {
        id: 'tailwind',
        label: 'Tailwind CSS',
        icon: '🎨',
        desc: 'Utility-first CSS — write styles directly in your HTML/JSX',
        badge: 'Industry standard',
        advantages: ['Fastest UI development', 'Tiny production CSS bundle', 'Consistent design system'],
        limits: ['Long class strings in markup', 'Steep initial lookup phase']
      },
      {
        id: 'shadcn',
        label: 'Tailwind + shadcn/ui',
        icon: '🧩',
        desc: 'Tailwind with copy-paste accessible component library (Radix UI based)',
        badge: 'Recommended for React SaaS',
        advantages: ['Beautiful accessible components out of the box', 'You own the code — no package updates breaking your UI'],
        limits: ['React only — not available for Vue or Svelte', 'Large initial component setup']
      },
      {
        id: 'css_modules',
        label: 'CSS Modules',
        icon: '📄',
        desc: 'Scoped CSS files per component — no class name collisions',
        advantages: ['Clean separation', 'No framework lock-in', 'Plain CSS syntax'],
        limits: ['More files to manage', 'No design system by default']
      },
      {
        id: 'bootstrap',
        label: 'Bootstrap',
        icon: '🅱️',
        desc: 'Classic component framework with grid system',
        advantages: ['Fast to prototype', 'Massive documentation'],
        limits: ['Generic "Bootstrap look"', 'Heavy bundle', 'Less customizable than Tailwind']
      }
    ],
    next: { '*': 'ai_integration' }
  },

  ai_integration: {
    id: 'ai_integration',
    question: 'Does your app need AI or LLM features?',
    type: 'single',
    options: [
      {
        id: 'no_ai',
        label: 'No AI features',
        icon: '❌',
        desc: 'Standard CRUD app — no language models needed',
        advantages: ['Simpler architecture', 'No AI API costs'],
        limits: []
      },
      {
        id: 'llm_chat',
        label: 'LLM Chat / Completions',
        icon: '💬',
        desc: 'Integrate OpenAI / Anthropic / Gemini for chat or text generation',
        advantages: ['Quick to add via SDK', 'Streaming responses available'],
        limits: ['API costs per token', 'Streaming needs server-sent events or WebSockets — check your platform supports it before committing']
      },
      {
        id: 'rag_vector',
        label: 'RAG / Vector Search',
        icon: '🔍',
        desc: 'Semantic search over your own documents using embeddings',
        advantages: ['App can answer questions from your own data'],
        limits: ['Need pgvector or Pinecone/Weaviate', 'Embedding generation costs', 'Adds significant architecture complexity']
      },
      {
        id: 'agents',
        label: 'AI Agents / Multi-step tasks',
        icon: '🤖',
        desc: 'Long-running agentic workflows using tools, function calling',
        advantages: ['Automates complex workflows'],
        limits: ['Needs persistent connections — serverless hostile', 'Hard to debug', 'High token costs']
      }
    ],
    next: { '*': 'payments' }
  },

  payments: {
    id: 'payments',
    question: 'Does your app need payment processing?',
    type: 'single',
    options: [
      {
        id: 'no_payments',
        label: 'No payments',
        icon: '❌',
        desc: 'Free app, internal tool, or monetized another way',
        advantages: ['No PCI compliance required', 'Simpler'],
        limits: []
      },
      {
        id: 'stripe',
        label: 'Stripe (subscriptions / one-time)',
        icon: '💳',
        desc: 'Industry standard — handles cards, invoices, subscriptions, webhooks',
        badge: 'Recommended',
        advantages: ['Best documentation in the industry', 'Webhooks make subscription state easy', 'Free until you earn money'],
        limits: ['2.9% + 30¢ per transaction', 'Webhook endpoint must be always-on and fast — test with Stripe CLI locally before deploying']
      },
      {
        id: 'lemon_squeezy',
        label: 'Lemon Squeezy',
        icon: '🍋',
        desc: 'Merchant of record — they handle VAT, taxes, and compliance for you',
        advantages: ['No tax headache for global products', 'Simple setup'],
        limits: ['Higher fees than Stripe', 'Less flexible for complex billing']
      }
    ],
    next: { '*': 'done' }
  },

};

// ─── QUESTION ORDER / GRAPH ───────────────────────────────────────────────────

export const FLOW_START = 'project_name';

export function getNextQuestion(currentId: string, answer: string | string[], answers: AnswerMap): string | null {
  const q = FLOW_QUESTIONS[currentId];
  if (!q || !q.next) return null;

  const answerStr = Array.isArray(answer) ? answer[0] : answer;
  const specific = q.next[answerStr];
  const fallback = q.next['*'];
  const nextId = specific || fallback || null;

  if (nextId === 'done' || !FLOW_QUESTIONS[nextId ?? '']) return null;

  // Context-sensitive skips
  if (nextId === 'backend_choice') {
    if (answers['deploy_target'] === 'supabase_hosting') return 'styling_choice';
  }

  // After email_verification, skip auth_library if Supabase Auth is handling auth
  if (nextId === 'auth_library') {
    if (answers['auth_supabase'] === 'supabase_auth_yes') return 'frontend_choice';
  }

  // Skip AI integration and payments for app types that don't need them
  if (nextId === 'ai_integration') {
    const appType = answers['app_type'];
    if (appType === 'landing' || appType === 'dashboard') return 'payments';
  }

  if (nextId === 'payments') {
    const appType = answers['app_type'];
    if (appType === 'landing' || appType === 'dashboard') return null;
  }

  return nextId;
}

/**
 * Conversational Flow Engine
 * Smart branching question logic for the stack wizard.
 * Each question can unlock different next questions based on the answer.
 */

export type AnswerMap = Record<string, string | string[]>;

// Compatibility rule: if answers[key] matches any value in `values`, this signal applies.
// 'recommended' = green Best Match badge
// 'incompatible' = red warning, card dimmed (still selectable)
export interface CompatibilityRule {
  signal: 'recommended' | 'incompatible';
  when: { key: string; values: string[] }[];  // ALL conditions must match (AND)
  reason: string;  // shown as a one-line tooltip/label
}

export interface FlowOption {
  id: string;
  label: string;
  desc: string;
  icon?: string;
  limits?: string[];     // real constraints, shown as warning chips
  advantages?: string[]; // shown as green chips
  badge?: string;
  compat?: CompatibilityRule[];  // context-aware signals based on prior answers
}

export interface FlowQuestion {
  id: string;
  question: string;
  hint?: string;         // small grey context sentence under question
  askAI?: string;        // pre-written prompt the user can copy into ChatGPT/Claude
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
        limits: ['Requires a persistent server — serverless edge platforms do not support WebSockets', 'Use a container PaaS or self-managed VPS instead']
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
    question: 'Where will your app live on the internet?',
    hint: 'This is your hosting choice — it affects cost, effort to set up, and what your app can do.',
    askAI: 'I am building a web app and need to choose where to host it. Explain the difference between these options in plain English, with no jargon: (1) push-to-deploy cloud like Vercel, (2) a managed server platform like Railway, (3) renting a raw Linux server like DigitalOcean, (4) an all-in-one platform like Supabase. Which is best for a beginner building their first web app?',
    type: 'single',
    options: [
      {
        id: 'vercel',
        label: 'Push-to-deploy cloud (zero server config)',
        icon: '▲',
        desc: 'Connect your code repo and it deploys automatically — HTTPS, global fast loading, and scaling are all handled for you (e.g. Vercel, Netlify)',
        badge: 'Best for most web apps',
        advantages: ['Free tier for small projects', 'Auto HTTPS + CDN built-in', 'Zero server config'],
        limits: [
          'Serverless functions timeout at 10–30s depending on plan',
          'No persistent WebSocket connections — not suitable for realtime apps',
          'No file system writes — use object storage instead',
          'Cold starts can add 200–500ms latency'
        ],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'dashboard', 'landing', 'ecommerce'] }], reason: 'Serverless edge hosting is ideal for this app type — fast deploys, zero DevOps' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['realtime'] }], reason: 'Serverless platforms drop WebSocket connections — use a container PaaS or VPS instead' },
        ]
      },
      {
        id: 'railway',
        label: 'Managed cloud server (always running)',
        icon: '🚂',
        desc: 'A managed platform runs your server 24/7 — no server config needed, supports live chat and background tasks (e.g. Railway, Render, Fly.io)',
        badge: 'Best for full-stack + realtime',
        advantages: ['Supports WebSockets and long-running processes', 'No server config needed', 'Many include built-in DB provisioning'],
        limits: [
          'Some free tiers sleep after inactivity',
          '$5–$20/mo for always-on servers',
          'Less global edge coverage than serverless platforms'
        ],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['realtime', 'ai_app'] }], reason: 'Persistent server required for WebSockets and long-running AI tasks' },
        ]
      },
      {
        id: 'vps',
        label: 'Your own Linux server (full control)',
        icon: '🖥️',
        desc: 'Rent a raw server and set it up yourself — cheapest long-term, total flexibility, but you handle security and updates (e.g. DigitalOcean, Hetzner, Linode)',
        advantages: ['Cheapest long-term (~$4–6/mo)', 'Full control — no platform limits', 'WebSockets, cron, any port'],
        limits: [
          'You set up the web server, SSL, and firewall yourself',
          'Need to manage OS updates and security patches',
          'No auto-scaling without extra work'
        ],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['realtime'] }], reason: 'Full server control — ideal for long-running WebSocket servers' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['landing'] }], reason: 'Overkill for a landing page — serverless edge hosting is free and zero-config' },
        ]
      },
      {
        id: 'supabase_hosting',
        label: 'All-in-one platform (database + auth built in)',
        icon: '🟢',
        desc: 'A platform that gives you database, login, and file storage in one dashboard — you just build the frontend (e.g. Supabase, Firebase, Appwrite)',
        badge: 'Fastest to launch',
        advantages: ['No backend server to manage', 'DB + Auth + Storage in one dashboard', 'Free tiers available'],
        limits: [
          'Free tiers typically cap at ~500MB DB and 50k monthly active users',
          'Serverless functions may use non-Node runtimes (e.g. Deno)',
          'Vendor lock-in — migrating away later is significant effort'
        ],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'dashboard'] }], reason: 'BaaS gives you DB + Auth + Storage in one — ideal for rapid MVP' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['realtime'] }], reason: 'BaaS realtime features have connection limits — persistent collaborative apps need a dedicated WebSocket server' },
        ]
      },
      {
        id: 'aws',
        label: 'Enterprise cloud (AWS / Google Cloud / Azure)',
        icon: '☁️',
        desc: 'The "big three" cloud providers — every service imaginable, scales to millions of users, but steep learning curve and complex billing (e.g. AWS, GCP, Azure)',
        advantages: ['Virtually unlimited scale', 'Every service imaginable', 'Best for enterprise compliance'],
        limits: [
          'Steep learning curve — IAM and networking alone take weeks',
          'Bills can spike unexpectedly without budget alerts',
          'Overkill for early-stage products'
        ],
        compat: [
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['landing', 'dashboard'] }], reason: 'Enterprise cloud is overkill here — a serverless edge host or container PaaS ships faster and costs less' },
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
    question: 'Where will your app store its data?',
    hint: 'Every app that saves user accounts, content, or settings needs a database. The push-to-deploy platform you chose works best with hosted database services.',
    askAI: 'I am building a web app hosted on Vercel (or similar serverless platform) and need to choose a database. Explain the difference between Supabase, Neon, PlanetScale, Turso, and MongoDB Atlas in plain English. Which is easiest to set up for a beginner? Which gives the best free tier?',
    type: 'single',
    options: [
      {
        id: 'supabase',
        label: 'Managed Postgres + BaaS',
        icon: '🟢',
        desc: 'Hosted Postgres bundled with auth, realtime subscriptions, storage, and auto-generated APIs (e.g. Supabase)',
        badge: 'DB + Auth in one place',
        advantages: ['Auth + DB + Storage in one dashboard', 'Row-level security built-in', 'Free tier available'],
        limits: ['Free tier pauses after ~1 week inactivity', 'Connection pooling required for serverless', 'Vendor lock-in if you use platform-specific features heavily'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'dashboard'] }], reason: 'Auth + DB in one dashboard — perfect for SaaS MVPs' },
          { signal: 'recommended', when: [{ key: 'auth_strategy', values: ['email_password', 'email_plus_oauth', 'oauth_only'] }], reason: 'Built-in auth covers your chosen login method natively' },
        ]
      },
      {
        id: 'planetscale',
        label: 'Serverless MySQL',
        icon: '🪐',
        desc: 'Hosted MySQL with branch-based schema migrations and an HTTP driver — no connection pooling needed (e.g. PlanetScale)',
        advantages: ['HTTP driver works natively in serverless', 'Schema branching prevents migration accidents'],
        limits: ['No foreign key constraints (by design)', 'MySQL dialect only', 'Paid from the start — no permanent free tier'],
        compat: [
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['landing'] }], reason: 'Serverless MySQL is a paid service — overkill for a landing page' },
        ]
      },
      {
        id: 'neon',
        label: 'Serverless Postgres',
        icon: '✨',
        desc: 'Pure Postgres that auto-scales to zero when idle — pay only for what you use (e.g. Neon)',
        badge: 'Just the database',
        advantages: ['Scales to zero cost when idle', 'Free tier included', 'DB branching for dev/staging environments'],
        limits: ['Scales to zero = cold start on first query (~500ms)', 'No built-in auth or storage — just the database'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'ecommerce', 'ai_app'] }], reason: 'Pure Postgres — best for complex relational data and AI/RAG workloads' },
        ]
      },
      {
        id: 'turso',
        label: 'Edge-Distributed SQLite',
        icon: '🦅',
        desc: 'SQLite replicated to 35+ edge regions — ultra-low latency reads globally (e.g. Turso)',
        advantages: ['Sub-millisecond reads at edge', 'Very generous free tier'],
        limits: ['SQLite write limitations — limited concurrent writes', 'Less mature ecosystem than Postgres'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['landing', 'dashboard'] }], reason: 'Ultra-fast reads, generous free tier — great for read-heavy apps' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['ecommerce'] }], reason: 'Limited concurrent writes — not suitable for high-traffic order processing' },
        ]
      },
      {
        id: 'mongodb_atlas',
        label: 'Managed Document DB',
        icon: '🍃',
        desc: 'Hosted NoSQL document store with a flexible JSON-like schema (e.g. MongoDB Atlas)',
        advantages: ['Free tier available', 'Great for flexible/unstructured data', 'Popular ORM ecosystem'],
        limits: ['No ACID transactions across collections', 'Schema flexibility can become a liability at scale'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['ai_app'] }], reason: 'Flexible JSON schema suits unstructured AI/LLM output storage' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['ecommerce'] }], reason: 'No cross-collection transactions — risky for financial/order data' },
        ]
      }
    ],
    next: { '*': 'auth_strategy' }
  },

  db_general: {
    id: 'db_general',
    question: 'Where will your app store its data?',
    hint: 'Every app that saves user accounts, content, or settings needs a database. With your chosen server setup, you can run one yourself or use a hosted service.',
    askAI: 'I am building a web app and need to choose a database. Explain in plain English: what is PostgreSQL vs MySQL vs MongoDB vs SQLite? Which should a beginner use and why? What does "self-hosted" mean vs a managed service?',
    type: 'single',
    options: [
      {
        id: 'postgres_self',
        label: 'PostgreSQL (self-hosted)',
        icon: '🐘',
        desc: 'Run your own Postgres in Docker on your server or container platform',
        advantages: ['Free', 'Full control, no vendor limits', 'Best ACID compliance'],
        limits: ['You manage backups and upgrades', 'Need connection pooling for high concurrency'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'ecommerce', 'realtime'] }], reason: 'Full control + ACID — ideal for data-critical or high-traffic apps' },
          { signal: 'recommended', when: [{ key: 'deploy_target', values: ['vps', 'railway'] }], reason: 'Self-hosted Postgres pairs naturally with a persistent server' },
        ]
      },
      {
        id: 'supabase',
        label: 'Managed Postgres + BaaS',
        icon: '🟢',
        desc: 'Hosted Postgres with auth, storage, and realtime built-in — usable from any hosting provider (e.g. Supabase)',
        advantages: ['Free tier generous', 'Auth + DB in one place'],
        limits: ['Free tier pauses after ~1 week idle', 'Extra vendor dependency'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'dashboard'] }], reason: 'Auth + DB in one dashboard — great for SaaS even on a container PaaS or VPS' },
        ]
      },
      {
        id: 'mysql_self',
        label: 'MySQL (self-hosted)',
        icon: '🐬',
        desc: 'Classic MySQL / MariaDB — still widely used for web applications',
        advantages: ['Very simple to set up on any server', 'Massive hosting compatibility'],
        limits: ['Less powerful JSON support than Postgres', 'No native vector search for AI workloads'],
        compat: [
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['ai_app'] }], reason: 'Poor JSON and vector support — use Postgres with pgvector for AI apps' },
        ]
      },
      {
        id: 'mongodb_atlas',
        label: 'Managed Document DB',
        icon: '🍃',
        desc: 'Hosted NoSQL document store — works well for fast iteration on flexible schemas (e.g. MongoDB Atlas)',
        advantages: ['No schema migrations needed', 'Free tier available'],
        limits: ['No joins — data modeling requires care', 'Less suitable for financial/relational data'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['ai_app'] }], reason: 'Flexible schema suits AI/LLM output and unstructured data' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['ecommerce'] }], reason: 'No cross-collection ACID transactions — risky for order and payment data' },
        ]
      },
      {
        id: 'sqlite',
        label: 'SQLite (file-based)',
        icon: '📁',
        desc: 'Embedded DB in a single file — zero setup, great for prototypes',
        advantages: ['Zero config, zero cost', 'Perfect for solo dev MVP'],
        limits: ['No concurrent writes', 'Not suitable for multi-server deployments', 'Data lost on redeploy without a persistent volume'],
        compat: [
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['saas', 'ecommerce', 'realtime'] }], reason: 'No concurrent writes — not suitable for multi-user production apps' },
          { signal: 'incompatible', when: [{ key: 'deploy_target', values: ['railway', 'vps'] }], reason: 'Data lost on redeploy without a persistent volume — use Postgres instead' },
        ]
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
    askAI: 'I am building a web app and need to choose how users log in. Explain in plain English: what is the difference between email+password login, social login (Google/GitHub), magic links, and no auth? Which is easiest to implement? Which do users prefer? Give me a simple recommendation.',
    type: 'single',
    options: [
      {
        id: 'email_password',
        label: 'Email + Password',
        icon: '📧',
        desc: 'Classic credential login — user registers with email, sets a password',
        advantages: ['No dependency on third-party providers', 'Users own their account'],
        limits: ['You must store hashed passwords (bcrypt)', 'Must handle forgot-password flow yourself'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'ecommerce'] }], reason: 'Standard for B2C products — users expect email + password' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['dashboard'] }], reason: 'Internal tools rarely need self-service registration — consider OAuth only' },
        ]
      },
      {
        id: 'oauth_only',
        label: 'Social OAuth only (Google, GitHub)',
        icon: '🔑',
        desc: 'Users sign in via Google or GitHub — no passwords stored on your side',
        advantages: ['Frictionless signup', 'No password resets to handle', 'Trusted identity from provider'],
        limits: ['Users without Google/GitHub are excluded', 'Provider outage = your users can\'t log in'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['dashboard', 'ai_app'] }], reason: 'Fastest to ship — internal or developer tools suit OAuth-only well' },
        ]
      },
      {
        id: 'email_plus_oauth',
        label: 'Email + Password AND OAuth',
        icon: '🔐',
        desc: 'Users can choose either — email/password or social login',
        advantages: ['Maximum flexibility for users', 'Higher conversion rates'],
        limits: ['More complex — need to handle account linking', 'Two auth paths to test and maintain'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'ecommerce'] }], reason: 'Highest conversion — users pick their preferred login method' },
        ]
      },
      {
        id: 'magic_link',
        label: 'Magic Link (passwordless email)',
        icon: '✨',
        desc: 'User enters email, gets a one-time login link — no password needed',
        advantages: ['No password storage at all', 'Very low friction signup'],
        limits: ['Depends on email deliverability', 'Users need access to their inbox every login'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas'] }], reason: 'Low friction, no password resets — works well for SaaS where users check email' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['ecommerce'] }], reason: 'Checkout flow requires reliable instant access — magic links depend on email speed' },
        ]
      },
      {
        id: 'no_auth',
        label: 'No authentication needed',
        icon: '🌐',
        desc: 'Public app — no login, no user accounts',
        advantages: ['Much simpler to build', 'Zero auth security concerns'],
        limits: ['No personalization', 'No protected routes'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['landing'] }], reason: 'Landing pages are public — no auth needed' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['saas', 'ecommerce', 'dashboard'] }], reason: 'Your app type requires user accounts and protected routes' },
        ]
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
    question: 'Which tool will handle login for your app?',
    hint: 'This is the code that checks passwords, manages sessions ("stay logged in"), and connects to Google/GitHub login.',
    askAI: 'I am building a web app and need to add login. Explain the difference between Auth.js (NextAuth), Clerk, BetterAuth, and building JWT auth yourself — in plain English, no jargon. Which is best for a beginner? Which is most flexible long-term? What are the hidden costs of each?',
    type: 'single',
    options: [
      {
        id: 'nextauth',
        label: 'Auth.js — open-source, works with most frameworks',
        icon: '🔒',
        desc: 'The most widely used login library — free, open-source, supports 50+ login providers (Google, GitHub, etc.) and email+password (e.g. Auth.js / NextAuth.js)',
        badge: 'Recommended for Next.js',
        advantages: ['Huge community', 'Works with any DB via adapters', 'Handles sessions + JWT'],
        limits: ['Config can be complex for custom flows', 'v5 still in beta for some adapters'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['nextjs'] }], reason: 'Auth.js is the native standard for Next.js — deep App Router integration' },
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['sveltekit'] }], reason: 'Auth.js has an official SvelteKit adapter — works natively' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['vue_nuxt'] }], reason: 'Auth.js has limited Vue/Nuxt support — use nuxt-auth or BetterAuth instead' },
        ]
      },
      {
        id: 'clerk',
        label: 'Clerk — plug-in login UI, no code to write',
        icon: '🧑‍💼',
        desc: 'A paid service that gives you a complete login system — pre-built sign-in/sign-up screens, user management dashboard, and multi-factor auth out of the box (e.g. Clerk)',
        advantages: ['Login screens and user management are already built — zero auth code', 'Supports 2FA, social login, magic links with no extra setup', 'Generous free tier for early projects'],
        limits: ['Monthly fee once you grow past the free tier', 'Less flexible if you need deeply custom login flows'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['nextjs', 'react_vite'] }], reason: 'Clerk\'s React SDK and pre-built components are React-first' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['sveltekit', 'vue_nuxt'] }], reason: 'Clerk has no official Svelte or Vue SDK — integration is manual and unsupported' },
        ]
      },
      {
        id: 'better_auth',
        label: 'BetterAuth — modern open-source login library',
        icon: '🏮',
        desc: 'A newer open-source login library that works with any framework — full control over how login behaves, with a plugin system for 2FA, OAuth, and more (e.g. BetterAuth)',
        advantages: ['Works with any framework — not tied to React or Next.js', 'Full control over login flows', 'Actively maintained'],
        limits: ['More code to write than Clerk — you build the login screens', 'Smaller community than Auth.js'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['sveltekit', 'vue_nuxt'] }], reason: 'Framework-agnostic — works equally well with Svelte and Vue' },
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['nextjs', 'react_vite'] }], reason: 'Works with React too — good if you want full control over auth logic' },
        ]
      },
      {
        id: 'supabase_auth_lib',
        label: 'Platform auth SDK — use your database platform\'s login',
        icon: '🟢',
        desc: 'Use the login system built into your database platform — everything stays in one dashboard, no extra service needed (e.g. Supabase Auth)',
        advantages: ['Everything in one dashboard — database and login together', 'Included in your existing plan at no extra cost'],
        limits: ['Ties your login system to your database provider — harder to switch later'],
        compat: [
          { signal: 'recommended', when: [{ key: 'db_for_vercel', values: ['supabase'] }, { key: 'db_general', values: ['supabase'] }], reason: 'Already using a managed Postgres + BaaS — using the same platform\'s auth keeps everything in one dashboard' },
          { signal: 'incompatible', when: [{ key: 'db_for_vercel', values: ['neon', 'planetscale', 'turso', 'mongodb_atlas'] }], reason: 'BaaS Auth SDK ties you to one provider even though your DB is elsewhere — use BetterAuth or Auth.js to stay DB-agnostic' },
        ]
      },
      {
        id: 'custom_jwt',
        label: 'Build it yourself (advanced — not recommended for most)',
        icon: '🔧',
        desc: 'Write your own login system from scratch — maximum flexibility, but security is entirely on you. Only choose this if you have a specific reason not to use the options above.',
        advantages: ['No dependency on any third-party service', 'Deepest possible control over login logic'],
        limits: ['Easy to introduce security vulnerabilities if done wrong', 'You must handle session expiry, password resets, and token security yourself'],
        compat: [
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['saas', 'ecommerce'] }], reason: 'Custom JWT is high-risk for production apps — use a battle-tested library instead' },
        ]
      }
    ],
    next: { '*': 'frontend_choice' }
  },

  // ── FRONTEND ──────────────────────────────────────────────────────────────

  frontend_choice: {
    id: 'frontend_choice',
    question: 'What will you use to build the visual part of your app?',
    hint: 'This is your "frontend framework" — the tool that creates what users see and click. Pick based on your project, not what sounds most impressive.',
    askAI: 'I need to choose a frontend framework for my web app. Explain the difference between Next.js, plain React (with Vite), SvelteKit, and Vue+Nuxt in plain English. Which is easiest to learn? Which has the most jobs? Which is best for a small team building a SaaS product?',
    type: 'single',
    options: [
      {
        id: 'nextjs',
        label: 'Next.js — React with built-in backend',
        icon: '▲',
        desc: 'The most popular choice for web apps — handles both your pages and your server logic in one project (e.g. SaaS, e-commerce, marketing sites)',
        badge: 'Most popular — great default choice',
        advantages: ['App Router = server components = faster pages', 'API routes = no separate backend for simple apps', 'SEO-friendly by default', 'Deploys on serverless edge, container PaaS, VPS, or any Node host'],
        limits: ['Server components add mental overhead', 'Large bundle if not careful with client components'],
        compat: [
          { signal: 'recommended', when: [{ key: 'deploy_target', values: ['vercel'] }], reason: 'Next.js is built by the team behind this serverless edge platform — first-class deployment support, zero config' },
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas', 'ecommerce'] }], reason: 'SSR + API routes in one — ideal for SEO-critical and data-heavy apps' },
        ]
      },
      {
        id: 'react_vite',
        label: 'React — frontend only (needs a separate backend)',
        icon: '⚛️',
        desc: 'Pure frontend with React — the page logic lives in the browser, and you connect to a separate backend server for data (good for dashboards, internal tools)',
        advantages: ['Fastest dev experience', 'Clear separation of frontend/backend'],
        limits: ['Search engines may not index your content — extra setup needed for SEO', 'You must deploy a separate backend server for data'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['dashboard'] }], reason: 'Dashboards are not SEO-critical — SPA works perfectly, fast iteration' },
          { signal: 'recommended', when: [{ key: 'deploy_target', values: ['supabase_hosting'] }], reason: 'BaaS backend means you only need a static frontend — Vite SPA is perfect' },
          { signal: 'incompatible', when: [{ key: 'backend_choice', values: ['nextjs_api'] }], reason: 'Next.js API Routes require a Next.js frontend — switch to Next.js or change your backend' },
        ]
      },
      {
        id: 'sveltekit',
        label: 'SvelteKit — lean alternative to Next.js',
        icon: '🔶',
        desc: 'A full-stack framework like Next.js but lighter and faster — same idea (pages + backend in one project), different syntax (Svelte instead of React)',
        advantages: ['Pages load faster — smaller code sent to the browser', 'Clean, readable code with less boilerplate', 'Built-in backend like Next.js'],
        limits: ['Smaller community than React — fewer tutorials and components', 'Some React libraries won\'t work directly'],
        compat: [
          { signal: 'recommended', when: [{ key: 'deploy_target', values: ['vercel', 'railway'] }], reason: 'SvelteKit deploys natively to serverless edge hosts and container PaaS platforms with adapter-auto' },
          { signal: 'recommended', when: [{ key: 'app_type', values: ['landing', 'dashboard'] }], reason: 'Tiny bundle size and fast rendering — great for content and internal tools' },
          { signal: 'incompatible', when: [{ key: 'auth_library', values: ['clerk'] }], reason: 'Clerk has no official Svelte SDK — use Auth.js (SvelteKit adapter) or BetterAuth' },
          { signal: 'incompatible', when: [{ key: 'styling_choice', values: ['shadcn'] }], reason: 'shadcn/ui is React-only — use shadcn-svelte or bits-ui for Svelte' },
        ]
      },
      {
        id: 'vue_nuxt',
        label: 'Vue + Nuxt — popular React alternative',
        icon: '💚',
        desc: 'A full-stack framework similar to Next.js but uses Vue instead of React — popular in Europe and Asia, with a famously gentle learning curve',
        advantages: ['Often considered easier to learn than React', 'Clean syntax, great official tooling'],
        limits: ['Smaller US community than React — fewer job listings and StackOverflow answers', 'Fewer ready-made UI component libraries'],
        compat: [
          { signal: 'recommended', when: [{ key: 'deploy_target', values: ['vercel', 'railway'] }], reason: 'Nuxt deploys cleanly to serverless edge hosts and container PaaS platforms' },
          { signal: 'incompatible', when: [{ key: 'auth_library', values: ['clerk', 'nextauth'] }], reason: 'Clerk and Auth.js have poor Vue support — use nuxt-auth or BetterAuth' },
          { signal: 'incompatible', when: [{ key: 'styling_choice', values: ['shadcn'] }], reason: 'shadcn/ui is React-only — use shadcn-vue or Nuxt UI instead' },
        ]
      },
      {
        id: 'vanilla',
        label: 'Plain HTML / CSS / JavaScript (no framework)',
        icon: '🌐',
        desc: 'Write the basics without any special tools — great for simple pages, not practical once your app has multiple screens or user accounts',
        advantages: ['Simplest possible setup — open a file and start', 'No tools to install or configure', 'Perfect for landing pages and portfolios'],
        limits: ['Gets messy fast with multiple pages or user data', 'No built-in way to reuse code across pages'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['landing'] }], reason: 'Landing pages need zero JS overhead — vanilla is fastest to ship' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['saas', 'ecommerce', 'realtime', 'dashboard', 'ai_app'] }], reason: 'Vanilla JS doesn\'t scale for complex interactive apps — pick a framework' },
        ]
      }
    ],
    next: { '*': 'backend_choice' }
  },

  // ── BACKEND ───────────────────────────────────────────────────────────────

  backend_choice: {
    id: 'backend_choice',
    question: 'How will your app handle data and logic on the server?',
    hint: 'Some frameworks (Next.js, SvelteKit) have this built in — you may not need a separate server at all.',
    askAI: 'I am building a web app and need to understand my backend options. Explain in plain English: what is a "backend"? What is the difference between using Next.js API routes vs a separate Express.js server vs a Python FastAPI server? When would I need a separate server vs just using what my framework provides?',
    type: 'single',
    options: [
      {
        id: 'nextjs_api',
        label: 'Built-in backend (Next.js handles it)',
        icon: '▲',
        desc: 'Your Next.js app includes server-side logic — no separate server to manage or deploy (e.g. Route Handlers / Server Actions)',
        advantages: ['No separate server to deploy', 'Shared TypeScript types', 'Deploy frontend + backend as one'],
        limits: ['Each server function must finish in 10–30 seconds — long-running tasks will be cut off', 'No live connections like chat — only request/response', 'Not suitable for WebSockets or long-running tasks'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['nextjs'] }], reason: 'Built into Next.js — no extra setup, shared types' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['sveltekit', 'vue_nuxt', 'react_vite', 'vanilla'] }], reason: 'This option only works inside a Next.js project — pick the built-in option for your chosen framework instead' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['realtime'] }], reason: 'Cannot hold live connections for realtime apps — use a dedicated server instead' },
        ]
      },
      {
        id: 'sveltekit_api',
        label: 'Built-in backend (SvelteKit handles it)',
        icon: '🔶',
        desc: 'Your SvelteKit app includes server-side logic — no separate server to manage (e.g. +server.ts endpoint files)',
        advantages: ['Lives alongside your Svelte pages', 'Shared TypeScript types', 'Deploys everywhere SvelteKit does'],
        limits: ['Each server function must finish in 10–30 seconds on cloud platforms — same limit as Next.js', 'Live chat/WebSocket support needs extra configuration'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['sveltekit'] }], reason: 'Built into SvelteKit — no extra server, fully integrated' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['nextjs', 'react_vite', 'vue_nuxt', 'vanilla'] }], reason: 'This option only works inside a SvelteKit project' },
        ]
      },
      {
        id: 'express_node',
        label: 'Separate Node.js server (JavaScript/TypeScript)',
        icon: '🟨',
        desc: 'A standalone server your frontend talks to — handles any request, supports live connections (e.g. Express.js, Fastify)',
        advantages: ['Handles live chat, WebSockets, long uploads', 'Simple and widely documented', 'Works with any frontend'],
        limits: ['One extra thing to deploy and keep running', 'You structure the code yourself'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['realtime'] }], reason: 'Supports live connections and long-running tasks — required for realtime apps' },
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['react_vite', 'vue_nuxt', 'vanilla'] }], reason: 'Your frontend needs a separate server to talk to — this is the standard choice' },
          { signal: 'recommended', when: [{ key: 'deploy_target', values: ['railway', 'vps'] }], reason: 'Persistent server platforms run this natively — perfect fit' },
        ]
      },
      {
        id: 'fastapi_py',
        label: 'Python backend (best for AI / data apps)',
        icon: '🐍',
        desc: 'A standalone Python server — the go-to choice when your app processes data, runs AI models, or uses machine learning (e.g. FastAPI)',
        badge: 'Best for AI/ML apps',
        advantages: ['Direct access to all AI/ML libraries (LangChain, PyTorch, etc.)', 'Auto-generated API docs', 'Fast and async'],
        limits: ['Slightly more setup than a Node server', 'Python environment management (venv) adds a step'],
        compat: [
          { signal: 'recommended', when: [{ key: 'ai_integration', values: ['rag_vector', 'agents'] }], reason: 'Python is the standard language for AI/ML — all major AI tools are Python-first' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['landing', 'dashboard'] }], reason: 'Overkill for this app type — use a built-in backend or a Node server instead' },
        ]
      },
      {
        id: 'go_backend',
        label: 'Go backend (high performance)',
        icon: '🐹',
        desc: 'A compiled Go server — handles huge amounts of traffic on minimal resources (e.g. Gin, Fiber)',
        advantages: ['Uses far less memory than Node.js at scale', 'Handles many users simultaneously', 'Deploys as a single file'],
        limits: ['Steeper learning curve — best if you already know Go', 'Fewer ready-made libraries than Node or Python'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['realtime', 'saas'] }], reason: 'Handles massive concurrency cheaply — ideal for high-traffic apps' },
          { signal: 'incompatible', when: [{ key: 'ai_integration', values: ['rag_vector', 'agents'] }], reason: 'Limited AI tooling in Go — use a Python backend for AI-heavy apps' },
        ]
      },
      {
        id: 'supabase_edge',
        label: 'Platform handles the backend for you (BaaS)',
        icon: '🟢',
        desc: 'Your BaaS platform (e.g. Supabase) runs small backend functions alongside your database — no separate server to deploy',
        advantages: ['No server to manage', 'Automatically connected to your database and auth', 'Included in your BaaS plan'],
        limits: ['Not all npm packages are supported (different runtime)', 'May take a moment to start up on the first request', 'Limited to short-lived tasks'],
        compat: [
          { signal: 'recommended', when: [{ key: 'db_for_vercel', values: ['supabase'] }], reason: 'Already using a BaaS platform — keeping the backend there avoids managing a separate server' },
          { signal: 'incompatible', when: [{ key: 'db_for_vercel', values: ['neon', 'planetscale', 'turso', 'mongodb_atlas'] }], reason: 'BaaS functions work best alongside their own database — mixing providers adds unnecessary complexity' },
          { signal: 'incompatible', when: [{ key: 'app_type', values: ['realtime', 'ai_app'] }], reason: 'Not suitable for streaming AI responses or live connections — use a dedicated server instead' },
        ]
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
        limits: ['Long class strings in markup', 'Steep initial lookup phase'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['nextjs', 'react_vite', 'sveltekit', 'vue_nuxt'] }], reason: 'Tailwind works natively with all major frameworks' },
        ]
      },
      {
        id: 'shadcn',
        label: 'Tailwind + shadcn/ui',
        icon: '🧩',
        desc: 'Tailwind with copy-paste accessible component library (Radix UI based)',
        badge: 'Recommended for React SaaS',
        advantages: ['Beautiful accessible components out of the box', 'You own the code — no package updates breaking your UI'],
        limits: ['React only — not available for Vue or Svelte natively', 'Large initial component setup'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['nextjs', 'react_vite'] }], reason: 'shadcn/ui is built for React — full component library with zero extra dependencies' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['sveltekit'] }], reason: 'shadcn/ui is React-only — use shadcn-svelte or bits-ui for Svelte' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['vue_nuxt'] }], reason: 'shadcn/ui is React-only — use shadcn-vue or Nuxt UI for Vue' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['vanilla'] }], reason: 'shadcn/ui requires a React build setup — incompatible with vanilla HTML/JS' },
        ]
      },
      {
        id: 'shadcn_svelte',
        label: 'Tailwind + shadcn-svelte',
        icon: '🔶',
        desc: 'The Svelte port of shadcn/ui — same component quality, native Svelte syntax',
        badge: 'Recommended for SvelteKit',
        advantages: ['Accessible components built for Svelte', 'You own the code', 'Pairs with bits-ui primitives'],
        limits: ['Smaller component set than the React original', 'Less community content and examples'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['sveltekit'] }], reason: 'The native Svelte equivalent of shadcn — best component library for SvelteKit' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['nextjs', 'react_vite', 'vue_nuxt', 'vanilla'] }], reason: 'shadcn-svelte only works inside a SvelteKit project' },
        ]
      },
      {
        id: 'nuxt_ui',
        label: 'Tailwind + Nuxt UI',
        icon: '💚',
        desc: 'Official Nuxt component library — Vue-native, built on Radix Vue',
        badge: 'Recommended for Vue/Nuxt',
        advantages: ['First-party Nuxt support', 'Accessible components', 'Dark mode built-in'],
        limits: ['Vue/Nuxt only', 'Fewer community templates than shadcn'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['vue_nuxt'] }], reason: 'Official Nuxt UI is the best component library for Vue/Nuxt apps' },
          { signal: 'incompatible', when: [{ key: 'frontend_choice', values: ['nextjs', 'react_vite', 'sveltekit', 'vanilla'] }], reason: 'Nuxt UI is Vue-only — not compatible with other frameworks' },
        ]
      },
      {
        id: 'css_modules',
        label: 'CSS Modules',
        icon: '📄',
        desc: 'Scoped CSS files per component — no class name collisions',
        advantages: ['Clean separation', 'No framework lock-in', 'Plain CSS syntax'],
        limits: ['More files to manage', 'No design system by default'],
        compat: [
          { signal: 'recommended', when: [{ key: 'frontend_choice', values: ['react_vite', 'nextjs'] }], reason: 'CSS Modules are a React ecosystem staple — zero config in Vite and Next.js' },
        ]
      },
      {
        id: 'bootstrap',
        label: 'Bootstrap',
        icon: '🅱️',
        desc: 'Classic component framework with grid system',
        advantages: ['Fast to prototype', 'Massive documentation'],
        limits: ['Generic "Bootstrap look"', 'Heavy bundle', 'Less customizable than Tailwind'],
      }
    ],
    next: { '*': 'ai_integration' }
  },

  ai_integration: {
    id: 'ai_integration',
    question: 'Does your app need AI or LLM features?',
    askAI: 'I am adding AI to my web app. Explain the difference between: (1) calling OpenAI/Anthropic for chat completions, (2) RAG (retrieval-augmented generation) for searching your own documents, (3) AI agents that do multi-step tasks. Which is easiest to start with? What are the costs and risks of each?',
    type: 'single',
    options: [
      {
        id: 'no_ai',
        label: 'No AI features',
        icon: '❌',
        desc: 'Standard CRUD app — no language models needed',
        advantages: ['Simpler architecture', 'No AI API costs'],
        limits: [],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['ecommerce', 'dashboard'] }], reason: 'Most e-commerce and dashboards don\'t need AI — keeps architecture simple' },
        ]
      },
      {
        id: 'llm_chat',
        label: 'LLM Chat / Completions',
        icon: '💬',
        desc: 'Integrate OpenAI / Anthropic / Gemini for chat or text generation',
        advantages: ['Quick to add via SDK', 'Streaming responses available'],
        limits: ['API costs per token', 'Streaming needs server-sent events or WebSockets — check your platform supports it before committing'],
        compat: [
          { signal: 'incompatible', when: [{ key: 'deploy_target', values: ['vercel'] }, { key: 'backend_choice', values: ['nextjs_api'] }], reason: 'Serverless edge functions timeout at 10–30s — streaming LLM responses will get cut off on long outputs' },
          { signal: 'recommended', when: [{ key: 'deploy_target', values: ['railway', 'vps'] }], reason: 'Persistent servers handle streaming responses without timeout restrictions' },
        ]
      },
      {
        id: 'rag_vector',
        label: 'RAG / Vector Search',
        icon: '🔍',
        desc: 'Semantic search over your own documents using embeddings',
        advantages: ['App can answer questions from your own data'],
        limits: ['Need pgvector or Pinecone/Weaviate', 'Embedding generation costs', 'Adds significant architecture complexity'],
        compat: [
          { signal: 'recommended', when: [{ key: 'backend_choice', values: ['fastapi_py'] }], reason: 'Python backend gives access to LangChain, LlamaIndex, and HuggingFace for RAG pipelines' },
          { signal: 'incompatible', when: [{ key: 'backend_choice', values: ['nextjs_api', 'sveltekit_api'] }], reason: 'Serverless functions are too slow and stateless for embedding pipelines — use a persistent Python server' },
        ]
      },
      {
        id: 'agents',
        label: 'AI Agents / Multi-step tasks',
        icon: '🤖',
        desc: 'Long-running agentic workflows using tools, function calling',
        advantages: ['Automates complex workflows'],
        limits: ['Needs persistent connections — serverless hostile', 'Hard to debug', 'High token costs'],
        compat: [
          { signal: 'incompatible', when: [{ key: 'deploy_target', values: ['vercel'] }], reason: 'Serverless edge functions timeout at 10–30s — agent tasks take minutes and will be killed' },
          { signal: 'recommended', when: [{ key: 'backend_choice', values: ['fastapi_py'] }], reason: 'Python with LangGraph or CrewAI is the standard for production agent pipelines' },
        ]
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
        limits: [],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['dashboard', 'landing'] }], reason: 'Internal tools and landing pages rarely need payment processing' },
        ]
      },
      {
        id: 'stripe',
        label: 'Payment Gateway',
        icon: '💳',
        desc: 'Direct card processing — you handle checkout, they handle the transaction and fraud (e.g. Stripe, Braintree)',
        badge: 'Recommended',
        advantages: ['Excellent developer documentation', 'Webhooks make subscription state easy', 'Free until you earn money'],
        limits: ['~2.9% + fixed fee per transaction', 'Webhook endpoint must be always-on — test locally with a CLI tunnel before deploying'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas'] }], reason: 'Payment gateways handle SaaS subscriptions, trials, and invoices natively' },
          { signal: 'recommended', when: [{ key: 'app_type', values: ['ecommerce'] }], reason: 'A payment gateway is the standard choice for one-time and recurring payments' },
        ]
      },
      {
        id: 'lemon_squeezy',
        label: 'Merchant of Record',
        icon: '🍋',
        desc: 'The provider becomes the legal seller — they collect VAT, handle tax compliance, and remit globally (e.g. Lemon Squeezy, Paddle)',
        advantages: ['No global VAT/tax headache — they handle it all', 'Simple setup, faster to launch internationally'],
        limits: ['Higher fees than a direct payment gateway', 'Less flexible for complex billing scenarios'],
        compat: [
          { signal: 'recommended', when: [{ key: 'app_type', values: ['saas'] }], reason: 'MoR model removes global VAT/tax complexity — ideal for indie SaaS with international users' },
        ]
      }
    ],
    next: { '*': 'done' }
  },

};

// ─── COMPATIBILITY EVALUATOR ─────────────────────────────────────────────────

export function getCompatSignal(
  opt: FlowOption,
  answers: AnswerMap
): { signal: 'recommended' | 'incompatible' | 'neutral'; reason: string } {
  if (!opt.compat || opt.compat.length === 0) return { signal: 'neutral', reason: '' };

  for (const rule of opt.compat) {
    const allMatch = rule.when.every(cond => {
      const val = answers[cond.key];
      if (Array.isArray(val)) return val.some(v => cond.values.includes(v));
      return val !== undefined && cond.values.includes(val as string);
    });
    if (allMatch) return { signal: rule.signal, reason: rule.reason };
  }

  return { signal: 'neutral', reason: '' };
}

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

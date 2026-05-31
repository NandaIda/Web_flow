/**
 * Tool knowledge base — plain-English explanations for every major tool.
 * Used by the flowchart node tooltips and the glossary.
 */

export interface ToolInfo {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'auth' | 'deployment' | 'process' | 'proxy' | 'monitoring' | 'styling' | 'build';
  emoji: string;
  tagline: string;
  what: string;         // plain-English "what is this?"
  why: string;          // "why does it exist / when do you need it?"
  beginner: string;     // direct advice for a beginner
  alternatives: string[];
  usedWith: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  docsUrl?: string;
}

export const TOOL_KNOWLEDGE: Record<string, ToolInfo> = {

  // ── FRONTEND ──────────────────────────────────────────────────────────────

  react: {
    id: 'react',
    name: 'React',
    category: 'frontend',
    emoji: '⚛️',
    tagline: 'UI component library by Meta',
    what: 'React is a JavaScript library for building user interfaces. You break your page into reusable pieces called "components" (like a Button, a Navbar, a ProductCard). When data changes, React only updates the parts of the page that changed — not the whole page.',
    why: 'Without React (or a similar tool), updating the DOM manually with vanilla JS gets messy and slow. React makes dynamic, interactive UIs manageable at scale.',
    beginner: 'Start with React + Vite. Learn components, props, and useState before anything else. Avoid class components — use functional components with hooks.',
    alternatives: ['Vue', 'Svelte', 'Angular', 'SolidJS'],
    usedWith: ['Vite', 'Next.js', 'TypeScript', 'Tailwind CSS', 'React Router'],
    difficulty: 'Beginner',
  },

  nextjs: {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    emoji: '▲',
    tagline: 'Full-stack React framework by Vercel',
    what: 'Next.js is a framework built on top of React that adds server-side rendering (SSR), static site generation (SSG), API routes, and file-based routing. You write React code but get much more out of the box.',
    why: 'Plain React apps are "SPA" — everything runs in the browser. Next.js can render pages on the server before sending them to the browser, which is faster and better for SEO. It also lets you write backend API code in the same project.',
    beginner: 'Use Next.js if you want to build a full-stack app without managing a separate backend server. The App Router (Next.js 13+) is the modern approach — learn it instead of the older Pages Router.',
    alternatives: ['Remix', 'SvelteKit', 'Nuxt (for Vue)'],
    usedWith: ['Vercel', 'TypeScript', 'Tailwind CSS', 'Prisma', 'Auth.js'],
    difficulty: 'Intermediate',
  },

  vue: {
    id: 'vue',
    name: 'Vue',
    category: 'frontend',
    emoji: '💚',
    tagline: 'Progressive JavaScript framework',
    what: 'Vue is a frontend framework similar to React but with a different syntax. Vue uses "Single File Components" (.vue files) that combine HTML template, JavaScript logic, and CSS scoped styles in one file.',
    why: 'Many developers find Vue easier to learn than React because its template syntax is closer to plain HTML. It has great official tools (Pinia for state, Vue Router for routing).',
    beginner: 'Choose Vue if you prefer template-style syntax over JSX. Use Vite + Vue 3 with the Composition API.',
    alternatives: ['React', 'Svelte', 'Angular'],
    usedWith: ['Vite', 'Pinia', 'Vue Router', 'TypeScript'],
    difficulty: 'Beginner',
  },

  svelte: {
    id: 'svelte',
    name: 'Svelte / SvelteKit',
    category: 'frontend',
    emoji: '🔶',
    tagline: 'Compiler-first frontend framework',
    what: 'Svelte is a frontend framework that compiles your code at build time into tiny vanilla JavaScript — no runtime library. This makes Svelte apps very small and fast. SvelteKit adds routing, SSR, and full-stack capabilities.',
    why: 'React and Vue need a runtime library to run in the browser. Svelte compiles away into pure JS so the bundle size is smaller and page speed is faster.',
    beginner: 'Svelte has the cleanest syntax of any frontend framework. Great choice if you want fast pages and small bundles. Use SvelteKit for full-stack.',
    alternatives: ['React', 'Vue', 'SolidJS'],
    usedWith: ['Vite', 'TypeScript', 'Tailwind CSS'],
    difficulty: 'Beginner',
  },

  // ── BUILD TOOLS ───────────────────────────────────────────────────────────

  vite: {
    id: 'vite',
    name: 'Vite',
    category: 'build',
    emoji: '⚡',
    tagline: 'Next-generation frontend build tool',
    what: 'Vite is a build tool that bundles and compiles your frontend code. During development, it starts instantly using native ES modules. For production, it uses Rollup to create an optimized bundle.',
    why: 'Webpack (the old standard) was slow — large projects took 30–60 seconds to start. Vite starts in under a second by only loading files you actually use. It handles TypeScript, JSX, CSS, and assets automatically.',
    beginner: 'Use Vite for any React, Vue, or Svelte project that is NOT Next.js or SvelteKit (those have their own bundlers). Run `npm create vite@latest`.',
    alternatives: ['Webpack', 'Parcel', 'Turbopack', 'esbuild'],
    usedWith: ['React', 'Vue', 'Svelte', 'TypeScript', 'Tailwind CSS'],
    difficulty: 'Beginner',
  },

  // ── STYLING ───────────────────────────────────────────────────────────────

  tailwind: {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'styling',
    emoji: '🎨',
    tagline: 'Utility-first CSS framework',
    what: 'Tailwind CSS gives you hundreds of pre-defined CSS classes like `flex`, `p-4`, `text-blue-600`, `rounded-lg` that you apply directly in your HTML/JSX. Instead of writing custom CSS files, you compose styles using these utility classes.',
    why: 'Writing traditional CSS requires constantly switching between HTML and CSS files, naming classes, and fighting specificity conflicts. Tailwind keeps styles co-located with markup and eliminates the need to invent class names.',
    beginner: 'Use Tailwind with the Tailwind CSS IntelliSense VS Code extension — it autocompletes every class. Install via `npm install -D tailwindcss`.',
    alternatives: ['Bootstrap', 'CSS Modules', 'Styled Components', 'Sass'],
    usedWith: ['React', 'Next.js', 'Vite', 'shadcn/ui'],
    difficulty: 'Beginner',
  },

  shadcn: {
    id: 'shadcn',
    name: 'shadcn/ui',
    category: 'styling',
    emoji: '🧩',
    tagline: 'Copy-paste accessible component library',
    what: 'shadcn/ui is a collection of accessible React components (buttons, dialogs, dropdowns, tables, etc.) built with Tailwind CSS and Radix UI primitives. You copy the component source code directly into your project — you own it completely.',
    why: 'Other UI libraries (like MUI or Chakra) install as packages, and you are stuck with their design decisions. shadcn gives you the full source code to customize however you want.',
    beginner: 'Use shadcn/ui with Next.js or Vite + React when you want professional-looking components without writing everything from scratch. Run `npx shadcn@latest init`.',
    alternatives: ['MUI', 'Chakra UI', 'DaisyUI', 'Radix UI'],
    usedWith: ['React', 'Next.js', 'Tailwind CSS'],
    difficulty: 'Beginner',
  },

  // ── BACKEND FRAMEWORKS ────────────────────────────────────────────────────

  express: {
    id: 'express',
    name: 'Express',
    category: 'backend',
    emoji: '🟨',
    tagline: 'Minimal Node.js web framework',
    what: 'Express is a lightweight Node.js framework for creating web servers and API routes. You define routes like `app.get("/users", ...)` and Express handles the incoming HTTP request and sends back a response.',
    why: 'Node.js alone can create a web server but it requires a lot of boilerplate. Express simplifies routing, middleware, and request/response handling into a clean API.',
    beginner: 'Express is the most common Node.js backend framework. Learn it before NestJS. It teaches you HTTP fundamentals directly. Start with: `app.get()`, `app.post()`, `req.body`, `res.json()`.',
    alternatives: ['Fastify', 'NestJS', 'Koa', 'Hono'],
    usedWith: ['Node.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'PM2'],
    difficulty: 'Beginner',
  },

  fastapi: {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    emoji: '🐍',
    tagline: 'Fast async Python web framework',
    what: 'FastAPI is a modern Python web framework for building APIs. It uses Python type hints to automatically validate request data and generate interactive API documentation (Swagger UI). It is async-first, which means it handles many requests efficiently.',
    why: 'Django is great but heavy. Flask is lightweight but gives no structure. FastAPI hits the sweet spot — lightweight, fast, and type-safe. It is the best Python choice for AI/ML backends because it integrates easily with PyTorch, Hugging Face, etc.',
    beginner: 'Use FastAPI if you know Python and are building an API. Run with Uvicorn: `uvicorn main:app --reload`. The auto-generated `/docs` page is very helpful for testing.',
    alternatives: ['Django REST Framework', 'Flask', 'Litestar'],
    usedWith: ['Python', 'Uvicorn', 'PostgreSQL', 'SQLAlchemy', 'Pydantic'],
    difficulty: 'Intermediate',
  },

  django: {
    id: 'django',
    name: 'Django',
    category: 'backend',
    emoji: '🐍',
    tagline: 'Batteries-included Python web framework',
    what: 'Django is a full-featured Python web framework that includes an ORM, admin panel, auth system, form handling, and more out of the box. The phrase "batteries included" means you rarely need to install extra packages.',
    why: 'Building an app with Flask or FastAPI means assembling many separate pieces. Django includes everything. This makes it very productive for business apps, admin tools, and projects where you need many features quickly.',
    beginner: 'Django has a steeper initial learning curve due to its structure, but you get a lot for free. Its built-in admin panel at `/admin` alone saves days of work. Use Django REST Framework for APIs.',
    alternatives: ['FastAPI', 'Flask', 'Rails (Ruby)'],
    usedWith: ['Python', 'Gunicorn', 'PostgreSQL', 'Django REST Framework', 'Nginx'],
    difficulty: 'Intermediate',
  },

  // ── DATABASES ─────────────────────────────────────────────────────────────

  postgres: {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'database',
    emoji: '🐘',
    tagline: 'The world\'s most advanced open-source database',
    what: 'PostgreSQL (Postgres) is a relational database that stores data in tables with rows and columns — like a spreadsheet that enforces strict rules. Tables can reference each other (e.g. Orders reference a User). It uses SQL to query data.',
    why: 'PostgreSQL is the default choice for serious web apps because it handles complex queries, maintains data integrity, supports ACID transactions, and scales well. It also supports JSON, arrays, full-text search, and vector extensions.',
    beginner: 'Every full-stack developer should learn PostgreSQL. Install it locally with Docker: `docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres`. Use a GUI like TablePlus or pgAdmin to explore your data.',
    alternatives: ['MySQL', 'SQLite', 'MongoDB', 'CockroachDB'],
    usedWith: ['Prisma', 'pg', 'Drizzle', 'Supabase', 'Express', 'Django'],
    difficulty: 'Beginner',
  },

  mysql: {
    id: 'mysql',
    name: 'MySQL / MariaDB',
    category: 'database',
    emoji: '🐬',
    tagline: 'Classic relational database',
    what: 'MySQL is a relational database, similar to PostgreSQL. It uses SQL and stores data in tables. MariaDB is a fork of MySQL that is fully compatible but community-maintained.',
    why: 'MySQL has been the standard database for PHP/WordPress applications for decades. It is simple to set up, widely supported by shared hosting, and good for read-heavy workloads.',
    beginner: 'For new projects, prefer PostgreSQL over MySQL — it has more features and better JSON support. Use MySQL if your hosting provider requires it, or if you are working with a Laravel codebase.',
    alternatives: ['PostgreSQL', 'SQLite', 'MariaDB'],
    usedWith: ['PHP', 'Laravel', 'Django', 'Sequelize'],
    difficulty: 'Beginner',
  },

  sqlite: {
    id: 'sqlite',
    name: 'SQLite',
    category: 'database',
    emoji: '📁',
    tagline: 'Serverless file-based SQL database',
    what: 'SQLite is a relational database stored as a single file on disk. There is no separate database server process — the database lives in a `.db` file alongside your application code.',
    why: 'SQLite requires zero setup or configuration. It is built into Python and available everywhere. Perfect for development, prototypes, CLI tools, mobile apps, and small sites that do not need concurrent writes.',
    beginner: 'Use SQLite when you are just learning or building a prototype. Do not use it in production if multiple server processes need to write simultaneously — use PostgreSQL instead.',
    alternatives: ['PostgreSQL', 'MySQL'],
    usedWith: ['Python', 'PHP', 'Prisma', 'Turso (SQLite at edge)'],
    difficulty: 'Beginner',
  },

  mongodb: {
    id: 'mongodb',
    name: 'MongoDB',
    category: 'database',
    emoji: '🍃',
    tagline: 'NoSQL document database',
    what: 'MongoDB stores data as JSON-like "documents" instead of rows in tables. A document can have any structure — nested objects, arrays, mixed types — without a fixed schema. Documents are grouped into "collections" instead of tables.',
    why: 'Relational databases require you to define a strict schema before inserting data. MongoDB lets you insert any shape of data immediately. This makes early prototyping fast, but can become chaotic at scale without discipline.',
    beginner: 'MongoDB is popular in the MERN stack. Be careful — the flexibility is also a trap. Without enforcing schema at the application layer (e.g. Mongoose), data inconsistency creeps in. For most apps, PostgreSQL is a safer choice.',
    alternatives: ['PostgreSQL (with JSONB)', 'DynamoDB', 'Firestore'],
    usedWith: ['Node.js', 'Express', 'Mongoose', 'React'],
    difficulty: 'Beginner',
  },

  // ── AUTH ──────────────────────────────────────────────────────────────────

  nextauth: {
    id: 'nextauth',
    name: 'Auth.js / NextAuth',
    category: 'auth',
    emoji: '🔒',
    tagline: 'Authentication for the web',
    what: 'Auth.js (formerly NextAuth.js) is an authentication library for JavaScript apps. It handles OAuth logins (Google, GitHub, etc.), email/password sessions, magic links, JWT tokens, and database session storage.',
    why: 'Building auth from scratch is one of the most common sources of security vulnerabilities. Auth.js handles the complexity of OAuth flows, token rotation, session management, and CSRF protection for you.',
    beginner: 'Use Auth.js with Next.js for the easiest setup. Add `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` to your .env. Takes about 30 minutes to get Google login working.',
    alternatives: ['Clerk', 'Lucia', 'Supabase Auth', 'Better Auth'],
    usedWith: ['Next.js', 'Prisma', 'PostgreSQL', 'TypeScript'],
    difficulty: 'Intermediate',
  },

  clerk: {
    id: 'clerk',
    name: 'Clerk',
    category: 'auth',
    emoji: '🧑‍💼',
    tagline: 'Drop-in auth with pre-built UI',
    what: 'Clerk is a managed authentication service that provides pre-built sign-in/sign-up UI components, user management dashboard, MFA, SSO, and organization features. You embed their components into your app.',
    why: 'Auth.js requires configuring adapters, callbacks, and DB schemas. Clerk works out of the box — wrap your app in `<ClerkProvider>` and add `<SignIn />`. The hosted user dashboard handles all user management.',
    beginner: 'Clerk is the fastest way to add professional auth to a Next.js app. Free tier supports 10,000 monthly active users. After that, $25/month. Good choice for MVPs and growing startups.',
    alternatives: ['Auth.js', 'Supabase Auth', 'Firebase Auth', 'Lucia'],
    usedWith: ['Next.js', 'React', 'TypeScript'],
    difficulty: 'Beginner',
  },

  supabase_auth: {
    id: 'supabase_auth',
    name: 'Supabase Auth',
    category: 'auth',
    emoji: '🟢',
    tagline: 'Auth built into your Postgres database',
    what: 'Supabase Auth is an authentication service included with every Supabase project. It stores users in your PostgreSQL database and supports email/password, magic links, Google, GitHub, Discord, and phone OTP.',
    why: 'When you use Supabase as your database, using Supabase Auth means users are stored right next to your app data. You get Row-Level Security (RLS) — database policies that restrict what data each user can see directly at the database level.',
    beginner: 'If you are already using Supabase for your database, using Supabase Auth is the natural choice. The `@supabase/auth-helpers-nextjs` package integrates it cleanly with Next.js.',
    alternatives: ['Clerk', 'Auth.js', 'Firebase Auth'],
    usedWith: ['Supabase', 'Next.js', 'React', 'PostgreSQL'],
    difficulty: 'Beginner',
  },

  // ── DEPLOYMENT ────────────────────────────────────────────────────────────

  vercel: {
    id: 'vercel',
    name: 'Vercel',
    category: 'deployment',
    emoji: '▲',
    tagline: 'Serverless cloud platform for frontend and fullstack',
    what: 'Vercel is a cloud platform that deploys your app directly from a GitHub repository. Push code → Vercel builds and deploys automatically. It runs your server code as serverless functions (short-lived, request-scoped).',
    why: 'Traditional hosting requires configuring a server, setting up SSL, managing Nginx, etc. Vercel handles all of that automatically. It is the fastest way to go from code to live URL.',
    beginner: 'The free tier is excellent for personal projects and small SaaS. Critical limit: serverless functions timeout at 10 seconds on the free plan. This means no WebSockets, no long AI streaming without upgrading.',
    alternatives: ['Netlify', 'Railway', 'Render', 'Cloudflare Pages'],
    usedWith: ['Next.js', 'React', 'Svelte', 'PostgreSQL (via Neon or Supabase)'],
    difficulty: 'Beginner',
  },

  railway: {
    id: 'railway',
    name: 'Railway / Render',
    category: 'deployment',
    emoji: '🚂',
    tagline: 'Managed container PaaS',
    what: 'Railway and Render are "Platform as a Service" (PaaS) providers. You push your code and they run it inside a persistent container (not serverless). Your server stays running 24/7, with no cold starts.',
    why: 'Unlike Vercel\'s serverless functions, Railway/Render containers support WebSockets, long-running processes, background jobs, and persistent in-memory state. They are better for full-stack apps with a separate backend.',
    beginner: 'Railway is easier to set up than a VPS and cheaper than AWS. Free tier on Render sleeps after 30 minutes of inactivity — upgrade to $7/month for always-on. Use for backend APIs and full-stack apps.',
    alternatives: ['Fly.io', 'Vercel', 'Heroku', 'VPS'],
    usedWith: ['Express', 'FastAPI', 'Django', 'PostgreSQL', 'Node.js'],
    difficulty: 'Beginner',
  },

  vps: {
    id: 'vps',
    name: 'VPS (Linux Server)',
    category: 'deployment',
    emoji: '🖥️',
    tagline: 'Your own Linux server in the cloud',
    what: 'A VPS (Virtual Private Server) is a rented Linux machine in a data center. You connect via SSH, install whatever software you want, and configure everything manually. Providers include DigitalOcean, Hetzner, Linode, and Vultr.',
    why: 'VPS gives you maximum control and lowest cost at scale. A Hetzner VPS costs €4/month and can run multiple apps, databases, background workers, and cron jobs. No function timeouts, no sleep mode, no vendor lock-in.',
    beginner: 'A VPS requires Linux terminal skills — you need to know how to SSH, install packages (apt), configure Nginx, manage firewalls (ufw), and use PM2 or systemd. Start with Railway/Render first, then graduate to VPS.',
    alternatives: ['Railway', 'Render', 'Fly.io', 'AWS EC2'],
    usedWith: ['Nginx', 'PM2', 'Docker', 'Certbot (SSL)', 'Systemd'],
    difficulty: 'Intermediate',
  },

  supabase: {
    id: 'supabase',
    name: 'Supabase',
    category: 'deployment',
    emoji: '🟢',
    tagline: 'Open-source Firebase alternative',
    what: 'Supabase provides a managed PostgreSQL database, authentication, file storage, realtime subscriptions, and edge functions — all in one platform with a generous free tier. You connect to it from your frontend using the Supabase JS client.',
    why: 'Building all these features yourself (database + auth + storage + realtime) would take weeks. Supabase provides them instantly. It is especially popular for MVPs and indie hackers who want to ship fast.',
    beginner: 'Use Supabase when you want a full backend without writing backend code. The free tier includes 500MB database, 1GB storage, and 50k monthly active users. After 1 week of inactivity, free projects pause.',
    alternatives: ['Firebase', 'PlanetScale', 'Neon + Auth.js'],
    usedWith: ['Next.js', 'React', 'Vercel', 'Prisma'],
    difficulty: 'Beginner',
  },

  // ── PROCESS MANAGERS ─────────────────────────────────────────────────────

  pm2: {
    id: 'pm2',
    name: 'PM2',
    category: 'process',
    emoji: '🔄',
    tagline: 'Production process manager for Node.js',
    what: 'PM2 keeps your Node.js app running in the background on a Linux server. When your app crashes, PM2 automatically restarts it. It also handles clustering (running multiple instances across CPU cores), log management, and startup scripts.',
    why: 'If you start Node.js with `node server.js` and close the terminal, the process dies. PM2 daemonizes the process so it keeps running. It also auto-restarts on crash — critical for production.',
    beginner: 'PM2 is the standard tool for Node.js on VPS. Learn these commands: `pm2 start server.js --name myapp`, `pm2 logs myapp`, `pm2 status`, `pm2 restart myapp`, `pm2 startup` (auto-start after reboot).',
    alternatives: ['systemd', 'Docker', 'Supervisor'],
    usedWith: ['Node.js', 'Express', 'Next.js', 'Nginx', 'VPS'],
    difficulty: 'Beginner',
  },

  systemd: {
    id: 'systemd',
    name: 'systemd',
    category: 'process',
    emoji: '🐧',
    tagline: 'Linux init system and service manager',
    what: 'systemd is the init system built into most Linux distributions. It manages all background processes (services) on the server. You write a `.service` unit file that tells systemd how to start, stop, and restart your app.',
    why: 'PM2 is Node.js-specific. For Go, Rust, or Python (with Gunicorn/Uvicorn) binaries, systemd is the native way to manage production processes. It integrates with Linux journald for log storage.',
    beginner: 'Use systemd instead of PM2 for non-Node.js apps. The learning curve is slightly higher — you write `.service` files manually. But every Linux admin knows systemd, making it the professional standard.',
    alternatives: ['PM2', 'Supervisor', 'Docker'],
    usedWith: ['Go', 'Rust', 'Python (Gunicorn/Uvicorn)', 'VPS'],
    difficulty: 'Intermediate',
  },

  gunicorn: {
    id: 'gunicorn',
    name: 'Gunicorn',
    category: 'process',
    emoji: '🦄',
    tagline: 'Python WSGI HTTP server for production',
    what: 'Gunicorn (Green Unicorn) is a Python HTTP server that runs Django and Flask apps in production. It creates multiple "worker" processes that handle incoming requests in parallel. Run: `gunicorn myapp.wsgi:application --workers 4`.',
    why: 'Django\'s built-in development server (`manage.py runserver`) is not production-safe — it handles one request at a time and has no crash recovery. Gunicorn makes your app handle multiple concurrent requests reliably.',
    beginner: 'Use Gunicorn with Django or Flask on a VPS. Pair it with Nginx (Nginx receives requests → forwards to Gunicorn). For async frameworks like FastAPI, use Uvicorn instead.',
    alternatives: ['Uvicorn', 'Daphne', 'uWSGI'],
    usedWith: ['Django', 'Flask', 'Nginx', 'systemd', 'VPS'],
    difficulty: 'Intermediate',
  },

  uvicorn: {
    id: 'uvicorn',
    name: 'Uvicorn',
    category: 'process',
    emoji: '🦄',
    tagline: 'ASGI server for async Python apps',
    what: 'Uvicorn is an ASGI (Asynchronous Server Gateway Interface) server for running async Python frameworks like FastAPI and Starlette in production. It handles WebSockets, long-polling, and asynchronous requests efficiently.',
    why: 'FastAPI uses async Python (ASGI) — traditional WSGI servers like Gunicorn cannot handle async code properly. Uvicorn is purpose-built for async frameworks. For production, run: `gunicorn -k uvicorn.workers.UvicornWorker`.',
    beginner: 'Use Uvicorn for FastAPI. In development: `uvicorn main:app --reload`. In production: combine with Gunicorn for process management: `gunicorn main:app -k uvicorn.workers.UvicornWorker -w 4`.',
    alternatives: ['Gunicorn', 'Hypercorn', 'Daphne'],
    usedWith: ['FastAPI', 'Starlette', 'Nginx', 'systemd'],
    difficulty: 'Intermediate',
  },

  // ── PROXY ─────────────────────────────────────────────────────────────────

  nginx: {
    id: 'nginx',
    name: 'Nginx',
    category: 'proxy',
    emoji: '🌐',
    tagline: 'High-performance reverse proxy and web server',
    what: 'Nginx sits in front of your application server (Express, Gunicorn, etc.) and handles incoming web traffic on ports 80 (HTTP) and 443 (HTTPS). It forwards requests to your app on a local port (e.g. 3000), serves static files, handles SSL termination, and can load-balance across multiple app instances.',
    why: 'You should never expose your app port (3000, 8000, etc.) directly to the internet. Nginx acts as a secure gateway: handles HTTPS, blocks malformed requests, caches static assets, and protects your app from direct exposure.',
    beginner: 'Nginx config can be intimidating at first. The key directive is `proxy_pass http://localhost:3000;` which forwards traffic to your app. Use Certbot to auto-configure SSL with Let\'s Encrypt.',
    alternatives: ['Caddy', 'Traefik', 'Apache', 'HAProxy'],
    usedWith: ['Express', 'Gunicorn', 'Uvicorn', 'PM2', 'Certbot', 'VPS'],
    difficulty: 'Intermediate',
  },

  caddy: {
    id: 'caddy',
    name: 'Caddy',
    category: 'proxy',
    emoji: '🦡',
    tagline: 'Modern web server with automatic HTTPS',
    what: 'Caddy is a web server and reverse proxy similar to Nginx, but it automatically manages HTTPS certificates using Let\'s Encrypt with zero configuration. Your Caddyfile is much simpler than Nginx config.',
    why: 'Nginx requires running Certbot separately to get/renew SSL certificates. Caddy handles certificate issuance and renewal automatically — just point your domain at the server and Caddy does the rest.',
    beginner: 'Caddy is the beginner-friendly alternative to Nginx. The config for a basic proxy is 3 lines. Use Caddy if you want HTTPS without managing Certbot.',
    alternatives: ['Nginx', 'Traefik', 'Apache'],
    usedWith: ['Express', 'FastAPI', 'Django', 'VPS'],
    difficulty: 'Beginner',
  },

  // ── MONITORING ────────────────────────────────────────────────────────────

  sentry: {
    id: 'sentry',
    name: 'Sentry',
    category: 'monitoring',
    emoji: '🐛',
    tagline: 'Error monitoring and performance tracking',
    what: 'Sentry captures JavaScript errors, exceptions, and performance issues from your live app and sends you alerts. When a user encounters a crash, Sentry records the full stack trace, the user\'s browser, the URL, and recent actions.',
    why: 'Without monitoring, you only find bugs when users complain. Sentry shows you errors the moment they happen, with full context, so you can fix them before they become widespread.',
    beginner: 'Add Sentry to any app with `npm install @sentry/react` (or `@sentry/node`). Free tier: 5,000 errors/month. Takes 10 minutes to set up and immediately makes your app more professional.',
    alternatives: ['Bugsnag', 'Rollbar', 'Datadog', 'LogRocket'],
    usedWith: ['React', 'Next.js', 'Express', 'FastAPI', 'Any production app'],
    difficulty: 'Beginner',
  },

  // ── ORMS ──────────────────────────────────────────────────────────────────

  prisma: {
    id: 'prisma',
    name: 'Prisma',
    category: 'backend',
    emoji: '▲',
    tagline: 'Next-generation ORM for Node.js',
    what: 'Prisma is an ORM (Object-Relational Mapper) for Node.js and TypeScript. You define your database schema in a `schema.prisma` file, and Prisma generates a type-safe client. Instead of writing SQL, you write: `prisma.user.findMany({ where: { active: true } })`.',
    why: 'Writing raw SQL in your Node.js code is error-prone and lacks type safety. Prisma gives you full TypeScript autocomplete for every query, auto-generates migrations, and prevents common SQL mistakes.',
    beginner: 'Prisma is the recommended ORM for any TypeScript/Node.js backend. Run `npx prisma init` to start. Edit `schema.prisma` to define your models, then run `npx prisma migrate dev` to create the database tables.',
    alternatives: ['Drizzle ORM', 'TypeORM', 'Sequelize', 'Knex', 'pg (raw)'],
    usedWith: ['TypeScript', 'Node.js', 'Express', 'Next.js', 'PostgreSQL'],
    difficulty: 'Beginner',
  },

};

// ─── LEARNING ROADMAP ─────────────────────────────────────────────────────────

export interface RoadmapStep {
  step: number;
  title: string;
  why: string;
  miniProject: string;
  tools: string[];
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'frontend' | 'backend' | 'database' | 'deployment' | 'fullstack';
}

export const LEARNING_ROADMAP: RoadmapStep[] = [
  {
    step: 1,
    title: 'HTML & CSS Basics',
    why: 'Every web page is HTML structure + CSS styling. You cannot skip this even if you use React.',
    miniProject: 'Build a personal profile page with a photo, bio, and links.',
    tools: ['HTML', 'CSS'],
    estimatedTime: '1–2 weeks',
    difficulty: 'Beginner',
    category: 'frontend',
  },
  {
    step: 2,
    title: 'JavaScript Fundamentals',
    why: 'JavaScript is the only programming language that runs in the browser. React is just JavaScript — if you skip JS fundamentals, React will confuse you.',
    miniProject: 'Build a to-do list that adds and removes items without any framework.',
    tools: ['JavaScript', 'DOM API'],
    estimatedTime: '2–4 weeks',
    difficulty: 'Beginner',
    category: 'frontend',
  },
  {
    step: 3,
    title: 'React Basics',
    why: 'React is the most-used frontend library in the industry. Components, props, and state are the building blocks of every modern web UI.',
    miniProject: 'Build a weather app that fetches data from a public API and displays it.',
    tools: ['React', 'Vite', 'useState', 'useEffect', 'fetch API'],
    estimatedTime: '2–3 weeks',
    difficulty: 'Beginner',
    category: 'frontend',
  },
  {
    step: 4,
    title: 'TypeScript Basics',
    why: 'TypeScript adds types to JavaScript. It catches bugs before you run the code, makes your editor smarter, and is now standard in professional codebases.',
    miniProject: 'Convert your weather app to TypeScript — add types to all props and API responses.',
    tools: ['TypeScript'],
    estimatedTime: '1–2 weeks',
    difficulty: 'Beginner',
    category: 'frontend',
  },
  {
    step: 5,
    title: 'Tailwind CSS',
    why: 'Tailwind speeds up UI development dramatically. Understanding utility-first CSS makes you faster at building interfaces.',
    miniProject: 'Build a responsive product card grid with dark/light variants.',
    tools: ['Tailwind CSS'],
    estimatedTime: '3–5 days',
    difficulty: 'Beginner',
    category: 'frontend',
  },
  {
    step: 6,
    title: 'REST API Concepts',
    why: 'REST APIs are how your frontend talks to your backend. Understanding HTTP methods (GET, POST, PUT, DELETE), status codes, and JSON payloads is essential.',
    miniProject: 'Use fetch/axios to call a real REST API (like GitHub or OpenWeather) and display the data.',
    tools: ['REST', 'HTTP', 'JSON', 'fetch API'],
    estimatedTime: '3–5 days',
    difficulty: 'Beginner',
    category: 'fullstack',
  },
  {
    step: 7,
    title: 'Node.js & Express',
    why: 'Node.js lets JavaScript run on the server. Express adds routing and middleware so you can build a real API backend.',
    miniProject: 'Build a simple REST API with 3 routes: GET /users, POST /users, DELETE /users/:id. Store data in memory (an array).',
    tools: ['Node.js', 'Express', 'TypeScript'],
    estimatedTime: '1–2 weeks',
    difficulty: 'Beginner',
    category: 'backend',
  },
  {
    step: 8,
    title: 'PostgreSQL & Prisma',
    why: 'Your API needs a real database to persist data. PostgreSQL is the standard choice. Prisma makes it easy to query PostgreSQL from TypeScript.',
    miniProject: 'Add a PostgreSQL database to your Express API. Store users in a real database table instead of memory.',
    tools: ['PostgreSQL', 'Prisma', 'Docker'],
    estimatedTime: '1–2 weeks',
    difficulty: 'Beginner',
    category: 'database',
  },
  {
    step: 9,
    title: 'Connect Frontend to Backend',
    why: 'This is the full-stack moment — your React app calls your Express API which queries PostgreSQL. This is how every production web app works.',
    miniProject: 'Build a full CRUD app: React frontend + Express backend + PostgreSQL. Users can create, read, update, and delete items.',
    tools: ['React', 'Express', 'PostgreSQL', 'Axios', 'CORS'],
    estimatedTime: '1–2 weeks',
    difficulty: 'Intermediate',
    category: 'fullstack',
  },
  {
    step: 10,
    title: 'Authentication',
    why: 'Almost every real app needs user accounts. Authentication covers sign-up, login, session/token management, and protected routes.',
    miniProject: 'Add email+password login to your full-stack app. Protect certain routes so only logged-in users can access them.',
    tools: ['Auth.js', 'JWT', 'bcrypt', 'Sessions', 'Cookies'],
    estimatedTime: '1–2 weeks',
    difficulty: 'Intermediate',
    category: 'fullstack',
  },
  {
    step: 11,
    title: 'Deploy Your App',
    why: 'A project only lives on localhost until you deploy it. Deployment teaches you environment variables, build processes, and real-world gotchas.',
    miniProject: 'Deploy your full-stack app: frontend to Vercel, backend to Railway or Render. Set up environment variables on each platform.',
    tools: ['Vercel', 'Railway', 'Render', 'Environment variables'],
    estimatedTime: '3–5 days',
    difficulty: 'Intermediate',
    category: 'deployment',
  },
  {
    step: 12,
    title: 'VPS & PM2 (Production)',
    why: 'Managed platforms (Railway, Render) are convenient but expensive at scale. A VPS gives you full control for much less money.',
    miniProject: 'Deploy your backend to a $5 VPS. Set up PM2, Nginx, and automatic HTTPS with Certbot.',
    tools: ['Linux', 'PM2', 'Nginx', 'Certbot', 'SSH', 'DigitalOcean'],
    estimatedTime: '1 week',
    difficulty: 'Intermediate',
    category: 'deployment',
  },
  {
    step: 13,
    title: 'Error Monitoring',
    why: 'In production, users encounter bugs you never saw in development. Sentry captures real errors from real users so you can fix them.',
    miniProject: 'Add Sentry to your frontend and backend. Trigger a test error and see it appear in the Sentry dashboard.',
    tools: ['Sentry', 'Logging'],
    estimatedTime: '1–2 days',
    difficulty: 'Beginner',
    category: 'deployment',
  },
];

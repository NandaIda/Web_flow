import { DecisionStep } from '../types';

export const DECISION_STEPS: DecisionStep[] = [
  {
    step: 1,
    title: 'Frontend Choice',
    subtitle: 'Where does the user interface live?',
    options: [
      {
        id: 'react',
        label: 'React + TypeScript',
        desc: 'Industry standard, enormous ecosystem, brilliant component ecosystem, robust state managers.',
        badge: 'Recommended',
        pros: ['Largest job market', 'Endless libraries & tools', 'Perfect for dashboards'],
        cons: ['Requires build step', 'State management clutter'],
        recommended: true,
        popularity: 68
      },
      {
        id: 'vue',
        label: 'Vue + TypeScript',
        desc: 'Highly approachable reactive syntax, great official documentation, cohesive ecosystem.',
        pros: ['Great official state/router', 'Smooth learning curve', 'Excellent reactivity'],
        cons: ['Fewer corporate resources', 'Ecosystem slightly fragmented'],
        popularity: 18
      },
      {
        id: 'svelte',
        label: 'Svelte / SvelteKit',
        desc: 'Compiles away to tiny runtime-free vanilla JS, no Virtual DOM, incredibly clean syntax.',
        pros: ['Microscopic outputs', 'Outstanding animations', 'Reactive variables standard'],
        cons: ['Smaller community size', 'Fewer global UI components prebuilt'],
        popularity: 9
      },
      {
        id: 'angular',
        label: 'Angular',
        desc: 'Enterprise batteries-included framework by Google with strict OOP structure and file generation.',
        pros: ['Stunning code consistency', 'Robust built-in dependency injection', 'Great for massive squads'],
        cons: ['Heavy bundle sizes', 'Very steep initial learning curve'],
        popularity: 4
      },
      {
        id: 'html5',
        label: 'Plain HTML + JS + CSS',
        desc: 'Old school simple. No compilation step required, zero framework overhead, direct DOM manipulation.',
        pros: ['Zero configuration needed', 'Instant load speeds', 'Perfect for tiny landing pages'],
        cons: ['Painful dynamic state handling', 'No modern component reuse models'],
        popularity: 1
      }
    ]
  },
  {
    step: 2,
    title: 'Build Tool / Bundler',
    subtitle: 'What bundles and transpiles your code at dev-time?',
    options: [
      {
        id: 'vite',
        label: 'Vite',
        desc: 'Ultra-fast ES-modules driven dev compiler. Replaces bloated complex webpack tools.',
        badge: 'Recommended',
        pros: ['Instant dev start speeds', 'Rich modern plugin list', 'Built-in TS support'],
        cons: ['Requires slight config updates', 'Can vary from custom servers'],
        recommended: true,
        popularity: 82
      },
      {
        id: 'angular-cli',
        label: 'Angular CLI (Webpack)',
        desc: 'The official packaging builder specified by the Angular framework specification.',
        pros: ['Zero config standard preset', 'Maintains system guidelines'],
        cons: ['Slower incremental compile times', 'Difficult to customize loaders'],
        popularity: 12
      },
      {
        id: 'none',
        label: 'No Build Tool (Vanilla CSS/JS)',
        desc: 'Direct script imports into index.html via CDN or local assets.',
        pros: ['Immediate start', 'No node_modules bloating'],
        cons: ['Lacks import statements capability', 'No bundle minification', 'No easy TypeScript execution'],
        popularity: 6
      }
    ]
  },
  {
    step: 3,
    title: 'Styling Strategy',
    subtitle: 'How do you design, theme and style elements?',
    options: [
      {
        id: 'tailwind',
        label: 'Tailwind CSS',
        desc: 'Utility-first framework directly writing responsive layouts inside template markup.',
        badge: 'Recommended',
        pros: ['Rapid layout development', 'Microscopic production bundles', 'No context switching'],
        cons: ['Long cluster class strings in HTML', 'Steep lookup list initially'],
        recommended: true,
        popularity: 74
      },
      {
        id: 'css-modules',
        label: 'CSS Modules / Sass',
        desc: 'Scoped normal CSS styles linked directly to React files with hash security protection.',
        pros: ['Clean separated components', 'Vanilla plain styles syntax friendly', 'Full CSS flexibility'],
        cons: ['Extra file clutter', 'Can get duplicate code states'],
        popularity: 15
      },
      {
        id: 'bootstrap',
        label: 'Bootstrap',
        desc: 'Classic utility framework with heavy grid structures and solid pre-themed inputs/buttons.',
        pros: ['Immediate structural visual setup', 'Responsive layout elements list'],
        cons: ['Creates standard cookie-cutter look', 'Heavy framework footprint'],
        popularity: 10
      },
      {
        id: 'raw-css',
        label: 'Raw Normal CSS',
        desc: 'Plain standard style files imported inside root files.',
        pros: ['Zero configuration needed', 'Complete standard CSS parameters compatibility'],
        cons: ['Lacks variable sharing nesting features', 'CSS scope bleed bugs list'],
        popularity: 1
      }
    ]
  },
  {
    step: 4,
    title: 'Client-Backend Communication',
    subtitle: 'How do frontend components sync up with backend APIs?',
    options: [
      {
        id: 'rest',
        label: 'REST API',
        desc: 'JSON payload responses over standard HTTP endpoints (GET, POST, PUT, DELETE).',
        badge: 'Recommended',
        pros: ['Universally compatible', 'Simple browser caching', 'Decoupled design structure'],
        cons: ['Over-fetching / Under-fetching', 'Lacks native end-to-end typing'],
        recommended: true,
        popularity: 76
      },
      {
        id: 'graphql',
        label: 'GraphQL',
        desc: 'Client-directed graph requests returning precise elements requested in schema.',
        pros: ['Clients query exact data attributes', 'Saves mobile network data', 'Single request multiple entities'],
        cons: ['High backend implementation cost', 'N+1 querying problems', 'No simple HTTP routing caches'],
        popularity: 12
      },
      {
        id: 'trpc',
        label: 'tRPC',
        desc: 'Direct type safety mapping backend structures to React types over JSON-RPC.',
        pros: ['End-to-end full TS compilation checks', 'Stunning developmental rate'],
        cons: ['TS-only dependency bounds both systems', 'Harder to configure publicly'],
        popularity: 8
      },
      {
        id: 'websockets',
        label: 'WebSocket (Realtime)',
        desc: 'Bidirectional state streams driving micro-second reactive client components.',
        pros: ['Blazing live data updates', 'Low message overheads'],
        cons: ['Hard state synchronization logic', 'Scaling server connections cost'],
        popularity: 4
      }
    ]
  },
  {
    step: 5,
    title: 'Backend Language & Runtime',
    subtitle: 'Which computing engine runs your server code?',
    options: [
      {
        id: 'node-ts',
        label: 'Node.js / TypeScript',
        desc: 'Excellent rapid asynchronous JavaScript engine with shared type assets.',
        badge: 'Recommended',
        pros: ['Shared TS logic both domains', 'Gigantic NPM packages marketplace', 'Stellar micro-task loop speed'],
        cons: ['Single threaded engine logic', 'Large node_modules dependencies lists'],
        recommended: true,
        popularity: 58
      },
      {
        id: 'python',
        label: 'Python',
        desc: 'Approachable syntax language standard for data science, AI tools, and robust APIs.',
        pros: ['Stellar AI/ML tooling libraries', 'Clean and readable logic', 'Massive backend systems frameworks'],
        cons: ['Slower execution runtime', 'Dependency management with pip can be messy'],
        popularity: 20
      },
      {
        id: 'go',
        label: 'Go (Golang)',
        desc: 'Compiled concurrency-first language engineered at Google with ultra-tiny footprints.',
        pros: ['Extreme server speed and efficiency', 'Concurrent worker channels', 'Self-contained binary compile'],
        cons: ['Highly verbose error validation', 'Lacks advanced framework abstractions'],
        popularity: 12
      },
      {
        id: 'rust',
        label: 'Rust',
        desc: 'Zero-overhead computing compilation built for critical security and safety.',
        pros: ['Fastest raw framework performance', 'Zero database-safety runtime errors', 'Extremely compact services'],
        cons: ['Massive compile-times', 'Steep borrow checker memory mechanics'],
        popularity: 6
      },
      {
        id: 'php',
        label: 'PHP',
        desc: 'Classic language crafted specifically for web platforms.',
        pros: ['Hosted instantly anywhere', 'Remarkable productivity in CMS systems'],
        cons: ['Inconsistent API legacy standards', 'Slightly slow native performance'],
        popularity: 4
      }
    ]
  },
  {
    step: 6,
    title: 'Backend Framework',
    subtitle: 'Which library handles routing, requests, and middleware?',
    options: [
      {
        id: 'express',
        label: 'Express (Node.js)',
        desc: 'Minimal and unopinionated middleware router. Industry baseline standard for Node.',
        badge: 'Recommended',
        pros: ['Extremely simple config', 'Thousands of packages', 'Easy online documentation lookup'],
        cons: ['Must design personal modular code file trees', 'Legacy asynchronous standard handlers can be verbose'],
        recommended: true,
        popularity: 65
      },
      {
        id: 'fastapi',
        label: 'FastAPI (Python)',
        desc: 'High performance web ASGI system with automated interactive Swagger JSON documentation.',
        pros: ['Blazing async speed', 'Strict structural pydantic typings', 'Auto-generated test client pages'],
        cons: ['Relatively small community relative to Django'],
        popularity: 15
      },
      {
        id: 'django',
        label: 'Django (Python)',
        desc: 'Robust corporate MVC chassis carrying native admin panels, ORM, and secure controls.',
        pros: ['Instantly gen complete dashboards', 'Extremely hard to break code security'],
        cons: ['Heavy frame constraints', 'Very opinionated structure rules'],
        popularity: 10
      },
      {
        id: 'axum',
        label: 'Axum / Actix Web (Rust)',
        desc: 'Blazing fast concurrent systems designed cleanly inside the Rust safety compiler.',
        pros: ['Unparalleled runtime processing speeds', 'Remarkable type systems safety'],
        cons: ['Very verbose database mappings'],
        popularity: 5
      },
      {
        id: 'laravel',
        label: 'Laravel (PHP)',
        desc: 'Elegant server platform featuring full queue, schema, email, and authentication libraries.',
        pros: ['Fabulous out-of-the-box system packages', 'Eloquent DB is highly intuitive'],
        cons: ['Requires special server PHP configurations'],
        popularity: 5
      },
      {
        id: 'gin-gonic',
        label: 'Gin-Gonic (Go)',
        desc: 'Ultra-fast, concurrent, and lightweight HTTP web microframework built in Go.',
        pros: ['Exceptional memory speed', 'Superb routing and middleware support', 'Native concurrency'],
        cons: ['Lacks built-in database ORMs standard'],
        popularity: 14
      }
    ]
  },
  {
    step: 7,
    title: 'Database Access Layer',
    subtitle: 'How does code validate and execute database transactions?',
    options: [
      {
        id: 'orm',
        label: 'ORM (Prisma / Hibernate)',
        desc: 'High-level entities modeling DB schemas to local language type-safe assets.',
        badge: 'Recommended',
        pros: ['No complex SQL queries needed', 'Autocompletion inside IDEs', 'Auto migration files generation'],
        cons: ['Creates complex nested SQL joins', 'Slightly slower runtime overhead'],
        recommended: true,
        popularity: 62
      },
      {
        id: 'query-builder',
        label: 'Query Builder (Knex / sqlx)',
        desc: 'Programmatic query composition that builds efficient SQL commands.',
        pros: ['Maintains performance of raw SQL', 'Handles dynamic filter inputs easily'],
        cons: ['Requires partial database mapping configuration'],
        popularity: 24
      },
      {
        id: 'raw-sql',
        label: 'Raw Raw SQL',
        desc: 'Writing native SELECT/INSERT strings directly in database driver tools.',
        pros: ['Perfect optimization capability', 'Zero dependencies package overhead'],
        cons: ['Security vulnerabilities to SQL Injection', 'Lacks type safety completely'],
        popularity: 14
      }
    ]
  },
  {
    step: 8,
    title: 'Database selection',
    subtitle: 'Where is your persistent dataset stored securely?',
    options: [
      {
        id: 'postgres',
        label: 'PostgreSQL Relational DB',
        desc: 'Industry gold standard SQL database. Handles massive transactional queries.',
        badge: 'Recommended',
        pros: ['Invaluable relational integrity features', 'Highly customizable indexing', 'Massive web framework integrations'],
        cons: ['Requires careful connection scaling limits'],
        recommended: true,
        popularity: 64
      },
      {
        id: 'mysql',
        label: 'MySQL / MariaDB',
        desc: 'The classic relational database powering most e-commerce setups.',
        pros: ['Extremely simple setups', 'High-performance read queries', 'Vast web host compatibility'],
        cons: ['Less flexible JSON operations', 'Fewer advanced scaling features'],
        popularity: 22
      },
      {
        id: 'sqlite',
        label: 'SQLite',
        desc: 'File-based serverless SQL database with fast response speeds.',
        pros: ['Zero configuration needed', 'Instant response speed', 'No network lag issues'],
        cons: ['No concurrent writing scale support'],
        popularity: 14
      }
    ]
  },
  {
    step: 9,
    title: 'Authentication Strategy',
    subtitle: 'How do users authenticate and access private records?',
    options: [
      {
        id: 'sessions',
        label: 'Session-based Login cookies',
        desc: 'Stateful authentication tracking logins via secure HTTP-only cookies.',
        badge: 'Recommended',
        pros: ['Native browser cookie security', 'Instant invalidation support'],
        cons: ['Requires backend state persistence table', 'Tricky CORS setup across domains'],
        recommended: true,
        popularity: 52
      },
      {
        id: 'jwt',
        label: 'Stateless JSON Web Tokens',
        desc: 'Tokens transmitted in header parameters, verified cryptographically anywhere.',
        pros: ['Zero backend session logic load', 'Perfect for distributed systems'],
        cons: ['Revocation lists can be cumbersome', 'Storage in localStorage is vulnerable to XSS'],
        popularity: 38
      },
      {
        id: 'oauth',
        label: 'Third-party OAuth logins',
        desc: 'Allow users to sign in with Google, GitHub, or other accounts.',
        pros: ['No credentials to secure', 'Frictionless signup flow'],
        cons: ['Dependent on third-party uptime', 'Complex integration setup'],
        popularity: 10
      }
    ]
  },
  {
    step: 10,
    title: 'Priority Hosting Target',
    subtitle: 'Where points your build for target deployment?',
    options: [
      {
        id: 'paas',
        label: 'Managed Containers PaaS (Render / Railway)',
        desc: 'Simplified container execution with automated background scaling. Instant builds flow.',
        badge: 'Recommended',
        pros: ['Automatic SSL checks', 'No root network logic configuration', 'Fastest MVP release speed'],
        cons: ['Expensive container hosting limits', 'Idle times on free tiers'],
        recommended: true,
        popularity: 65
      },
      {
        id: 'vps',
        label: 'Ubuntu Linux VPS (Linode / DigitalOcean / Hetzner)',
        desc: 'Sourcing dedicated server hardware setups running PM2 or Docker Compose manually.',
        pros: ['Extremely cheap flat-rate host', 'Perfect configuration flexibility'],
        cons: ['Needs manual terminal configuration and system administration'],
        popularity: 25
      },
      {
        id: 'hyper-cloud',
        label: 'Hyper Cloud VMs (AWS EC2 / GCP)',
        desc: 'Enterprise-managed VM nodes with endless scalability integrations.',
        pros: ['Endless scale capabilities', 'Excellent corporate access controls'],
        cons: ['Enormously steep billing learning curve', 'Complex deployment parameters'],
        popularity: 10
      }
    ]
  },
  {
    step: 11,
    title: 'Server Process Manager',
    subtitle: 'How do you daemonize and manage server uptime?',
    options: [
      {
        id: 'pm2',
        label: 'PM2 Daemon Manager',
        desc: 'Production-grade runtime scheduler restarting crashed Node processes.',
        badge: 'Recommended',
        pros: ['Native cluster multi-threading', 'Live reload watch tools', 'Fast console logs access'],
        cons: ['Specifically tailored for JavaScript runtimes'],
        recommended: true,
        popularity: 72
      },
      {
        id: 'systemd',
        label: 'systemd Linux scheduler',
        desc: 'Native operating system controller daemonizing any compiled binary (Go, Rust, etc.).',
        pros: ['Built into standard Linux distros', 'Zero dependency footprints'],
        cons: ['Requires system terminal root privileges'],
        popularity: 18
      },
      {
        id: 'docker-compose',
        label: 'Docker Compose orchestration',
        desc: 'Configuring multi-container platforms together in localized files.',
        pros: ['Perfect environmental reproducibility', 'Unified microservice scaling'],
        cons: ['Slightly slower compiling loop time'],
        popularity: 10
      }
    ]
  },
  {
    step: 12,
    title: 'Ingress Web Server / Reverse Proxy',
    subtitle: 'What forwards public web ports to your local application ports?',
    options: [
      {
        id: 'nginx',
        label: 'Nginx Reverse Proxy',
        desc: 'Robust high-concurrency gateway server routing traffic to port 3000.',
        badge: 'Recommended',
        pros: ['Microsecond static file server', 'Outstanding custom configurations library', 'Low memory footprint'],
        cons: ['Cryptically formatted config files'],
        recommended: true,
        popularity: 68
      },
      {
        id: 'caddy',
        label: 'Caddy Server',
        desc: 'Modern web proxy that automates SSL certificate management natively.',
        pros: ['Auto managed Let\'s Encrypt SSL certificates', 'Approachable and clean Caddyfile layout'],
        cons: ['Requires custom compiling extensions'],
        popularity: 20
      },
      {
        id: 'cloudflare',
        label: 'Cloudflare Tunnel standard routing',
        desc: 'Direct proxy tunnels linking local network nodes directly with security proxies.',
        pros: ['No opening incoming server ports needed', 'Built-in DDoS protection'],
        cons: ['Requires persistent Cloudflare agent daemon'],
        popularity: 12
      }
    ]
  },
  {
    step: 13,
    title: 'Process Telemetry & Logs',
    subtitle: 'How do you monitor backend errors and operational telemetry?',
    options: [
      {
        id: 'sentry',
        label: 'Sentry Telemetry standard client',
        desc: 'Cloud error monitoring capturing real exception traces on consumer devices.',
        badge: 'Recommended',
        pros: ['Traces real client bugs instantly', 'Automated email alerts'],
        cons: ['Integrations bundle size overhead'],
        recommended: true,
        popularity: 70
      },
      {
        id: 'prometheus-grafana',
        label: 'Prometheus + Grafana dashboards',
        desc: 'Real-time server telemetry tracking system resources natively.',
        pros: ['Outstanding visual charts', 'Tracks memory leaks and page load latency'],
        cons: ['Complex self-hosting configuration'],
        popularity: 20
      },
      {
        id: 'pm2-logs',
        label: 'Local Text Log aggregates File system',
        desc: 'Sourcing plain system files saving plain stdout/stderr logs on the server.',
        pros: ['Requires zero external configuration', 'Fully private server-side logs'],
        cons: ['Hard to search across scaled nodes'],
        popularity: 10
      }
    ]
  }
];

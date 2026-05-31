# Product Requirements Document (PRD)

## Product Name: Full-Stack Decision Map & Stack Builder
**Product Vibe**: Precision System Configuration Blueprint (High Density Theme)  
**Host Environment**: Sandbox Node.js + Vite Client Container

---

## 1. Overview & Objectives
Choosing a full-stack technology architecture is one of the most consequential decisions a software team can make. The **Full-Stack Decision Map & Stack Builder** serves as an interactive sandbox cataloging frontend bundlers, database access layers (ORMs/Query Builders), server reverse proxies, process supervisors, and telemetry suites. It reduces architectural friction by guiding development squads through standard full-stack components based on their precise talent profiles.

### Core Objectives:
*   Identify high-performance pathways (like PERN, Actix, or Golang) with strict structural compliance.
*   Interactive step-by-step custom planning through 13 critical hosting and database decisions.
*   Enable single-click exports of system specification blueprints to local clipboards.

---

## 2. Refactored Directory & File Architecture
To ensure extreme maintainability, clean data isolation, and prevent oversized compiler files, the application layout has been refactored from single-file structures to a modular, decoupled state:

```text
/
├── .env.example                       # Declares API and portal requirements
├── index.html                         # Document wrapper
├── metadata.json                      # Ingress and sandbox frame permissions
├── package.json                       # Module dependencies (Node/TypeScript)
├── PRD.md                             # [THIS FILE] Central product specifications
├── vite.config.ts                     # Bundling parameters
├── src/
│   ├── main.tsx                       # Client mount entry point
│   ├── index.css                      # Global @import "tailwindcss" styling
│   ├── App.tsx                        # Core router & Tab state controller
│   ├── types.ts                       # Shared interfaces and TypeScript types
│   ├── data.ts                        # Central re-exporter and backwards-compatibility proxy
│   ├── data/
│   │   ├── decisionSteps.ts           # The 13 interactive module config steps
│   │   └── predefinedStacks.ts        # Preconfigured industry technology stack profiles
│   └── components/
│       ├── Header.tsx                 # Site header with operational counters
│       ├── TabsNavigation.tsx         # Responsive layout tab selector bar
│       ├── StepMatrixFlow.tsx         # Tab 1: Interactive step choosing flow
│       ├── StackComparisonMatrix.tsx  # Tab 2: Listing filters and detailed comparators
│       ├── VisualTopologyNodes.tsx    # Tab 3: Topological visualizer charts
│       └── AutoStackQuestionnaire.tsx # Tab 4: Spec recommendation builder
```

---

## 3. Detailed Feature Specifications

### A. Modular 13-Step Interactive Selector Matrix
*   **Target View**: Tab 1 ("`flow`").
*   **Behavior**:
    *   Walks the user through 13 separate decisions: *Frontend Choice, Build Tool, Styling Strategy, API Communication, Backend Language, Backend Framework, DB Access Layer, Database selection, Authentication, Priority Hosting, Process Manager, Reverse Proxy, and Telemetry Logs*.
    *   **Auto-scaling Rules**: Selecting `Angular` automatically modifies subsequent defaults to `Angular CLI` and `Bootstrap`. Selecting languages (Python, Go, Rust, PHP) updates frameworks, ORMs, and supervisors (like `systemd` or `pm2`) dynamically.
    *   **Telemetry Rating**: Computes live estimated cost, SQL Relational vs NoSQL database paradigms, and language productivity levels.

### B. Preconfigured Stack Catalog Matrix
*   **Target View**: Tab 2 ("`table`").
*   **Behavior**:
    *   Table listing pre-engineered blueprints (Django, Next.js, FastAPI, SvelteKit, Rust nodes, Laravel).
    *   Client filter menus for Difficulty Level (Easy, Medium, Hard) and database families (PostgreSQL, MySQL, SQLite).
    *   Custom column toggles sorting rank by lexicographical name or system complexity.
    *   **Port Specs Logic**: Single-click activationports the chosen predefined configuration back to Tab 1's interactive stepper state for custom editing.

### C. Visual Packets & Topology Diagram Canvas
*   **Target View**: Tab 3 ("`graphs`").
*   **Behavior**:
    *   Renders real-time vector graphs tracking developmental phases and deployment pipelines.
    *   Includes structures for:
        1.  *Learning Path Foundation Timeline*
        2.  *Client-Gateway-Express API Route Transmit*
        3.  *ORM Select database query sockets*
        4.  *Git Deployment Chain (Github -> Vite compiler -> PM2 process supervisor -> Reverse Gateway proxy)*
        5.  *Global network chart representation*

### D. Automated Smart Questionnaire Recommendation Wizard
*   **Target View**: Tab 4 ("`builder`").
*   **Behavior**:
    *   Asks three high-level matching questions: App Name, Business model (Analytical dashboard, commercial SaaS, realtime portals, employee tools), and Squad Profile (unified JS/TS, Pythonistas, concurrent performance).
    *   Auto-computes matching presets (e.g., matching mathematical workloads with FastAPI, or high-concurrency loops with Go nodes).
    *   Displays direct explanations justifying why the stack meets the squad profile.

---

## 4. UI & Visual Theme Guidelines (**High Density Design Theme**)
The interface features the optimized high-contrast High Density theme:
*   **Color Palette**: Clean off-white background canvas (`#F4F4F5`) framed by severe deep charcoal gray headers (`#18181B`) and sharp blue system accents (`#2563EB`).
*   **Typography**: Clean sans-serif sans fonts for user guidance paired with compact monochrome technical fonts (`font-mono`) for specs details, system codes, and metadata rails.
*   **Layout Spacing**: Narrow vertical padding with high density grids allows development leads to view all 13 step selections and overall ratings on a single screen without vertical scroll-fatigue.

The main rule of thumb for web body text is **16 pixels (px)**, which equals **12 points** or **1 rem**. [boia](https://www.boia.org/blog/does-font-size-matter-for-web-accessibility)

### Key font size guidelines:

| Aspect | Recommendation |
|--------|----------------|
| **Body text** | 16 px (12 pt / 1 rem) minimum  [boia](https://www.boia.org/blog/does-font-size-matter-for-web-accessibility) |
| **Absolute minimum** | 12 px (9 pt) — smaller may be illegible  [accessibility.psu](https://accessibility.psu.edu/fontsizehtml/) |
| **Mobile websites** | 16 px minimum for readability  [specialt](https://www.specialt.net/documentation/standards/typography-38) |
| **Older adults/vision issues** | At least 19 px (14 pt / 1.67 rem)  [boia](https://www.boia.org/blog/does-font-size-matter-for-web-accessibility) |
| **Subheadings** | Significantly larger than body text  [boia](https://www.boia.org/blog/does-font-size-matter-for-web-accessibility) |

### Important best practices:

- **Use relative units** (`rem` or `em`) instead of absolute units (`px` or `pt`) so text respects user browser settings [w3](https://www.w3.org/QA/Tips/font-size)
- **Don't go below 1 em** for body text (except fine print like copyrights) [w3](https://www.w3.org/QA/Tips/font-size.html)
- **Ensure text can zoom to 200%** without losing functionality (WCAG requirement) [accessibility.psu](https://accessibility.psu.edu/fontsizehtml/)
- **Line height** should be at least 1.5 (150%) for readability [specialt](https://www.specialt.net/documentation/standards/typography-38)

The 16 px standard works because it's readable for most users without forcing them to zoom in, while still being efficient for screen real estate. [boia](https://www.boia.org/blog/does-font-size-matter-for-web-accessibility)

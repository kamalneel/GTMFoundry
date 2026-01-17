# GTM Foundry Design System

A comprehensive design specification for the GTM Foundry web dashboard, inspired by NesterLabs' GTM Command Center.

## Design Principles

1. **Dark-first**: Optimized for extended use with a dark theme that reduces eye strain
2. **Agent-centric**: Each agent has a distinct visual identity through color coding
3. **Information density**: Command center layout maximizes data visibility without clutter
4. **Subtle motion**: Smooth animations provide feedback without distraction
5. **Consistent patterns**: Reusable components maintain visual coherence

---

## Color System

### Brand Colors (Green - represents growth/GTM success)

```css
--color-brand-50: #f0fdf4;
--color-brand-100: #dcfce7;
--color-brand-200: #bbf7d0;
--color-brand-300: #86efac;
--color-brand-400: #4ade80;
--color-brand-500: #22c55e;  /* Primary */
--color-brand-600: #16a34a;
--color-brand-700: #15803d;
--color-brand-800: #166534;
--color-brand-900: #14532d;
--color-brand-950: #052e16;
```

### Agent Colors

| Agent | Color | Hex | Rationale |
|-------|-------|-----|-----------|
| **Data Agent** | Blue | `#3b82f6` | Trust, stability, central hub |
| **Import Agent** | Amber | `#f59e0b` | Action, incoming data flow |
| **Enrichment Agent** | Purple | `#8b5cf6` | Enhancement, intelligence |
| **Demand Gen Agent** | Rose | `#f43f5e` | Energy, outreach, engagement |
| **Website Agent** | Cyan | `#06b6d4` | Digital, web, connectivity |
| **Assistant Agent** | Emerald | `#10b981` | Human connection, support |
| **Analytics Agent** | Indigo | `#6366f1` | Insights, data visualization |

```css
/* Agent Color Variables */
--color-agent-data: #3b82f6;
--color-agent-import: #f59e0b;
--color-agent-enrichment: #8b5cf6;
--color-agent-demandgen: #f43f5e;
--color-agent-website: #06b6d4;
--color-agent-assistant: #10b981;
--color-agent-analytics: #6366f1;
```

### Surface Colors (Dark Theme)

```css
--color-surface: #0f0f0f;           /* Main background */
--color-surface-elevated: #1a1a1a;  /* Cards, sidebar */
--color-surface-hover: #252525;     /* Hover states */
--color-border: #2a2a2a;            /* Default borders */
--color-border-light: #3a3a3a;      /* Hover borders */
```

### Text Colors

```css
--color-text-primary: #fafafa;      /* Headings, important text */
--color-text-secondary: #a1a1aa;    /* Body text */
--color-text-muted: #71717a;        /* Captions, timestamps */
```

### Status Colors

```css
--color-status-active: #4ade80;     /* Green - running, success */
--color-status-pending: #fbbf24;    /* Yellow - waiting, queued */
--color-status-completed: #818cf8;  /* Purple - done */
--color-status-error: #f87171;      /* Red - failed, error */
```

---

## Typography

### Font Families

```css
/* Primary: Space Grotesk - Modern, geometric, highly readable */
font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif;

/* Monospace: JetBrains Mono - For code, IDs, timestamps */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 (Page title) | 30px (text-3xl) | 700 (bold) | 1.2 |
| H2 (Section title) | 20px (text-xl) | 600 (semibold) | 1.3 |
| H3 (Card title) | 18px (text-lg) | 600 (semibold) | 1.4 |
| Body | 14px (text-sm) | 400 (normal) | 1.5 |
| Caption | 12px (text-xs) | 500 (medium) | 1.4 |
| Label | 12px (text-xs) | 600 (semibold) | 1 |

---

## Layout

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        VIEWPORT                              │
├────────────┬────────────────────────────────────────────────┤
│            │                                                 │
│            │              MAIN CONTENT                       │
│  SIDEBAR   │                                                 │
│  (64/256px)│         max-width: 1280px (7xl)                │
│            │         padding: 32px (p-8)                     │
│            │                                                 │
│            │                                                 │
└────────────┴────────────────────────────────────────────────┘
```

### Sidebar

- **Collapsed width**: 80px (w-20)
- **Expanded width**: 256px (w-64)
- **Sections**: Logo → Overview → Agents → Settings/Help → Collapse toggle

### Grid System

```css
/* Dashboard metrics: 4 columns on large screens */
grid-cols-1 md:grid-cols-2 lg:grid-cols-4

/* Agent cards: 7 agents in responsive grid */
grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4

/* Two-column layout: Side by side on large screens */
grid-cols-1 lg:grid-cols-2

/* Gaps */
gap-4  /* Compact (16px) */
gap-6  /* Standard (24px) */
gap-8  /* Spacious (32px) */
```

---

## Components

### Cards

```css
.card {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--color-border-light);
  background: var(--color-surface-hover);
}
```

### Metric Cards

Features:
- Colored top accent bar (3px gradient)
- Icon in bordered box
- Large value display
- Trend indicator (up/down/neutral)

```css
.metric-card {
  padding: 24px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient);
}
```

### Agent Cards

Features:
- Agent icon in colored container
- Agent name and description
- Stats footer (tasks, success rate)
- Hover arrow animation
- Agent-specific glow effect

### Buttons

```css
/* Primary - Brand gradient */
.btn-primary {
  background: linear-gradient(135deg, var(--color-brand-500) 0%, var(--color-brand-600) 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 500;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* Secondary - Subtle border */
.btn-secondary {
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}
```

### Badges / Status Pills

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Status variants */
.status-active { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
.status-pending { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }
.status-completed { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
.status-error { background: rgba(248, 113, 113, 0.15); color: #f87171; }
```

### Inputs

```css
.input {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 10px 14px;
  color: var(--color-text-primary);
  font-size: 14px;
}

.input:focus {
  outline: none;
  border-color: var(--color-brand-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.input::placeholder {
  color: var(--color-text-muted);
}
```

### Navigation Items

```css
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%);
  color: var(--color-brand-400);
  border: 1px solid rgba(34, 197, 94, 0.2);
}
```

### Tables

```css
.table th {
  text-align: left;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
}

.table td {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.table tr:hover td {
  background: var(--color-surface-hover);
}
```

### Chat Interface

Features:
- Agent-colored header with status indicator
- Message bubbles (user = right/green tint, agent = left/neutral)
- Typing indicator with bouncing dots
- Input with attachment button
- Agent-colored send button

---

## Animations

### Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
```

### Usage Classes

```css
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
.animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
.animate-pulse { animation: pulse-glow 2s ease-in-out infinite; }
```

### Staggered Animations

For lists, use animation-delay based on index:
```tsx
style={{ animationDelay: `${index * 100}ms` }}
```

---

## Agent Glow Effects

Each agent has a subtle glow for emphasis:

```css
.glow-data { box-shadow: 0 0 20px rgba(59, 130, 246, 0.15); }
.glow-import { box-shadow: 0 0 20px rgba(245, 158, 11, 0.15); }
.glow-enrichment { box-shadow: 0 0 20px rgba(139, 92, 246, 0.15); }
.glow-demandgen { box-shadow: 0 0 20px rgba(244, 63, 94, 0.15); }
.glow-website { box-shadow: 0 0 20px rgba(6, 182, 212, 0.15); }
.glow-assistant { box-shadow: 0 0 20px rgba(16, 185, 129, 0.15); }
.glow-analytics { box-shadow: 0 0 20px rgba(99, 102, 241, 0.15); }
```

---

## Icons

Using **Lucide React** for consistent iconography.

### Agent Icons

| Agent | Icon | Lucide Component |
|-------|------|------------------|
| Data Agent | Database | `<Database />` |
| Import Agent | Upload | `<Upload />` |
| Enrichment Agent | Sparkles | `<Sparkles />` |
| Demand Gen Agent | Mail | `<Mail />` |
| Website Agent | Globe | `<Globe />` |
| Assistant Agent | MessageCircle | `<MessageCircle />` |
| Analytics Agent | BarChart3 | `<BarChart3 />` |

### Common Icons

- Navigation: `LayoutDashboard`, `Building2`, `Settings`, `HelpCircle`
- Actions: `Plus`, `Send`, `Paperclip`, `ArrowRight`, `ChevronRight`
- Status: `CheckCircle2`, `Clock`, `AlertCircle`, `XCircle`
- Metrics: `TrendingUp`, `TrendingDown`, `Zap`

---

## Responsive Breakpoints

Following Tailwind CSS defaults:

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Extra large |

---

## Page Templates

### Dashboard (Command Center)

1. Welcome header with user name
2. Metric cards row (4 columns)
3. Agent cards grid (7 agents)
4. Two-column: Recent Accounts + Activity Feed

### Agent Detail Page

1. Back navigation
2. Agent header with gradient background
3. Stats cards row (4 columns)
4. Capabilities grid
5. Two-column: Working On + Recent Tasks
6. Side panel: Chat interface (400px width)

### Accounts List

1. Page header with actions
2. Search/filter bar
3. Table with sortable columns
4. Row hover states with quick actions

### Account Detail

1. Back navigation
2. Account header with health indicator
3. Contact list
4. Activity timeline
5. Agent-specific panels

---

## Accessibility

- Color contrast ratio: Minimum 4.5:1 for body text
- Focus states: Visible outline with brand color
- Interactive elements: Minimum 44x44px touch targets
- Motion: Respect `prefers-reduced-motion`
- Screen readers: Proper ARIA labels on interactive elements

---

## File Organization

```
src/
├── styles/
│   └── globals.css          # CSS variables, base styles
├── components/
│   ├── ui/                   # Generic components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── ...
│   ├── layout/               # Layout components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── features/             # Feature-specific components
│       ├── agents/
│       ├── accounts/
│       └── dashboard/
├── pages/                    # Next.js pages (or app/ for App Router)
├── data/                     # Agent configs, mock data
│   ├── agents.ts
│   └── mockData.ts
└── types/                    # TypeScript definitions
    └── index.ts
```

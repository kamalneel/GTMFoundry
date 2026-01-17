# GTM Foundry: Architecture Decisions

This document captures the confirmed architecture decisions for GTM Foundry.

---

## Final Agent Architecture (7 Agents)

All 7 agents are confirmed for v1:

| Agent | Purpose | Key Integrations |
|-------|---------|------------------|
| **Data Agent** | Central CRM hub, master data | Attio (CRM sync) |
| **Import Agent** | Data migration, file ingestion | File uploads |
| **Enrichment Agent** | Contact/company enrichment | Apollo.io |
| **Demand Gen Agent** | Email drafting, personalization | Claude API |
| **Website Agent** | Web content management | Vercel (previews) |
| **Assistant Agent** | Human interface layer | Slack, Email, Mobile (future) |
| **Analytics Agent** | Dashboards, reporting | - |

---

## Confirmed Simplifications

### 1. Hybrid Agent Communication ✅

Use the right tool for each operation type:

**Use Direct Function Calls for:**
- Fast queries (dashboard metrics, account lookups)
- Simple writes (update contact, approve draft)
- User-facing synchronous requests

**Use Task Queue (Supabase) for:**
- Batch operations (import 1000 contacts)
- Long-running tasks (website crawl, bulk enrichment)
- Operations that may fail/need retry
- Background processing

```typescript
// Direct call - synchronous, fast
const metrics = await analyticsAgent.getDashboardMetrics();

// Task queue - asynchronous, resilient
await taskQueue.enqueue({
  agent: 'enrichment',
  type: 'enrich_batch',
  payload: { contactIds }
});
```

### 2. SQLite for Local Development ✅

Multi-database setup for better developer experience:

| Environment | Database | Purpose |
|-------------|----------|---------|
| Local dev | SQLite | Zero setup, works offline |
| CI/Tests | SQLite (in-memory) | Fast, isolated |
| Production | Supabase PostgreSQL | Full features, scalable |

**Implementation:** Use Drizzle ORM as abstraction layer.

```typescript
// Automatic database selection
export const db = process.env.DATABASE_URL?.includes('supabase')
  ? createSupabaseClient()  // PostgreSQL in production
  : createSqliteClient();   // SQLite locally
```

**Benefits:**
- Clone → `npm install` → `npm run dev` (no accounts needed)
- Works offline
- Fast test runs
- Each developer has isolated local data

---

## Technology Stack (Confirmed)

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js + React |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database (prod)** | Supabase PostgreSQL |
| **Database (dev)** | SQLite |
| **ORM** | Drizzle |
| **Auth** | Supabase Auth |
| **File Storage** | Supabase Storage |
| **Background Jobs** | Supabase Edge Functions |
| **Scheduled Tasks** | Vercel Cron |
| **LLM** | Anthropic Claude API |
| **CRM Sync** | Attio |
| **Enrichment** | Apollo.io |
| **Email Delivery** | Resend |
| **Monitoring** | Sentry |
| **Deployment** | Vercel |

---

## Agent Communication Patterns

### Pattern 1: Direct Call (Synchronous)

```
User Request → API Route → Agent Function → Response
     │                                          │
     └──────────── < 1 second ──────────────────┘
```

Use for: Queries, simple updates, real-time UI

### Pattern 2: Task Queue (Asynchronous)

```
User Request → API Route → Create Task → Response (accepted)
                               │
                               ▼
                    Supabase Task Table
                               │
                               ▼
                    Agent picks up task
                               │
                               ▼
                    Process (may take minutes)
                               │
                               ▼
                    Update task status
                               │
                               ▼
                    Notify via Assistant Agent
```

Use for: Imports, batch enrichment, long-running analysis

### Pattern 3: Event-Driven (Reactive)

```
Agent A completes work → Writes to DB → Triggers notification
                                              │
                                              ▼
                                   Supabase Realtime
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                         Dashboard      Other Agents    Assistant
                         (live update)  (react to data) (notify user)
```

Use for: Real-time updates, agent coordination, notifications

---

## Data Flow Examples

### Example 1: Import Contacts (Queue Pattern)

```
1. User uploads CSV
2. API creates import task (status: pending)
3. User sees "Import started" immediately
4. Import Agent picks up task
5. Processes rows, updates progress
6. On completion → triggers enrichment tasks
7. Assistant notifies user "Import complete"
```

### Example 2: View Dashboard (Direct Pattern)

```
1. User opens dashboard
2. API calls analyticsAgent.getMetrics()
3. Agent queries database
4. Returns metrics in ~200ms
5. Dashboard renders
```

### Example 3: Approve Email Draft (Direct + Event)

```
1. User clicks "Approve" on draft
2. API calls demandGenAgent.approveDraft(id)
3. Agent updates draft status
4. Supabase Realtime notifies UI
5. Dashboard updates instantly
6. If auto-send enabled: creates send task
```

---

## Open Decisions

The following decisions are confirmed but implementation details TBD:

| Decision | Options to Explore |
|----------|-------------------|
| Drizzle schema design | Single schema file vs per-agent |
| Task queue table structure | Polling vs Supabase Realtime triggers |
| SQLite migration strategy | Shared migrations vs environment-specific |
| Agent code organization | Modules vs classes vs functions |

---

## Next Steps

1. Set up Next.js project with TypeScript
2. Configure Drizzle with SQLite (local) + PostgreSQL (prod) support
3. Define database schema
4. Implement Data Agent as first agent
5. Build dashboard shell with agent status cards

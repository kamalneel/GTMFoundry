# GTM Foundry: Version Roadmap

A phased approach to building GTM Foundry, starting with high-confidence features and progressively adding complexity.

---

## Version Summary

| Version | Focus | Agents | Key Features |
|---------|-------|--------|--------------|
| **V1** | Core GTM Loop | 5 | Import → Enrich → Draft → Track |
| **V2** | Email Automation | 5 | Direct send, sequences, Slack |
| **V3** | CRM Integration | 6 | Attio sync, advanced imports |
| **V4** | Website & Mobile | 7 | Website Agent, mobile app |

---

## V1: Core Foundation

**Goal:** A working GTM system that helps you manage contacts, enrich data, draft personalized emails, and track metrics.

**Timeline:** First release

### V1 Agents

| Agent | Status | Scope |
|-------|--------|-------|
| **Data Agent** | ✅ Active | Contact/Account CRUD, standalone CRM |
| **Import Agent** | ✅ Active | Small CSV import (<1MB) |
| **Enrichment Agent** | ✅ Active | Apollo.io single + batch enrichment |
| **Demand Gen Agent** | ✅ Active | Email drafting (copy/paste workflow) |
| **Analytics Agent** | ✅ Active | Dashboard, basic metrics |
| **Assistant Agent** | ⚡ Partial | In-app + email notifications only |
| **Website Agent** | ❌ Deferred | Not in V1 |

### V1 Features

#### Data Management
- [x] Create, read, update, delete contacts
- [x] Create, read, update, delete accounts
- [x] Account → Contact relationships
- [x] Search and filter contacts/accounts
- [x] Contact/account detail views
- [ ] ~~Attio CRM sync~~ (V3)
- [ ] ~~Deduplication~~ (V2)

#### Import
- [x] CSV file upload
- [x] Field mapping interface
- [x] Import preview before commit
- [x] Import history log
- [ ] ~~Large file support (>1MB)~~ (V2)
- [ ] ~~Excel support~~ (V2)
- [ ] ~~Email archive parsing~~ (V3)

#### Enrichment
- [x] Enrich single contact via Apollo
- [x] Batch enrich selected contacts
- [x] Credit usage tracking
- [x] Enrichment status per contact
- [x] Schedule auto-enrichment (daily/weekly)
- [ ] ~~Multiple enrichment providers~~ (V3)

#### Demand Generation
- [x] AI-powered email draft generation
- [x] Context from contact + account data
- [x] Draft review and editing
- [x] Draft approval workflow
- [x] Copy draft to clipboard (for pasting to email client)
- [ ] ~~Direct email sending~~ (V2)
- [ ] ~~Email sequences~~ (V2)
- [ ] ~~A/B variants~~ (V3)

#### Analytics
- [x] Dashboard with key metrics
- [x] Total contacts/accounts
- [x] Enrichment coverage percentage
- [x] Drafts created/approved
- [x] Agent activity summary
- [ ] ~~Engagement tracking~~ (V2)
- [ ] ~~Custom reports~~ (V3)

#### Notifications (Assistant Agent)
- [x] In-app notification center
- [x] Email notifications for key events
- [x] Notification preferences
- [ ] ~~Slack integration~~ (V2)
- [ ] ~~Mobile push notifications~~ (V4)

#### Infrastructure
- [x] Next.js application
- [x] Supabase Auth (email/password)
- [x] SQLite for local development
- [x] Supabase PostgreSQL for production
- [x] Drizzle ORM
- [x] Tailwind CSS + design system
- [x] Sentry error tracking
- [x] Vercel deployment

### V1 User Flow

```
1. Sign up / Log in
         ↓
2. Import contacts via CSV
         ↓
3. Review and map fields
         ↓
4. Enrich contacts with Apollo
         ↓
5. View enriched contact profiles
         ↓
6. Generate personalized email draft
         ↓
7. Review and approve draft
         ↓
8. Copy to clipboard → Paste in email client → Send manually
         ↓
9. Track progress on dashboard
```

### V1 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database (dev) | SQLite |
| Database (prod) | Supabase PostgreSQL |
| ORM | Drizzle |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| AI | Anthropic Claude API |
| Enrichment | Apollo.io API |
| Monitoring | Sentry |
| Deployment | Vercel |

---

## V2: Email Automation

**Goal:** Send emails directly from GTM Foundry, with sequences and better notifications.

**Prerequisite:** V1 stable and in use

### V2 New Features

#### Direct Email Sending
- [ ] Resend integration
- [ ] Send approved drafts directly
- [ ] Delivery status tracking
- [ ] Bounce handling
- [ ] Domain authentication guidance (SPF/DKIM)

#### Email Sequences
- [ ] Multi-step email sequences
- [ ] Delay configuration between steps
- [ ] Sequence templates
- [ ] Pause/resume sequences
- [ ] Stop on reply detection

#### Enhanced Import
- [ ] Large file support (streaming)
- [ ] Excel file support (.xlsx)
- [ ] Progress indicator for large imports
- [ ] Import error handling and retry

#### Slack Integration
- [ ] Slack app installation
- [ ] Notifications to Slack channel
- [ ] Daily/weekly digest to Slack
- [ ] Slash commands for quick lookups

#### Data Quality
- [ ] Duplicate detection
- [ ] Merge duplicate contacts
- [ ] Data validation rules

#### Enhanced Analytics
- [ ] Email open tracking
- [ ] Email click tracking
- [ ] Response rate metrics
- [ ] Sequence performance

### V2 Tech Additions

| Component | Technology |
|-----------|------------|
| Email Sending | Resend |
| Email Tracking | Resend webhooks |
| Slack | Slack API |

---

## V3: CRM Integration

**Goal:** Bidirectional sync with Attio CRM and advanced data management.

**Prerequisite:** V2 stable

### V3 New Features

#### Attio CRM Sync
- [ ] Connect Attio account
- [ ] Initial data sync (Attio → GTM Foundry)
- [ ] Bidirectional sync
- [ ] Conflict resolution rules
- [ ] Sync status dashboard
- [ ] Field mapping configuration

#### Advanced Import
- [ ] Email archive import (Gmail, Outlook)
- [ ] Parse email threads for contacts
- [ ] Extract relationship context from emails

#### Multi-Provider Enrichment
- [ ] Clearbit integration
- [ ] LinkedIn data (manual entry)
- [ ] Provider fallback chain

#### A/B Testing
- [ ] Email variant generation
- [ ] Random assignment
- [ ] Performance comparison

#### Advanced Analytics
- [ ] Custom report builder
- [ ] Export reports (PDF, CSV)
- [ ] Scheduled report delivery
- [ ] Pipeline forecasting

#### Enhanced Assistant
- [ ] Conversational interface ("What needs my attention?")
- [ ] Smart prioritization
- [ ] Action suggestions

### V3 Tech Additions

| Component | Technology |
|-----------|------------|
| CRM Sync | Attio API |
| Email Parsing | Custom + libraries |

---

## V4: Website & Mobile

**Goal:** Full Website Agent capabilities and mobile access.

**Prerequisite:** V3 stable

### V4 New Features

#### Website Agent
- [ ] Website URL input
- [ ] Automated crawling
- [ ] Content extraction and structuring
- [ ] Clone site generation
- [ ] Vercel preview deployments
- [ ] Content change proposals
- [ ] Side-by-side comparison view
- [ ] Change approval workflow
- [ ] Export change instructions

#### Mobile App (Assistant)
- [ ] React Native app
- [ ] Push notifications
- [ ] Quick actions (approve, dismiss)
- [ ] Contact lookup
- [ ] Voice notes for follow-up

#### Advanced Automation
- [ ] Workflow builder
- [ ] Trigger-based actions
- [ ] Custom agent rules

#### Team Features
- [ ] Multiple users per instance
- [ ] Role-based permissions
- [ ] Activity audit log
- [ ] Team performance metrics

### V4 Tech Additions

| Component | Technology |
|-----------|------------|
| Website Crawling | Puppeteer / Playwright |
| Clone Hosting | Vercel API |
| Mobile App | React Native / Expo |
| Push Notifications | Expo Push / Firebase |

---

## Version Comparison Matrix

| Feature | V1 | V2 | V3 | V4 |
|---------|----|----|----|----|
| Contact/Account CRUD | ✅ | ✅ | ✅ | ✅ |
| CSV Import | ✅ | ✅ | ✅ | ✅ |
| Large File Import | ❌ | ✅ | ✅ | ✅ |
| Email Archive Import | ❌ | ❌ | ✅ | ✅ |
| Apollo Enrichment | ✅ | ✅ | ✅ | ✅ |
| Multi-Provider Enrichment | ❌ | ❌ | ✅ | ✅ |
| AI Email Drafts | ✅ | ✅ | ✅ | ✅ |
| Copy/Paste Workflow | ✅ | ✅ | ✅ | ✅ |
| Direct Email Send | ❌ | ✅ | ✅ | ✅ |
| Email Sequences | ❌ | ✅ | ✅ | ✅ |
| Email Tracking | ❌ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Custom Reports | ❌ | ❌ | ✅ | ✅ |
| In-App Notifications | ✅ | ✅ | ✅ | ✅ |
| Email Notifications | ✅ | ✅ | ✅ | ✅ |
| Slack Notifications | ❌ | ✅ | ✅ | ✅ |
| Attio CRM Sync | ❌ | ❌ | ✅ | ✅ |
| Website Agent | ❌ | ❌ | ❌ | ✅ |
| Mobile App | ❌ | ❌ | ❌ | ✅ |

---

## Agent Activation by Version

```
V1:  [Data] [Import] [Enrichment] [DemandGen] [Analytics] [Assistant*]
      ✅      ✅         ✅           ✅          ✅         ⚡partial

V2:  [Data] [Import] [Enrichment] [DemandGen] [Analytics] [Assistant]
      ✅      ✅         ✅           ✅          ✅          ✅full

V3:  [Data] [Import] [Enrichment] [DemandGen] [Analytics] [Assistant]
      ✅+     ✅+        ✅+          ✅+         ✅+         ✅
     Attio   Large    Multi-       A/B        Reports   Conversational
     Sync    Files    Provider     Testing

V4:  [Data] [Import] [Enrichment] [DemandGen] [Website] [Analytics] [Assistant]
      ✅      ✅         ✅           ✅          ✅          ✅         ✅+
                                              NEW                    Mobile
```

---

## Risk Assessment by Version

| Version | Complexity | Bug Risk | Claude Code Confidence |
|---------|------------|----------|------------------------|
| V1 | Low-Medium | Low | 🟢 90% |
| V2 | Medium | Medium | 🟡 75% |
| V3 | High | High | 🟡 60% |
| V4 | Very High | Very High | 🔴 45% |

**Note:** V3 and V4 may benefit from professional developer assistance for the complex integrations.

---

## Implementation Order (V1)

### Phase 1: Foundation
1. Next.js project setup
2. Tailwind + design system CSS
3. Drizzle ORM configuration
4. Database schema
5. SQLite local / PostgreSQL prod setup

### Phase 2: Authentication
6. Supabase Auth integration
7. Login / Signup pages
8. Protected routes

### Phase 3: Core UI
9. Layout component (sidebar + main)
10. Dashboard page (shell)
11. Navigation

### Phase 4: Data Agent
12. Contact CRUD
13. Account CRUD
14. Contact/Account list views
15. Detail views

### Phase 5: Import Agent
16. CSV upload component
17. Field mapping UI
18. Import processing
19. Import history

### Phase 6: Enrichment Agent
20. Apollo.io integration
21. Single contact enrichment
22. Batch enrichment
23. Enrichment status UI

### Phase 7: Demand Gen Agent
24. Claude API integration
25. Draft generation
26. Draft review UI
27. Approval workflow
28. Copy to clipboard

### Phase 8: Analytics Agent
29. Metrics calculations
30. Dashboard widgets
31. Metric cards

### Phase 9: Assistant Agent (Partial)
32. Notification data model
33. In-app notification center
34. Email notification sending

### Phase 10: Polish & Deploy
35. Error handling
36. Loading states
37. Sentry integration
38. Vercel deployment
39. Production Supabase setup

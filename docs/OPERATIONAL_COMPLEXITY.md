# GTM Foundry: Operational Complexity Analysis

A comprehensive breakdown of all systems, services, and operational concerns for running GTM Foundry.

---

## Summary: Systems Count

| Category | Count | Complexity |
|----------|-------|------------|
| External Services (Paid) | 6 | High |
| Infrastructure Components | 5 | Medium |
| Data Management Areas | 7 | High |
| Agent Operations | 7 | High |
| Security Concerns | 6 | Medium |
| Compliance Requirements | 4 | Medium |
| **Total Operational Areas** | **35** | |

---

## 1. External Services (Paid Subscriptions)

These require active accounts, billing management, and API key maintenance.

| Service | Purpose | Billing Model | Complexity |
|---------|---------|---------------|------------|
| **Vercel** | App hosting, serverless, cron | Usage-based | Medium |
| **Supabase** | Database, auth, storage, edge functions | Usage-based | Medium |
| **Anthropic** | Claude API for AI agents | Per-token | High |
| **Attio** | CRM sync | Per-seat | Low |
| **Apollo.io** | Contact/company enrichment | Credits-based | Medium |
| **Resend** | Email delivery | Per-email | Low |
| **Sentry** | Error monitoring | Event-based | Low |

### Operational Tasks:
- [ ] Monitor monthly costs across all services
- [ ] Track API usage against quotas
- [ ] Manage billing alerts and thresholds
- [ ] Handle subscription renewals
- [ ] Plan for usage spikes (campaigns, imports)

---

## 2. Infrastructure Components

| Component | Service | What to Manage |
|-----------|---------|----------------|
| **Application Hosting** | Vercel | Deployments, environment variables, domains |
| **Database** | Supabase PostgreSQL | Schema, migrations, performance, backups |
| **File Storage** | Supabase Storage | Upload limits, file cleanup, access policies |
| **Background Jobs** | Supabase Edge Functions | Function deployments, timeouts, logs |
| **Scheduled Tasks** | Vercel Cron | Job schedules, failure handling |
| **Realtime** | Supabase Realtime | Connection limits, channel subscriptions |

### Operational Tasks:
- [ ] Monitor deployment health
- [ ] Review database performance metrics
- [ ] Manage storage quotas and cleanup old files
- [ ] Monitor edge function execution times
- [ ] Verify cron jobs are running on schedule

---

## 3. Data Management

| Area | Description | Frequency |
|------|-------------|-----------|
| **Schema Migrations** | Database structure changes | Per release |
| **Data Backups** | Point-in-time recovery | Daily (auto) |
| **Data Deduplication** | Merge duplicate contacts/accounts | Weekly |
| **Data Decay Tracking** | Identify stale records needing enrichment | Weekly |
| **CRM Sync Health** | Monitor Attio bidirectional sync | Daily |
| **Import Processing** | Handle queued file imports | On-demand |
| **Data Exports** | User data export requests | On-demand |

### Data Volume Concerns:
```
Estimated Growth (per active instance):
├── Contacts: +500-2000/month (imports + enrichment)
├── Accounts: +100-500/month
├── Activities: +5000-20000/month (email events, tasks)
├── Email Drafts: +200-1000/month
├── Tasks: +1000-5000/month (agent tasks)
└── Files: +50-200MB/month (imports, attachments)
```

---

## 4. Agent Operations (7 Agents)

Each agent has its own operational concerns:

### 4.1 Data Agent (Hub)
| Concern | What to Monitor |
|---------|-----------------|
| Task Queue | Queue depth, processing time, failed tasks |
| CRM Sync | Sync lag, conflict resolution, API errors |
| Deduplication | Merge accuracy, false positives |

### 4.2 Import Agent
| Concern | What to Monitor |
|---------|-----------------|
| File Processing | Parse errors, unsupported formats |
| Data Mapping | Field mapping accuracy, unmapped fields |
| Queue Backlog | Large file processing times |

### 4.3 Enrichment Agent
| Concern | What to Monitor |
|---------|-----------------|
| Apollo Credits | Credit consumption rate, remaining balance |
| Enrichment Rate | Contacts enriched/day, coverage % |
| Data Quality | Match accuracy, stale data detection |
| Rate Limits | API throttling, retry queues |

### 4.4 Demand Gen Agent
| Concern | What to Monitor |
|---------|-----------------|
| Claude API Usage | Token consumption, costs |
| Draft Quality | Approval rate, rejection reasons |
| Personalization | Context utilization, template effectiveness |
| Queue Depth | Pending drafts awaiting approval |

### 4.5 Website Agent
| Concern | What to Monitor |
|---------|-----------------|
| Crawl Health | Failed crawls, blocked pages |
| Preview Deployments | Deployment count, cleanup old previews |
| Content Changes | Pending changes, approval backlog |
| Storage | Clone storage consumption |

### 4.6 Assistant Agent
| Concern | What to Monitor |
|---------|-----------------|
| Notification Delivery | Email delivery rate, bounces |
| Escalation Queue | Unhandled escalations, SLA breaches |
| User Response Time | Time to action on notifications |

### 4.7 Analytics Agent
| Concern | What to Monitor |
|---------|-----------------|
| Report Generation | Failed reports, stale dashboards |
| Metric Accuracy | Data consistency, calculation errors |
| Performance | Dashboard load times, query performance |

---

## 5. API Rate Limits & Quotas

Critical limits that must be tracked to prevent service disruption:

| Service | Limit Type | Typical Limit | Impact of Exceeding |
|---------|------------|---------------|---------------------|
| **Anthropic** | Tokens/min | 100K | Agent tasks fail |
| **Anthropic** | Requests/min | 60 | Agent tasks queue |
| **Apollo.io** | Credits/month | Plan-based | Enrichment stops |
| **Apollo.io** | Requests/min | 100 | Enrichment slows |
| **Attio** | Requests/min | 100 | CRM sync fails |
| **Resend** | Emails/day | Plan-based | Outreach stops |
| **Resend** | Emails/second | 10 | Emails queue |
| **Supabase** | DB connections | 60 (free) | App errors |
| **Supabase** | Edge invocations | 500K/month | Background jobs fail |
| **Vercel** | Function duration | 10-300s | Long tasks timeout |
| **Vercel** | Cron invocations | 500/month (hobby) | Scheduled jobs skip |

### Rate Limit Management:
```
Database Table: api_quotas
├── Track usage per service
├── Reset counters on schedule
├── Alert at 80% threshold
├── Pause agents at 95% threshold
└── Log all quota events
```

---

## 6. Security Operations

| Area | What to Manage | Frequency |
|------|----------------|-----------|
| **API Keys** | Rotation, secure storage | Quarterly |
| **Supabase Auth** | User sessions, password policies | Ongoing |
| **Row Level Security** | Database access policies | Per migration |
| **Environment Variables** | Vercel secrets management | Per change |
| **Audit Logs** | Agent activity, data access | Retention policy |
| **Vulnerability Scanning** | Dependency updates, security patches | Weekly |

### Secrets Inventory:
```
Environment Variables Required:
├── SUPABASE_URL
├── SUPABASE_ANON_KEY
├── SUPABASE_SERVICE_ROLE_KEY
├── ANTHROPIC_API_KEY
├── ATTIO_API_KEY
├── APOLLO_API_KEY
├── RESEND_API_KEY
├── SENTRY_DSN
└── (Optional) WEBSITE_CLONE_WEBHOOK_SECRET
```

---

## 7. Email Deliverability

Critical for Demand Gen Agent effectiveness:

| Area | What to Manage |
|------|----------------|
| **Domain Authentication** | SPF, DKIM, DMARC records |
| **Sender Reputation** | Bounce rates, spam complaints |
| **Warm-up** | Gradual sending increase for new domains |
| **Suppression Lists** | Bounced, unsubscribed, complained |
| **Content Quality** | Spam score, link safety |

### Email Health Metrics:
```
Monitor Daily:
├── Delivery rate (target: >98%)
├── Bounce rate (target: <2%)
├── Spam complaint rate (target: <0.1%)
├── Open rate (benchmark: 20-40%)
└── Reply rate (benchmark: 2-10%)
```

---

## 8. Compliance & Legal

| Requirement | Applies To | Operational Impact |
|-------------|------------|-------------------|
| **GDPR** | EU contacts | Data export, deletion requests |
| **CAN-SPAM** | Email outreach | Unsubscribe handling, physical address |
| **CCPA** | California contacts | Privacy disclosures, opt-out |
| **Data Retention** | All data | Automated cleanup policies |

### Compliance Tasks:
- [ ] Handle data subject access requests (DSARs)
- [ ] Process deletion requests within 30 days
- [ ] Maintain unsubscribe links in all emails
- [ ] Log consent for data processing
- [ ] Document data flows and processing purposes

---

## 9. Monitoring & Alerting

| System | What to Monitor | Alert Threshold |
|--------|-----------------|-----------------|
| **Sentry** | Application errors | >10 errors/hour |
| **Vercel** | Function failures | >5% error rate |
| **Supabase** | Database health | Connection pool >80% |
| **Agents** | Task failures | >10% failure rate |
| **Email** | Delivery failures | >5% bounce rate |
| **Quotas** | API usage | >80% of limit |

### Recommended Dashboards:
1. **System Health** - Infrastructure status, error rates
2. **Agent Activity** - Tasks processed, queue depths, success rates
3. **Data Pipeline** - Imports, enrichments, sync status
4. **Outreach Performance** - Emails sent, opened, replied
5. **Cost Tracking** - API usage, projected monthly spend

---

## 10. Disaster Recovery

| Scenario | Recovery Strategy | RTO | RPO |
|----------|-------------------|-----|-----|
| Database corruption | Supabase point-in-time restore | 1 hour | 24 hours |
| Service outage (Vercel) | Wait for provider recovery | N/A | N/A |
| API key compromise | Rotate keys, audit logs | 15 min | N/A |
| Accidental data deletion | Database restore | 2 hours | 24 hours |
| External service failure | Graceful degradation, queue tasks | N/A | N/A |

---

## 11. Cost Estimation

### Monthly Cost Breakdown (estimated for active instance):

| Service | Tier | Est. Monthly Cost |
|---------|------|-------------------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Anthropic | Pay-as-you-go | $50-200 |
| Attio | Starter | $29/user |
| Apollo.io | Basic | $49 |
| Resend | Pro | $20 |
| Sentry | Team | $26 |
| **Total** | | **$219-369+** |

*Costs scale with usage. High-volume instances may be significantly higher.*

---

## 12. Operational Runbook Checklist

### Daily Operations
- [ ] Check Sentry for new errors
- [ ] Review agent task failure rates
- [ ] Monitor email delivery metrics
- [ ] Verify CRM sync completed

### Weekly Operations
- [ ] Review API quota consumption
- [ ] Check data enrichment coverage
- [ ] Clear old preview deployments
- [ ] Review pending approvals queue

### Monthly Operations
- [ ] Review and optimize costs
- [ ] Rotate API keys if needed
- [ ] Run data deduplication
- [ ] Review and archive old data
- [ ] Update dependencies/security patches

### Quarterly Operations
- [ ] Full security audit
- [ ] Performance optimization review
- [ ] Disaster recovery test
- [ ] Compliance review

---

## Complexity Assessment

### High-Complexity Areas (require expertise):
1. **Claude API management** - Cost optimization, prompt engineering
2. **Email deliverability** - Reputation management, authentication
3. **Data quality** - Deduplication, decay detection, enrichment accuracy
4. **Rate limit orchestration** - Coordinating 6+ APIs with different limits

### Medium-Complexity Areas (routine with tooling):
1. **Database operations** - Migrations, backups, performance
2. **Security** - Key rotation, access control
3. **Monitoring** - Alert tuning, dashboard maintenance

### Low-Complexity Areas (mostly automated):
1. **Deployments** - Vercel handles automatically
2. **Auth** - Supabase manages session/tokens
3. **File storage** - Supabase handles scaling

---

## Recommendations

1. **Build an Admin Dashboard** - Central place to monitor all operational metrics
2. **Implement Health Checks** - Automated checks for all external service connections
3. **Create Alert Escalation** - PagerDuty/Opsgenie for critical failures
4. **Document Runbooks** - Step-by-step guides for common issues
5. **Automate Where Possible** - Self-healing for transient failures

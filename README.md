# GTM Foundry

An agentic system that handles all aspects of go-to-market (GTM) for software and services businesses.

## Overview

GTM Foundry enables businesses to transition from traditional, manual go-to-market operations to a fully agentic approach. Whether a company has been operating for 10, 20, or more years using spreadsheets, email, and various SaaS tools, GTM Foundry consolidates and automates the entire GTM function through a coordinated system of specialized agents.

## Architecture

GTM Foundry is built on a **hub-and-spoke architecture** where all agents communicate through a central Data Agent. This design ensures:

- Single source of truth for all GTM data
- Consistent state across all operations
- Clear audit trail of all agent activities
- Decoupled agent communication

```
                    ┌─────────────────┐
                    │   Data Agent    │
                    │   (Central Hub) │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │           │        │        │           │
        ▼           ▼        ▼        ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Import  │ │ Enrich  │ │ Demand  │ │ Website │ │Analytics│
   │ Agent   │ │ Agent   │ │Gen Agent│ │ Agent   │ │ Agent   │
   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
                                            │
                                            ▼
                                      ┌───────────┐
                                      │ Assistant │
                                      │   Agent   │
                                      └───────────┘
```

## Agents

### 1. Data Agent (CRM)

The **central nervous system** of GTM Foundry. Acts as both the primary data store and synchronization layer.

**Responsibilities:**
- Maintains the master record of all GTM data (contacts, accounts, interactions, campaigns)
- Syncs bidirectionally with external CRMs (Salesforce, HubSpot, etc.)
- Serves as the communication hub for all other agents
- Provides consistent data access patterns for the entire system

### 2. Import Agent

Handles the **data migration and ongoing ingestion** from legacy systems and external sources.

**Responsibilities:**
- Imports data from spreadsheets, emails, existing CRMs, and other sources
- Supports progressive data loading (start with contacts, add email mining later, etc.)
- Normalizes data from disparate formats into a unified schema
- Handles incremental imports as new data sources are identified

**Supported Sources:**
- Spreadsheets (CSV, Excel)
- Email archives
- Existing CRM exports
- Custom data sources via API

### 3. Enrichment Agent

Keeps data **current and comprehensive** by connecting to external data providers.

**Responsibilities:**
- Enriches contact and company data with current information
- Updates stale records (e.g., contacts who have changed roles/companies)
- Integrates with enrichment providers (ZoomInfo, LinkedIn, Clearbit, etc.)
- Validates and verifies existing data

**Key Insight:** A company with 10-20 years of data has significant decay—the Enrichment Agent ensures your outreach targets the right people at the right companies.

### 4. Demand Gen Agent

Creates **personalized, contextual messaging** for outreach campaigns.

**Responsibilities:**
- Analyzes historical interaction data to understand relationship context
- Leverages enrichment data to craft relevant messages
- Generates personalized outreach content
- Adapts messaging based on prospect engagement history

**Intelligence Sources:**
- Historical relationship data from the Data Agent
- Current role/company information from the Enrichment Agent
- Website content and messaging from the Website Agent
- Engagement analytics from the Analytics Agent

### 5. Website Agent

Manages and optimizes the company's **web presence**.

**Responsibilities:**
- Takes control of website content management (with proper credentials)
- Updates website messaging based on campaign strategies
- Creates new pages/content aligned with demand gen efforts
- When direct updates aren't possible, generates change recommendations for manual implementation

**Modes:**
- **Active Mode:** Direct website updates via CMS integration
- **Advisory Mode:** Generates detailed change specifications for manual implementation

### 6. Assistant Agent

The **human-agent interface** that keeps the business owner informed and directs human action.

**Responsibilities:**
- Notifies the boss when human intervention is required
- Alerts on high-priority responses requiring personal attention
- Escalates "hard prospects" that need direct human outreach (phone calls, personal emails)
- Surfaces website changes that require manual implementation
- Prioritizes and queues action items for the human operator

**Example Notifications:**
- "You have 3 prospect replies requiring your response"
- "Website update ready for review—unable to auto-publish"
- "High-value prospect [Name] recommended for direct phone call"

### 7. Analytics Agent

Provides **RevOps-style reporting and dashboards** for system visibility.

**Responsibilities:**
- Tracks system-wide metrics and KPIs
- Generates reports on GTM performance
- Maintains dashboards for operational visibility
- Monitors agent health and activity

**Key Metrics:**
- Total prospects in the system
- Enrichment coverage and completion rates
- Daily/weekly message volume
- Response rates and engagement metrics
- Pipeline progression and conversion rates
- Agent activity and performance metrics

## Getting Started

```bash
# Clone the repository
git clone https://github.com/kamalneel/GTMFoundry.git

# Navigate to the project
cd GTMFoundry

# Install dependencies (coming soon)
# npm install

# Start the application (coming soon)
# npm start
```

## Project Structure

```
GTMFoundry/
├── src/
│   ├── agents/         # Individual agent implementations
│   ├── api/            # API endpoints
│   ├── config/         # Configuration files
│   └── utils/          # Shared utilities
├── docs/               # Additional documentation
├── tests/              # Test suites
└── README.md           # This file
```

## License

[License to be determined]

## Contributing

Contribution guidelines coming soon.

import type { Agent, AgentType } from '../types';

/**
 * GTM Foundry Agent Configuration
 *
 * The 7 agents work in a hub-and-spoke model with the Data Agent
 * serving as the central coordinator.
 *
 * Version Status:
 * - V1: Data, Import, Enrichment, Demand Gen, Analytics (full), Assistant (partial)
 * - V2: + Email sending, sequences, Slack
 * - V3: + Attio sync, advanced imports
 * - V4: + Website Agent, mobile app
 */

export type AgentVersion = 'v1' | 'v2' | 'v3' | 'v4';

export interface AgentWithVersion extends Agent {
  /** Minimum version where this agent is available */
  availableFrom: AgentVersion;
  /** V1-specific scope limitations */
  v1Scope?: string[];
  /** Features deferred to later versions */
  deferredFeatures?: { feature: string; version: AgentVersion }[];
}

export const agents: AgentWithVersion[] = [
  {
    id: 'data',
    name: 'Data',
    fullName: 'Data Agent - CRM Hub',
    description:
      'The central nervous system of GTM Foundry. Maintains the master record of all GTM data and serves as the communication hub for all other agents.',
    icon: 'Database',
    color: '#3b82f6',
    status: 'active',
    availableFrom: 'v1',
    capabilities: [
      'Master data management',
      'Contact & account CRUD',
      'Data consistency enforcement',
      'Agent task coordination',
      'Audit trail management',
    ],
    v1Scope: [
      'Contact CRUD operations',
      'Account CRUD operations',
      'Account-Contact relationships',
      'Search and filtering',
      'Basic data validation',
    ],
    deferredFeatures: [
      { feature: 'Attio bidirectional sync', version: 'v3' },
      { feature: 'Advanced deduplication', version: 'v2' },
      { feature: 'Conflict resolution', version: 'v3' },
    ],
  },
  {
    id: 'import',
    name: 'Import',
    fullName: 'Import Agent - Data Migration',
    description:
      'Handles data migration and ongoing ingestion from legacy systems. Imports from spreadsheets and normalizes data into a unified schema.',
    icon: 'Upload',
    color: '#f59e0b',
    status: 'active',
    availableFrom: 'v1',
    capabilities: [
      'CSV file import',
      'Field mapping interface',
      'Import preview',
      'Import history',
      'Data normalization',
    ],
    v1Scope: [
      'Small CSV import (<1MB)',
      'Field mapping UI',
      'Preview before commit',
      'Import history log',
    ],
    deferredFeatures: [
      { feature: 'Large file support (streaming)', version: 'v2' },
      { feature: 'Excel file support', version: 'v2' },
      { feature: 'Email archive parsing', version: 'v3' },
      { feature: 'CRM export ingestion', version: 'v3' },
    ],
  },
  {
    id: 'enrichment',
    name: 'Enrichment',
    fullName: 'Enrichment Agent - Data Intelligence',
    description:
      'Keeps data current and comprehensive by connecting to Apollo.io. Updates stale records and validates existing information.',
    icon: 'Sparkles',
    color: '#8b5cf6',
    status: 'active',
    availableFrom: 'v1',
    capabilities: [
      'Contact enrichment (Apollo.io)',
      'Company data updates',
      'Batch enrichment',
      'Credit usage tracking',
      'Scheduled auto-enrichment',
    ],
    v1Scope: [
      'Single contact enrichment',
      'Batch enrichment (selected contacts)',
      'Apollo.io credit tracking',
      'Enrichment status per contact',
      'Daily/weekly auto-enrichment schedule',
    ],
    deferredFeatures: [
      { feature: 'Multi-provider support (Clearbit)', version: 'v3' },
      { feature: 'Email validation', version: 'v2' },
      { feature: 'Provider fallback chain', version: 'v3' },
    ],
  },
  {
    id: 'demandgen',
    name: 'Demand Gen',
    fullName: 'Demand Gen Agent - Outreach',
    description:
      'Creates personalized, contextual messaging for outreach. Analyzes contact and account data to craft relevant email drafts.',
    icon: 'Mail',
    color: '#f43f5e',
    status: 'active',
    availableFrom: 'v1',
    capabilities: [
      'AI-powered email drafting',
      'Context-aware personalization',
      'Draft review and editing',
      'Approval workflow',
      'Copy to clipboard',
    ],
    v1Scope: [
      'Generate personalized email draft',
      'Use contact + account context',
      'Draft editing interface',
      'Approve/reject workflow',
      'Copy draft to clipboard (manual send)',
    ],
    deferredFeatures: [
      { feature: 'Direct email sending (Resend)', version: 'v2' },
      { feature: 'Email sequences', version: 'v2' },
      { feature: 'A/B variant generation', version: 'v3' },
      { feature: 'Reply detection', version: 'v2' },
    ],
  },
  {
    id: 'website',
    name: 'Website',
    fullName: 'Website Agent - Content Management',
    description:
      'Manages and optimizes web presence. Creates clones of customer websites for safe preview of proposed changes before deployment.',
    icon: 'Globe',
    color: '#06b6d4',
    status: 'disabled', // Not available in V1
    availableFrom: 'v4',
    capabilities: [
      'Website crawling & cloning',
      'Content change proposals',
      'Preview deployment (Vercel)',
      'SEO recommendations',
      'Change comparison view',
    ],
    v1Scope: [], // Not in V1
    deferredFeatures: [
      { feature: 'Website crawling', version: 'v4' },
      { feature: 'Clone generation', version: 'v4' },
      { feature: 'Vercel preview deployments', version: 'v4' },
      { feature: 'Content diff view', version: 'v4' },
    ],
  },
  {
    id: 'assistant',
    name: 'Assistant',
    fullName: 'Assistant Agent - Human Interface',
    description:
      'The human-agent interface that keeps the business owner informed. Handles notifications and prioritizes action items requiring human attention.',
    icon: 'MessageCircle',
    color: '#10b981',
    status: 'active',
    availableFrom: 'v1',
    capabilities: [
      'In-app notification center',
      'Email notifications',
      'Notification preferences',
    ],
    v1Scope: [
      'In-app notification center',
      'Email notifications (key events)',
      'Notification preferences',
    ],
    deferredFeatures: [
      { feature: 'Slack integration', version: 'v2' },
      { feature: 'Conversational interface', version: 'v3' },
      { feature: 'Mobile push notifications', version: 'v4' },
      { feature: 'Mobile app', version: 'v4' },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics',
    fullName: 'Analytics Agent - RevOps Insights',
    description:
      'Provides RevOps-style reporting and dashboards for system visibility. Tracks metrics and monitors agent performance.',
    icon: 'BarChart3',
    color: '#6366f1',
    status: 'active',
    availableFrom: 'v1',
    capabilities: [
      'Dashboard with key metrics',
      'Contact/account counts',
      'Enrichment coverage',
      'Draft statistics',
      'Agent activity summary',
    ],
    v1Scope: [
      'Dashboard with metric cards',
      'Total contacts/accounts',
      'Enrichment coverage percentage',
      'Drafts created/approved counts',
      'Agent activity summary',
    ],
    deferredFeatures: [
      { feature: 'Email open/click tracking', version: 'v2' },
      { feature: 'Custom report builder', version: 'v3' },
      { feature: 'Pipeline forecasting', version: 'v3' },
      { feature: 'Export reports (PDF/CSV)', version: 'v3' },
    ],
  },
];

/**
 * Get agents available in a specific version
 */
export function getAgentsForVersion(version: AgentVersion): AgentWithVersion[] {
  const versionOrder: AgentVersion[] = ['v1', 'v2', 'v3', 'v4'];
  const versionIndex = versionOrder.indexOf(version);

  return agents.filter((agent) => {
    const agentVersionIndex = versionOrder.indexOf(agent.availableFrom);
    return agentVersionIndex <= versionIndex;
  });
}

/**
 * Get V1 agents only
 */
export function getV1Agents(): AgentWithVersion[] {
  return getAgentsForVersion('v1');
}

/**
 * Get active V1 agents (excludes disabled like Website)
 */
export function getActiveV1Agents(): AgentWithVersion[] {
  return getV1Agents().filter((agent) => agent.status !== 'disabled');
}

/**
 * Get an agent by ID
 */
export function getAgent(id: AgentType): AgentWithVersion | undefined {
  return agents.find((agent) => agent.id === id);
}

/**
 * Get agent color by ID
 */
export function getAgentColor(id: AgentType): string {
  return getAgent(id)?.color ?? '#71717a';
}

/**
 * Get all agent IDs
 */
export function getAgentIds(): AgentType[] {
  return agents.map((agent) => agent.id);
}

/**
 * Agent color mapping for CSS classes
 */
export const agentColorClasses: Record<
  AgentType,
  {
    gradient: string;
    glow: string;
    badge: string;
    bg: string;
    text: string;
  }
> = {
  data: {
    gradient: 'gradient-data',
    glow: 'glow-data',
    badge: 'agent-data',
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
  },
  import: {
    gradient: 'gradient-import',
    glow: 'glow-import',
    badge: 'agent-import',
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
  },
  enrichment: {
    gradient: 'gradient-enrichment',
    glow: 'glow-enrichment',
    badge: 'agent-enrichment',
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
  },
  demandgen: {
    gradient: 'gradient-demandgen',
    glow: 'glow-demandgen',
    badge: 'agent-demandgen',
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
  },
  website: {
    gradient: 'gradient-website',
    glow: 'glow-website',
    badge: 'agent-website',
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
  },
  assistant: {
    gradient: 'gradient-assistant',
    glow: 'glow-assistant',
    badge: 'agent-assistant',
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
  },
  analytics: {
    gradient: 'gradient-analytics',
    glow: 'glow-analytics',
    badge: 'agent-analytics',
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-400',
  },
};

import type { Agent, AgentType } from '../types';

/**
 * GTM Foundry Agent Configuration
 *
 * The 7 agents work in a hub-and-spoke model with the Data Agent
 * serving as the central coordinator.
 */

export const agents: Agent[] = [
  {
    id: 'data',
    name: 'Data',
    fullName: 'Data Agent - CRM Hub',
    description:
      'The central nervous system of GTM Foundry. Maintains the master record of all GTM data and serves as the communication hub for all other agents. Syncs bidirectionally with external CRMs.',
    icon: 'Database',
    color: '#3b82f6',
    capabilities: [
      'Master data management',
      'CRM bidirectional sync (Attio)',
      'Contact & account deduplication',
      'Data consistency enforcement',
      'Agent task coordination',
      'Audit trail management',
    ],
    status: 'active',
  },
  {
    id: 'import',
    name: 'Import',
    fullName: 'Import Agent - Data Migration',
    description:
      'Handles data migration and ongoing ingestion from legacy systems. Imports from spreadsheets, emails, CRM exports, and normalizes data into a unified schema.',
    icon: 'Upload',
    color: '#f59e0b',
    capabilities: [
      'Spreadsheet import (CSV, Excel)',
      'Email archive parsing',
      'CRM export ingestion',
      'Data normalization',
      'Incremental import support',
      'Duplicate detection',
    ],
    status: 'active',
  },
  {
    id: 'enrichment',
    name: 'Enrichment',
    fullName: 'Enrichment Agent - Data Intelligence',
    description:
      'Keeps data current and comprehensive by connecting to external data providers. Updates stale records and validates existing information.',
    icon: 'Sparkles',
    color: '#8b5cf6',
    capabilities: [
      'Contact enrichment (Apollo.io)',
      'Company data updates',
      'Email validation',
      'Role/title verification',
      'Social profile linking',
      'Data decay detection',
    ],
    status: 'active',
  },
  {
    id: 'demandgen',
    name: 'Demand Gen',
    fullName: 'Demand Gen Agent - Outreach',
    description:
      'Creates personalized, contextual messaging for outreach campaigns. Analyzes historical interactions and enrichment data to craft relevant messages.',
    icon: 'Mail',
    color: '#f43f5e',
    capabilities: [
      'Personalized email drafting',
      'Sequence generation',
      'Context-aware messaging',
      'A/B variant creation',
      'Tone/style adaptation',
      'Follow-up suggestions',
    ],
    status: 'active',
  },
  {
    id: 'website',
    name: 'Website',
    fullName: 'Website Agent - Content Management',
    description:
      'Manages and optimizes web presence. Creates clones of customer websites for safe preview of proposed changes before deployment.',
    icon: 'Globe',
    color: '#06b6d4',
    capabilities: [
      'Website crawling & cloning',
      'Content change proposals',
      'Preview deployment (Vercel)',
      'SEO recommendations',
      'Messaging alignment',
      'Change comparison view',
    ],
    status: 'active',
  },
  {
    id: 'assistant',
    name: 'Assistant',
    fullName: 'Assistant Agent - Human Interface',
    description:
      'The human-agent interface that keeps the business owner informed. Handles notifications, escalations, and prioritizes action items requiring human attention.',
    icon: 'MessageCircle',
    color: '#10b981',
    capabilities: [
      'Email notifications',
      'In-app alerts',
      'Task escalation',
      'Approval workflows',
      'Priority queue management',
      'Context summarization',
    ],
    status: 'active',
  },
  {
    id: 'analytics',
    name: 'Analytics',
    fullName: 'Analytics Agent - RevOps Insights',
    description:
      'Provides RevOps-style reporting and dashboards for system visibility. Tracks metrics, generates reports, and monitors agent performance.',
    icon: 'BarChart3',
    color: '#6366f1',
    capabilities: [
      'Dashboard generation',
      'KPI tracking',
      'Pipeline analytics',
      'Agent performance metrics',
      'Engagement reporting',
      'Trend analysis',
    ],
    status: 'active',
  },
];

/**
 * Get an agent by ID
 */
export function getAgent(id: AgentType): Agent | undefined {
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
export const agentColorClasses: Record<AgentType, {
  gradient: string;
  glow: string;
  badge: string;
  bg: string;
  text: string;
}> = {
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

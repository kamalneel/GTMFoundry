// ============================================
// GTM Foundry Core Types
// ============================================

// --------------------------------------------
// Agent Types
// --------------------------------------------

export type AgentType =
  | 'data'
  | 'import'
  | 'enrichment'
  | 'demandgen'
  | 'website'
  | 'assistant'
  | 'analytics';

export interface Agent {
  id: AgentType;
  name: string;
  fullName: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Hex color
  capabilities: string[];
  status: AgentStatus;
}

export type AgentStatus = 'active' | 'idle' | 'error' | 'disabled';

// --------------------------------------------
// Account & Contact Types
// --------------------------------------------

export interface Account {
  id: string;
  name: string;
  industry: string;
  website: string;
  employees: string;
  revenue: string;
  stage: AccountStage;
  health: AccountHealth;
  source: DataSource;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  attioId?: string; // External CRM ID
  metrics: AccountMetrics;
}

export type AccountStage =
  | 'prospect'
  | 'lead'
  | 'qualified'
  | 'opportunity'
  | 'negotiation'
  | 'closed-won'
  | 'closed-lost';

export type AccountHealth = 'healthy' | 'at-risk' | 'critical';

export interface AccountMetrics {
  engagementScore: number;
  touchpoints: number;
  daysInPipeline: number;
  dealValue: number;
  probability: number;
  enrichmentCompleteness: number; // 0-100%
}

export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  title?: string;
  phone?: string;
  linkedin?: string;
  isPrimary: boolean;
  lastContacted?: string;
  enrichedAt?: string;
  source: DataSource;
}

export type DataSource =
  | 'import'        // Imported from spreadsheet/file
  | 'attio'         // Synced from Attio CRM
  | 'apollo'        // Enriched via Apollo.io
  | 'manual'        // Manually entered
  | 'website';      // From website form/interaction

// --------------------------------------------
// Task & Activity Types
// --------------------------------------------

export interface AgentTask {
  id: string;
  agentType: AgentType;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  accountId?: string;
  contactId?: string;
  payload?: Record<string, unknown>;
  result?: TaskResult;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export type TaskType =
  // Import Agent
  | 'import_spreadsheet'
  | 'import_email_archive'
  | 'import_crm_sync'
  // Enrichment Agent
  | 'enrich_contact'
  | 'enrich_account'
  | 'validate_emails'
  // Demand Gen Agent
  | 'draft_email'
  | 'draft_sequence'
  | 'personalize_message'
  // Website Agent
  | 'crawl_website'
  | 'propose_content_change'
  | 'deploy_preview'
  // Assistant Agent
  | 'notify_user'
  | 'escalate_task'
  | 'request_approval'
  // Analytics Agent
  | 'generate_report'
  | 'update_dashboard'
  | 'calculate_metrics'
  // Data Agent
  | 'sync_crm'
  | 'deduplicate'
  | 'merge_records';

export type TaskStatus =
  | 'pending'
  | 'queued'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskResult {
  success: boolean;
  data?: Record<string, unknown>;
  message?: string;
}

export interface Activity {
  id: string;
  accountId?: string;
  contactId?: string;
  agentType: AgentType;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export type ActivityType =
  | 'email_sent'
  | 'email_opened'
  | 'email_replied'
  | 'call_logged'
  | 'meeting_scheduled'
  | 'data_imported'
  | 'data_enriched'
  | 'content_updated'
  | 'task_completed'
  | 'notification_sent';

// --------------------------------------------
// Email & Messaging Types
// --------------------------------------------

export interface EmailDraft {
  id: string;
  contactId: string;
  accountId: string;
  subject: string;
  body: string;
  status: DraftStatus;
  generatedBy: AgentType;
  createdAt: string;
  approvedAt?: string;
  sentAt?: string;
  sequenceId?: string;
  sequenceStep?: number;
}

export type DraftStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'sent'
  | 'rejected';

export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  steps: EmailSequenceStep[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: string;
}

export interface EmailSequenceStep {
  order: number;
  delayDays: number;
  subject: string;
  bodyTemplate: string;
}

// --------------------------------------------
// Website Agent Types
// --------------------------------------------

export interface WebsiteClone {
  id: string;
  originalUrl: string;
  previewUrl: string;
  pages: WebsitePage[];
  status: 'crawling' | 'ready' | 'updating' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface WebsitePage {
  id: string;
  path: string;
  title: string;
  content: string; // Structured content
  lastCrawled: string;
}

export interface ContentChange {
  id: string;
  websiteCloneId: string;
  pageId: string;
  changeType: 'update' | 'add' | 'delete';
  originalContent: string;
  proposedContent: string;
  rationale: string;
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  createdAt: string;
}

// --------------------------------------------
// Notification Types
// --------------------------------------------

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: TaskPriority;
  actionUrl?: string;
  actionLabel?: string;
  relatedTaskId?: string;
  relatedAccountId?: string;
  read: boolean;
  createdAt: string;
}

export type NotificationType =
  | 'approval_required'
  | 'task_completed'
  | 'task_failed'
  | 'prospect_replied'
  | 'high_priority_lead'
  | 'enrichment_complete'
  | 'system_alert';

// --------------------------------------------
// Analytics Types
// --------------------------------------------

export interface DashboardMetrics {
  totalAccounts: number;
  totalContacts: number;
  activeOpportunities: number;
  pipelineValue: number;
  winRate: number;
  tasksCompletedToday: number;
  enrichmentCoverage: number;
  emailsSentThisWeek: number;
  responseRate: number;
  agentActivity: Record<AgentType, AgentActivityStats>;
}

export interface AgentActivityStats {
  tasksCompleted: number;
  tasksInProgress: number;
  tasksFailed: number;
  successRate: number;
  avgProcessingTime: number; // in seconds
}

export interface Report {
  id: string;
  name: string;
  type: ReportType;
  dateRange: {
    start: string;
    end: string;
  };
  data: Record<string, unknown>;
  generatedAt: string;
}

export type ReportType =
  | 'pipeline_summary'
  | 'agent_performance'
  | 'outreach_analytics'
  | 'enrichment_status'
  | 'engagement_trends';

// --------------------------------------------
// Integration Types
// --------------------------------------------

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  config: Record<string, unknown>;
  lastSyncAt?: string;
  error?: string;
}

export type IntegrationType =
  | 'attio'
  | 'apollo'
  | 'resend'
  | 'anthropic';

// --------------------------------------------
// API Quota Types
// --------------------------------------------

export interface ApiQuota {
  service: IntegrationType | 'claude';
  limit: number;
  used: number;
  resetsAt: string;
  lastChecked: string;
}

// --------------------------------------------
// Chat/Message Types (for Assistant Agent)
// --------------------------------------------

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  agentType?: AgentType;
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ChatSession {
  id: string;
  agentType: AgentType;
  accountContext?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// --------------------------------------------
// User & Settings Types
// --------------------------------------------

export interface UserSettings {
  id: string;
  email: string;
  name: string;
  notificationPreferences: {
    email: boolean;
    inApp: boolean;
    digest: 'realtime' | 'daily' | 'weekly';
  };
  defaultAgent?: AgentType;
  timezone: string;
}

export interface SystemSettings {
  companyName: string;
  industry: string;
  website: string;
  enrichmentAutoRun: boolean;
  enrichmentFrequency: 'daily' | 'weekly' | 'monthly';
  emailApprovalRequired: boolean;
  maxDailyEmails: number;
}

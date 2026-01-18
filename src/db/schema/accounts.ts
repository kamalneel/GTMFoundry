import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { contacts } from './contacts';

/**
 * Accounts table - represents companies/organizations
 */
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  industry: text('industry'),
  website: text('website'),
  employees: text('employees'), // Range like "10-50", "500-1000"
  revenue: text('revenue'), // Range like "$1M-$5M"
  stage: text('stage', {
    enum: [
      'prospect',
      'lead',
      'qualified',
      'opportunity',
      'negotiation',
      'closed-won',
      'closed-lost',
    ],
  }).default('prospect'),
  health: text('health', {
    enum: ['healthy', 'at-risk', 'critical'],
  }).default('healthy'),
  source: text('source', {
    enum: ['import', 'manual', 'enrichment'],
  }).default('manual'),

  // Metrics (stored as JSON string for SQLite compatibility)
  engagementScore: integer('engagement_score').default(0),
  touchpoints: integer('touchpoints').default(0),
  daysInPipeline: integer('days_in_pipeline').default(0),
  dealValue: integer('deal_value').default(0),
  probability: integer('probability').default(0),

  // Timestamps
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
  lastActivity: text('last_activity'),
});

/**
 * Account relations
 */
export const accountRelations = relations(accounts, ({ many }) => ({
  contacts: many(contacts),
}));

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;

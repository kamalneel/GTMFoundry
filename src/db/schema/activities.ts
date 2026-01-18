import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Activities table - audit log of all agent actions
 */
export const activities = sqliteTable('activities', {
  id: text('id').primaryKey(),

  // Which agent performed this
  agentType: text('agent_type', {
    enum: ['data', 'import', 'enrichment', 'demandgen', 'assistant', 'analytics'],
  }).notNull(),

  // What type of activity
  type: text('type', {
    enum: [
      'contact_created',
      'contact_updated',
      'account_created',
      'account_updated',
      'import_started',
      'import_completed',
      'enrichment_completed',
      'draft_generated',
      'draft_approved',
      'draft_rejected',
      'notification_sent',
    ],
  }).notNull(),

  // Description
  title: text('title').notNull(),
  description: text('description'),

  // Related entities
  accountId: text('account_id'),
  contactId: text('contact_id'),

  // Additional metadata (JSON string)
  metadata: text('metadata'),

  // Timestamp
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

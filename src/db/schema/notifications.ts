import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Notifications table - for the Assistant Agent
 */
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),

  // Content
  type: text('type', {
    enum: [
      'approval_required',
      'task_completed',
      'task_failed',
      'import_complete',
      'enrichment_complete',
      'system_alert',
    ],
  }).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),

  // Priority
  priority: text('priority', {
    enum: ['low', 'medium', 'high', 'urgent'],
  }).default('medium'),

  // Action
  actionUrl: text('action_url'),
  actionLabel: text('action_label'),

  // Related entities
  relatedType: text('related_type'), // 'contact', 'account', 'import', 'draft'
  relatedId: text('related_id'),

  // Status
  read: integer('read', { mode: 'boolean' }).default(false),
  emailSent: integer('email_sent', { mode: 'boolean' }).default(false),

  // Timestamps
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  readAt: text('read_at'),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

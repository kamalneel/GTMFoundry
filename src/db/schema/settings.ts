import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Settings table - application settings (single row)
 */
export const settings = sqliteTable('settings', {
  id: text('id').primaryKey().default('default'),

  // Company info
  companyName: text('company_name'),
  industry: text('industry'),
  website: text('website'),

  // User info
  userName: text('user_name'),
  userEmail: text('user_email'),

  // Notification preferences
  emailNotifications: integer('email_notifications', { mode: 'boolean' }).default(true),
  notificationDigest: text('notification_digest', {
    enum: ['realtime', 'daily', 'weekly'],
  }).default('realtime'),

  // Enrichment settings
  autoEnrichment: integer('auto_enrichment', { mode: 'boolean' }).default(false),
  enrichmentFrequency: text('enrichment_frequency', {
    enum: ['daily', 'weekly', 'monthly'],
  }).default('weekly'),

  // Apollo.io credits tracking
  apolloCreditsUsed: integer('apollo_credits_used').default(0),
  apolloCreditsLimit: integer('apollo_credits_limit').default(0),
  apolloCreditsResetAt: text('apollo_credits_reset_at'),

  // Timestamps
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
});

export type Settings = typeof settings.$inferSelect;
export type NewSettings = typeof settings.$inferInsert;

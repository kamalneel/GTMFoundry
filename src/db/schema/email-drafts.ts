import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { contacts } from './contacts';
import { accounts } from './accounts';

/**
 * Email Drafts table - AI-generated email drafts for review
 */
export const emailDrafts = sqliteTable('email_drafts', {
  id: text('id').primaryKey(),
  contactId: text('contact_id')
    .notNull()
    .references(() => contacts.id, { onDelete: 'cascade' }),
  accountId: text('account_id').references(() => accounts.id, {
    onDelete: 'set null',
  }),

  // Email content
  subject: text('subject').notNull(),
  body: text('body').notNull(),

  // Generation context (JSON string - contains prompt context used)
  context: text('context'),

  // Status
  status: text('status', {
    enum: ['draft', 'pending_approval', 'approved', 'rejected', 'sent'],
  }).default('draft'),

  // Feedback
  rejectionReason: text('rejection_reason'),

  // Timestamps
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
  approvedAt: text('approved_at'),
  sentAt: text('sent_at'),
});

/**
 * Email draft relations
 */
export const emailDraftRelations = relations(emailDrafts, ({ one }) => ({
  contact: one(contacts, {
    fields: [emailDrafts.contactId],
    references: [contacts.id],
  }),
  account: one(accounts, {
    fields: [emailDrafts.accountId],
    references: [accounts.id],
  }),
}));

export type EmailDraft = typeof emailDrafts.$inferSelect;
export type NewEmailDraft = typeof emailDrafts.$inferInsert;

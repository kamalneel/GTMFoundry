import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { accounts } from './accounts';
import { emailDrafts } from './email-drafts';

/**
 * Contacts table - represents individual people
 */
export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').references(() => accounts.id, {
    onDelete: 'set null',
  }),

  // Basic info
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),

  // Professional info
  title: text('title'),
  role: text('role'),
  department: text('department'),
  linkedin: text('linkedin'),

  // Status
  isPrimary: integer('is_primary', { mode: 'boolean' }).default(false),
  source: text('source', {
    enum: ['import', 'manual', 'enrichment'],
  }).default('manual'),

  // Enrichment
  enrichedAt: text('enriched_at'),
  enrichmentStatus: text('enrichment_status', {
    enum: ['pending', 'enriched', 'failed', 'not_found'],
  }).default('pending'),
  enrichmentData: text('enrichment_data'), // JSON string

  // Timestamps
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updated_at').notNull().$defaultFn(() => new Date().toISOString()),
  lastContacted: text('last_contacted'),
});

/**
 * Contact relations
 */
export const contactRelations = relations(contacts, ({ one, many }) => ({
  account: one(accounts, {
    fields: [contacts.accountId],
    references: [accounts.id],
  }),
  emailDrafts: many(emailDrafts),
}));

export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;

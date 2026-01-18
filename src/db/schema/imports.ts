import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Imports table - tracks CSV import history
 */
export const imports = sqliteTable('imports', {
  id: text('id').primaryKey(),

  // File info
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(), // in bytes

  // Status
  status: text('status', {
    enum: ['pending', 'processing', 'completed', 'failed'],
  }).default('pending'),

  // Results
  totalRows: integer('total_rows').default(0),
  processedRows: integer('processed_rows').default(0),
  successCount: integer('success_count').default(0),
  errorCount: integer('error_count').default(0),
  errors: text('errors'), // JSON array of error messages

  // Field mapping (JSON string)
  fieldMapping: text('field_mapping'),

  // Timestamps
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
  completedAt: text('completed_at'),
});

export type Import = typeof imports.$inferSelect;
export type NewImport = typeof imports.$inferInsert;

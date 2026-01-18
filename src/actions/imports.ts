'use server';

import { db } from '@/db';
import {
  imports,
  contacts,
  accounts,
  activities,
  notifications,
  type Import,
  type NewImport,
} from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateId } from '@/lib/utils';

export interface FieldMapping {
  csvField: string;
  dbField: string;
  type: 'contact' | 'account';
}

export interface ParsedRow {
  [key: string]: string;
}

/**
 * Get all imports
 */
export async function getImports(): Promise<Import[]> {
  return db.select().from(imports).orderBy(desc(imports.createdAt));
}

/**
 * Get a single import by ID
 */
export async function getImport(id: string): Promise<Import | undefined> {
  const results = await db.select().from(imports).where(eq(imports.id, id));
  return results[0];
}

/**
 * Create an import record
 */
export async function createImport(
  fileName: string,
  fileSize: number,
  totalRows: number,
  fieldMapping: FieldMapping[]
): Promise<Import> {
  const id = generateId();
  const now = new Date().toISOString();

  const newImport: NewImport = {
    id,
    fileName,
    fileSize,
    totalRows,
    status: 'pending',
    fieldMapping: JSON.stringify(fieldMapping),
    createdAt: now,
  };

  await db.insert(imports).values(newImport);

  revalidatePath('/agents/import');
  revalidatePath('/');

  return { ...newImport } as Import;
}

/**
 * Process import data
 */
export async function processImport(
  importId: string,
  rows: ParsedRow[],
  fieldMapping: FieldMapping[]
): Promise<{ success: number; errors: string[] }> {
  const now = new Date().toISOString();
  let successCount = 0;
  const errors: string[] = [];

  // Update status to processing
  await db
    .update(imports)
    .set({ status: 'processing' })
    .where(eq(imports.id, importId));

  // Group mappings by type
  const contactMappings = fieldMapping.filter((m) => m.type === 'contact');
  const accountMappings = fieldMapping.filter((m) => m.type === 'account');

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    try {
      // Process account if mappings exist
      let accountId: string | undefined;
      if (accountMappings.length > 0) {
        const accountData: Record<string, string> = {};
        for (const mapping of accountMappings) {
          if (row[mapping.csvField]) {
            accountData[mapping.dbField] = row[mapping.csvField];
          }
        }

        if (accountData.name) {
          accountId = generateId();
          await db.insert(accounts).values({
            id: accountId,
            name: accountData.name,
            industry: accountData.industry,
            website: accountData.website,
            employees: accountData.employees,
            revenue: accountData.revenue,
            source: 'import',
            createdAt: now,
            updatedAt: now,
          });
        }
      }

      // Process contact if mappings exist
      if (contactMappings.length > 0) {
        const contactData: Record<string, string> = {};
        for (const mapping of contactMappings) {
          if (row[mapping.csvField]) {
            contactData[mapping.dbField] = row[mapping.csvField];
          }
        }

        if (contactData.email && contactData.firstName) {
          await db.insert(contacts).values({
            id: generateId(),
            firstName: contactData.firstName,
            lastName: contactData.lastName || '',
            email: contactData.email,
            phone: contactData.phone,
            title: contactData.title,
            accountId,
            source: 'import',
            createdAt: now,
            updatedAt: now,
          });
          successCount++;
        } else {
          errors.push(`Row ${i + 1}: Missing required fields (email or firstName)`);
        }
      }

      // Update processed count
      await db
        .update(imports)
        .set({ processedRows: i + 1 })
        .where(eq(imports.id, importId));
    } catch (err) {
      errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }

  // Update final status
  await db
    .update(imports)
    .set({
      status: 'completed',
      successCount,
      errorCount: errors.length,
      errors: errors.length > 0 ? JSON.stringify(errors.slice(0, 100)) : null,
      completedAt: now,
    })
    .where(eq(imports.id, importId));

  // Log activity
  await db.insert(activities).values({
    id: generateId(),
    agentType: 'import',
    type: 'import_completed',
    title: `Import completed: ${successCount} records`,
    metadata: JSON.stringify({ importId, successCount, errorCount: errors.length }),
    createdAt: now,
  });

  // Create notification
  await db.insert(notifications).values({
    id: generateId(),
    type: 'import_complete',
    title: 'Import Complete',
    message: `Successfully imported ${successCount} records with ${errors.length} errors.`,
    priority: errors.length > 0 ? 'medium' : 'low',
    relatedType: 'import',
    relatedId: importId,
    actionUrl: `/agents/import/${importId}`,
    actionLabel: 'View Details',
    createdAt: now,
  });

  revalidatePath('/agents/import');
  revalidatePath('/contacts');
  revalidatePath('/accounts');
  revalidatePath('/');

  return { success: successCount, errors };
}

'use server';

import { db } from '@/db';
import { notifications } from '@/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';

type NotificationType =
  | 'approval_required'
  | 'task_completed'
  | 'task_failed'
  | 'import_complete'
  | 'enrichment_complete'
  | 'system_alert';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  message: string;
  priority?: Priority;
  actionUrl?: string;
  actionLabel?: string;
  relatedType?: string;
  relatedId?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  const id = crypto.randomUUID();

  const [notification] = await db
    .insert(notifications)
    .values({
      id,
      type: params.type,
      title: params.title,
      message: params.message,
      priority: params.priority || 'medium',
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
      relatedType: params.relatedType,
      relatedId: params.relatedId,
      read: false,
      emailSent: false,
    })
    .returning();

  return notification;
}

export async function getNotifications(options?: { unreadOnly?: boolean; limit?: number }) {
  const limit = options?.limit || 50;

  if (options?.unreadOnly) {
    return db.query.notifications.findMany({
      where: eq(notifications.read, false),
      orderBy: [desc(notifications.createdAt)],
      limit,
    });
  }

  return db.query.notifications.findMany({
    orderBy: [desc(notifications.createdAt)],
    limit,
  });
}

export async function getUnreadCount() {
  const result = await db
    .select({ count: count() })
    .from(notifications)
    .where(eq(notifications.read, false));

  return result[0]?.count || 0;
}

export async function markAsRead(id: string) {
  const [updated] = await db
    .update(notifications)
    .set({
      read: true,
      readAt: new Date().toISOString(),
    })
    .where(eq(notifications.id, id))
    .returning();

  return updated;
}

export async function markAllAsRead() {
  await db
    .update(notifications)
    .set({
      read: true,
      readAt: new Date().toISOString(),
    })
    .where(eq(notifications.read, false));

  return { success: true };
}

export async function deleteNotification(id: string) {
  await db.delete(notifications).where(eq(notifications.id, id));
  return { success: true };
}

export async function clearAllNotifications() {
  await db.delete(notifications);
  return { success: true };
}

// Helper functions for common notification types
export async function notifyImportComplete(
  importId: string,
  fileName: string,
  successCount: number,
  errorCount: number
) {
  const hasErrors = errorCount > 0;
  return createNotification({
    type: hasErrors ? 'task_completed' : 'import_complete',
    title: hasErrors ? 'Import Completed with Errors' : 'Import Complete',
    message: `Successfully imported ${successCount} records from ${fileName}${
      hasErrors ? `. ${errorCount} records failed.` : '.'
    }`,
    priority: hasErrors ? 'high' : 'medium',
    actionUrl: '/contacts',
    actionLabel: 'View Contacts',
    relatedType: 'import',
    relatedId: importId,
  });
}

export async function notifyEnrichmentComplete(
  enrichedCount: number,
  failedCount: number
) {
  const hasFailures = failedCount > 0;
  return createNotification({
    type: 'enrichment_complete',
    title: 'Enrichment Complete',
    message: `Enriched ${enrichedCount} contacts${
      hasFailures ? `. ${failedCount} contacts failed enrichment.` : '.'
    }`,
    priority: hasFailures ? 'medium' : 'low',
    actionUrl: '/contacts',
    actionLabel: 'View Contacts',
  });
}

export async function notifyDraftRequiresApproval(draftId: string, contactName: string) {
  return createNotification({
    type: 'approval_required',
    title: 'Draft Requires Approval',
    message: `A new email draft for ${contactName} is ready for review.`,
    priority: 'medium',
    actionUrl: '/agents/demandgen',
    actionLabel: 'Review Draft',
    relatedType: 'draft',
    relatedId: draftId,
  });
}

export async function notifySystemAlert(title: string, message: string, priority: Priority = 'high') {
  return createNotification({
    type: 'system_alert',
    title,
    message,
    priority,
  });
}

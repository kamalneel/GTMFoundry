'use server';

import { db } from '@/db';
import { contacts, accounts, emailDrafts, imports, activities } from '@/db/schema';
import { eq, count, sql } from 'drizzle-orm';

export interface DashboardMetrics {
  contacts: {
    total: number;
    enriched: number;
    enrichmentRate: number;
    newThisWeek: number;
  };
  accounts: {
    total: number;
    byStage: Record<string, number>;
    newThisWeek: number;
  };
  drafts: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  imports: {
    total: number;
    totalRecords: number;
    recentImports: Array<{
      id: string;
      fileName: string;
      rowCount: number;
      createdAt: string;
    }>;
  };
  activity: {
    recentActions: Array<{
      id: string;
      action: string;
      entityType: string;
      entityId: string;
      metadata: string | null;
      createdAt: string;
    }>;
  };
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekAgoStr = oneWeekAgo.toISOString();

  // Fetch all metrics in parallel
  const [
    contactsList,
    accountsList,
    draftsList,
    importsList,
    activitiesList,
  ] = await Promise.all([
    db.select().from(contacts),
    db.select().from(accounts),
    db.select().from(emailDrafts),
    db.select().from(imports).orderBy(sql`${imports.createdAt} DESC`).limit(5),
    db.select().from(activities).orderBy(sql`${activities.createdAt} DESC`).limit(10),
  ]);

  // Process contacts
  const totalContacts = contactsList.length;
  const enrichedContacts = contactsList.filter((c) => c.enrichmentStatus === 'enriched').length;
  const newContactsThisWeek = contactsList.filter((c) => c.createdAt >= oneWeekAgoStr).length;

  // Process accounts
  const totalAccounts = accountsList.length;
  const newAccountsThisWeek = accountsList.filter((a) => a.createdAt >= oneWeekAgoStr).length;
  const accountsByStage: Record<string, number> = {};
  accountsList.forEach((account) => {
    const stage = account.stage || 'prospect';
    accountsByStage[stage] = (accountsByStage[stage] || 0) + 1;
  });

  // Process drafts
  const totalDrafts = draftsList.length;
  const pendingDrafts = draftsList.filter(
    (d) => d.status === 'draft' || d.status === 'pending_approval'
  ).length;
  const approvedDrafts = draftsList.filter((d) => d.status === 'approved').length;
  const rejectedDrafts = draftsList.filter((d) => d.status === 'rejected').length;

  // Process imports
  const totalImports = importsList.length;
  const totalRecords = importsList.reduce((sum, imp) => sum + (imp.rowCount || 0), 0);

  return {
    contacts: {
      total: totalContacts,
      enriched: enrichedContacts,
      enrichmentRate: totalContacts > 0 ? Math.round((enrichedContacts / totalContacts) * 100) : 0,
      newThisWeek: newContactsThisWeek,
    },
    accounts: {
      total: totalAccounts,
      byStage: accountsByStage,
      newThisWeek: newAccountsThisWeek,
    },
    drafts: {
      total: totalDrafts,
      pending: pendingDrafts,
      approved: approvedDrafts,
      rejected: rejectedDrafts,
    },
    imports: {
      total: totalImports,
      totalRecords,
      recentImports: importsList.map((imp) => ({
        id: imp.id,
        fileName: imp.fileName,
        rowCount: imp.rowCount || 0,
        createdAt: imp.createdAt,
      })),
    },
    activity: {
      recentActions: activitiesList.map((act) => ({
        id: act.id,
        action: act.action,
        entityType: act.entityType,
        entityId: act.entityId || '',
        metadata: act.metadata,
        createdAt: act.createdAt,
      })),
    },
  };
}

export async function getAgentStats() {
  const [contactCount, accountCount, draftCount, importCount] = await Promise.all([
    db.select({ count: count() }).from(contacts),
    db.select({ count: count() }).from(accounts),
    db.select({ count: count() }).from(emailDrafts),
    db.select({ count: count() }).from(imports),
  ]);

  return {
    data: {
      contacts: contactCount[0]?.count || 0,
      accounts: accountCount[0]?.count || 0,
    },
    import: {
      imports: importCount[0]?.count || 0,
    },
    enrichment: {
      enrichedContacts: 0, // Will be calculated from contacts
    },
    demandgen: {
      drafts: draftCount[0]?.count || 0,
    },
  };
}

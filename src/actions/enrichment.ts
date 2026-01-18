'use server';

import { db } from '@/db';
import { contacts, activities, notifications, settings } from '@/db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateId } from '@/lib/utils';

// Apollo.io API response type (simplified)
interface ApolloPersonResponse {
  person?: {
    first_name?: string;
    last_name?: string;
    title?: string;
    linkedin_url?: string;
    organization?: {
      name?: string;
      industry?: string;
      website_url?: string;
      estimated_num_employees?: number;
    };
  };
}

/**
 * Enrich a single contact via Apollo.io
 */
export async function enrichContact(
  contactId: string
): Promise<{ success: boolean; message: string }> {
  const apiKey = process.env.APOLLO_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      message: 'Apollo.io API key not configured. Add APOLLO_API_KEY to environment variables.',
    };
  }

  // Get the contact
  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, contactId));

  if (!contact) {
    return { success: false, message: 'Contact not found' };
  }

  const now = new Date().toISOString();

  try {
    // Call Apollo.io People Enrichment API
    const response = await fetch('https://api.apollo.io/v1/people/match', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({
        email: contact.email,
        first_name: contact.firstName,
        last_name: contact.lastName,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Apollo API error: ${response.status} - ${error}`);
    }

    const data: ApolloPersonResponse = await response.json();

    if (!data.person) {
      // Update contact as not found
      await db
        .update(contacts)
        .set({
          enrichmentStatus: 'not_found',
          enrichedAt: now,
          updatedAt: now,
        })
        .where(eq(contacts.id, contactId));

      return { success: false, message: 'No matching person found in Apollo.io' };
    }

    // Update contact with enriched data
    await db
      .update(contacts)
      .set({
        title: data.person.title || contact.title,
        linkedin: data.person.linkedin_url || contact.linkedin,
        enrichmentStatus: 'enriched',
        enrichmentData: JSON.stringify(data.person),
        enrichedAt: now,
        updatedAt: now,
      })
      .where(eq(contacts.id, contactId));

    // Update credit usage
    await updateCreditUsage();

    // Log activity
    await db.insert(activities).values({
      id: generateId(),
      agentType: 'enrichment',
      type: 'enrichment_completed',
      title: `Contact enriched: ${contact.firstName} ${contact.lastName}`,
      contactId,
      createdAt: now,
    });

    revalidatePath('/contacts');
    revalidatePath(`/contacts/${contactId}`);
    revalidatePath('/agents/enrichment');

    return { success: true, message: 'Contact enriched successfully' };
  } catch (error) {
    // Update contact as failed
    await db
      .update(contacts)
      .set({
        enrichmentStatus: 'failed',
        updatedAt: now,
      })
      .where(eq(contacts.id, contactId));

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Enrichment failed',
    };
  }
}

/**
 * Enrich multiple contacts
 */
export async function enrichContacts(
  contactIds: string[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const id of contactIds) {
    const result = await enrichContact(id);
    if (result.success) {
      success++;
    } else {
      failed++;
    }

    // Rate limiting - wait 200ms between requests
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const now = new Date().toISOString();

  // Create notification
  await db.insert(notifications).values({
    id: generateId(),
    type: 'enrichment_complete',
    title: 'Batch Enrichment Complete',
    message: `Enriched ${success} contacts, ${failed} failed.`,
    priority: failed > 0 ? 'medium' : 'low',
    actionUrl: '/contacts',
    actionLabel: 'View Contacts',
    createdAt: now,
  });

  return { success, failed };
}

/**
 * Get contacts needing enrichment
 */
export async function getUnenrichedContacts(limit = 50) {
  return db
    .select()
    .from(contacts)
    .where(
      or(
        eq(contacts.enrichmentStatus, 'pending'),
        isNull(contacts.enrichmentStatus)
      )
    )
    .limit(limit);
}

/**
 * Get enrichment statistics
 */
export async function getEnrichmentStats() {
  const allContacts = await db.select().from(contacts);

  const stats = {
    total: allContacts.length,
    enriched: allContacts.filter((c) => c.enrichmentStatus === 'enriched').length,
    pending: allContacts.filter(
      (c) => c.enrichmentStatus === 'pending' || !c.enrichmentStatus
    ).length,
    failed: allContacts.filter((c) => c.enrichmentStatus === 'failed').length,
    notFound: allContacts.filter((c) => c.enrichmentStatus === 'not_found').length,
  };

  return {
    ...stats,
    coverage: stats.total > 0 ? Math.round((stats.enriched / stats.total) * 100) : 0,
  };
}

/**
 * Update Apollo credit usage
 */
async function updateCreditUsage() {
  const [currentSettings] = await db.select().from(settings);

  if (currentSettings) {
    await db
      .update(settings)
      .set({
        apolloCreditsUsed: (currentSettings.apolloCreditsUsed || 0) + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(settings.id, 'default'));
  }
}

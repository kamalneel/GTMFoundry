'use server';

import { db } from '@/db';
import { emailDrafts, contacts, accounts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

interface GenerateDraftParams {
  contactId: string;
  purpose: 'introduction' | 'follow-up' | 'proposal' | 'check-in' | 'custom';
  customInstructions?: string;
  tone: 'formal' | 'friendly' | 'casual';
}

export async function generateDraft({
  contactId,
  purpose,
  customInstructions,
  tone,
}: GenerateDraftParams): Promise<{ success: boolean; draft?: typeof emailDrafts.$inferSelect; error?: string }> {
  // Check for API key
  if (!process.env.ANTHROPIC_API_KEY) {
    return { success: false, error: 'Anthropic API key not configured.' };
  }

  try {
    // Get contact with account information
    const contact = await db.query.contacts.findFirst({
      where: eq(contacts.id, contactId),
      with: {
        account: true,
      },
    });

    if (!contact) {
      return { success: false, error: 'Contact not found.' };
    }

    // Build context for Claude
    const contactContext = buildContactContext(contact);
    const accountContext = contact.account ? buildAccountContext(contact.account) : '';

    // Build the prompt
    const prompt = buildEmailPrompt({
      contactContext,
      accountContext,
      purpose,
      customInstructions,
      tone,
    });

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract the text response
    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      return { success: false, error: 'No response from Claude.' };
    }

    // Parse subject and body from response
    const { subject, body } = parseEmailResponse(textContent.text);

    // Create draft in database
    const draftId = crypto.randomUUID();
    const [newDraft] = await db
      .insert(emailDrafts)
      .values({
        id: draftId,
        contactId: contact.id,
        accountId: contact.accountId,
        subject,
        body,
        context: JSON.stringify({
          purpose,
          customInstructions,
          tone,
          contactName: `${contact.firstName} ${contact.lastName}`,
          accountName: contact.account?.name,
        }),
        status: 'draft',
      })
      .returning();

    return { success: true, draft: newDraft };
  } catch (error) {
    console.error('Draft generation error:', error);
    return { success: false, error: 'Failed to generate draft.' };
  }
}

function buildContactContext(contact: any): string {
  const parts = [];
  parts.push(`Name: ${contact.firstName} ${contact.lastName}`);
  parts.push(`Email: ${contact.email}`);
  if (contact.title) parts.push(`Title: ${contact.title}`);
  if (contact.role) parts.push(`Role: ${contact.role}`);
  if (contact.department) parts.push(`Department: ${contact.department}`);
  if (contact.linkedin) parts.push(`LinkedIn: ${contact.linkedin}`);

  // Include enrichment data if available
  if (contact.enrichmentData) {
    try {
      const enriched = JSON.parse(contact.enrichmentData);
      if (enriched.headline) parts.push(`Professional headline: ${enriched.headline}`);
      if (enriched.city) parts.push(`Location: ${enriched.city}, ${enriched.state || ''}`);
    } catch {
      // Ignore parse errors
    }
  }

  return parts.join('\n');
}

function buildAccountContext(account: any): string {
  const parts = [];
  parts.push(`Company: ${account.name}`);
  if (account.industry) parts.push(`Industry: ${account.industry}`);
  if (account.website) parts.push(`Website: ${account.website}`);
  if (account.employees) parts.push(`Company size: ${account.employees} employees`);
  if (account.revenue) parts.push(`Revenue: ${account.revenue}`);
  if (account.stage) parts.push(`Sales stage: ${account.stage}`);
  return parts.join('\n');
}

function buildEmailPrompt({
  contactContext,
  accountContext,
  purpose,
  customInstructions,
  tone,
}: {
  contactContext: string;
  accountContext: string;
  purpose: string;
  customInstructions?: string;
  tone: string;
}): string {
  const purposeDescriptions: Record<string, string> = {
    'introduction': 'Write a cold outreach introduction email to establish initial contact.',
    'follow-up': 'Write a follow-up email to continue a previous conversation.',
    'proposal': 'Write an email proposing a meeting or call to discuss a potential opportunity.',
    'check-in': 'Write a casual check-in email to maintain the relationship.',
    'custom': customInstructions || 'Write a personalized email.',
  };

  const toneDescriptions: Record<string, string> = {
    'formal': 'Use a professional and formal tone.',
    'friendly': 'Use a warm and friendly but still professional tone.',
    'casual': 'Use a casual and conversational tone.',
  };

  return `You are an expert B2B sales email writer. Generate a personalized email based on the following context.

RECIPIENT INFORMATION:
${contactContext}

${accountContext ? `COMPANY INFORMATION:\n${accountContext}\n` : ''}
PURPOSE: ${purposeDescriptions[purpose]}

TONE: ${toneDescriptions[tone]}

${customInstructions ? `ADDITIONAL INSTRUCTIONS: ${customInstructions}\n` : ''}
GUIDELINES:
- Keep the email concise (under 150 words)
- Personalize based on the recipient's role and company
- Include a clear call to action
- Don't be pushy or salesy
- Sound human and authentic

RESPONSE FORMAT:
Return the email in this exact format:
SUBJECT: [Your subject line here]
BODY:
[Your email body here]`;
}

function parseEmailResponse(text: string): { subject: string; body: string } {
  const subjectMatch = text.match(/SUBJECT:\s*(.+?)(?:\n|BODY:)/si);
  const bodyMatch = text.match(/BODY:\s*([\s\S]+)/i);

  const subject = subjectMatch ? subjectMatch[1].trim() : 'Email Draft';
  const body = bodyMatch ? bodyMatch[1].trim() : text;

  return { subject, body };
}

export async function getDrafts(status?: string) {
  const query = status
    ? db.query.emailDrafts.findMany({
        where: eq(emailDrafts.status, status as any),
        with: {
          contact: true,
          account: true,
        },
        orderBy: (drafts, { desc }) => [desc(drafts.createdAt)],
      })
    : db.query.emailDrafts.findMany({
        with: {
          contact: true,
          account: true,
        },
        orderBy: (drafts, { desc }) => [desc(drafts.createdAt)],
      });

  return query;
}

export async function getDraft(id: string) {
  return db.query.emailDrafts.findFirst({
    where: eq(emailDrafts.id, id),
    with: {
      contact: true,
      account: true,
    },
  });
}

export async function updateDraft(
  id: string,
  data: {
    subject?: string;
    body?: string;
    status?: 'draft' | 'pending_approval' | 'approved' | 'rejected';
    rejectionReason?: string;
  }
) {
  const updateData: any = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  if (data.status === 'approved') {
    updateData.approvedAt = new Date().toISOString();
  }

  const [updated] = await db
    .update(emailDrafts)
    .set(updateData)
    .where(eq(emailDrafts.id, id))
    .returning();

  return updated;
}

export async function deleteDraft(id: string) {
  await db.delete(emailDrafts).where(eq(emailDrafts.id, id));
  return { success: true };
}

export async function getContactsForDrafting() {
  // Get contacts that are enriched or have good data
  return db.query.contacts.findMany({
    with: {
      account: true,
    },
    orderBy: (contacts, { desc }) => [desc(contacts.updatedAt)],
    limit: 100,
  });
}

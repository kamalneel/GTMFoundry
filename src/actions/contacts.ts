'use server';

import { db } from '@/db';
import { contacts, activities, type Contact, type NewContact } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateId } from '@/lib/utils';

/**
 * Get all contacts with optional search
 */
export async function getContacts(search?: string): Promise<Contact[]> {
  if (search) {
    return db
      .select()
      .from(contacts)
      .where(
        or(
          like(contacts.firstName, `%${search}%`),
          like(contacts.lastName, `%${search}%`),
          like(contacts.email, `%${search}%`),
          like(contacts.title, `%${search}%`)
        )
      )
      .orderBy(desc(contacts.createdAt));
  }

  return db.select().from(contacts).orderBy(desc(contacts.createdAt));
}

/**
 * Get a single contact by ID
 */
export async function getContact(id: string): Promise<Contact | undefined> {
  const results = await db.select().from(contacts).where(eq(contacts.id, id));
  return results[0];
}

/**
 * Create a new contact
 */
export async function createContact(
  data: Omit<NewContact, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Contact> {
  const id = generateId();
  const now = new Date().toISOString();

  const newContact: NewContact = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(contacts).values(newContact);

  // Log activity
  await db.insert(activities).values({
    id: generateId(),
    agentType: 'data',
    type: 'contact_created',
    title: `Contact created: ${data.firstName} ${data.lastName}`,
    contactId: id,
    accountId: data.accountId || undefined,
    createdAt: now,
  });

  revalidatePath('/contacts');
  revalidatePath('/');

  return { ...newContact } as Contact;
}

/**
 * Update a contact
 */
export async function updateContact(
  id: string,
  data: Partial<Omit<NewContact, 'id' | 'createdAt'>>
): Promise<Contact | undefined> {
  const now = new Date().toISOString();

  await db
    .update(contacts)
    .set({ ...data, updatedAt: now })
    .where(eq(contacts.id, id));

  // Log activity
  await db.insert(activities).values({
    id: generateId(),
    agentType: 'data',
    type: 'contact_updated',
    title: `Contact updated`,
    contactId: id,
    createdAt: now,
  });

  revalidatePath('/contacts');
  revalidatePath(`/contacts/${id}`);
  revalidatePath('/');

  return getContact(id);
}

/**
 * Delete a contact
 */
export async function deleteContact(id: string): Promise<void> {
  await db.delete(contacts).where(eq(contacts.id, id));

  revalidatePath('/contacts');
  revalidatePath('/');
}

/**
 * Get contact count
 */
export async function getContactCount(): Promise<number> {
  const results = await db.select().from(contacts);
  return results.length;
}

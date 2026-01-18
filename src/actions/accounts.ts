'use server';

import { db } from '@/db';
import { accounts, activities, type Account, type NewAccount } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateId } from '@/lib/utils';

/**
 * Get all accounts with optional search
 */
export async function getAccounts(search?: string): Promise<Account[]> {
  if (search) {
    return db
      .select()
      .from(accounts)
      .where(
        or(
          like(accounts.name, `%${search}%`),
          like(accounts.industry, `%${search}%`),
          like(accounts.website, `%${search}%`)
        )
      )
      .orderBy(desc(accounts.createdAt));
  }

  return db.select().from(accounts).orderBy(desc(accounts.createdAt));
}

/**
 * Get a single account by ID
 */
export async function getAccount(id: string): Promise<Account | undefined> {
  const results = await db.select().from(accounts).where(eq(accounts.id, id));
  return results[0];
}

/**
 * Create a new account
 */
export async function createAccount(
  data: Omit<NewAccount, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Account> {
  const id = generateId();
  const now = new Date().toISOString();

  const newAccount: NewAccount = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(accounts).values(newAccount);

  // Log activity
  await db.insert(activities).values({
    id: generateId(),
    agentType: 'data',
    type: 'account_created',
    title: `Account created: ${data.name}`,
    accountId: id,
    createdAt: now,
  });

  revalidatePath('/accounts');
  revalidatePath('/');

  return { ...newAccount } as Account;
}

/**
 * Update an account
 */
export async function updateAccount(
  id: string,
  data: Partial<Omit<NewAccount, 'id' | 'createdAt'>>
): Promise<Account | undefined> {
  const now = new Date().toISOString();

  await db
    .update(accounts)
    .set({ ...data, updatedAt: now })
    .where(eq(accounts.id, id));

  // Log activity
  await db.insert(activities).values({
    id: generateId(),
    agentType: 'data',
    type: 'account_updated',
    title: `Account updated`,
    accountId: id,
    createdAt: now,
  });

  revalidatePath('/accounts');
  revalidatePath(`/accounts/${id}`);
  revalidatePath('/');

  return getAccount(id);
}

/**
 * Delete an account
 */
export async function deleteAccount(id: string): Promise<void> {
  await db.delete(accounts).where(eq(accounts.id, id));

  revalidatePath('/accounts');
  revalidatePath('/');
}

/**
 * Get account count
 */
export async function getAccountCount(): Promise<number> {
  const results = await db.select().from(accounts);
  return results.length;
}

import { db } from '@/db';
import { contacts, accounts } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import Link from 'next/link';
import {
  Database,
  Users,
  Building2,
  Plus,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default async function DataAgentPage() {
  // Fetch counts
  const [contactCount, accountCount, enrichedCount] = await Promise.all([
    db.select({ count: count() }).from(contacts),
    db.select({ count: count() }).from(accounts),
    db.select({ count: count() }).from(contacts).where(eq(contacts.enrichmentStatus, 'enriched')),
  ]);

  const totalContacts = contactCount[0]?.count || 0;
  const totalAccounts = accountCount[0]?.count || 0;
  const enriched = enrichedCount[0]?.count || 0;
  const enrichmentRate = totalContacts > 0 ? Math.round((enriched / totalContacts) * 100) : 0;

  // Fetch recent contacts
  const recentContacts = await db.query.contacts.findMany({
    with: { account: true },
    orderBy: (contacts, { desc }) => [desc(contacts.createdAt)],
    limit: 5,
  });

  // Fetch recent accounts
  const recentAccounts = await db.query.accounts.findMany({
    orderBy: (accounts, { desc }) => [desc(accounts.createdAt)],
    limit: 5,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-agent-data/20">
              <Database className="w-6 h-6 text-agent-data" />
            </div>
            <h1 className="text-2xl font-bold text-white">Data Agent</h1>
          </div>
          <p className="text-zinc-400">
            Central hub for all your GTM data - contacts and accounts
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalContacts}</p>
            <p className="text-zinc-500 text-sm">Total Contacts</p>
          </div>
          <div className="bg-surface border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Building2 className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalAccounts}</p>
            <p className="text-zinc-500 text-sm">Total Accounts</p>
          </div>
          <div className="bg-surface border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{enrichmentRate}%</p>
            <p className="text-zinc-500 text-sm">Enrichment Coverage</p>
          </div>
          <div className="bg-surface border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Database className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{totalContacts + totalAccounts}</p>
            <p className="text-zinc-500 text-sm">Total Records</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <Link
            href="/contacts"
            className="bg-surface border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Contacts</h3>
                  <p className="text-zinc-500 text-sm">Manage your contact database</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
          <Link
            href="/accounts"
            className="bg-surface border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Building2 className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Accounts</h3>
                  <p className="text-zinc-500 text-sm">Manage your company records</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-2 gap-6">
          {/* Recent Contacts */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Contacts</h3>
              <Link href="/contacts/new" className="btn btn-secondary text-sm">
                <Plus className="w-4 h-4" />
                Add
              </Link>
            </div>
            {recentContacts.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-8">
                No contacts yet. Import or create your first contact.
              </p>
            ) : (
              <div className="space-y-3">
                {recentContacts.map((contact) => (
                  <Link
                    key={contact.id}
                    href={`/contacts/${contact.id}`}
                    className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-zinc-500 text-sm">{contact.email}</p>
                    </div>
                    {contact.account && (
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                        {contact.account.name}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Accounts */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Accounts</h3>
              <Link href="/accounts/new" className="btn btn-secondary text-sm">
                <Plus className="w-4 h-4" />
                Add
              </Link>
            </div>
            {recentAccounts.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-8">
                No accounts yet. Create your first account.
              </p>
            ) : (
              <div className="space-y-3">
                {recentAccounts.map((account) => (
                  <Link
                    key={account.id}
                    href={`/accounts/${account.id}`}
                    className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  >
                    <div>
                      <p className="text-white font-medium">{account.name}</p>
                      <p className="text-zinc-500 text-sm">
                        {account.industry || 'No industry'}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded capitalize ${
                        account.stage === 'closed-won'
                          ? 'bg-green-500/20 text-green-500'
                          : account.stage === 'closed-lost'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {account.stage?.replace('-', ' ')}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { getAccounts } from '@/actions/accounts';
import Link from 'next/link';
import { Building2, Plus, Search, Users, Globe } from 'lucide-react';
import { AccountsTable } from './accounts-table';
import { CreateAccountModal } from './create-account-modal';

export default async function AccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; create?: string }>;
}) {
  const params = await searchParams;
  const accounts = await getAccounts(params.search);
  const showCreateModal = params.create === 'true';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-elevated border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/">
            <h1 className="text-xl font-bold text-white">GTM Foundry</h1>
          </Link>
          <p className="text-xs text-zinc-500 mt-1">v1.0.0</p>
        </div>
        <nav className="flex-1 p-4">
          <Link href="/" className="nav-item">
            <Building2 className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/contacts" className="nav-item">
            <Users className="w-5 h-5" />
            <span>Contacts</span>
          </Link>
          <Link href="/accounts" className="nav-item active">
            <Building2 className="w-5 h-5" />
            <span>Accounts</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-surface">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Accounts</h2>
            <p className="text-zinc-400 mt-1">
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} in your database
            </p>
          </div>
          <Link href="/accounts?create=true" className="btn btn-primary">
            <Plus className="w-4 h-4" />
            Add Account
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <form className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              name="search"
              defaultValue={params.search}
              placeholder="Search accounts..."
              className="input pl-10"
            />
          </form>
        </div>

        {/* Accounts Table */}
        {accounts.length > 0 ? (
          <AccountsTable accounts={accounts} />
        ) : (
          <div className="card p-12 text-center">
            <Building2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              No accounts yet
            </h3>
            <p className="text-zinc-400 mb-6">
              Add your first account or import from a CSV file.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/accounts?create=true" className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Add Account
              </Link>
              <Link href="/agents/import" className="btn btn-secondary">
                Import CSV
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Create Account Modal */}
      {showCreateModal && <CreateAccountModal />}
    </div>
  );
}

'use client';

import { Account } from '@/db/schema';
import { deleteAccount } from '@/actions/accounts';
import Link from 'next/link';
import { Trash2, ExternalLink, Globe, Users } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AccountsTableProps {
  accounts: Account[];
}

export function AccountsTable({ accounts }: AccountsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    setDeletingId(id);
    try {
      await deleteAccount(id);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const getStageBadge = (stage: string | null) => {
    const stageColors: Record<string, string> = {
      prospect: 'bg-zinc-800 text-zinc-400',
      lead: 'bg-blue-500/15 text-blue-400',
      qualified: 'bg-purple-500/15 text-purple-400',
      opportunity: 'bg-amber-500/15 text-amber-400',
      negotiation: 'bg-orange-500/15 text-orange-400',
      'closed-won': 'bg-green-500/15 text-green-400',
      'closed-lost': 'bg-red-500/15 text-red-400',
    };

    return (
      <span className={`badge ${stageColors[stage || 'prospect'] || stageColors.prospect}`}>
        {stage || 'Prospect'}
      </span>
    );
  };

  return (
    <div className="card overflow-hidden">
      <table className="table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Stage</th>
            <th>Website</th>
            <th className="w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>
                <Link
                  href={`/accounts/${account.id}`}
                  className="text-white hover:text-brand-400 font-medium"
                >
                  {account.name}
                </Link>
              </td>
              <td className="text-zinc-400">{account.industry || '-'}</td>
              <td>{getStageBadge(account.stage)}</td>
              <td>
                {account.website ? (
                  <a
                    href={account.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    {new URL(account.website).hostname}
                  </a>
                ) : (
                  <span className="text-zinc-600">-</span>
                )}
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/accounts/${account.id}`}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-surface-hover rounded-lg transition-colors"
                    title="View details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(account.id, account.name)}
                    disabled={deletingId === account.id}
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

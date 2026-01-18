'use client';

import { Contact } from '@/db/schema';
import { deleteContact } from '@/actions/contacts';
import Link from 'next/link';
import { Mail, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    setDeletingId(id);
    try {
      await deleteContact(id);
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const getEnrichmentBadge = (status: string | null) => {
    switch (status) {
      case 'enriched':
        return <span className="badge status-completed">Enriched</span>;
      case 'pending':
        return <span className="badge status-pending">Pending</span>;
      case 'failed':
        return <span className="badge status-error">Failed</span>;
      default:
        return <span className="badge bg-zinc-800 text-zinc-400">Not enriched</span>;
    }
  };

  return (
    <div className="card overflow-hidden">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Title</th>
            <th>Enrichment</th>
            <th className="w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>
                <Link
                  href={`/contacts/${contact.id}`}
                  className="text-white hover:text-brand-400 font-medium"
                >
                  {contact.firstName} {contact.lastName}
                </Link>
              </td>
              <td>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <Mail className="w-4 h-4" />
                  {contact.email}
                </a>
              </td>
              <td className="text-zinc-400">
                {contact.title || '-'}
              </td>
              <td>
                {getEnrichmentBadge(contact.enrichmentStatus)}
              </td>
              <td>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/contacts/${contact.id}`}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-surface-hover rounded-lg transition-colors"
                    title="View details"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() =>
                      handleDelete(
                        contact.id,
                        `${contact.firstName} ${contact.lastName}`
                      )
                    }
                    disabled={deletingId === contact.id}
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

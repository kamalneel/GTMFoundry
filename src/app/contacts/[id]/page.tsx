import { getContact, updateContact } from '@/actions/contacts';
import { getAccounts } from '@/actions/accounts';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Linkedin,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { ContactEditForm } from './contact-edit-form';

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contact = await getContact(id);
  const accounts = await getAccounts();

  if (!contact) {
    notFound();
  }

  const account = contact.accountId
    ? accounts.find((a) => a.id === contact.accountId)
    : null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-elevated border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/">
            <h1 className="text-xl font-bold text-white">GTM Foundry</h1>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <Link href="/contacts" className="nav-item">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Contacts</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-surface">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">
              {contact.firstName} {contact.lastName}
            </h2>
            <p className="text-zinc-400 mt-1">{contact.title || 'No title'}</p>
          </div>
          <div className="flex items-center gap-2">
            {contact.enrichmentStatus === 'enriched' ? (
              <span className="badge status-completed">
                <Sparkles className="w-3 h-3 mr-1" />
                Enriched
              </span>
            ) : (
              <Link
                href={`/agents/enrichment?contactId=${contact.id}`}
                className="btn btn-secondary"
              >
                <Sparkles className="w-4 h-4" />
                Enrich
              </Link>
            )}
            <Link
              href={`/agents/demandgen?contactId=${contact.id}`}
              className="btn btn-primary"
            >
              <Mail className="w-4 h-4" />
              Generate Email
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Card */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-6">
                Contact Information
              </h3>
              <ContactEditForm contact={contact} accounts={accounts} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Quick Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-zinc-400">
                  <Mail className="w-5 h-5" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-white"
                  >
                    {contact.email}
                  </a>
                </div>
                {contact.phone && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Phone className="w-5 h-5" />
                    <a href={`tel:${contact.phone}`} className="hover:text-white">
                      {contact.phone}
                    </a>
                  </div>
                )}
                {account && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Building2 className="w-5 h-5" />
                    <Link
                      href={`/accounts/${account.id}`}
                      className="hover:text-white"
                    >
                      {account.name}
                    </Link>
                  </div>
                )}
                {contact.linkedin && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Linkedin className="w-5 h-5" />
                    <a
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-zinc-400">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created:{' '}
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {contact.enrichedAt && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      Enriched:{' '}
                      {new Date(contact.enrichedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {contact.lastContacted && (
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Mail className="w-4 h-4" />
                    <span>
                      Last contacted:{' '}
                      {new Date(contact.lastContacted).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

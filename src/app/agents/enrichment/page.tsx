import { getEnrichmentStats, getUnenrichedContacts } from '@/actions/enrichment';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Users, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { EnrichmentActions } from './enrichment-actions';

export default async function EnrichmentAgentPage() {
  const stats = await getEnrichmentStats();
  const unenrichedContacts = await getUnenrichedContacts(20);

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
          <Link href="/" className="nav-item">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-surface">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: '#8b5cf620', color: '#8b5cf6' }}
          >
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Enrichment Agent</h2>
            <p className="text-zinc-400">
              Enhance contact data using Apollo.io
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="metric-card gradient-enrichment">
            <p className="text-zinc-400 text-sm mb-2">Coverage</p>
            <p className="text-3xl font-bold text-white">{stats.coverage}%</p>
            <p className="text-sm text-zinc-500 mt-2">of contacts enriched</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-sm">Enriched</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.enriched}</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white">{stats.pending}</p>
          </div>
          <div className="card p-6">
            <div className="flex items-center gap-2 text-zinc-400 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-sm">Failed / Not Found</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {stats.failed + stats.notFound}
            </p>
          </div>
        </div>

        {/* Unenriched Contacts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Contacts Needing Enrichment
            </h3>
            <EnrichmentActions contacts={unenrichedContacts} />
          </div>

          {unenrichedContacts.length > 0 ? (
            <div className="space-y-3">
              {unenrichedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-4 bg-surface rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-zinc-500 text-sm">{contact.email}</p>
                    </div>
                  </div>
                  <EnrichmentActions contacts={[contact]} single />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">
                All Caught Up!
              </h4>
              <p className="text-zinc-400">
                All contacts have been enriched or attempted.
              </p>
            </div>
          )}
        </div>

        {/* API Configuration Notice */}
        {!process.env.APOLLO_API_KEY && (
          <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p className="text-amber-400 font-medium">Apollo.io API Not Configured</p>
            <p className="text-amber-400/80 text-sm mt-1">
              Add your APOLLO_API_KEY to environment variables to enable enrichment.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

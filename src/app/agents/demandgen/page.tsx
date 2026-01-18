import { getDrafts, getContactsForDrafting } from '@/actions/drafts';
import { DraftGenerator } from './draft-generator';
import { DraftList } from './draft-list';
import { Sparkles, FileText, CheckCircle, XCircle } from 'lucide-react';

export default async function DemandGenPage() {
  const [drafts, contacts] = await Promise.all([
    getDrafts(),
    getContactsForDrafting(),
  ]);

  // Calculate stats
  const totalDrafts = drafts.length;
  const pendingDrafts = drafts.filter((d) => d.status === 'draft' || d.status === 'pending_approval').length;
  const approvedDrafts = drafts.filter((d) => d.status === 'approved').length;
  const rejectedDrafts = drafts.filter((d) => d.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-agent-demandgen/20">
              <Sparkles className="w-6 h-6 text-agent-demandgen" />
            </div>
            <h1 className="text-2xl font-bold text-white">Demand Gen Agent</h1>
          </div>
          <p className="text-zinc-400">
            AI-powered personalized email drafts using contact and account context
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-surface border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800">
                <FileText className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalDrafts}</p>
                <p className="text-sm text-zinc-500">Total Drafts</p>
              </div>
            </div>
          </div>
          <div className="bg-surface border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <FileText className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{pendingDrafts}</p>
                <p className="text-sm text-zinc-500">Pending Review</p>
              </div>
            </div>
          </div>
          <div className="bg-surface border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{approvedDrafts}</p>
                <p className="text-sm text-zinc-500">Approved</p>
              </div>
            </div>
          </div>
          <div className="bg-surface border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <XCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{rejectedDrafts}</p>
                <p className="text-sm text-zinc-500">Rejected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Draft Generator */}
          <div className="col-span-1">
            <div className="bg-surface border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Generate Draft</h2>
              <DraftGenerator contacts={contacts} />
            </div>
          </div>

          {/* Draft List */}
          <div className="col-span-2">
            <div className="bg-surface border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Drafts</h2>
              <DraftList initialDrafts={drafts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

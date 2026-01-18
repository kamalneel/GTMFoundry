'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailDraft, Contact, Account } from '@/db/schema';
import { updateDraft, deleteDraft } from '@/actions/drafts';
import {
  FileText,
  Check,
  X,
  Copy,
  Trash2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Mail,
} from 'lucide-react';

type DraftWithRelations = EmailDraft & {
  contact: Contact | null;
  account: Account | null;
};

interface DraftListProps {
  initialDrafts: DraftWithRelations[];
}

export function DraftList({ initialDrafts }: DraftListProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  const handleCopy = async (draft: DraftWithRelations) => {
    const emailText = `Subject: ${draft.subject}\n\n${draft.body}`;
    await navigator.clipboard.writeText(emailText);
    setCopied(draft.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    await updateDraft(id, { status: 'approved' });
    router.refresh();
    setActionLoading(null);
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    await updateDraft(id, { status: 'rejected' });
    router.refresh();
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;
    setActionLoading(id);
    await deleteDraft(id);
    router.refresh();
    setActionLoading(null);
  };

  const handleStartEdit = (draft: DraftWithRelations) => {
    setEditingId(draft.id);
    setEditSubject(draft.subject);
    setEditBody(draft.body);
  };

  const handleSaveEdit = async (id: string) => {
    setActionLoading(id);
    await updateDraft(id, { subject: editSubject, body: editBody });
    setEditingId(null);
    router.refresh();
    setActionLoading(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditSubject('');
    setEditBody('');
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-zinc-700 text-zinc-300',
      pending_approval: 'bg-amber-500/20 text-amber-500',
      approved: 'bg-green-500/20 text-green-500',
      rejected: 'bg-red-500/20 text-red-500',
      sent: 'bg-blue-500/20 text-blue-500',
    };

    const labels: Record<string, string> = {
      draft: 'Draft',
      pending_approval: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      sent: 'Sent',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (initialDrafts.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-500">No drafts yet</p>
        <p className="text-zinc-600 text-sm">Generate your first email draft using the form</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {initialDrafts.map((draft) => (
        <div
          key={draft.id}
          className="border border-zinc-800 rounded-lg overflow-hidden"
        >
          {/* Header Row */}
          <div
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-hover transition-colors"
            onClick={() => setExpandedId(expandedId === draft.id ? null : draft.id)}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Mail className="w-5 h-5 text-zinc-500 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white font-medium truncate">{draft.subject}</p>
                <p className="text-zinc-500 text-sm">
                  To: {draft.contact?.firstName} {draft.contact?.lastName}
                  {draft.account && ` (${draft.account.name})`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(draft.status || 'draft')}
              {expandedId === draft.id ? (
                <ChevronUp className="w-5 h-5 text-zinc-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-zinc-500" />
              )}
            </div>
          </div>

          {/* Expanded Content */}
          {expandedId === draft.id && (
            <div className="border-t border-zinc-800 p-4 bg-surface-hover/50">
              {editingId === draft.id ? (
                /* Edit Mode */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Subject</label>
                    <input
                      type="text"
                      value={editSubject}
                      onChange={(e) => setEditSubject(e.target.value)}
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1">Body</label>
                    <textarea
                      value={editBody}
                      onChange={(e) => setEditBody(e.target.value)}
                      rows={8}
                      className="input resize-none font-mono text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(draft.id)}
                      disabled={actionLoading === draft.id}
                      className="btn btn-primary text-sm"
                    >
                      {actionLoading === draft.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn btn-secondary text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
                  <div className="mb-4">
                    <p className="text-sm text-zinc-400 mb-1">Subject:</p>
                    <p className="text-white">{draft.subject}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-zinc-400 mb-1">Body:</p>
                    <div className="bg-zinc-900 rounded-lg p-4 whitespace-pre-wrap text-zinc-300 font-mono text-sm">
                      {draft.body}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-600 mb-4">
                    Created: {new Date(draft.createdAt).toLocaleString()}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleCopy(draft)}
                      className="btn btn-secondary text-sm"
                    >
                      {copied === draft.id ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy to Clipboard
                        </>
                      )}
                    </button>

                    {(draft.status === 'draft' || draft.status === 'pending_approval') && (
                      <>
                        <button
                          onClick={() => handleStartEdit(draft)}
                          className="btn btn-secondary text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleApprove(draft.id)}
                          disabled={actionLoading === draft.id}
                          className="btn text-sm bg-green-600 hover:bg-green-500 text-white"
                        >
                          {actionLoading === draft.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(draft.id)}
                          disabled={actionLoading === draft.id}
                          className="btn text-sm bg-red-600 hover:bg-red-500 text-white"
                        >
                          {actionLoading === draft.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <X className="w-4 h-4" />
                              Reject
                            </>
                          )}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleDelete(draft.id)}
                      disabled={actionLoading === draft.id}
                      className="btn btn-secondary text-sm text-red-400 hover:text-red-300"
                    >
                      {actionLoading === draft.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

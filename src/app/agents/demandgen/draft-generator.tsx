'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateDraft } from '@/actions/drafts';
import { Contact, Account } from '@/db/schema';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

type ContactWithAccount = Contact & {
  account: Account | null;
};

interface DraftGeneratorProps {
  contacts: ContactWithAccount[];
}

export function DraftGenerator({ contacts }: DraftGeneratorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const contactId = formData.get('contactId') as string;
    const purpose = formData.get('purpose') as any;
    const tone = formData.get('tone') as any;
    const customInstructions = formData.get('customInstructions') as string;

    if (!contactId) {
      setError('Please select a contact');
      setLoading(false);
      return;
    }

    try {
      const result = await generateDraft({
        contactId,
        purpose,
        tone,
        customInstructions: customInstructions || undefined,
      });

      if (result.success) {
        setSuccess(true);
        router.refresh();
        // Reset form
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'Failed to generate draft');
      }
    } catch (err) {
      setError('An error occurred while generating the draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
          Draft generated successfully!
        </div>
      )}

      {/* Contact Selection */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Select Contact *
        </label>
        <select name="contactId" required className="input">
          <option value="">Choose a contact...</option>
          {contacts.map((contact) => (
            <option key={contact.id} value={contact.id}>
              {contact.firstName} {contact.lastName}
              {contact.account ? ` (${contact.account.name})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Email Purpose *
        </label>
        <select name="purpose" required className="input">
          <option value="introduction">Introduction / Cold Outreach</option>
          <option value="follow-up">Follow-up</option>
          <option value="proposal">Meeting Proposal</option>
          <option value="check-in">Check-in</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Tone */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Tone *
        </label>
        <select name="tone" required className="input">
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
        </select>
      </div>

      {/* Custom Instructions */}
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Additional Instructions
        </label>
        <textarea
          name="customInstructions"
          rows={3}
          className="input resize-none"
          placeholder="Any specific points to include, topics to mention, etc."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || contacts.length === 0}
        className="btn btn-primary w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Draft
          </>
        )}
      </button>

      {contacts.length === 0 && (
        <p className="text-zinc-500 text-sm text-center">
          No contacts available. Import or create contacts first.
        </p>
      )}
    </form>
  );
}

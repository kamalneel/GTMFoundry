'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enrichContact, enrichContacts } from '@/actions/enrichment';
import { Contact } from '@/db/schema';
import { Sparkles, Loader2 } from 'lucide-react';

interface EnrichmentActionsProps {
  contacts: Contact[];
  single?: boolean;
}

export function EnrichmentActions({ contacts, single }: EnrichmentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleEnrich = async () => {
    setLoading(true);
    setResult(null);

    try {
      if (single && contacts.length === 1) {
        const res = await enrichContact(contacts[0].id);
        setResult(res.message);
      } else {
        const contactIds = contacts.map((c) => c.id);
        const res = await enrichContacts(contactIds);
        setResult(`Enriched ${res.success} contacts, ${res.failed} failed`);
      }
      router.refresh();
    } catch (error) {
      setResult('Enrichment failed');
    } finally {
      setLoading(false);

      // Clear result after 3 seconds
      setTimeout(() => setResult(null), 3000);
    }
  };

  if (single) {
    return (
      <button
        onClick={handleEnrich}
        disabled={loading}
        className="btn btn-secondary text-sm py-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Enrich
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {result && (
        <span className="text-sm text-zinc-400">{result}</span>
      )}
      <button
        onClick={handleEnrich}
        disabled={loading || contacts.length === 0}
        className="btn btn-primary"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enriching...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Enrich All ({contacts.length})
          </>
        )}
      </button>
    </div>
  );
}

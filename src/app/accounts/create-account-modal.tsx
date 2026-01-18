'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAccount } from '@/actions/accounts';
import { X } from 'lucide-react';

export function CreateAccountModal() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    router.push('/accounts');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      await createAccount({
        name: formData.get('name') as string,
        industry: (formData.get('industry') as string) || undefined,
        website: (formData.get('website') as string) || undefined,
        employees: (formData.get('employees') as string) || undefined,
        revenue: (formData.get('revenue') as string) || undefined,
        stage: (formData.get('stage') as any) || 'prospect',
        source: 'manual',
      });

      router.push('/accounts');
      router.refresh();
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 backdrop" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-surface-elevated border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add Account</h2>
          <button
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="name"
              required
              className="input"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Industry
            </label>
            <input
              type="text"
              name="industry"
              className="input"
              placeholder="Technology, Healthcare, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              className="input"
              placeholder="https://example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Employees
              </label>
              <select name="employees" className="input">
                <option value="">Select range</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Revenue
              </label>
              <select name="revenue" className="input">
                <option value="">Select range</option>
                <option value="<$1M">{'<$1M'}</option>
                <option value="$1M-$10M">$1M-$10M</option>
                <option value="$10M-$50M">$10M-$50M</option>
                <option value="$50M-$100M">$50M-$100M</option>
                <option value="$100M+">$100M+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Stage
            </label>
            <select name="stage" className="input">
              <option value="prospect">Prospect</option>
              <option value="lead">Lead</option>
              <option value="qualified">Qualified</option>
              <option value="opportunity">Opportunity</option>
              <option value="negotiation">Negotiation</option>
              <option value="closed-won">Closed Won</option>
              <option value="closed-lost">Closed Lost</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

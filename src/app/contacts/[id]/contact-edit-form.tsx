'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateContact } from '@/actions/contacts';
import { Contact, Account } from '@/db/schema';
import { Save } from 'lucide-react';

interface ContactEditFormProps {
  contact: Contact;
  accounts: Account[];
}

export function ContactEditForm({ contact, accounts }: ContactEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const formData = new FormData(e.currentTarget);

    try {
      await updateContact(contact.id, {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        phone: (formData.get('phone') as string) || undefined,
        title: (formData.get('title') as string) || undefined,
        role: (formData.get('role') as string) || undefined,
        department: (formData.get('department') as string) || undefined,
        linkedin: (formData.get('linkedin') as string) || undefined,
        accountId: (formData.get('accountId') as string) || undefined,
      });

      setSaved(true);
      router.refresh();

      // Reset saved indicator after 2 seconds
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            defaultValue={contact.firstName}
            required
            className="input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            defaultValue={contact.lastName}
            required
            className="input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          defaultValue={contact.email}
          required
          className="input"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={contact.phone || ''}
          className="input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            defaultValue={contact.title || ''}
            className="input"
            placeholder="e.g., VP of Sales"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Role
          </label>
          <input
            type="text"
            name="role"
            defaultValue={contact.role || ''}
            className="input"
            placeholder="e.g., Decision Maker"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Department
        </label>
        <input
          type="text"
          name="department"
          defaultValue={contact.department || ''}
          className="input"
          placeholder="e.g., Sales, Engineering"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          LinkedIn URL
        </label>
        <input
          type="url"
          name="linkedin"
          defaultValue={contact.linkedin || ''}
          className="input"
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Account
        </label>
        <select
          name="accountId"
          defaultValue={contact.accountId || ''}
          className="input"
        >
          <option value="">No account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          <Save className="w-4 h-4" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        {saved && (
          <span className="text-brand-400 text-sm">Changes saved!</span>
        )}
      </div>
    </form>
  );
}

import { getImports } from '@/actions/imports';
import Link from 'next/link';
import { Upload, ArrowLeft, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { ImportUploader } from './import-uploader';

export default async function ImportAgentPage() {
  const imports = await getImports();

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
            style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}
          >
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Import Agent</h2>
            <p className="text-zinc-400">Upload CSV files to import contacts and accounts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Upload CSV</h3>
            <ImportUploader />
          </div>

          {/* Import History */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Import History</h3>
            {imports.length > 0 ? (
              <div className="space-y-3">
                {imports.slice(0, 10).map((imp) => (
                  <div
                    key={imp.id}
                    className="flex items-center justify-between p-3 bg-surface rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-zinc-500" />
                      <div>
                        <p className="text-white text-sm font-medium">
                          {imp.fileName}
                        </p>
                        <p className="text-zinc-500 text-xs">
                          {new Date(imp.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {imp.status === 'completed' && (
                        <span className="badge status-completed">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {imp.successCount} imported
                        </span>
                      )}
                      {imp.status === 'failed' && (
                        <span className="badge status-error">
                          <XCircle className="w-3 h-3 mr-1" />
                          Failed
                        </span>
                      )}
                      {imp.status === 'processing' && (
                        <span className="badge status-pending">
                          <Clock className="w-3 h-3 mr-1" />
                          Processing
                        </span>
                      )}
                      {imp.status === 'pending' && (
                        <span className="badge bg-zinc-800 text-zinc-400">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 text-center py-8">
                No imports yet. Upload a CSV to get started.
              </p>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 card p-6">
          <h3 className="text-lg font-semibold text-white mb-4">CSV Format Guide</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Contact Fields</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• <code className="text-brand-400">firstName</code> - First name (required)</li>
                <li>• <code className="text-brand-400">lastName</code> - Last name</li>
                <li>• <code className="text-brand-400">email</code> - Email address (required)</li>
                <li>• <code className="text-brand-400">phone</code> - Phone number</li>
                <li>• <code className="text-brand-400">title</code> - Job title</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Account Fields</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• <code className="text-brand-400">company</code> - Company name</li>
                <li>• <code className="text-brand-400">industry</code> - Industry</li>
                <li>• <code className="text-brand-400">website</code> - Company website</li>
                <li>• <code className="text-brand-400">employees</code> - Employee count</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import { getDashboardMetrics } from '@/actions/analytics';
import {
  BarChart3,
  Users,
  Building2,
  FileText,
  Upload,
  TrendingUp,
  Sparkles,
  CheckCircle,
  Clock,
  Activity,
} from 'lucide-react';

export default async function AnalyticsPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-agent-analytics/20">
              <BarChart3 className="w-6 h-6 text-agent-analytics" />
            </div>
            <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          </div>
          <p className="text-zinc-400">
            Overview of your GTM metrics and agent activity
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-4">
          {/* Total Contacts */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              {metrics.contacts.newThisWeek > 0 && (
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />+{metrics.contacts.newThisWeek}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-white">{metrics.contacts.total}</p>
            <p className="text-zinc-500 text-sm">Total Contacts</p>
          </div>

          {/* Total Accounts */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Building2 className="w-5 h-5 text-purple-500" />
              </div>
              {metrics.accounts.newThisWeek > 0 && (
                <span className="text-green-500 text-sm flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />+{metrics.accounts.newThisWeek}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-white">{metrics.accounts.total}</p>
            <p className="text-zinc-500 text-sm">Total Accounts</p>
          </div>

          {/* Enrichment Rate */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.contacts.enrichmentRate}%</p>
            <p className="text-zinc-500 text-sm">
              Enriched ({metrics.contacts.enriched}/{metrics.contacts.total})
            </p>
          </div>

          {/* Drafts Approved */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{metrics.drafts.approved}</p>
            <p className="text-zinc-500 text-sm">
              Approved Drafts ({metrics.drafts.pending} pending)
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Account Pipeline */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-500" />
              Account Pipeline
            </h3>
            {Object.keys(metrics.accounts.byStage).length === 0 ? (
              <p className="text-zinc-500 text-sm">No accounts yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(metrics.accounts.byStage).map(([stage, count]) => (
                  <div key={stage} className="flex items-center justify-between">
                    <span className="text-zinc-400 capitalize">{stage.replace('-', ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{
                            width: `${(count / metrics.accounts.total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-white font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Draft Stats */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-agent-demandgen" />
              Email Drafts
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-white">{metrics.drafts.total}</p>
                <p className="text-zinc-500 text-sm">Total Created</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-amber-500">{metrics.drafts.pending}</p>
                <p className="text-zinc-500 text-sm">Pending Review</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-green-500">{metrics.drafts.approved}</p>
                <p className="text-zinc-500 text-sm">Approved</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4">
                <p className="text-2xl font-bold text-red-500">{metrics.drafts.rejected}</p>
                <p className="text-zinc-500 text-sm">Rejected</p>
              </div>
            </div>
          </div>

          {/* Import History */}
          <div className="bg-surface border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-agent-import" />
              Recent Imports
            </h3>
            {metrics.imports.recentImports.length === 0 ? (
              <p className="text-zinc-500 text-sm">No imports yet</p>
            ) : (
              <div className="space-y-3">
                {metrics.imports.recentImports.map((imp) => (
                  <div
                    key={imp.id}
                    className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-white text-sm truncate">{imp.fileName}</p>
                      <p className="text-zinc-500 text-xs">
                        {new Date(imp.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-zinc-400 text-sm">{imp.rowCount} rows</span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Total Records Imported</span>
                <span className="text-white font-medium">{metrics.imports.totalRecords}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-surface border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-500" />
            Recent Activity
          </h3>
          {metrics.activity.recentActions.length === 0 ? (
            <p className="text-zinc-500 text-sm">No activity yet</p>
          ) : (
            <div className="space-y-3">
              {metrics.activity.recentActions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-center gap-4 p-3 bg-zinc-800/30 rounded-lg"
                >
                  <div className="p-2 rounded-lg bg-zinc-800">
                    <Clock className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-medium capitalize">{action.action.replace('_', ' ')}</span>
                      {' '}
                      <span className="text-zinc-400">{action.entityType}</span>
                    </p>
                    <p className="text-zinc-500 text-xs">
                      {new Date(action.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agent Summary */}
        <div className="bg-surface border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Agent Summary</h3>
          <div className="grid grid-cols-6 gap-4">
            <AgentCard
              name="Data"
              color="bg-agent-data"
              stat={`${metrics.contacts.total} contacts`}
              substat={`${metrics.accounts.total} accounts`}
            />
            <AgentCard
              name="Import"
              color="bg-agent-import"
              stat={`${metrics.imports.total} imports`}
              substat={`${metrics.imports.totalRecords} records`}
            />
            <AgentCard
              name="Enrichment"
              color="bg-agent-enrichment"
              stat={`${metrics.contacts.enriched} enriched`}
              substat={`${metrics.contacts.enrichmentRate}% coverage`}
            />
            <AgentCard
              name="Demand Gen"
              color="bg-agent-demandgen"
              stat={`${metrics.drafts.total} drafts`}
              substat={`${metrics.drafts.approved} approved`}
            />
            <AgentCard
              name="Analytics"
              color="bg-agent-analytics"
              stat="Active"
              substat="Real-time metrics"
            />
            <AgentCard
              name="Assistant"
              color="bg-agent-assistant"
              stat="Active"
              substat="Notifications"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentCard({
  name,
  color,
  stat,
  substat,
}: {
  name: string;
  color: string;
  stat: string;
  substat: string;
}) {
  return (
    <div className="bg-zinc-800/30 border border-zinc-800 rounded-lg p-4">
      <div className={`w-3 h-3 rounded-full ${color} mb-3`} />
      <p className="text-white font-medium">{name}</p>
      <p className="text-zinc-400 text-sm">{stat}</p>
      <p className="text-zinc-600 text-xs">{substat}</p>
    </div>
  );
}

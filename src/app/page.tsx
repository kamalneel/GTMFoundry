import {
  Database,
  Upload,
  Sparkles,
  Mail,
  BarChart3,
  MessageCircle,
  Globe,
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { getActiveV1Agents } from '@/data/agents';

// Map icon names to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Database,
  Upload,
  Sparkles,
  Mail,
  BarChart3,
  MessageCircle,
  Globe,
};

export default function DashboardPage() {
  const agents = getActiveV1Agents();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-elevated border-r border-zinc-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold text-white">GTM Foundry</h1>
          <p className="text-xs text-zinc-500 mt-1">v1.0.0</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 mb-3">
            Overview
          </p>
          <Link href="/" className="nav-item active">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link href="/accounts" className="nav-item">
            <Building2 className="w-5 h-5" />
            <span>Accounts</span>
          </Link>
          <Link href="/contacts" className="nav-item">
            <Users className="w-5 h-5" />
            <span>Contacts</span>
          </Link>

          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-4 mb-3 mt-6">
            Agents
          </p>
          {agents.map((agent) => {
            const Icon = iconMap[agent.icon] || Database;
            return (
              <Link
                key={agent.id}
                href={`/agents/${agent.id}`}
                className="nav-item"
              >
                <Icon className="w-5 h-5" style={{ color: agent.color }} />
                <span>{agent.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="p-4 border-t border-zinc-800 space-y-1">
          <Link href="/settings" className="nav-item">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
          <Link href="/help" className="nav-item">
            <HelpCircle className="w-5 h-5" />
            <span>Help</span>
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 bg-surface">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="text-zinc-400 mt-1">
            Here&apos;s what&apos;s happening with your GTM operations
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Contacts"
            value="0"
            change="+0%"
            gradient="gradient-data"
          />
          <MetricCard
            title="Accounts"
            value="0"
            change="+0%"
            gradient="gradient-import"
          />
          <MetricCard
            title="Enriched"
            value="0%"
            change="+0%"
            gradient="gradient-enrichment"
          />
          <MetricCard
            title="Drafts Created"
            value="0"
            change="+0"
            gradient="gradient-demandgen"
          />
        </div>

        {/* Agents Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Active Agents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => {
              const Icon = iconMap[agent.icon] || Database;
              return (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  description={agent.description}
                  icon={<Icon className="w-6 h-6" />}
                  color={agent.color}
                  status={agent.status}
                  href={`/agents/${agent.id}`}
                />
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Imports
            </h3>
            <div className="text-zinc-500 text-center py-8">
              No imports yet. Upload a CSV to get started.
            </div>
          </div>
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Recent Drafts
            </h3>
            <div className="text-zinc-500 text-center py-8">
              No drafts yet. Enrich contacts and generate emails.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  gradient,
}: {
  title: string;
  value: string;
  change: string;
  gradient: string;
}) {
  return (
    <div className={`metric-card ${gradient}`}>
      <p className="text-zinc-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-sm text-zinc-500 mt-2">{change} from last week</p>
    </div>
  );
}

function AgentCard({
  name,
  description,
  icon,
  color,
  status,
  href,
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  status: string;
  href: string;
}) {
  return (
    <Link href={href} className="card p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
        <span
          className={`badge ${status === 'active' ? 'status-active' : 'status-pending'}`}
        >
          {status}
        </span>
      </div>
      <h4 className="text-lg font-semibold text-white mb-2">{name} Agent</h4>
      <p className="text-sm text-zinc-400 line-clamp-2">{description}</p>
      <div className="mt-4 flex items-center text-sm text-zinc-500 group-hover:text-brand-400 transition-colors">
        <span>View details</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

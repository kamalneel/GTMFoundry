'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from '@/db/schema';
import {
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from '@/actions/notifications';
import {
  Bell,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  Sparkles,
  Info,
  Check,
  Trash2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface NotificationCenterProps {
  initialNotifications: Notification[];
  grouped: {
    today: Notification[];
    yesterday: Notification[];
    older: Notification[];
  };
}

export function NotificationCenter({ initialNotifications, grouped }: NotificationCenterProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleMarkAsRead = async (id: string) => {
    setLoading(id);
    await markAsRead(id);
    router.refresh();
    setLoading(null);
  };

  const handleMarkAllAsRead = async () => {
    setLoading('all');
    await markAllAsRead();
    router.refresh();
    setLoading(null);
  };

  const handleDelete = async (id: string) => {
    setLoading(id);
    await deleteNotification(id);
    router.refresh();
    setLoading(null);
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all notifications?')) return;
    setLoading('clear');
    await clearAllNotifications();
    router.refresh();
    setLoading(null);
  };

  const getIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      approval_required: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      task_completed: <CheckCircle className="w-5 h-5 text-green-500" />,
      task_failed: <XCircle className="w-5 h-5 text-red-500" />,
      import_complete: <Upload className="w-5 h-5 text-agent-import" />,
      enrichment_complete: <Sparkles className="w-5 h-5 text-agent-enrichment" />,
      system_alert: <Info className="w-5 h-5 text-blue-500" />,
    };
    return icons[type] || <Bell className="w-5 h-5 text-zinc-500" />;
  };

  const getPriorityStyles = (priority: string) => {
    const styles: Record<string, string> = {
      urgent: 'border-l-4 border-l-red-500',
      high: 'border-l-4 border-l-amber-500',
      medium: 'border-l-4 border-l-blue-500',
      low: 'border-l-4 border-l-zinc-600',
    };
    return styles[priority] || styles.medium;
  };

  const renderNotification = (notification: Notification) => (
    <div
      key={notification.id}
      className={`bg-surface border border-zinc-800 rounded-lg p-4 ${getPriorityStyles(
        notification.priority || 'medium'
      )} ${!notification.read ? 'bg-surface-elevated' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-zinc-800 flex-shrink-0">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-medium">{notification.title}</h4>
            {!notification.read && (
              <span className="w-2 h-2 rounded-full bg-brand-500" />
            )}
          </div>
          <p className="text-zinc-400 text-sm mb-2">{notification.message}</p>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span>{formatTime(notification.createdAt)}</span>
            {notification.actionUrl && (
              <Link
                href={notification.actionUrl}
                className="text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                {notification.actionLabel || 'View'}
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {!notification.read && (
            <button
              onClick={() => handleMarkAsRead(notification.id)}
              disabled={loading === notification.id}
              className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
              title="Mark as read"
            >
              {loading === notification.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </button>
          )}
          <button
            onClick={() => handleDelete(notification.id)}
            disabled={loading === notification.id}
            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  if (initialNotifications.length === 0) {
    return null;
  }

  const hasUnread = initialNotifications.some((n) => !n.read);

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasUnread && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading === 'all'}
              className="btn btn-secondary text-sm"
            >
              {loading === 'all' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Mark all read
                </>
              )}
            </button>
          )}
        </div>
        <button
          onClick={handleClearAll}
          disabled={loading === 'clear'}
          className="btn btn-secondary text-sm text-red-400 hover:text-red-300"
        >
          {loading === 'clear' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Clear all
            </>
          )}
        </button>
      </div>

      {/* Today */}
      {grouped.today.length > 0 && (
        <div>
          <h3 className="text-zinc-500 text-sm font-medium mb-3">Today</h3>
          <div className="space-y-3">
            {grouped.today.map(renderNotification)}
          </div>
        </div>
      )}

      {/* Yesterday */}
      {grouped.yesterday.length > 0 && (
        <div>
          <h3 className="text-zinc-500 text-sm font-medium mb-3">Yesterday</h3>
          <div className="space-y-3">
            {grouped.yesterday.map(renderNotification)}
          </div>
        </div>
      )}

      {/* Older */}
      {grouped.older.length > 0 && (
        <div>
          <h3 className="text-zinc-500 text-sm font-medium mb-3">Older</h3>
          <div className="space-y-3">
            {grouped.older.map(renderNotification)}
          </div>
        </div>
      )}
    </div>
  );
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // Less than 1 minute
  if (diff < 60000) {
    return 'Just now';
  }

  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }

  // Show date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

import { getNotifications, getUnreadCount } from '@/actions/notifications';
import { NotificationCenter } from './notification-center';
import { Bot, Bell, BellRing, Settings } from 'lucide-react';
import Link from 'next/link';

export default async function AssistantPage() {
  const [allNotifications, unreadCount] = await Promise.all([
    getNotifications({ limit: 100 }),
    getUnreadCount(),
  ]);

  // Group notifications by date
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  const grouped = {
    today: allNotifications.filter(
      (n) => new Date(n.createdAt).toDateString() === today
    ),
    yesterday: allNotifications.filter(
      (n) => new Date(n.createdAt).toDateString() === yesterday
    ),
    older: allNotifications.filter((n) => {
      const date = new Date(n.createdAt).toDateString();
      return date !== today && date !== yesterday;
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-agent-assistant/20">
                  <Bot className="w-6 h-6 text-agent-assistant" />
                </div>
                <h1 className="text-2xl font-bold text-white">Assistant</h1>
              </div>
              <p className="text-zinc-400">
                Your notification center and activity hub
              </p>
            </div>
            <Link
              href="/settings/notifications"
              className="btn btn-secondary text-sm"
            >
              <Settings className="w-4 h-4" />
              Preferences
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Stats Bar */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-surface border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3">
            {unreadCount > 0 ? (
              <div className="p-2 rounded-lg bg-red-500/20">
                <BellRing className="w-5 h-5 text-red-500" />
              </div>
            ) : (
              <div className="p-2 rounded-lg bg-zinc-800">
                <Bell className="w-5 h-5 text-zinc-500" />
              </div>
            )}
            <div>
              <p className="text-2xl font-bold text-white">{unreadCount}</p>
              <p className="text-zinc-500 text-sm">Unread</p>
            </div>
          </div>
          <div className="h-10 w-px bg-zinc-800" />
          <div>
            <p className="text-2xl font-bold text-white">{allNotifications.length}</p>
            <p className="text-zinc-500 text-sm">Total Notifications</p>
          </div>
          <div className="h-10 w-px bg-zinc-800" />
          <div>
            <p className="text-2xl font-bold text-white">{grouped.today.length}</p>
            <p className="text-zinc-500 text-sm">Today</p>
          </div>
        </div>

        {/* Notification Center */}
        <NotificationCenter
          initialNotifications={allNotifications}
          grouped={grouped}
        />

        {/* Empty State */}
        {allNotifications.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-zinc-800 inline-block mb-4">
              <Bell className="w-12 h-12 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              You'll receive notifications here when important events happen,
              like completed imports, enrichments, or drafts that need your approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

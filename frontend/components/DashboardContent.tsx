"use client";

import { Users, MessageSquare, Send, TrendingUp, BarChart3 } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useContacts } from "@/hooks/useContacts";
import { useCampaigns } from "@/hooks/useCampaigns";

export default function DashboardContent() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: contacts } = useContacts();
  const { data: campaigns } = useCampaigns();

  const statCards = [
    {
      label: "Total Contacts",
      value: stats?.totalContacts || 0,
      change: stats?.contactsChange || "+0%",
      icon: Users,
      color: "bg-teal-500",
    },
    {
      label: "Active Chats",
      value: stats?.activeChats || 0,
      change: stats?.chatsChange || "+0%",
      icon: MessageSquare,
      color: "bg-emerald-500",
    },
    {
      label: "Campaigns",
      value: stats?.campaigns || 0,
      change: stats?.campaignsChange || "+0%",
      icon: Send,
      color: "bg-purple-500",
    },
    {
      label: "Messages Sent",
      value: stats?.messagesSent || 0,
      change: stats?.messagesChange || "+0%",
      icon: TrendingUp,
      color: "bg-blue-500",
    },
  ];

  const activities = [
    {
      name: "Sarah Johnson",
      action: "Replied to your message",
      time: "2m ago",
      type: "message",
    },
    {
      name: "New Campaign",
      action: "'Summer Sale' went live",
      time: "15m ago",
      type: "campaign",
    },
  ];

  const performance = [
    { label: "Message Delivery", value: 98.5 },
    { label: "Read Rate", value: 76.2 },
    { label: "Response Rate", value: 82.8 },
    { label: "Campaign Success", value: 91.4 },
  ];

  if (statsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold dark:text-white">{stat.value.toLocaleString()}</h3>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs text-emerald-600">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold dark:text-white">Message Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your messaging performance</p>
            </div>
            <div className="flex gap-2">
              {["7D", "30D", "90D", "1Y"].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 text-sm rounded ${
                    period === "30D"
                      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[40, 55, 45, 60, 50, 70, 65].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col gap-2">
                <div
                  className="bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-lg"
                  style={{ height: `${height}%` }}
                />
                <div
                  className="bg-gradient-to-t from-teal-500 to-teal-300 rounded-t-lg"
                  style={{ height: `${height * 0.8}%` }}
                />
                <div
                  className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg"
                  style={{ height: `${height * 0.6}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Sent</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Read</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "New Message", icon: MessageSquare, color: "bg-emerald-500", href: "/chat" },
                { label: "Add Contact", icon: Users, color: "bg-emerald-500", href: "/contacts" },
                { label: "New Campaign", icon: Send, color: "bg-purple-500", href: "/campaigns" },
                { label: "Create Template", icon: BarChart3, color: "bg-blue-500", href: "/templates" },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs text-gray-700 dark:text-gray-300 text-center">{action.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold dark:text-white">Performance</h3>
            </div>
            <div className="space-y-4">
              {performance.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className="font-medium dark:text-white">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold dark:text-white">Recent Activity</h3>
            <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300">
              View all →
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "message" ? "bg-emerald-100 dark:bg-emerald-900" : "bg-purple-100 dark:bg-purple-900"
                  }`}
                >
                  {activity.type === "message" ? (
                    <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Send className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium dark:text-white">{activity.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gray-900 dark:bg-emerald-600 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold dark:text-white">Campaign Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track performance across all campaigns</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Sent", value: "45,234" },
              { label: "Delivered", value: "44,891" },
              { label: "Read", value: "34,567" },
              { label: "Clicked", value: "12,345" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold mb-1 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

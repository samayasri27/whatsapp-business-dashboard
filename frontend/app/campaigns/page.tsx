"use client";
import Sidebar from "@/components/Sidebar";

import { useState } from "react";
import Header from "@/components/Header";
import CreateCampaignModal from "@/components/CreateCampaignModal";
import { Users, Send, TrendingUp, BarChart3, Plus } from "lucide-react";

export default function Campaigns() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const campaigns = [
    {
      title: "Summer Sale 2024",
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      description: "Promotional campaign for our summer collection with exclusive discounts",
      recipients: 2458,
      sent: 2458,
      readRate: "78%",
      deliveryRate: "97%",
      date: "Mar 15, 2024",
    },
    {
      title: "Welcome Series",
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      description: "Automated welcome messages for new subscribers",
      recipients: 1234,
      sent: 1234,
      readRate: "82%",
      deliveryRate: "97%",
      date: "Mar 10, 2024",
    },
    {
      title: "Product Launch",
      status: "Completed",
      statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      description: "Announcement campaign for our new product line",
      recipients: 5678,
      sent: 5678,
      readRate: "75%",
      deliveryRate: "97%",
      date: "Mar 5, 2024",
    },
    {
      title: "Re-engagement",
      status: "Paused",
      statusColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      description: "Win back inactive customers with special offers",
      recipients: 892,
      sent: 450,
      readRate: "53%",
      deliveryRate: "97%",
      date: "Feb 28, 2024",
    },
    {
      title: "Flash Sale Alert",
      status: "Scheduled",
      statusColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      description: "24-hour flash sale notification to VIP customers",
      recipients: 1567,
      sent: 0,
      readRate: "NaN%",
      deliveryRate: "NaN%",
      date: "Mar 20, 2024",
    },
    {
      title: "Customer Feedback",
      status: "Draft",
      statusColor: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      description: "Request feedback from recent purchasers",
      recipients: 789,
      sent: 0,
      readRate: "NaN%",
      deliveryRate: "NaN%",
      date: "—",
    },
  ];

  const stats = [
    { label: "Total Campaigns", value: "6", color: "border-l-emerald-500" },
    { label: "Active", value: "2", color: "border-l-blue-500" },
    { label: "Messages Sent", value: "12.4K", color: "border-l-purple-500" },
    { label: "Avg. Read Rate", value: "76%", color: "border-l-pink-500" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Campaigns" subtitle="Welcome back! Here's what's happening" />
      
      <div className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Campaigns</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          </div>
          
          <CreateCampaignModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage broadcast campaigns</p>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`bg-white dark:bg-gray-800 rounded-lg p-6 border-l-4 ${stat.color} dark:border-opacity-80`}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold dark:text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-2">
                {["All", "Active", "Scheduled", "Completed", "Drafts"].map((filter) => (
                  <button
                    key={filter}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      filter === "All"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              <button className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 p-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.title}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold mb-1 dark:text-white">{campaign.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${campaign.statusColor}`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">⋯</button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{campaign.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Recipients</p>
                    </div>
                    <p className="text-lg font-semibold dark:text-white">{campaign.recipients.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
                    </div>
                    <p className="text-lg font-semibold dark:text-white">{campaign.sent.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Read Rate</p>
                    </div>
                    <p className="text-lg font-semibold dark:text-white">{campaign.readRate}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Delivery Rate</span>
                      <span className="font-medium dark:text-white">{campaign.deliveryRate}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: campaign.deliveryRate }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Read Rate</span>
                      <span className="font-medium dark:text-white">{campaign.readRate}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 dark:bg-gray-300 rounded-full"
                        style={{ width: campaign.readRate }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>📅</span>
                    <span>{campaign.date}</span>
                  </div>
                  <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 bg-gray-900 dark:bg-gray-800 rounded-xl p-6 text-white border border-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6" />
              <div>
                <h3 className="text-lg font-semibold">Campaign Analytics</h3>
                <p className="text-sm text-gray-400">Track performance across all campaigns</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-8">
              {[
                { label: "Total Sent", value: "45,234" },
                { label: "Delivered", value: "44,891" },
                { label: "Read", value: "34,567" },
                { label: "Clicked", value: "12,345" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
            <button className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-2">
              View Details →
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

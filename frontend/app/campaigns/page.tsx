"use client";
import Sidebar from "@/components/Sidebar";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import CreateCampaignModal from "@/components/CreateCampaignModal";
import CampaignDetailsModal from "@/components/CampaignDetailsModal";
import { Users, Send, TrendingUp, BarChart3, Plus, Search, Filter } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  recipients: number;
  sent: number;
  delivered: number;
  read: number;
  readRate: string;
  deliveryRate: string;
  createdAt: string;
  template?: string;
  contactSheet?: string;
  scheduledDate?: string;
}

export default function Campaigns() {
  const { getToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    messagesSent: 0,
    avgReadRate: "0%",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [campaigns]);

  const fetchCampaigns = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/campaigns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("📊 Campaigns API response:", data);
        console.log(`✅ Loaded ${data.length || 0} campaigns`);
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === "Active").length;
    const messagesSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
    const avgReadRate =
      campaigns.length > 0
        ? Math.round(
            campaigns.reduce((sum, c) => {
              const rate = parseFloat(c.readRate?.replace("%", "") || "0");
              return sum + rate;
            }, 0) / campaigns.length
          )
        : 0;

    setStats({
      total,
      active,
      messagesSent,
      avgReadRate: `${avgReadRate}%`,
    });
  };

  const handleCampaignCreated = () => {
    fetchCampaigns();
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "scheduled":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
      case "paused":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      campaign.status.toLowerCase() === statusFilter.toLowerCase() ||
      (statusFilter === "Drafts" && campaign.status.toLowerCase() === "draft");
    return matchesSearch && matchesStatus;
  });

  const statsCards = [
    {
      label: "Total Campaigns",
      value: stats.total.toString(),
      color: "border-l-emerald-500",
    },
    {
      label: "Active",
      value: stats.active.toString(),
      color: "border-l-blue-500",
    },
    {
      label: "Messages Sent",
      value: stats.messagesSent >= 1000 ? `${(stats.messagesSent / 1000).toFixed(1)}K` : stats.messagesSent.toString(),
      color: "border-l-purple-500",
    },
    {
      label: "Avg. Read Rate",
      value: stats.avgReadRate,
      color: "border-l-pink-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Campaigns" subtitle="Welcome back! Here's what's happening" />

        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-white">Campaigns</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Campaign
              </button>
            </div>

            <CreateCampaignModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSuccess={handleCampaignCreated}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create and manage broadcast campaigns
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            {statsCards.map((stat) => (
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
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  {["All", "Active", "Scheduled", "Completed", "Drafts"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setStatusFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                        statusFilter === filter
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900 dark:text-emerald-300"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 p-6">
              {filteredCampaigns.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
                  {searchQuery || statusFilter !== "All"
                    ? "No campaigns match your filters"
                    : "No campaigns found. Create your first campaign to get started."}
                </div>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign)}
                    className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold mb-1 dark:text-white">{campaign.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add more options menu
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        ⋯
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Recipients</p>
                        </div>
                        <p className="text-lg font-semibold dark:text-white">
                          {campaign.recipients.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
                        </div>
                        <p className="text-lg font-semibold dark:text-white">
                          {campaign.sent.toLocaleString()}
                        </p>
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
                            className="h-full bg-emerald-500 rounded-full transition-all"
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
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: campaign.readRate }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>📅</span>
                        <span>{campaign.createdAt}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCampaign(campaign);
                        }}
                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Analytics
                      </button>
                    </div>
                  </div>
                ))
              )}
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
                  {
                    label: "Total Sent",
                    value: campaigns.reduce((sum, c) => sum + c.sent, 0).toLocaleString(),
                  },
                  {
                    label: "Delivered",
                    value: campaigns.reduce((sum, c) => sum + c.delivered, 0).toLocaleString(),
                  },
                  {
                    label: "Read",
                    value: campaigns.reduce((sum, c) => sum + c.read, 0).toLocaleString(),
                  },
                  {
                    label: "Avg. Delivery",
                    value: stats.avgReadRate,
                  },
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

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <CampaignDetailsModal
          campaign={selectedCampaign}
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
        />
      )}
    </div>
  );
}

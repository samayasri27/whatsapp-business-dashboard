"use client";

import { X, Users, Send, CheckCheck, Eye, Download, TrendingUp, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

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

interface CampaignContact {
  id: string;
  name: string;
  phone: string;
  status: "pending" | "sent" | "delivered" | "read" | "failed";
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

interface CampaignDetailsModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignDetailsModal({
  campaign,
  isOpen,
  onClose,
}: CampaignDetailsModalProps) {
  const { getToken } = useAuth();
  const [activeTab, setActiveTab] = useState<"analytics" | "contacts">("analytics");
  const [contacts, setContacts] = useState<CampaignContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (isOpen && activeTab === "contacts") {
      fetchCampaignContacts();
    }
  }, [isOpen, activeTab]);

  const fetchCampaignContacts = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `http://localhost:8000/campaign_contacts?campaign=${campaign.name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // If no data, generate mock data
        if (data.length === 0) {
          const mockContacts: CampaignContact[] = Array.from({ length: 20 }, (_, i) => ({
            id: `contact-${i}`,
            name: `Contact ${i + 1}`,
            phone: `+1 (555) ${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
            status: ["sent", "delivered", "read", "failed"][Math.floor(Math.random() * 4)] as any,
            sentAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
            deliveredAt: new Date(Date.now() - Math.random() * 43200000).toISOString(),
            readAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 21600000).toISOString() : undefined,
          }));
          setContacts(mockContacts);
        } else {
          setContacts(data);
        }
      }
    } catch (error) {
      console.error("Error fetching campaign contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "delivered":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "read":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "failed":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery);
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    sent: contacts.filter((c) => c.status === "sent").length,
    delivered: contacts.filter((c) => c.status === "delivered").length,
    read: contacts.filter((c) => c.status === "read").length,
    failed: contacts.filter((c) => c.status === "failed").length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold dark:text-white">{campaign.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {campaign.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 px-6">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === "analytics"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </div>
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`py-3 px-4 border-b-2 transition-colors ${
                activeTab === "contacts"
                  ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                  : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Contacts ({campaign.recipients})
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "analytics" ? (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Recipients</p>
                  </div>
                  <p className="text-2xl font-bold dark:text-white">
                    {campaign.recipients.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sent</p>
                  </div>
                  <p className="text-2xl font-bold dark:text-white">
                    {campaign.sent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
                  </div>
                  <p className="text-2xl font-bold dark:text-white">
                    {campaign.delivered.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Read</p>
                  </div>
                  <p className="text-2xl font-bold dark:text-white">
                    {campaign.read.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold mb-4 dark:text-white">Delivery Rate</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Overall</span>
                        <span className="font-medium dark:text-white">{campaign.deliveryRate}</span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all"
                          style={{ width: campaign.deliveryRate }}
                        />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {campaign.delivered} of {campaign.sent} messages delivered
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                  <h3 className="font-semibold mb-4 dark:text-white">Read Rate</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Overall</span>
                        <span className="font-medium dark:text-white">{campaign.readRate}</span>
                      </div>
                      <div className="h-3 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all"
                          style={{ width: campaign.readRate }}
                        />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {campaign.read} of {campaign.delivered} messages read
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold mb-4 dark:text-white">Campaign Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-white">Campaign Created</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{campaign.createdAt}</p>
                    </div>
                  </div>
                  {campaign.status !== "Draft" && (
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">Messages Sent</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {campaign.sent} messages sent
                        </p>
                      </div>
                    </div>
                  )}
                  {campaign.status === "Completed" && (
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">Campaign Completed</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          All messages delivered
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Contacts Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Sent ({statusCounts.sent})</option>
                    <option value="delivered">Delivered ({statusCounts.delivered})</option>
                    <option value="read">Read ({statusCounts.read})</option>
                    <option value="failed">Failed ({statusCounts.failed})</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {/* Contacts Table */}
              <div className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-600 border-b border-gray-200 dark:border-gray-500">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Sent At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                        Read At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          Loading contacts...
                        </td>
                      </tr>
                    ) : filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                          No contacts found
                        </td>
                      </tr>
                    ) : (
                      filteredContacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                          <td className="px-6 py-4 text-sm font-medium dark:text-white">
                            {contact.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {contact.phone}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(contact.status)}`}>
                              {contact.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {contact.sentAt
                              ? new Date(contact.sentAt).toLocaleString()
                              : "—"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                            {contact.readAt
                              ? new Date(contact.readAt).toLocaleString()
                              : "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

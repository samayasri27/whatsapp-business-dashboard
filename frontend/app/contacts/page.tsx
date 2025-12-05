"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import CreateContactModal from "@/components/CreateContactModal";
import { Phone, Download, Upload, Plus } from "lucide-react";

export default function Contacts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const contacts = [
    {
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      tags: ["VIP", "Customer"],
      tagColors: ["bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300", "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"],
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      lastMessage: "2 hours ago",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1 (555) 234-5678",
      tags: ["Lead", "Prospect"],
      tagColors: ["bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"],
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      lastMessage: "5 hours ago",
      avatar: "MC",
    },
    {
      name: "Emily Davis",
      email: "emily.davis@email.com",
      phone: "+1 (555) 345-6789",
      tags: ["Customer", "Support"],
      tagColors: ["bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"],
      status: "Inactive",
      statusColor: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      lastMessage: "1 day ago",
      avatar: "ED",
    },
    {
      name: "James Wilson",
      email: "james.wilson@email.com",
      phone: "+1 (555) 456-7890",
      tags: ["Lead"],
      tagColors: ["bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"],
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      lastMessage: "3 hours ago",
      avatar: "JW",
    },
    {
      name: "Amanda Brown",
      email: "amanda.brown@email.com",
      phone: "+1 (555) 567-8901",
      tags: ["VIP", "Customer", "+1"],
      tagColors: ["bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300", "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300", "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"],
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      lastMessage: "Just now",
      avatar: "AB",
    },
    {
      name: "David Lee",
      email: "david.lee@email.com",
      phone: "+1 (555) 678-9012",
      tags: ["Prospect"],
      tagColors: ["bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"],
      status: "Blocked",
      statusColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      lastMessage: "5 days ago",
      avatar: "DL",
    },
    {
      name: "Lisa Thompson",
      email: "lisa.thompson@email.com",
      phone: "+1 (555) 789-0123",
      tags: ["Customer"],
      tagColors: ["bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"],
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      lastMessage: "1 hour ago",
      avatar: "LT",
    },
    {
      name: "Robert Martinez",
      email: "robert.martinez@email.com",
      phone: "+1 (555) 890-1234",
      tags: ["Lead", "VIP"],
      tagColors: ["bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"],
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      lastMessage: "30 minutes ago",
      avatar: "RM",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Contacts" subtitle="Welcome back! Here's what's happening" />
      
      <div className="p-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold dark:text-white">Contacts</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Contact
            </button>
          </div>
          
          <CreateContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage and organize your contacts</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search contacts..."
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <select className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Blocked</option>
              </select>
              <select className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>All Tags</option>
                <option>VIP</option>
                <option>Customer</option>
                <option>Lead</option>
              </select>
              <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                <Upload className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Last Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {contacts.map((contact) => (
                  <tr key={contact.email} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                          {contact.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Phone className="w-4 h-4" />
                        {contact.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {contact.tags.map((tag, i) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-1 rounded-full ${contact.tagColors[i]}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${contact.statusColor}`}
                      >
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {contact.lastMessage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">Showing 8 of 8 contacts</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                Previous
              </button>
              <button className="px-3 py-1 bg-emerald-500 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                2
              </button>
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                3
              </button>
              <button className="px-3 py-1 border border-gray-200 dark:border-gray-600 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

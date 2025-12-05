"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { Phone, Mail, MessageSquare, Calendar, Tag, Edit, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ContactProfile() {
  const params = useParams();
  
  // Mock contact data - would come from API
  const contact = {
    id: params.id,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "SJ",
    status: "Active",
    tags: ["VIP", "Customer"],
    joinedDate: "Jan 15, 2024",
    lastMessage: "2 hours ago",
    totalMessages: 156,
    notes: "Preferred customer, interested in premium features. Follow up on Q1 2024.",
  };

  const recentMessages = [
    { date: "Today, 10:30 AM", message: "Thanks for the quick response!", sent: false },
    { date: "Today, 10:28 AM", message: "I'll send you the details right away.", sent: true },
    { date: "Yesterday, 3:45 PM", message: "Can you help me with my account?", sent: false },
  ];

  const activities = [
    { type: "message", text: "Sent a message", date: "2 hours ago" },
    { type: "campaign", text: "Received 'Summer Sale' campaign", date: "1 day ago" },
    { type: "tag", text: "Tagged as VIP", date: "3 days ago" },
    { type: "created", text: "Contact created", date: "Jan 15, 2024" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Contact Profile" subtitle="View and manage contact details" />
      
      <div className="p-8">
        <Link 
          href="/contacts"
          className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contacts
        </Link>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-medium mx-auto mb-4">
                  {contact.avatar}
                </div>
                <h2 className="text-2xl font-semibold mb-1 dark:text-white">{contact.name}</h2>
                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 rounded-full text-sm">
                  {contact.status}
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">{contact.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Joined {contact.joinedDate}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium dark:text-gray-200">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {contact.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </button>
                <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Edit className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4 dark:text-white">Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Total Messages</span>
                    <span className="font-medium dark:text-white">{contact.totalMessages}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Last Contact</span>
                    <span className="font-medium dark:text-white">{contact.lastMessage}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Response Rate</span>
                    <span className="font-medium dark:text-white">87%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "87%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Activity & Messages */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4 dark:text-white">Notes</h3>
              <textarea
                defaultValue={contact.notes}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm">
                Save Notes
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4 dark:text-white">Recent Messages</h3>
              <div className="space-y-4">
                {recentMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-md ${msg.sent ? "order-2" : "order-1"}`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          msg.sent
                            ? "bg-emerald-500 text-white rounded-br-none"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${msg.sent ? "text-right" : "text-left"}`}>
                        {msg.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/chat"
                className="mt-4 block text-center text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
              >
                View Full Conversation →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-4 dark:text-white">Activity Timeline</h3>
              <div className="space-y-4">
                {activities.map((activity, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium dark:text-white">{activity.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import Sidebar from "@/components/Sidebar";

import Header from "@/components/Header";
import { Search, Plus, Phone, Video, MoreVertical, Smile, Paperclip, Send } from "lucide-react";

export default function Chat() {
  const chats = [
    { name: "Sarah Johnson", message: "That sounds great! Let me check an...", time: "2m", unread: 3, avatar: "SJ", online: true },
    { name: "Michael Chen", message: "I've sent you the documents", time: "10m", unread: 0, avatar: "MC", online: false },
    { name: "Emily Davis", message: "Can we schedule a call tomorrow?", time: "1h", unread: 1, avatar: "ED", online: true },
    { name: "James Wilson", message: "Perfect, thank you!", time: "2h", unread: 0, avatar: "JW", online: false },
    { name: "Amanda Brown", message: "I'll review the proposal and let you know", time: "3h", unread: 0, avatar: "AB", online: false },
    { name: "David Lee", message: "Looking forward to our meeting", time: "5h", unread: 0, avatar: "DL", online: true },
    { name: "Lisa Thompson", message: "Thanks for the update!", time: "1d", unread: 0, avatar: "LT", online: false },
    { name: "Robert Martinez", message: "Let's discuss this next week", time: "2d", unread: 0, avatar: "RM", online: false },
  ];

  const messages = [
    { text: "Hi! I'm interested in your products.", time: "10:30 AM", sent: false },
    { text: "Hello! Thank you for reaching out. How can I help you today?", time: "10:32 AM", sent: true },
    { text: "I'd like to know more about the pricing plans.", time: "10:33 AM", sent: false },
    { text: "Of course! We have three plans: Basic at $29/mo, Pro at $79/mo, and Enterprise with custom pricing. Which one interests you?", time: "10:40 AM", sent: true },
    { text: "The Pro plan sounds interesting. Does it include API access?", time: "10:38 AM", sent: false },
    { text: "Yes! The Pro plan includes full API access with up to 10,000 requests/month. I can send you the detailed documentation.", time: "10:40 AM", sent: true },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Messages" subtitle="Welcome back! Here's what's happening" />
      
      <div className="flex h-[calc(100vh-80px)]">
        <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold flex-1 dark:text-white">Chats</h2>
              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-120px)]">
            {chats.map((chat) => (
              <div
                key={chat.name}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  chat.name === "Sarah Johnson" ? "bg-emerald-50 dark:bg-emerald-900/20" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">{chat.name}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.message}</p>
                      {chat.unread > 0 && (
                        <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                  SJ
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <p className="font-medium dark:text-white">Sarah Johnson</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <Video className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-md ${msg.sent ? "order-2" : "order-1"}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      msg.sent
                        ? "bg-emerald-500 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${msg.sent ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <Smile className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-3">
              SJ
            </div>
            <h3 className="font-semibold text-lg dark:text-white">Sarah Johnson</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Email</p>
              <p className="text-sm dark:text-gray-200">sarah.johnson@email.com</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Phone</p>
              <p className="text-sm dark:text-gray-200">+1 (555) 123-4567</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tags</p>
              <div className="flex gap-2">
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">VIP</span>
                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Customer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

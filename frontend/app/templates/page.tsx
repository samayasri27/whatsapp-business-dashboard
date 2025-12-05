"use client";
import Sidebar from "@/components/Sidebar";

import { useState } from "react";
import Header from "@/components/Header";
import TemplateParameterModal from "@/components/TemplateParameterModal";
import { Eye, Copy, Edit } from "lucide-react";

export default function Templates() {
  const [selectedTemplate, setSelectedTemplate] = useState<{ title: string; message: string } | null>(null);
  const templates = [
    {
      title: "Welcome Message",
      category: "utility",
      status: "approved",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      message: "Hello {{name}}! 👋 Welcome to our service. We're excited to have you on board! If you have any questions, feel free to reach out.",
      used: 1234,
      language: "English",
      created: "Mar 1, 2024",
    },
    {
      title: "Order Confirmation",
      category: "transactional",
      status: "approved",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      message: "Hi {{name}}! Your order #{{order_id}} has been confirmed. Expected delivery: {{date}}. Track your order: {{link}}",
      used: 856,
      language: "English",
      created: "Feb 15, 2024",
    },
    {
      title: "Promotional Offer",
      category: "marketing",
      status: "approved",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      message: "🎉 Exclusive offer for you, {{name}}! Get {{discount}}% off on your next purchase. Use code: {{code}}. Shop now: {{link}}",
      used: 2341,
      language: "English",
      created: "Mar 5, 2024",
    },
    {
      title: "Appointment Reminder",
      category: "utility",
      status: "approved",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      message: "Hi {{name}}, this is a reminder for your appointment on {{date}} at {{time}}. Reply YES to confirm or NO to reschedule.",
      used: 567,
      language: "English",
      created: "Feb 20, 2024",
    },
    {
      title: "Shipping Update",
      category: "transactional",
      status: "pending",
      statusColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      message: "Good news, {{name}}! Your order is on its way. Estimated arrival: {{date}}. Track: {{link}}",
      used: 0,
      language: "English",
      created: "Mar 8, 2024",
    },
    {
      title: "Feedback Request",
      category: "marketing",
      status: "rejected",
      statusColor: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      message: "Hi {{name}}, we'd love to hear your feedback! How was your recent experience with us? Rate us: {{link}}",
      used: 0,
      language: "English",
      created: "Feb 25, 2024",
    },
    {
      title: "Payment Reminder",
      category: "transactional",
      status: "approved",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      message: "Hi {{name}}, your payment of {{amount}} is due on {{date}}. Pay now to avoid late fees: {{link}}",
      used: 789,
      language: "English",
      created: "Mar 1, 2024",
    },
    {
      title: "New Product Alert",
      category: "marketing",
      status: "pending",
      statusColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      message: "🚀 Introducing {{product_name}}! Be the first to try our latest innovation. Learn more: {{link}}",
      used: 0,
      language: "English",
      created: "Mar 10, 2024",
    },
    {
      title: "OTP Verification",
      category: "authentication",
      status: "approved",
      statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      message: "Your verification code is {{code}}. This code expires in 10 minutes. Do not share this code with anyone.",
      used: 4521,
      language: "English",
      created: "Jan 15, 2024",
    },
  ];

  const categories = ["All Templates", "Marketing", "Utility", "Transactional", "Authentication"];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Templates" subtitle="Welcome back! Here's what's happening" />
      
      <div className="p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Templates</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your message templates</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search templates..."
                className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      cat === "All Templates"
                        ? "bg-emerald-500 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 p-6">
            {templates.map((template) => (
              <div
                key={template.title}
                className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1 dark:text-white">{template.title}</h3>
                    <div className="flex gap-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                        {template.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${template.statusColor}`}>
                        {template.status}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">⋯</button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 min-h-[100px]">
                  <p className="text-sm text-gray-700 dark:text-gray-200">{template.message}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>📊 {template.used} times used</span>
                  <span>📅 {template.created}</span>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedTemplate({ title: template.title, message: template.message })}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-gray-200"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <TemplateParameterModal 
        isOpen={!!selectedTemplate} 
        onClose={() => setSelectedTemplate(null)} 
        template={selectedTemplate}
      />
      </div>
    </div>
  );
}

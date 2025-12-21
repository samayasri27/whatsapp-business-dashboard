"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { MessageCircle, Mail, Phone, Book, HelpCircle, FileText, Video, ExternalLink } from "lucide-react";

export default function HelpAndSupport() {
  const faqs = [
    {
      question: "How do I send a message to a contact?",
      answer: "Navigate to the Chat page, select a contact from the list, type your message in the input field, and click the send button or press Enter."
    },
    {
      question: "How do I create a campaign?",
      answer: "Go to the Campaigns page, click 'Create Campaign', fill in the campaign details including name, recipients, and message template, then click 'Launch Campaign'."
    },
    {
      question: "How do I add a new contact?",
      answer: "Visit the Contacts page and click the 'Add Contact' button. Fill in the contact details including name, phone number, email, and tags, then save."
    },
    {
      question: "How do I use message templates?",
      answer: "Go to the Templates page, browse available templates, click 'Use' on any template, fill in the required parameters, and send it to your contacts."
    },
    {
      question: "How do I track campaign performance?",
      answer: "Visit the Dashboard to see overall analytics, or go to the Campaigns page and click on any campaign to view detailed metrics including delivery rate, read rate, and engagement."
    },
    {
      question: "Can I import contacts from Google Sheets?",
      answer: "Yes! Go to the Contacts page, click 'Import', connect your Google Sheets account, and select the sheet containing your contacts."
    }
  ];

  const resources = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of using WhatsApp Business Platform",
      icon: Book,
      link: "#"
    },
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      link: "#"
    },
    {
      title: "API Documentation",
      description: "Technical documentation for developers",
      icon: FileText,
      link: "#"
    },
    {
      title: "Best Practices",
      description: "Tips for effective WhatsApp marketing",
      icon: HelpCircle,
      link: "#"
    }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Help & Support" subtitle="Get help and find answers to your questions" />
        
        <div className="p-8">
          {/* Contact Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Live Chat</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Chat with our support team in real-time
              </p>
              <button className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline">
                Start Chat →
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Email Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Send us an email and we'll respond within 24 hours
              </p>
              <a href="mailto:support@whatsappbusiness.com" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                support@whatsappbusiness.com
              </a>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Phone Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Call us Monday-Friday, 9AM-6PM EST
              </p>
              <a href="tel:+1234567890" className="text-purple-600 dark:text-purple-400 text-sm font-medium hover:underline">
                +1 (234) 567-890
              </a>
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Frequently Asked Questions</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Find quick answers to common questions
              </p>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors list-none">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium dark:text-white pr-4 flex-1">{faq.question}</h3>
                      <svg 
                        className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-2">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold dark:text-white">Resources</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Explore guides, tutorials, and documentation
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map((resource, index) => {
                  const Icon = resource.icon;
                  return (
                    <a
                      key={index}
                      href={resource.link}
                      className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.description}
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-8 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div>
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">All Systems Operational</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  All services are running smoothly. Last checked: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

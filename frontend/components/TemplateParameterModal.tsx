"use client";

import { X, Copy, ExternalLink, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface TemplateParameterModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    title: string;
    message: string;
    category?: string;
    language?: string;
    usageCount?: number;
    createdAt?: string;
  } | null;
  onSend?: (filledMessage: string) => void;
}

export default function TemplateParameterModal({
  isOpen,
  onClose,
  template,
  onSend,
}: TemplateParameterModalProps) {
  const [parameters, setParameters] = useState<Record<string, string>>({});

  if (!isOpen || !template) return null;

  // Extract parameters from template message
  const paramMatches = template.message.match(/\{\{(\w+)\}\}/g) || [];
  const paramNames = paramMatches.map((match) => match.replace(/\{\{|\}\}/g, ""));

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Replace parameters in message
    let filledMessage = template.message;
    Object.entries(parameters).forEach(([key, value]) => {
      filledMessage = filledMessage.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
    });

    if (onSend) {
      onSend(filledMessage);
    } else {
      console.log("Filled message:", filledMessage);
      toast.success("Template filled successfully!");
    }
    onClose();
  };

  // Get preview message
  const previewMessage = Object.entries(parameters).reduce(
    (msg, [key, value]) =>
      msg.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value || `{{${key}}}`),
    template.message
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold dark:text-white">{template.title}</h2>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded text-xs">
              ✓ Approved
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-6 p-6">
            {/* Left Column - Template Parameters */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  # Template Parameters
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Customize the placeholder values to preview your message
                </p>

                {paramNames.length > 0 ? (
                  <div className="space-y-4">
                    {paramNames.map((param) => (
                      <div key={param}>
                        <label className="block text-sm font-medium mb-2 dark:text-gray-200 capitalize">
                          {param}
                        </label>
                        <input
                          type="text"
                          value={parameters[param] || ""}
                          onChange={(e) =>
                            setParameters({ ...parameters, [param]: e.target.value })
                          }
                          placeholder={param === "name" ? "John Doe" : `Enter ${param}`}
                          className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This template has no parameters to fill.
                  </p>
                )}
              </div>

              {/* Template Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  📋 Template Details
                </h3>
                <div className="space-y-3 text-sm">
                  {template.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Category</span>
                      <span className="font-medium dark:text-white capitalize">{template.category}</span>
                    </div>
                  )}
                  {template.language && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Language</span>
                      <span className="font-medium dark:text-white">{template.language}</span>
                    </div>
                  )}
                  {template.usageCount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Used</span>
                      <span className="font-medium dark:text-white">{template.usageCount} times</span>
                    </div>
                  )}
                  {template.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Created</span>
                      <span className="font-medium dark:text-white">
                        {new Date(template.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Parameters</span>
                    <span className="font-medium dark:text-white">{paramNames.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Message Preview */}
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                Message Preview
              </h3>
              
              {/* WhatsApp-style Phone Preview */}
              <div className="bg-gray-100 dark:bg-gray-900 rounded-3xl p-4 shadow-xl">
                {/* Phone Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-t-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Your Business</p>
                    <p className="text-white/80 text-xs">Business Account</p>
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="bg-white dark:bg-gray-800 rounded-b-2xl p-4 min-h-[200px]">
                  <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {previewMessage}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-right">
                      {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(previewMessage);
                    toast.success("Copied to clipboard!");
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-gray-200"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={() => handleSubmit()}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  Use Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import TemplateParameterModal from "@/components/TemplateParameterModal";
import { Eye, Copy, Edit, Search, Filter, Plus, Trash2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface Template {
  id: string;
  name: string;
  category: string;
  status: string;
  language: string;
  content: string;
  parameters: string[];
  usageCount: number;
  createdAt: string;
}

export default function Templates() {
  const { getToken } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [searchQuery, selectedCategory, selectedStatus]);

  const fetchTemplates = async () => {
    try {
      const token = await getToken();
      const params = new URLSearchParams();
      
      if (searchQuery) params.append("search", searchQuery);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      
      const response = await fetch(
        `http://localhost:8000/templates?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("📊 Templates API response:", data);
        console.log(`✅ Loaded ${data.templates?.length || 0} templates (total in DB: ${data.total || 0})`);
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:8000/templates/categories/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const cats = await response.json();
        setCategories(cats);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Template copied to clipboard!");
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/templates/${templateId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("Template deleted successfully");
        fetchTemplates();
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Failed to delete template");
    }
  };

  const handleUseTemplate = async (templateId: string, parameters: Record<string, string>) => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/templates/${templateId}/use`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parameters),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Template used successfully!");
        fetchTemplates(); // Refresh to update usage count
        return data.filled_content;
      }
    } catch (error) {
      console.error("Error using template:", error);
      toast.error("Failed to use template");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "marketing":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      case "utility":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "transactional":
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300";
      case "authentication":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Templates" subtitle="Manage your WhatsApp message templates" />
      
        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-semibold dark:text-white">Templates</h2>
              <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Browse and manage your approved WhatsApp templates
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates by name or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedCategory === "all"
                      ? "bg-emerald-500 text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  All Templates
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                      selectedCategory === cat
                        ? "bg-emerald-500 text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            <div className="p-6">
              {loading ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  Loading templates...
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Filter className="w-16 h-16 mx-auto mb-2" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mb-2">No templates found</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Try adjusting your filters or create a new template
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2 dark:text-white line-clamp-1">
                            {template.name}
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(template.category)}`}>
                              {template.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(template.status)}`}>
                              {template.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 min-h-[100px] max-h-[120px] overflow-hidden">
                        <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-4">
                          {template.content}
                        </p>
                      </div>

                      {/* Parameters */}
                      {template.parameters && template.parameters.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Parameters:
                          </p>
                          <div className="flex gap-1 flex-wrap">
                            {template.parameters.map((param) => (
                              <span
                                key={param}
                                className="text-xs px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded"
                              >
                                {`{{${param}}}`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <span className="flex items-center gap-1">
                          📊 {template.usageCount} uses
                        </span>
                        <span className="flex items-center gap-1">
                          🌐 {template.language}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedTemplate(template)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Use
                        </button>
                        <button
                          onClick={() => setSelectedTemplate(template)}
                          className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm dark:text-gray-200 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => handleCopyTemplate(template.content)}
                          className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
                          title="Copy template"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                          title="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {!loading && templates.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {templates.length} template{templates.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
      
        <TemplateParameterModal 
          isOpen={!!selectedTemplate} 
          onClose={() => setSelectedTemplate(null)} 
          template={selectedTemplate ? {
            title: selectedTemplate.name,
            message: selectedTemplate.content,
            category: selectedTemplate.category,
            language: selectedTemplate.language,
            usageCount: selectedTemplate.usageCount,
            createdAt: selectedTemplate.createdAt
          } : null}
          onSend={(filledMessage) => {
            if (selectedTemplate) {
              // Extract parameters from filled message
              const params: Record<string, string> = {};
              selectedTemplate.parameters.forEach(param => {
                const regex = new RegExp(`{{${param}}}`, 'g');
                const match = filledMessage.match(regex);
                if (!match) {
                  // Parameter was filled
                  params[param] = "filled"; // You'd extract the actual value here
                }
              });
              handleUseTemplate(selectedTemplate.id, params);
            }
          }}
        />
      </div>
    </div>
  );
}

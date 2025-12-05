"use client";

import { X, FileSpreadsheet, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const campaignSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  template: z.string().min(1, "Please select a template"),
  contactSource: z.enum(["all", "tags", "sheet"]),
  contactTags: z.array(z.string()).optional(),
  sheet: z.string().optional(),
  scheduledDate: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  status: string;
}

interface ContactTag {
  name: string;
  count: number;
}

export default function CreateCampaignModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateCampaignModalProps) {
  const { getToken } = useAuth();
  const [isScheduled, setIsScheduled] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [contactTags, setContactTags] = useState<ContactTag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [contactSource, setContactSource] = useState<"all" | "tags" | "sheet">("all");
  const [estimatedRecipients, setEstimatedRecipients] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      contactSource: "all",
    },
  });

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
      fetchContactTags();
      fetchAllContactsCount();
    }
  }, [isOpen]);

  useEffect(() => {
    calculateEstimatedRecipients();
  }, [contactSource, selectedTags]);

  const fetchTemplates = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/templates?status=approved`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Backend returns { templates: [...], total, page, limit, pages }
        const templatesList = data.templates || data;
        setTemplates(Array.isArray(templatesList) ? templatesList : []);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast.error("Failed to load templates");
    }
  };

  const fetchContactTags = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/tags`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const tags = await response.json();
        // Mock counts for now
        setContactTags(
          tags.map((tag: string) => ({
            name: tag,
            count: Math.floor(Math.random() * 500) + 50,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const fetchAllContactsCount = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/contacts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Backend returns { contacts: [...], total, page, limit, pages }
        const contactsList = data.contacts || data;
        if (contactSource === "all") {
          setEstimatedRecipients(Array.isArray(contactsList) ? contactsList.length : data.total || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const calculateEstimatedRecipients = () => {
    if (contactSource === "all") {
      fetchAllContactsCount();
    } else if (contactSource === "tags") {
      const count = selectedTags.reduce((sum, tag) => {
        const tagData = contactTags.find((t) => t.name === tag);
        return sum + (tagData?.count || 0);
      }, 0);
      setEstimatedRecipients(count);
    } else if (contactSource === "sheet") {
      // Mock count for sheet
      setEstimatedRecipients(Math.floor(Math.random() * 1000) + 100);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const onSubmit = async (data: CampaignFormData) => {
    setLoading(true);
    try {
      const token = await getToken();
      const campaignData = {
        name: data.name,
        description: data.description,
        template: data.template,
        contactSource,
        contactTags: contactSource === "tags" ? selectedTags : undefined,
        sheet: contactSource === "sheet" ? data.sheet : undefined,
        scheduledDate: isScheduled ? data.scheduledDate : undefined,
        status: isScheduled ? "Scheduled" : "Draft",
        recipients: estimatedRecipients,
      };

      const response = await fetch(`http://localhost:8000/campaigns`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        toast.success("Campaign created successfully!");
        reset();
        setSelectedTags([]);
        setContactSource("all");
        setIsScheduled(false);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        // Get error details from response
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        const errorMessage = errorData.detail || "Failed to create campaign";
        console.error("Campaign creation failed:", errorData);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create campaign";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-semibold dark:text-white">Create New Campaign</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Campaign Name *
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Summer Sale 2024"
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Describe your campaign..."
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* WhatsApp Template */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              WhatsApp Template *
            </label>
            <select
              {...register("template")}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.category})
                </option>
              ))}
            </select>
            {errors.template && (
              <p className="text-red-500 text-sm mt-1">{errors.template.message}</p>
            )}
          </div>

          {/* Contact Source Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 dark:text-gray-200">
              Select Recipients *
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setContactSource("all")}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  contactSource === "all"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-emerald-300"
                }`}
              >
                <p className="font-medium dark:text-white">All Contacts</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Send to everyone
                </p>
              </button>
              <button
                type="button"
                onClick={() => setContactSource("tags")}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  contactSource === "tags"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-emerald-300"
                }`}
              >
                <p className="font-medium dark:text-white">By Tags</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Filter by tags
                </p>
              </button>
              <button
                type="button"
                onClick={() => setContactSource("sheet")}
                className={`p-4 border-2 rounded-lg text-center transition-all ${
                  contactSource === "sheet"
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-gray-200 dark:border-gray-600 hover:border-emerald-300"
                }`}
              >
                <p className="font-medium dark:text-white">Google Sheet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Import from sheet
                </p>
              </button>
            </div>
          </div>

          {/* Tag Selection */}
          {contactSource === "tags" && (
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Select Tags
              </label>
              <div className="flex flex-wrap gap-2 p-4 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                {contactTags.map((tag) => (
                  <button
                    key={tag.name}
                    type="button"
                    onClick={() => toggleTag(tag.name)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag.name)
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-500"
                    }`}
                  >
                    {tag.name} ({tag.count})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Google Sheet Selection */}
          {contactSource === "sheet" && (
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Google Sheet
              </label>
              <select
                {...register("sheet")}
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select a sheet</option>
                <option value="customer-list-2024">Customer List 2024 (1,250 contacts)</option>
                <option value="vip-contacts">VIP Contacts (89 contacts)</option>
                <option value="leads-q1">Q1 Leads (456 contacts)</option>
              </select>
            </div>
          )}

          {/* Estimated Recipients */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                  Estimated Recipients
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                  Messages will be sent to these contacts
                </p>
              </div>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {estimatedRecipients.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Schedule Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="scheduled"
              checked={isScheduled}
              onChange={(e) => setIsScheduled(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="scheduled" className="text-sm dark:text-gray-200">
              Schedule for later
            </label>
          </div>

          {isScheduled && (
            <div>
              <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                Scheduled Date & Time
              </label>
              <input
                {...register("scheduledDate")}
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

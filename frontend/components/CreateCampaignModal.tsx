"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const campaignSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  template: z.string().min(1, "Please select a template"),
  sheet: z.string().min(1, "Please select a contact sheet"),
  scheduledDate: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCampaignModal({ isOpen, onClose }: CreateCampaignModalProps) {
  const [isScheduled, setIsScheduled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
  });

  const onSubmit = (data: CampaignFormData) => {
    console.log("Campaign data:", data);
    toast.success("Campaign created successfully!");
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold dark:text-white">Create New Campaign</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <X className="w-5 h-5 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              WhatsApp Template *
            </label>
            <select
              {...register("template")}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a template</option>
              <option value="welcome">Welcome Message</option>
              <option value="promo">Promotional Offer</option>
              <option value="order">Order Confirmation</option>
              <option value="reminder">Appointment Reminder</option>
            </select>
            {errors.template && (
              <p className="text-red-500 text-sm mt-1">{errors.template.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Contact Sheet *
            </label>
            <select
              {...register("sheet")}
              className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a contact sheet</option>
              <option value="all-customers">All Customers (2,458)</option>
              <option value="vip">VIP Customers (567)</option>
              <option value="leads">Leads (1,234)</option>
              <option value="inactive">Inactive Users (892)</option>
            </select>
            {errors.sheet && (
              <p className="text-red-500 text-sm mt-1">{errors.sheet.message}</p>
            )}
          </div>

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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

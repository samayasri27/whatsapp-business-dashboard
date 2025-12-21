"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { User, Mail, Phone, Building, Calendar, Shield, Edit2, Save, X } from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 digits").optional().or(z.literal("")),
  company: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phoneNumbers[0]?.phoneNumber || "",
      company: "",
      department: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phoneNumbers[0]?.phoneNumber || "",
        company: "",
        department: "",
        bio: "",
      });
    }
  }, [user, reset]);

  const formData = watch();

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // TODO: Save to backend
      console.log("Profile data:", data);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Profile" subtitle="Comprehensive account and business profile management" />
        
        <div className="p-8 max-w-4xl mx-auto">
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5">
                ℹ️
              </div>
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Profile Management Options</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This page provides comprehensive profile management for your business account. 
                  For quick profile access, you can also use the profile menu in the bottom-left corner (Clerk integration).
                </p>
              </div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-sm flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      User
                    </span>
                  </div>
                </div>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-semibold dark:text-white mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      {...register("firstName")}
                      type="text"
                      className="flex-1 bg-transparent outline-none dark:text-white"
                    />
                  ) : (
                    <span className="dark:text-white">{formData.firstName}</span>
                  )}
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      {...register("lastName")}
                      type="text"
                      className="flex-1 bg-transparent outline-none dark:text-white"
                    />
                  ) : (
                    <span className="dark:text-white">{formData.lastName}</span>
                  )}
                </div>
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 bg-gray-50 dark:bg-gray-800">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="dark:text-white">{user?.emailAddresses[0]?.emailAddress}</span>
                  <span className="ml-auto text-xs text-gray-500">Managed by Clerk</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      {...register("phone")}
                      type="tel"
                      className="flex-1 bg-transparent outline-none dark:text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  ) : (
                    <span className="dark:text-white">{formData.phone || "Not set"}</span>
                  )}
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                  <Building className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      {...register("company")}
                      type="text"
                      className="flex-1 bg-transparent outline-none dark:text-white"
                      placeholder="Your company"
                    />
                  ) : (
                    <span className="dark:text-white">{formData.company || "Not set"}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                  <Building className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      {...register("department")}
                      type="text"
                      className="flex-1 bg-transparent outline-none dark:text-white"
                      placeholder="Sales, Marketing, etc."
                    />
                  ) : (
                    <span className="dark:text-white">{formData.department || "Not set"}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <>
                  <textarea
                    {...register("bio")}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
                  )}
                </>
              ) : (
                <p className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                  {formData.bio || "No bio added yet"}
                </p>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold dark:text-white mb-4">Account Information</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Member Since</span>
                </div>
                <span className="text-sm font-medium dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                </div>
                <span className="text-sm font-medium dark:text-white">User</span>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">User ID</span>
                </div>
                <span className="text-sm font-medium dark:text-white font-mono">
                  {user?.id?.substring(0, 16)}...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

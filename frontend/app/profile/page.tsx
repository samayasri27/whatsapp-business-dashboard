"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { User, Mail, Phone, Building, Calendar, Shield, Edit2, Save, X } from "lucide-react";

export default function Profile() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: user?.phoneNumbers[0]?.phoneNumber || "",
    company: "",
    role: "User",
    department: "",
    bio: "",
  });

  const handleSave = async () => {
    // TODO: Save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emailAddresses[0]?.emailAddress || "",
      phone: user?.phoneNumbers[0]?.phoneNumber || "",
      company: "",
      role: "User",
      department: "",
      bio: "",
    });
    setIsEditing(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Profile" subtitle="Manage your account information" />
        
        <div className="p-8 max-w-4xl mx-auto">
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
                  <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 rounded-full text-sm flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      {formData.role}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {isEditing && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
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
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="flex-1 bg-transparent outline-none dark:text-white"
                    />
                  ) : (
                    <span className="dark:text-white">{formData.firstName}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                  <User className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="flex-1 bg-transparent outline-none dark:text-white"
                    />
                  ) : (
                    <span className="dark:text-white">{formData.lastName}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="dark:text-white">{formData.email}</span>
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
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 bg-transparent outline-none dark:text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  ) : (
                    <span className="dark:text-white">{formData.phone || "Not set"}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700">
                  <Building className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  rows={3}
                  placeholder="Tell us about yourself..."
                />
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
                <span className="text-sm font-medium dark:text-white">{formData.role}</span>
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

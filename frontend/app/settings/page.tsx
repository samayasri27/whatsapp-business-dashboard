"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { 
  Bell, 
  Moon, 
  Globe, 
  Lock, 
  Mail, 
  MessageSquare, 
  Volume2,
  Shield,
  Key,
  Smartphone,
  Save
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newMessageAlert: true,
    campaignUpdates: true,
    weeklyReport: true,
    
    // Appearance
    darkMode: false,
    language: "en",
    timezone: "UTC",
    
    // Privacy & Security
    twoFactorAuth: false,
    sessionTimeout: "30",
    dataSharing: false,
    
    // Communication
    autoReply: false,
    readReceipts: true,
    typingIndicator: true,
    soundEffects: true,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = () => {
    // TODO: Save to backend
    alert("Settings saved successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Settings" subtitle="Manage your preferences and account settings" />
        
        <div className="p-8 max-w-4xl mx-auto">
          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold dark:text-white">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">Email Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">Push Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in browser</p>
                </div>
                <button
                  onClick={() => handleToggle('pushNotifications')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.pushNotifications ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.pushNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">SMS Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive important alerts via SMS</p>
                </div>
                <button
                  onClick={() => handleToggle('smsNotifications')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.smsNotifications ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.smsNotifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">New Message Alerts</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get notified when you receive new messages</p>
                </div>
                <button
                  onClick={() => handleToggle('newMessageAlert')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.newMessageAlert ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.newMessageAlert ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">Campaign Updates</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about your campaigns</p>
                </div>
                <button
                  onClick={() => handleToggle('campaignUpdates')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.campaignUpdates ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.campaignUpdates ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium dark:text-white">Weekly Report</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Receive weekly performance reports</p>
                </div>
                <button
                  onClick={() => handleToggle('weeklyReport')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.weeklyReport ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.weeklyReport ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold dark:text-white">Appearance</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">Dark Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use dark theme</p>
                </div>
                <button
                  onClick={() => handleToggle('darkMode')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.darkMode ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.darkMode ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                <label className="block font-medium dark:text-white mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                </select>
              </div>

              <div className="py-3">
                <label className="block font-medium dark:text-white mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold dark:text-white">Privacy & Security</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
                </div>
                <button
                  onClick={() => handleToggle('twoFactorAuth')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.twoFactorAuth ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.twoFactorAuth ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="py-3 border-b border-gray-200 dark:border-gray-700">
                <label className="block font-medium dark:text-white mb-2">Session Timeout</label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium dark:text-white">Data Sharing</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share analytics data to improve service</p>
                </div>
                <button
                  onClick={() => handleToggle('dataSharing')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.dataSharing ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.dataSharing ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold dark:text-white">Communication Preferences</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">Auto Reply</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Automatically reply to messages when away</p>
                </div>
                <button
                  onClick={() => handleToggle('autoReply')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.autoReply ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.autoReply ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">Read Receipts</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Let others know when you've read their messages</p>
                </div>
                <button
                  onClick={() => handleToggle('readReceipts')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.readReceipts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.readReceipts ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <p className="font-medium dark:text-white">Typing Indicator</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Show when you're typing</p>
                </div>
                <button
                  onClick={() => handleToggle('typingIndicator')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.typingIndicator ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.typingIndicator ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium dark:text-white">Sound Effects</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Play sounds for notifications</p>
                </div>
                <button
                  onClick={() => handleToggle('soundEffects')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.soundEffects ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings.soundEffects ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save All Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Header from "@/components/Header";
import DashboardContent from "@/components/DashboardContent";
import Sidebar from "@/components/Sidebar";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header title="Dashboard" subtitle="Welcome back! Here's what's happening" />
        <DashboardContent />
      </div>
    </div>
  );
}

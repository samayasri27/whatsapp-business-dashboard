"use client";

import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  
  // Public routes that don't need sidebar
  const publicRoutes = ['/sign-in', '/sign-up', '/'];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up');
  
  // Show sidebar only if signed in and not on public routes
  const showSidebar = isSignedIn && !isPublicRoute;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {showSidebar && <Sidebar />}
      <main className={`flex-1 overflow-auto ${showSidebar ? '' : 'w-full'}`}>
        {children}
      </main>
    </div>
  );
}

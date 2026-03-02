"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/dashboardStructer/Header";
import Sidebar from "@/components/dashboardStructer/Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface User {
  name: string;
  email: string;
  role?: "user" | "admin";
  image?: string;
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      {/* Header skeleton */}
      <div
        className="h-16 border-b border-gray-800/80 flex items-center px-6 gap-4"
        style={{ background: "#0b0b14" }}
      >
        <div className="w-8 h-8 rounded-lg bg-gray-800 animate-pulse" />
        <div className="w-24 h-4 rounded-md bg-gray-800 animate-pulse" />
        <div className="ml-auto w-8 h-8 rounded-full bg-gray-800 animate-pulse" />
      </div>

      <div className="flex">
        {/* Sidebar skeleton */}
        <div
          className="hidden lg:block w-64 h-[calc(100vh-64px)] border-r border-gray-800/80 p-4 space-y-2"
          style={{ background: "#0b0b14" }}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 rounded-xl bg-gray-800/50 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-6 space-y-4">
          <div className="h-8 w-48 rounded-lg bg-gray-800/60 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-gray-800/40 animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-gray-800/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Main Layout ───────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) return <DashboardSkeleton />;
  if (!user) return <DashboardSkeleton />;

  const typedUser: User = {
    ...user,
    role: (user.role as "user" | "admin") || "user",
  };

  return (
    <div className="min-h-screen" style={{ background: "#080810" }}>
      {/* ── Header ── */}
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        user={typedUser}
      />

      <div className="flex pt-16">
        {/* ── Sidebar ── */}
        <div
          className={`
            fixed top-16 bottom-0 left-0 z-30
            transition-all duration-300
            ${isSidebarOpen ? "w-64" : "w-0"}
            lg:w-64
          `}
        >
          <Sidebar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            user={typedUser}
          />
        </div>

        {/* ── Main content ── */}
        <main
          className="flex-1 min-h-[calc(100vh-64px)] overflow-y-auto p-4 md:p-6 lg:p-8 lg:ml-64"
          style={{ background: "#080810" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

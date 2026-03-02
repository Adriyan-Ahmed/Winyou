"use client";

import { useRef, useEffect, useState } from "react";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setIsOpen(false);
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2 md:space-x-3">
        <Link href="/auth/login">
          <Button variant="primary" size="sm">
            Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ── Trigger Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5  rounded-xl border border-gray-800 bg-gray-900/60 hover:bg-gray-800/80 hover:border-gray-700 transition-all duration-200 cursor-pointer group"
      >
        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0  ring-indigo-500/30 group-hover:ring-indigo-500/60 transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          }}
        >
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name || "User Avatar"}
              className="w-full h-full object-cover"
              width={32}
              height={32}
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-white font-semibold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </button>

      {/* ── Dropdown Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2.5 w-68 rounded-2xl border border-gray-800 overflow-hidden z-50 shadow-2xl"
            style={{
              width: 272,
              background: "#0d0d16",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08)",
            }}
          >
            {/* ── User Info ── */}
            <div
              className="px-5 py-4 border-b border-gray-800/80 relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(13,13,22,0) 60%)",
              }}
            >
              {/* Glow */}
              <div
                className="absolute top-0 left-0 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ background: "#6366f1" }}
              />

              <div className="relative flex items-center gap-3">
                {/* Avatar (large) */}
                <div
                  className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden ring-2 ring-indigo-500/30"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  }}
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                      width={40}
                      height={40}
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-white font-bold text-base">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-gray-100 text-sm truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* ── Menu Items ── */}
            <div className="py-1.5">
              <MenuItem
                icon={<LayoutDashboard className="w-4 h-4" />}
                label="Dashboard"
                onClick={() => {
                  router.push("/dashboard");
                  setIsOpen(false);
                }}
                iconColor="text-indigo-400"
                hoverBg="hover:bg-indigo-500/10"
                hoverText="hover:text-indigo-300"
              />
            </div>

            {/* ── Divider ── */}
            <div className="h-px bg-gray-800/80 mx-3" />

            {/* ── Logout ── */}
            <div className="py-1.5">
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 disabled:opacity-50 group cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-400 rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4 group-hover:scale-105 transition-transform" />
                )}
                <span className="font-medium">
                  {loading ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Reusable menu item ────────────────────────────────────────────────────────
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  iconColor?: string;
  hoverBg?: string;
  hoverText?: string;
}

function MenuItem({
  icon,
  label,
  onClick,
  iconColor = "text-gray-400",
  hoverBg = "hover:bg-gray-800",
  hoverText = "hover:text-gray-100",
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 ${hoverBg} ${hoverText} transition-all duration-150 group cursor-pointer`}
    >
      <span
        className={`${iconColor} group-hover:scale-105 transition-transform`}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default UserDropdown;

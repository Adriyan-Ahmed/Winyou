"use client";

import { Menu, Shield, ShoppingBag } from "lucide-react";
import UserDropdown from "../shared/navbar/UserDropdown";
import Link from "next/link";

import logo from "../../../public/win-you.me-logo.jpg"; // extension ঠিক করো
import Image from "next/image";

interface User {
  name: string;
  email: string;
  role?: "user" | "admin";
  image?: string;
}

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  user: User;
  onLogout?: () => void;
}

export default function Header({ setIsSidebarOpen, user }: HeaderProps) {
  return (
    <header
      className="h-16 fixed top-0 left-0 right-0 z-30 border-b border-gray-800/80"
      style={{ background: "#0b0b14" }}
    >
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* ── Left ── */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 cursor-pointer rounded-xl text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="  hidden sm:block  ">
            <div className="relative w-16 h-15">
              <Image
                src={logo}
                alt="WinYou Me Logo"
                fill
                className="object-contain rounded-xl"
                priority
              />
            </div>
          </Link>
        </div>

        {/* ── Right ── */}
        <div className="flex items-center gap-2.5">
          {/* Admin badge */}
          {user.role === "admin" && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-semibold text-red-400">Admin</span>
            </div>
          )}

          {/* User Dropdown */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}

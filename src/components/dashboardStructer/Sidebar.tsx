"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  ShoppingBag,
  ListOrderedIcon,
  Settings,
} from "lucide-react";
import Image from "next/image";
import logo from "../../../public/win-you.me-logo.jpg"; // extension ঠিক করো

interface UserType {
  name: string;
  email: string;
  role?: "user" | "admin";
  image?: string;
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: UserType;
  onLogout?: () => void;
}

const menuItems = {
  user: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Orders", href: "/admin/orders", icon: ListOrderedIcon },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

export default function Sidebar({ isOpen, setIsOpen, user }: SidebarProps) {
  const pathname = usePathname();
  const role = user?.role || "user";
  const items = menuItems[role as keyof typeof menuItems] || menuItems.user;

  return (
    <>
      <style>{`
        .sidebar-scroll::-webkit-scrollbar { width: 3px; }
        .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background-color: #1f2937;
          border-radius: 999px;
        }
        .sidebar-scroll { scrollbar-width: thin; scrollbar-color: #1f2937 transparent; }
      `}</style>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 left-0 top-0 h-screen w-64
          flex flex-col overflow-hidden
          border-r border-gray-800/80
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none
        `}
        style={{ background: "#0b0b14" }}
      >
        {/* ── Logo (mobile) ── */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-3.5 border-b border-gray-800/80 lg:hidden">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-10 h-10">
              <Image
                src={logo}
                alt="WinYou Me Logo"
                fill
                className="object-contain rounded-xl"
                priority
              />
            </div>
            <span className="text-lg font-bold uppercase text-gray-200">
              {" "}
              <span className="text-amber-400">Win</span>you
              <span className=" text-amber-400 text-xs lowercase">.me</span>
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 min-h-0 overflow-y-auto sidebar-scroll py-3 px-2">
          <ul className="space-y-0.5">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <li key={`${item.href}-${item.label}`}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${
                        isActive
                          ? "text-indigo-300 border border-indigo-500/20"
                          : "text-gray-500 hover:text-gray-200 hover:bg-gray-800/60"
                      }
                    `}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(99,102,241,0.05) 100%)",
                          }
                        : {}
                    }
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                        isActive ? "text-indigo-400" : "text-gray-600"
                      }`}
                    />
                    <span>{item.label}</span>

                    {/* Active dot */}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── User footer ── */}
        <div
          className="flex-shrink-0 border-t border-gray-800/80"
          style={{ background: "#090910" }}
        >
          <div className="px-4 py-2 flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 ring-2 ring-indigo-500/20"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate leading-tight">
                {user?.name}
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="px-4 py-2  lg:mb-16 mb-0 border-t border-gray-800/60">
            <p className="text-[10px] text-gray-700 text-center">
              © {new Date().getFullYear()} Winyou me · v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

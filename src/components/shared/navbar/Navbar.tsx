"use client";

import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";
import NavbarLogo from "./NavbarLogo";
import UserDropdown from "./UserDropdown";
import NavMenuItems from "./NavManuItems";
import { useCart } from "@/context/CartContext ";
import Link from "next/link";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { totalProducts } = useCart();
  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-950/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex justify-between items-center h-20">
            {/* Left */}
            <div className="flex items-center md:gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition"
              >
                <Menu className="w-6 h-6 text-gray-300" />
              </button>

              <NavbarLogo />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex flex-1 justify-center">
              <NavMenuItems onLinkClick={() => {}} />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* 🛒 Cart Icon */}
              <Link
                href="/cart"
                className="relative p-2 rounded-lg hover:bg-gray-800 transition"
              >
                <ShoppingCart className="w-6 h-6 text-gray-300" />

                {totalProducts > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalProducts}
                  </span>
                )}
              </Link>

              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-gray-900 border-r border-gray-800 shadow-2xl transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-4 h-20 border-b border-gray-800">
            <NavbarLogo />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 cursor-pointer hover:bg-gray-800 rounded-lg"
            >
              <X className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          <NavMenuItems onLinkClick={() => setIsSidebarOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default Navbar;

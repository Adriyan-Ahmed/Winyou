"use client";

import { Home, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavMenuItemsProps {
  onLinkClick: () => void;
}

const menuLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Products", icon: ShoppingBag },
];

const NavMenuItems = ({ onLinkClick }: NavMenuItemsProps) => {
  const pathname = usePathname();

  return (
    <nav className="flex md:flex-row flex-col gap-2 md:items-center px-4 md:px-0 py-6 md:py-0">
      {menuLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavMenuItems;

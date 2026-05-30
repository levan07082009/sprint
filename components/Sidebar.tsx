"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Search, 
  DollarSign, 
  Settings, 
  Menu,
  X,
  FileText
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getLinksForRole = (role: string) => {
  if (role === "STUDENT") {
    return [
      { name: "Find Gigs", href: "/student", icon: Search },
      { name: "My Applications", href: "/student/applications", icon: FileText },
      { name: "Earnings", href: "/student/earnings", icon: DollarSign },
      { name: "Settings", href: "/student/settings", icon: Settings },
    ];
  }
  // BUSINESS & INDIVIDUAL
  return [
    { name: "Dashboard", href: `/${role.toLowerCase()}`, icon: Briefcase },
    { name: "Payments", href: `/${role.toLowerCase()}/payments`, icon: DollarSign },
    { name: "Settings", href: `/${role.toLowerCase()}/settings`, icon: Settings },
  ];
};

export default function Sidebar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!isLoaded) return null;

  const role = (user?.publicMetadata?.role as string) || "STUDENT";
  const links = getLinksForRole(role);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-neutral-900 border border-neutral-800 rounded-xl text-white"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-[280px] border-r border-neutral-800 bg-black text-white flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 pb-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500" />
            <span className="text-xl font-bold tracking-tight">Sprint</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
              >
                <div className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                  isActive 
                    ? "text-white bg-white/5" 
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                )}>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab" 
                      className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500"
                    />
                  )}
                  <link.icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-violet-400" : "text-neutral-500 group-hover:text-neutral-300"
                  )} />
                  <span className="font-medium text-sm">{link.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 mt-auto">
          <div className="flex items-center p-2 space-x-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 border-2 border-neutral-800"
                }
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-neutral-500 truncate capitalize">
                {role.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

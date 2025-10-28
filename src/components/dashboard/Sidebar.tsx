"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  PieChart,
  Receipt,
  Target,
  HelpCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";

const CACHE_KEY = "supabase_user_cache";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserInitials = useCallback((fullName: string | undefined) => {
    if (!fullName) return "";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }, []);

  const fetchAndCacheUser = useCallback(async () => {
    setLoading(true);
    let currentUser: User | null = null;

    try {
      const cachedData = localStorage.getItem(CACHE_KEY);

      if (cachedData) {
        const { user: cachedUser, timestamp } = JSON.parse(cachedData);
        const isCacheValid = Date.now() - timestamp < CACHE_DURATION;

        if (isCacheValid) {
          currentUser = cachedUser;
        } else {
          localStorage.removeItem(CACHE_KEY); // Cache is stale
        }
      }

      if (!currentUser) {
        const supabase = createClient();
        const {
          data: { user: fetchedUser },
        } = await supabase.auth.getUser();
        currentUser = fetchedUser;

        if (currentUser) {
          const cachePayload = { user: currentUser, timestamp: Date.now() };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cachePayload));
        }
      }
    } catch (error) {
      console.error("Error fetching or caching user:", error);

      localStorage.removeItem(CACHE_KEY);
    } finally {
      setUser(currentUser);
      setLoading(false);
    }
  }, []); // Empty dependency array, function is stable

  useEffect(() => {
    fetchAndCacheUser();
  }, [fetchAndCacheUser]); // Dependency on fetchAndCacheUser

  // FIX: Wrap handleLogout in useCallback
  const handleLogout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem(CACHE_KEY); // Ensure cache is cleared on logout
    router.push("/login");
  }, [router]); // `router` is a dependency here

  // Memoize menu items as they are static
  const menuItems = useMemo(
    () => [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
      },
      {
        id: "transactions",
        label: "Transactions",
        icon: Receipt,
        href: "/transactions",
      },
      { id: "budgets", label: "Budgets", icon: Target, href: "/budgets" },
      {
        id: "analytics",
        label: "Analytics",
        icon: TrendingUp,
        href: "/analytics",
      },
      { id: "profile", label: "Profile", icon: PieChart, href: "/profile" },
    ],
    []
  ); // Empty dependency array for static data

  const bottomMenuItems = useMemo(
    () => [
      { id: "help", label: "Help & Support", icon: HelpCircle, href: "/help" },
    ],
    []
  );
  const SidebarContent = useMemo(
    () => (
      <>
        {/* Logo Section */}
        <div className="flex flex-col p-6 pt-2 pb-2 items-center justify-center border-b border-zinc-800">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={128}
            height={128}
            className="h-[40px] pt-2 w-80 px-2"
          />
          <p className="text-sm mb-3 text-zinc-400 tracking-wide">
            Manage your money
          </p>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-zinc-800">
          {loading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-zinc-800 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-zinc-800 rounded"></div>
                <div className="w-full h-3 bg-zinc-800 rounded"></div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover" // Added object-cover
                  height={48} // Use actual rendered size for better performance,
                  width={48} // assuming w-12 h-12 resolves to 48px
                  loading="lazy" // Avatars typically aren't LCP
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {getUserInitials(user?.user_metadata?.full_name)}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.user_metadata?.full_name ?? "User"}
                </p>
                <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <div key={item.id}>
                  <Link
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </nav>

        {/* Bottom Menu */}
        <div className="p-4 border-t border-zinc-800">
          <div className="space-y-1 mb-4">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </>
    ),
    [
      loading,
      user,
      getUserInitials,
      pathname,
      menuItems,
      bottomMenuItems,
      handleLogout,
    ]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white hover:bg-zinc-800 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {SidebarContent}
      </aside>
    </>
  );
}

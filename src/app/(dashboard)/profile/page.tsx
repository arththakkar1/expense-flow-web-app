"use client";

import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Zap, Star, Calendar, Crown, LogOut } from "lucide-react";
import { createClient } from "../../../lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { StatCardData, Profile, UserStats } from "../../../types/profile";
import { differenceInDays } from "date-fns";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

const supabase = createClient();

// --- Data Fetching Functions ---
const fetchUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

const fetchProfile = async (): Promise<Profile | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return {
    id: user.id,
    full_name: user.user_metadata?.full_name ?? null,
    email: user.email ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
  };
};

const fetchUserStats = async (
  userId: string | undefined
): Promise<UserStats | null> => {
  if (!userId) return null;

  const { count: totalTransactions, error: tError } = await supabase
    .from("transactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { count: budgetsCreated, error: bError } = await supabase
    .from("budgets")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  const { data: savingsData } = await supabase
    .from("transactions")
    .select("amount")
    .eq("user_id", userId)
    .eq("type", "savings");

  const moneySaved =
    savingsData?.reduce(
      (sum, transaction) => sum + (transaction.amount || 0),
      0
    ) ?? 0;

  if (tError || bError) {
    throw new Error(tError?.message || bError?.message);
  }

  return {
    totalTransactions: totalTransactions ?? 0,
    budgetsCreated: budgetsCreated ?? 0,
    moneySaved,
  };
};

// --- Skeleton Component ---
const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 mb-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 text-center sm:text-left">
          <Skeleton className="h-8 w-48 rounded mb-3" />
          <Skeleton className="h-5 w-64 rounded" />
        </div>
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6"
        >
          <Skeleton className="w-12 h-12 rounded-lg mb-3" />
          <Skeleton className="h-8 w-20 rounded mb-2" />
          <Skeleton className="h-4 w-28 rounded" />
        </div>
      ))}
    </div>
  </div>
);

// --- Main Component ---
export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000,
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    enabled: !!user,
  });

  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: () => fetchUserStats(user?.id),
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [isLoadingUser, user, router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    router.push("/login");
  };

  const daysActive = user
    ? differenceInDays(new Date(), new Date(user.created_at))
    : 0;

  const stats: StatCardData[] = [
    {
      label: "Total Transactions",
      value: userStats?.totalTransactions ?? 0,
      icon: Zap,
      color: "blue",
    },
    {
      label: "Budgets Created",
      value: userStats?.budgetsCreated ?? 0,
      icon: Star,
      color: "purple",
    },
    { label: "Days Active", value: daysActive, icon: Calendar, color: "green" },
    {
      label: "Money Saved",
      value: `₹${(userStats?.moneySaved ?? 0).toLocaleString("en-IN")}`,
      icon: Crown,
      color: "yellow",
    },
  ];

  const colorMap: { [key: string]: { bg: string; text: string } } = {
    blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
    green: { bg: "bg-green-500/10", text: "text-green-400" },
    yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
  };

  const isLoading = isLoadingUser || isLoadingProfile || isLoadingStats;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-zinc-400 mt-1 text-sm sm:text-base">
              Your account information and activity summary.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 rounded-lg transition-all text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          user && (
            <>
              <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-900/20 border border-zinc-800 rounded-xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl shadow-lg">
                    {profile?.avatar_url ? (
                      <Image
                        height={1000}
                        width={1000}
                        src={profile.avatar_url}
                        alt="User Avatar"
                        className="rounded-full w-full h-full object-cover"
                      />
                    ) : (
                      profile?.full_name?.charAt(0) || "👤"
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                      {profile?.full_name || "User"}
                    </h2>
                    <p className="text-zinc-400 text-sm sm:text-base">
                      {profile?.email || "No email provided"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  const colors = colorMap[stat.color] || colorMap.blue;
                  return (
                    <div
                      key={index}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-700 transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}
                      >
                        <Icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`}
                        />
                      </div>
                      <p className="text-2xl sm:text-3xl font-bold mb-1">
                        {stat.value}
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-400">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

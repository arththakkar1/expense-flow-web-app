"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Zap, Star, Calendar, Crown } from "lucide-react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import { StatCardData } from "../../../types/profile";
import { differenceInDays } from "date-fns";

// Import components
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileHeaderBar from "@/components/profile/ProfileHeaderBar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import StatCardGrid from "@/components/profile/StatCardGrid";
import DangerZone from "@/components/profile/DangerZone";
import ConfirmDeleteDialog from "@/components/profile/ConfirmDeleteDialog";
import EditProfileDialog from "@/components/profile/EditProfileDialog";

export type UserType = {
  id: string;
  aud?: string;
  role?: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
  user_metadata?: {
    avatar_url?: string;
    email?: string;
    email_verified?: boolean;
    full_name?: string;
    iss?: string;
    name?: string;
    phone_verified?: boolean;
    preferred_username?: string;
    provider_id?: string;
    sub?: string;
    user_name?: string;
  };
  identities?: Array<{
    identity_id?: string;
    id?: string;
    user_id?: string;
    identity_data?: {
      avatar_url?: string;
      email?: string;
      email_verified?: boolean;
      full_name?: string;
      iss?: string;
      name?: string;
      phone_verified?: boolean;
      preferred_username?: string;
      provider_id?: string;
      sub?: string;
      user_name?: string;
    };
    provider?: string;
    last_sign_in_at?: string;
    created_at?: string;
    updated_at?: string;
    email?: string;
  }>;
  created_at?: string;
  updated_at?: string;
  is_anonymous?: boolean;
};

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // --- State for dialogs ---
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // --- Data Fetching ---
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 5 * 60 * 1000,
  });

  //
  // --- THIS IS THE UPDATED SECTION ---
  //
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id], // Key is now dependent on user.id
    queryFn: async () => {
      const supabase = createClient();
      if (!user) return null; // Use the user from the first query

      // Fetch from the 'profiles' table
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*") // Get all columns (full_name, email, avatar_url, etc.)
        .eq("user_id", user.id) // Match it to the logged-in user
        .single(); // We expect one row or null

      if (error) {
        console.error("Error fetching profile:", error);
        throw new Error(error.message);
      }

      return profileData;
    },
    enabled: !!user, // This is perfect, only runs when 'user' is loaded
  });
  //
  // --- END OF UPDATED SECTION ---
  //

  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      // ... (fetch userStats logic)
      const supabase = createClient();
      const userId = user?.id;
      if (!userId) return null;

      const { count: totalTransactions } = await supabase
        .from("transactions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: budgetsCreated } = await supabase
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

      return {
        totalTransactions: totalTransactions ?? 0,
        budgetsCreated: budgetsCreated ?? 0,
        moneySaved,
      };
    },
    enabled: !!user,
  });

  // --- Auth & Handlers (Delete logic unchanged) ---
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [isLoadingUser, user, router]);

  const handleSignOut = async () => {
    // ... (sign out logic)
    const supabase = createClient();
    await supabase.auth.signOut();
    queryClient.clear();
    router.push("/login");
  };

  const handleDeleteAllTransactions = async () => {
    if (!user) return;
    // ... (delete logic unchanged)
    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["userStats"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboardData"] }),
        queryClient.invalidateQueries({ queryKey: ["transactions"] }),
        queryClient.invalidateQueries({ queryKey: ["budgets"] }),
        queryClient.invalidateQueries({ queryKey: ["analyticsTransactions"] }),
        queryClient.invalidateQueries({ queryKey: ["transactionStats"] }),
      ]);

      alert("All transactions have been deleted.");
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete transactions:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Data Preparation (No Changes) ---
  const daysActive = user
    ? differenceInDays(new Date(), new Date(user.created_at))
    : 0;
  const stats: StatCardData[] = [
    // ... (stats array unchanged)
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
  const isLoading = isLoadingUser || isLoadingProfile || isLoadingStats;

  // --- JSX Render (Updated) ---
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
        <ProfileHeaderBar onSignOut={handleSignOut} />

        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          user &&
          profile && (
            <>
              {/* Pass onEdit prop */}
              <ProfileHeader
                profile={profile}
                onEdit={() => setIsEditOpen(true)}
                user={user}
              />
              <StatCardGrid stats={stats} />
              <DangerZone onOpenConfirm={() => setIsConfirmOpen(true)} />
            </>
          )
        )}
      </div>

      {/* --- Dialogs --- */}
      <ConfirmDeleteDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteAllTransactions}
        isDeleting={isDeleting}
      />

      {/* Render Edit dialog (only if profile exists) */}
      {profile && (
        <EditProfileDialog
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          profile={profile}
        />
      )}
    </div>
  );
}

"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle, LucideIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import Header from "@/components/budgets/Header";
import Overview from "@/components/budgets/Overview";
import StatsCard from "@/components/budgets/StatsCard";
import BudgetCard from "@/components/budgets/BudgetCard";
import AddBudgetModal from "@/components/budgets/AddBudgetModal";
import EditBudgetModal from "@/components/budgets/EditBudgetModal";
import DeleteBudgetDialog from "@/components/budgets/DeleteBudgetDialog";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export interface Budget {
  id: string;
  categoryName: string;
  categoryIcon: string;
  amount: number;
  spent: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  color: string;
  category_id: string;
}

// --- Skeletons (No changes) ---
function BudgetCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <div>
            <Skeleton className="h-5 w-24 mb-1.5" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="w-5 h-5 rounded-full" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20 ml-auto" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-2.5 w-full" />
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <Skeleton className="h-4 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-6 rounded" />
          <Skeleton className="h-6 w-6 rounded" />
        </div>
      </div>
    </div>
  );
}

function BudgetsLoadingSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
        <BudgetCardSkeleton />
      </div>
    </div>
  );
}

// --- Main Component ---
export default function BudgetsPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "weekly" | "monthly" | "yearly"
  >("monthly");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const queryClient = useQueryClient();

  // MODIFIED: fetchUser logic is now inside queryFn
  const { data: user, isLoading: isUserLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient(); // Client created here
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: Infinity,
  });

  // MODIFIED: fetchBudgetsWithSpent logic is now inside queryFn
  const {
    data: budgets = [],
    isLoading: isBudgetsLoading,
    isError,
  } = useQuery<Budget[]>({
    queryKey: ["budgets", user?.id],
    queryFn: async () => {
      // `enabled: !!user` already protects this, so user.id is available
      const supabase = createClient(); // Client created here
      const { data, error } = await supabase.rpc("get_budgets_with_spent");
      if (error) {
        console.error("Error fetching budgets:", error);
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!user, // Only run query if user exists
    refetchOnWindowFocus: true,
  });

  // Combined loading state
  const isLoading = isUserLoading || isBudgetsLoading;

  // Client-side auth check
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [isUserLoading, user, router]);

  // Memoize calculations (No changes)
  const { totalBudget, totalSpent, totalRemaining, overallPercentage } =
    useMemo(() => {
      const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
      const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
      const totalRemaining = totalBudget - totalSpent;
      const overallPercentage =
        totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      return { totalBudget, totalSpent, totalRemaining, overallPercentage };
    }, [budgets]);

  // --- Helper Functions (No changes) ---
  const getColorClasses = (color: string) => {
    const colors: {
      [key: string]: {
        bg: string;
        text: string;
        border: string;
        progress: string;
      };
    } = {
      orange: {
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/20",
        progress: "bg-orange-500",
      },
      yellow: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/20",
        progress: "bg-yellow-500",
      },
      purple: {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/20",
        progress: "bg-purple-500",
      },
      pink: {
        bg: "bg-pink-500/10",
        text: "text-pink-400",
        border: "border-pink-500/20",
        progress: "bg-pink-500",
      },
      blue: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
        progress: "bg-blue-500",
      },
      green: {
        bg: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500/20",
        progress: "bg-green-500",
      },
    };
    return colors[color] || colors.blue;
  };

  const getStatusInfo = (
    spent: number,
    amount: number
  ): {
    status: "exceeded" | "warning" | "good";
    icon: LucideIcon;
    color: string;
  } => {
    const percentage = amount > 0 ? (spent / amount) * 100 : 0;
    if (percentage >= 100)
      return { status: "exceeded", icon: AlertCircle, color: "text-red-400" };
    if (percentage >= 80)
      return { status: "warning", icon: AlertCircle, color: "text-yellow-400" };
    return { status: "good", icon: CheckCircle, color: "text-green-400" };
  };

  // --- Event Handlers ---
  const handleEditClick = (budget: Budget) => {
    setEditingBudget(budget);
    setShowEditModal(true);
  };

  const handleDeleteClick = (budget: Budget) => {
    setDeletingBudget(budget);
    setShowDeleteDialog(true);
  };

  // MODIFIED: Create client inside the handler
  const handleDeleteConfirm = async () => {
    if (!deletingBudget) return;

    setIsDeleting(true);
    const supabase = createClient(); // Client created here
    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", deletingBudget.id);

    setIsDeleting(false);

    if (error) {
      alert("Failed to delete budget: " + error.message);
    } else {
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      setShowDeleteDialog(false);
      setDeletingBudget(null);
    }
  };

  // --- JSX Render (No changes) ---
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        <Header setShowAddModal={setShowAddModal} />

        {isLoading && <BudgetsLoadingSkeleton />}

        {isError && (
          <div className="text-center p-8 text-red-400">
            Error loading budgets.
          </div>
        )}

        {!isLoading && !isError && user && (
          <>
            <Overview
              {...{
                totalRemaining,
                overallPercentage,
                selectedPeriod,
                setSelectedPeriod,
                totalSpent,
                totalBudget,
              }}
            />
            <StatsCard budgets={budgets} />
            <BudgetCard
              budgets={budgets}
              getStatusInfo={getStatusInfo}
              setShowAddModal={setShowAddModal}
              getColorClasses={getColorClasses}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          </>
        )}
      </div>

      <AddBudgetModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        user={user || null}
      />

      <EditBudgetModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingBudget(null);
        }}
        budget={editingBudget}
      />

      <DeleteBudgetDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingBudget(null);
        }}
        onConfirm={handleDeleteConfirm}
        budgetName={deletingBudget?.categoryName || ""}
        isLoading={isDeleting}
      />
    </div>
  );
}

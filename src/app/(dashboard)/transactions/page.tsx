"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { DollarSign, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import Header from "@/components/transaction/Header"; // Use the corrected Header component
import StatsCard from "@/components/transaction/StatsCard";
import Filters from "@/components/transaction/Filters";
import Transactions from "@/components/transaction/Transactions";
import EditTransactionDialog from "@/components/transaction/EditTransactionDialog";
import { UpdateTransactionData } from "@/lib/supabase/queries";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface TransactionForEdit {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  type: "income" | "expense";
  category_id: string | null;
  transaction_date: string;
}

interface MutationPayload {
  transactionId: string;
  transactionData: UpdateTransactionData;
}

export interface TransactionWithCategory {
  id: string;
  title: string;
  category: string;
  date: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  status: "completed" | "pending" | "failed";
  merchant?: string;
  user_id: string;
  description: string;
  category_id: string | null;
  transaction_date: string;
}

export type StatCardData = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: typeof TrendingUp | typeof DollarSign;
};

interface AggregatedStats {
  totalIncome: number;
  totalExpenses: number;
}

// Ensure this structure matches the JOIN result from Supabase
interface DetailedRawTransaction {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: "income" | "expense" | "transfer";
  user_id: string;
  category_id: string | null;
  categories: { id: string | null; name: string | null } | null;
}

type CategoryName = string;
type FilterType = "all" | "income" | "expense";
type DateRangeType = "all" | "week" | "month" | "year";

const ITEMS_PER_PAGE = 8;
const DEBOUNCE_DELAY = 300;
const supabase = createClient();

const getDateBoundaries = (range: DateRangeType) => {
  const end = new Date();
  const start = new Date(end);

  if (range === "all") {
    // Note: Using a very old date for 'all' is common for Supabase/Postgres range queries
    return { start: "2000-01-01T00:00:00Z", end: end.toISOString() };
  } else if (range === "week") {
    start.setDate(end.getDate() - 7);
  } else if (range === "month") {
    start.setMonth(end.getMonth() - 1);
  } else if (range === "year") {
    start.setFullYear(end.getFullYear() - 1);
  }
  return { start: start.toISOString(), end: end.toISOString() };
};

// --- Data Fetching Functions ---
const fetchUser = async (): Promise<User | null> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

const fetchTransactionStats = async ({
  queryKey,
}: {
  queryKey: readonly unknown[];
}): Promise<AggregatedStats> => {
  const [, userId, filter, dateRange] = queryKey;
  if (!userId) return { totalIncome: 0, totalExpenses: 0 };

  const { start, end } = getDateBoundaries(dateRange as DateRangeType);

  let query = supabase
    .from("transactions")
    .select(`type, amount`)
    .eq("user_id", userId as string)
    .gte("date", start)
    .lte("date", end);

  if (filter !== "all") {
    query = query.eq("type", filter as string);
  }

  const { data, error } = await query;
  if (error) throw error;

  const totalIncome =
    data
      ?.filter((t) => t.type === "income")
      // Use Math.abs() as amount is stored as positive in DB
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0) ?? 0;

  const totalExpenses =
    data
      ?.filter((t) => t.type === "expense")
      // Use Math.abs() as amount is stored as positive in DB
      .reduce((sum, t) => sum + Math.abs(t.amount || 0), 0) ?? 0;

  return { totalIncome, totalExpenses };
};

const fetchTransactions = async ({
  queryKey,
}: {
  queryKey: readonly unknown[];
}) => {
  const [, userId, filter, dateRange, page, searchQuery] = queryKey;
  if (!userId) throw new Error("User ID is required.");

  const { start, end } = getDateBoundaries(dateRange as DateRangeType);

  const from = ((page as number) - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("transactions")
    .select(
      `id, description, date, amount, type, user_id, category_id, categories ( id, name )`,
      {
        count: "exact",
      }
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  console.log("Value:", query);

  if (filter !== "all") query = query.eq("type", filter as string);
  query = query.gte("date", start).lte("date", end);

  if (searchQuery) {
    const searchString = `%${searchQuery as string}%`;
    // Filter by description OR category name
    query = query.or(
      `description.ilike.${searchString},categories.name.ilike.${searchString}`
    );
  }

  const { data, error, count } = await query.range(from, to);
  if (error) throw error;

  // Type assertion for correct data mapping
  const mappedData: TransactionWithCategory[] = (
    (data as unknown as DetailedRawTransaction[]) || []
  ).map((t) => ({
    id: t.id,
    title: t.description || "N/A",
    category: (t.categories && t.categories.name) || "Uncategorized",
    date: t.date,
    // Convert DB positive amount to positive/negative based on type
    amount: t.type === "expense" ? -Math.abs(t.amount) : Math.abs(t.amount),
    type: t.type,
    status: "completed" as const,
    merchant: t.description || undefined,
    user_id: t.user_id,
    description: t.description,
    category_id: t.category_id,
    transaction_date: t.date,
  }));

  return { transactions: mappedData, count: count || 0 };
};

// --- Custom Delete Dialog Component ---
interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60]">
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold text-white">Confirm Deletion</h3>
        <p className="text-zinc-400">
          Are you sure you want to permanently delete this transaction? This
          action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="bg-zinc-700 text-white hover:bg-zinc-600 border-none"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function TransactionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] =
    useState<string>(searchQuery);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [dateRange, setDateRange] = useState<DateRangeType>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // State for dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionWithCategory | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDeleteId, setTransactionToDeleteId] = useState<
    string | null
  >(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, dateRange, debouncedSearchQuery]);

  // --- Data Queries ---
  const { data: user, isLoading: isLoadingUser } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity,
  });

  const { data: statsData, isLoading: isLoadingStats } =
    useQuery<AggregatedStats>({
      queryKey: ["transactionStats", user?.id, selectedFilter, dateRange],
      queryFn: fetchTransactionStats,
      enabled: !!user,
    });

  const {
    data,
    isLoading: isLoadingTransactions,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "transactions",
      user?.id,
      selectedFilter,
      dateRange,
      currentPage,
      debouncedSearchQuery,
    ],
    queryFn: fetchTransactions,
    enabled: !!user,
  });

  // --- Mutations ---
  const invalidateQueries = (userId?: string) => {
    if (!userId) return;
    // Invalidate queries relevant to the current user
    queryClient.invalidateQueries({ queryKey: ["transactions", userId] });
    queryClient.invalidateQueries({ queryKey: ["transactionStats", userId] });
    queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
  };

  const updateTransactionMutation = useMutation({
    mutationFn: async (payload: MutationPayload) => {
      const { transactionId, transactionData } = payload;
      const { error } = await supabase
        .from("transactions")
        .update({
          // Ensure we send the absolute amount back to the DB
          amount: Math.abs(transactionData.amount!),
          description: transactionData.description,
          category_id: transactionData.category_id,
          type: transactionData.type,
          date: transactionData.transaction_date,
        })
        .eq("id", transactionId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidateQueries(user?.id);
      setIsEditDialogOpen(false);
      setEditingTransaction(null);
    },
    onError: (error) => {
      alert("Failed to update transaction: " + error.message);
      console.error("Update failed:", error);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: async (transactionId: string) => {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      invalidateQueries(user?.id);
      handleCloseDeleteDialog();
    },
    onError: (error) => {
      alert("Failed to delete transaction: " + error.message);
      console.error("Delete failed:", error);
    },
  });

  // Auth Effect
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [isLoadingUser, user, router]);

  // Computed State
  const isLoading = isLoadingUser || isLoadingTransactions || isLoadingStats;
  const transactionsData = useMemo(() => data?.transactions ?? [], [data]);
  const totalCount = data?.count ?? 0;

  const stats: StatCardData[] = useMemo(() => {
    const totalIncome = statsData?.totalIncome ?? 0;
    const totalExpenses = statsData?.totalExpenses ?? 0;
    const netBalance = totalIncome - totalExpenses;

    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);

    return [
      {
        label: "Total Income",
        value: formatCurrency(totalIncome),
        change: "",
        trend: "up" as const,
        icon: TrendingUp,
      },
      {
        label: "Total Expenses",
        value: formatCurrency(totalExpenses),
        change: "",
        trend: "down" as const,
        icon: TrendingDown,
      },
      {
        label: "Net Balance",
        value: formatCurrency(netBalance),
        change: "",
        trend: (netBalance >= 0 ? "up" : "down") as "up" | "down",
        icon: DollarSign,
      },
    ];
  }, [statsData]);

  // --- Event Handlers ---
  const getCategoryColor = (category: CategoryName): string => {
    const colors: Record<string, string> = {
      Salary: "bg-green-500/10 text-green-400 border-green-500/20",
      "Food & Groceries":
        "bg-orange-500/10 text-orange-400 border-orange-500/20",
      Utilities: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Entertainment: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      Transport: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      Shopping: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      Freelance: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    };
    return (
      colors[category] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    );
  };

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const handleEdit = (transactionId: string) => {
    const transactionToEdit = transactionsData.find(
      (t) => t.id === transactionId
    );
    if (transactionToEdit && transactionToEdit.type !== "transfer") {
      setEditingTransaction(transactionToEdit);
      setIsEditDialogOpen(true);
    } else if (transactionToEdit) {
      alert("Editing 'transfer' transactions is not supported.");
    }
  };

  const handleUpdateTransaction = async (payload: MutationPayload) => {
    await updateTransactionMutation.mutateAsync(payload);
  };

  const handleOpenDeleteDialog = (transactionId: string) => {
    setTransactionToDeleteId(transactionId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (transactionToDeleteId) {
      deleteTransactionMutation.mutate(transactionToDeleteId);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setTransactionToDeleteId(null);
  };

  // Data formatting for the edit dialog
  const transactionForEdit: TransactionForEdit | null = editingTransaction
    ? {
        id: editingTransaction.id,
        user_id: editingTransaction.user_id,
        // Send the absolute value to the dialog/mutation
        amount: Math.abs(editingTransaction.amount),
        description: editingTransaction.description,
        type: editingTransaction.type as "income" | "expense",
        category_id: editingTransaction.category_id,
        transaction_date: editingTransaction.transaction_date,
      }
    : null;

  // --- Render ---
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-white">
      <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        <Header user={user || null} />
        {isError ? (
          <div className="text-red-500 p-4 border border-red-500/20 rounded-lg">
            Error:{" "}
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </div>
        ) : (
          user && (
            <>
              <StatsCard stats={stats} isLoading={isLoading} />
              <Filters
                {...{
                  searchQuery,
                  selectedFilter,
                  setSearchQuery,
                  setSelectedFilter,
                  dateRange,
                  setDateRange,
                }}
              />
              <Transactions
                {...{
                  transactions: transactionsData,
                  getCategoryColor,
                  isLoading,
                  currentPage,
                  itemsPerPage: ITEMS_PER_PAGE,
                  totalCount,
                  onPageChange: handlePageChange,
                  onEdit: handleEdit,
                  onDelete: handleOpenDeleteDialog,
                }}
              />
            </>
          )
        )}
      </div>

      <EditTransactionDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        transaction={transactionForEdit}
        onUpdate={handleUpdateTransaction}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isSubmitting={deleteTransactionMutation.isPending}
      />
    </div>
  );
}

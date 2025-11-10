"use client";

import React, { useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Wallet, PieChart, IndianRupeeIcon } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ChartSecotion from "@/components/dashboard/ChartSecotion";
import MinTransaction from "@/components/dashboard/MinTransaction";
import { createClient } from "@/lib/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
// --- REMOVED: Account type import ---

// --- Type Definitions ---
export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: string;
}

export interface Transaction {
  id: string;
  type: "expense" | "income" | "transfer";
  amount: number;
  description: string | null;
  category_id: string | null;
  date: string;
  account_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  category: Category | null;
}

export type StatsCard = {
  icon: React.ElementType;
  gradient: string;
  border: string;
  labelColor: string;
  label: string;
  iconColor: string;
  value: string | number;
  changeType: "up" | "down" | "neutral";
  change: string | number;
};

export interface CategorySpending {
  category_name: string;
  total_amount: number;
  percentage: number;
  color: string;
}

interface MonthlyTransaction {
  amount: number;
  type: "expense" | "income" | "transfer";
  date: string;
  category: {
    name: string;
    color: string;
  } | null;
}

interface PieChartItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface TooltipPayloadItem {
  name: string;
  color: string;
  value: number;
  payload: { [key: string]: string | number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

// --- Skeletons (No Changes) ---
function StatsCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-32">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-28" />
    </div>
  );
}

function ChartSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-96">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-full w-full max-h-72" />
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-96">
        <Skeleton className="h-6 w-1/2 mb-4" />
        <Skeleton className="h-full w-full max-h-72" />
      </div>
    </div>
  );
}

function MinTransactionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-96">
        <Skeleton className="h-6 w-1/3 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24 mb-1.5" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 h-96">
        <Skeleton className="h-6 w-1/2 mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Main Component ---
export default function DashboardPage() {
  const router = useRouter();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    },
    staleTime: Infinity,
  });

  const {
    data,
    isLoading: isDataLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboardData", user?.id],
    queryFn: async () => {
      const supabase = createClient();
      const userId = user?.id;

      if (!userId) return null;

      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      ).toISOString();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const [
        // --- REMOVED: accountsRes ---
        transactionsRes,
        monthlyTransactionsRes,
        trendDataRes,
      ] = await Promise.all([
        // --- REMOVED: Accounts fetch ---
        supabase
          .from("transactions")
          .select(
            `
              *,
              category:categories (
                id,
                name,
                icon,
                color,
                type
              )
            `
          )
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("transactions")
          .select("amount, type, date, category:categories(name, color)")
          .eq("user_id", userId)
          .gte("date", firstDayOfMonth),
        supabase
          .from("transactions")
          .select("amount, type, date")
          .eq("user_id", userId)
          .gte("date", sixMonthsAgo.toISOString()),
      ]);

      // --- REMOVED: accountsRes.error check ---
      if (transactionsRes.error) throw new Error(transactionsRes.error.message);
      if (monthlyTransactionsRes.error)
        throw new Error(monthlyTransactionsRes.error.message);
      if (trendDataRes.error) throw new Error(trendDataRes.error.message);

      return {
        // --- REMOVED: accountsRes ---
        transactionsRes,
        monthlyTransactionsRes,
        trendDataRes,
      };
    },
    enabled: !!user,
  });

  const isLoading = isUserLoading || isDataLoading;

  useEffect(() => {
    if (!isUserLoading && !user) {
      redirect("/login");
    }
  }, [isUserLoading, user, router]);

  const { stats, transactions, categorySpending, monthlyTrendData } =
    useMemo(() => {
      if (!data) {
        return {
          // --- MODIFIED: Added netMonthlyBalance, removed totalBalance ---
          stats: { netMonthlyBalance: 0, monthlyExpenses: 0, monthlyIncome: 0 },
          transactions: [],
          categorySpending: [],
          monthlyTrendData: [],
          // --- REMOVED: accounts: [] ---
        };
      }

      const {
        // --- REMOVED: accountsRes ---
        transactionsRes,
        monthlyTransactionsRes,
        trendDataRes,
      } = data;

      // --- REMOVED: totalBalance calculation ---

      const monthlyData = (monthlyTransactionsRes.data ||
        []) as unknown as MonthlyTransaction[];

      const monthlyIncome = monthlyData
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

      const monthlyExpenses = monthlyData
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

      // --- NEW: Calculate netMonthlyBalance ---
      const netMonthlyBalance = monthlyIncome - monthlyExpenses;

      const spending: { [key: string]: { amount: number; color: string } } = {};

      monthlyData
        .filter((t) => t.type === "expense")
        .forEach((t) => {
          const categoryName = t.category?.name ?? "Uncategorized";
          if (!spending[categoryName]) {
            spending[categoryName] = {
              amount: 0,
              color: t.category?.color ?? "#8884d8",
            };
          }
          spending[categoryName].amount += t.amount;
        });

      const totalExpensesForPercentage = Object.values(spending).reduce(
        (acc, curr) => acc + curr.amount,
        0
      );

      const categorySpendingData = Object.entries(spending).map(
        ([name, data]) => ({
          category_name: name,
          total_amount: data.amount,
          color: data.color,
          percentage:
            totalExpensesForPercentage > 0
              ? Math.round((data.amount / totalExpensesForPercentage) * 100)
              : 0,
        })
      );

      const monthlySummary: {
        [key: string]: { income: number; expenses: number };
      } = {};

      if (trendDataRes.data) {
        for (const t of trendDataRes.data) {
          const month = new Date(t.date).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });
          if (!monthlySummary[month]) {
            monthlySummary[month] = { income: 0, expenses: 0 };
          }
          if (t.type === "income") {
            monthlySummary[month].income += t.amount;
          } else if (t.type === "expense") {
            monthlySummary[month].expenses += t.amount;
          }
        }
      }

      const trendChartData = Object.entries(monthlySummary).map(
        ([month, data]) => ({ month, ...data })
      );

      return {
        // --- MODIFIED: Added netMonthlyBalance, removed totalBalance ---
        stats: { netMonthlyBalance, monthlyExpenses, monthlyIncome },
        transactions: (transactionsRes.data as Transaction[]) ?? [],
        categorySpending: categorySpendingData,
        monthlyTrendData: trendChartData,
        // --- REMOVED: accounts ---
      };
    }, [data]);

  const formatCurrency = useCallback(
    (amount: number) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount),
    []
  );

  const pieChartData: PieChartItem[] = useMemo(
    () =>
      categorySpending.map((cat) => ({
        name: cat.category_name,
        value: cat.total_amount,
        color: cat.color,
      })),
    [categorySpending]
  );

  const statsCards: StatsCard[] = useMemo(
    () => [
      // --- MODIFIED: This card is now "Monthly Net Balance" and is dynamic ---
      {
        gradient:
          stats.netMonthlyBalance >= 0
            ? "from-green-500/20 to-green-600/20"
            : "from-red-500/20 to-red-600/20",
        border:
          stats.netMonthlyBalance >= 0
            ? "border-green-500/30"
            : "border-red-500/30",
        label: "Monthly Net Balance",
        labelColor:
          stats.netMonthlyBalance >= 0 ? "text-green-400" : "text-red-400",
        value: formatCurrency(stats.netMonthlyBalance),
        change: "",
        changeType: stats.netMonthlyBalance >= 0 ? "up" : "down",
        icon: Wallet,
        iconColor:
          stats.netMonthlyBalance >= 0 ? "text-green-400" : "text-red-400",
      },
      // --- End of modified card ---
      {
        gradient: "from-purple-500/20 to-purple-600/20",
        border: "border-purple-500/30",
        label: "Monthly Expenses",
        labelColor: "text-purple-400",
        value: formatCurrency(stats.monthlyExpenses),
        change: "",
        changeType: "down",
        icon: CreditCard,
        iconColor: "text-purple-400",
      },
      {
        gradient: "from-green-500/20 to-green-600/20",
        border: "border-green-500/30",
        label: "Monthly Income",
        labelColor: "text-green-400",
        value: formatCurrency(stats.monthlyIncome),
        change: "",
        changeType: "up",
        icon: IndianRupeeIcon,
        iconColor: "text-green-400",
      },
      {
        gradient: "from-orange-500/20 to-orange-600/20",
        border: "border-orange-500/30",
        label: "Savings Goal",
        labelColor: "text-orange-400",
        value: "N/A",
        change: "Feature coming",
        changeType: "neutral",
        icon: PieChart,
        iconColor: "text-orange-400",
      },
    ],
    [stats, formatCurrency]
  );

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const month = payload[0].payload.month;
      return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
          <p className="text-sm text-zinc-400 mb-1">
            {typeof month === "string" ? month : "Data Point"}
          </p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="text-sm font-semibold"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Error loading dashboard</p>
          <p className="text-zinc-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* --- REMOVED stale comment about passing accounts --- */}
        <DashboardHeader user={user || null} />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </div>
        ) : (
          <StatsCards loading={isLoading} statsCards={statsCards} />
        )}

        {isLoading ? (
          <ChartSectionSkeleton />
        ) : (
          <ChartSecotion
            monthlyTrendData={monthlyTrendData}
            pieChartData={pieChartData}
            formatCurrency={formatCurrency}
            CustomTooltip={CustomTooltip}
            isLoading={isLoading}
          />
        )}

        {isLoading ? (
          <MinTransactionSkeleton />
        ) : (
          <MinTransaction
            transactions={transactions}
            formatCurrency={formatCurrency}
            categorySpending={categorySpending}
            stats={stats}
          />
        )}
      </div>
    </div>
  );
}

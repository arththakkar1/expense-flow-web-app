"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  Activity,
  Target,
  Zap,
} from "lucide-react";

import { createClient } from "../../../lib/supabase/client"; // Import the function
import { useRouter } from "next/navigation";
import {
  Stat,
  Insight,
  SpendingTrend,
  CategorySpending,
  TopTransaction,
  WeeklyComparison,
} from "../../../types/analytics";
import Header from "../../../components/analytics/Header";
import StatCard from "../../../components/analytics/StatCard";
import Chart from "../../../components/analytics/Chart";
import KeyInsight from "../../../components/analytics/KeyInsight";

import {
  subDays,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  eachMonthOfInterval,
  format,
  getDaysInMonth,
  eachDayOfInterval,
} from "date-fns";

type RawTransaction = {
  amount: number;
  type: "income" | "expense";
  date: string;
  description: string | null;
  categories: {
    name: string;
    color: string;
  } | null;
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");

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
    data: rawTransactions = [],
    isLoading: isTransactionsLoading,
    isError,
  } = useQuery<RawTransaction[]>({
    queryKey: ["analyticsTransactions", user?.id],
    queryFn: async () => {
      // MODIFIED: Create client inside the query function
      const supabase = createClient();
      const userId = user?.id; // Get user from closure

      if (!userId) return [];

      const oneYearAgo = format(subDays(new Date(), 365), "yyyy-MM-dd");

      const { data, error } = await supabase
        .from("transactions")
        .select(`amount, type, date, description, categories (name, color)`)
        .eq("user_id", userId)
        .gte("date", oneYearAgo)
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        throw new Error(error.message);
      }

      return data as unknown as RawTransaction[];
    },
    enabled: !!user,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const isLoading = isUserLoading || isTransactionsLoading;

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [isUserLoading, user, router]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    if (timeRange === "week") startDate = subDays(now, 6);
    else if (timeRange === "month") startDate = startOfMonth(now);
    else if (timeRange === "quarter") startDate = startOfQuarter(now);
    else startDate = startOfYear(now);

    return rawTransactions.filter((t) => new Date(t.date) >= startDate);
  }, [rawTransactions, timeRange]);

  const stats: Stat[] = useMemo(() => {
    const expenses = filteredTransactions.filter((t) => t.type === "expense");
    const income = filteredTransactions.filter((t) => t.type === "income");

    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

    const daysInPeriod = {
      week: 7,
      month: getDaysInMonth(new Date()),
      quarter: 90,
      year: 365,
    }[timeRange];

    const avgDaily = daysInPeriod > 0 ? totalSpent / daysInPeriod : 0;
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalSpent) / totalIncome) * 100 : 0;

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(val || 0);
    const formatPercent = (val: number) => `${(val || 0).toFixed(1)}%`;

    return [
      {
        label: "Total Spent",
        value: formatCurrency(totalSpent),
        change: "",
        trend: "up",
        icon: DollarSign,
        color: "red",
      },
      {
        label: "Avg Daily",
        value: formatCurrency(avgDaily),
        change: "",
        trend: "down",
        icon: Activity,
        color: "green",
      },
      {
        label: "Transactions",
        value: filteredTransactions.length,
        change: "",
        trend: "up",
        icon: BarChart3,
        color: "blue",
      },
      {
        label: "Savings Rate",
        value: formatPercent(savingsRate),
        change: "",
        trend: "up",
        icon: Target,
        color: "purple",
      },
    ];
  }, [filteredTransactions, timeRange]);

  const categorySpending: CategorySpending[] = useMemo(() => {
    const spendingMap = new Map<string, { value: number; color: string }>();
    const expenses = filteredTransactions.filter((t) => t.type === "expense");
    const totalSpent = expenses.reduce((sum, t) => sum + t.amount, 0);

    for (const t of expenses) {
      const categoryName = t.categories?.name || "Uncategorized";
      const current = spendingMap.get(categoryName) || {
        value: 0,
        color: t.categories?.color || "#8884d8",
      };
      current.value += t.amount;
      spendingMap.set(categoryName, current);
    }

    return Array.from(spendingMap.entries())
      .map(([name, data]) => ({
        name,
        value: data.value,
        color: data.color,
        percentage: totalSpent > 0 ? (data.value / totalSpent) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTransactions]);

  const topTransactions: TopTransaction[] = useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 4)
      .map((t) => ({
        name: t.description || "N/A",
        amount: t.amount,
        category: t.categories?.name || "Uncategorized",
        date: format(new Date(t.date), "MMM dd"),
      }));
  }, [filteredTransactions]);

  const spendingTrend: SpendingTrend[] = useMemo(() => {
    const now = new Date();
    const dataMap = new Map<string, { spending: number; income: number }>();

    if (timeRange === "year" || timeRange === "quarter") {
      const start =
        timeRange === "year" ? startOfYear(now) : startOfQuarter(now);
      const months = eachMonthOfInterval({ start, end: now });
      const relevantTransactions = rawTransactions.filter(
        (t) => new Date(t.date) >= start
      );

      for (const t of relevantTransactions) {
        const monthKey = format(new Date(t.date), "MMM");
        const current = dataMap.get(monthKey) || { spending: 0, income: 0 };
        if (t.type === "expense") current.spending += t.amount;
        if (t.type === "income") current.income += t.amount;
        dataMap.set(monthKey, current);
      }

      return months.map((month) => {
        const monthKey = format(month, "MMM");
        const data = dataMap.get(monthKey) || { spending: 0, income: 0 };
        return { date: monthKey, spending: data.spending, income: data.income };
      });
    }

    const start = timeRange === "month" ? startOfMonth(now) : subDays(now, 6);
    const days = eachDayOfInterval({ start, end: now });
    const relevantTransactions = rawTransactions.filter(
      (t) => new Date(t.date) >= start
    );

    for (const t of relevantTransactions) {
      const dayKey = format(new Date(t.date), "MMM d");
      const current = dataMap.get(dayKey) || { spending: 0, income: 0 };
      if (t.type === "expense") current.spending += t.amount;
      if (t.type === "income") current.income += t.amount;
      dataMap.set(dayKey, current);
    }

    return days.map((day) => {
      const dayKey = format(day, "MMM d");
      const data = dataMap.get(dayKey) || { spending: 0, income: 0 };
      return {
        date: format(day, "MMM d"),
        spending: data.spending,
        income: data.income,
      };
    });
  }, [rawTransactions, timeRange]);

  const weeklyComparison: WeeklyComparison[] = useMemo(() => {
    const now = new Date();
    const lastWeekStart = subDays(now, 13);
    const thisWeekStart = subDays(now, 6);

    const relevantTransactions = rawTransactions.filter((t) => {
      const tDate = new Date(t.date);
      return t.type === "expense" && tDate >= lastWeekStart && tDate <= now;
    });

    const dataMap = new Map<string, { thisWeek: number; lastWeek: number }>();
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach((day) => dataMap.set(day, { thisWeek: 0, lastWeek: 0 }));

    for (const t of relevantTransactions) {
      const tDate = new Date(t.date);
      const dayKey = format(tDate, "E"); // 'E' gives day of week like 'Mon', 'Tue'
      const entry = dataMap.get(dayKey);

      if (entry) {
        if (tDate >= thisWeekStart) {
          entry.thisWeek += t.amount;
        } else {
          entry.lastWeek += t.amount;
        }
      }
    }

    return daysOfWeek.map((day) => ({
      day,
      thisWeek: dataMap.get(day)?.thisWeek || 0,
      lastWeek: dataMap.get(day)?.lastWeek || 0,
    }));
  }, [rawTransactions]);

  const insights: Insight[] = useMemo(
    () => [
      {
        icon: TrendingUp,
        title: "Spending Analysis",
        description: `Data shown for the last ${timeRange}.`,
        change: "",
        color: "blue",
      },
      {
        icon: Target,
        title: "Budget Goal",
        description: "You're 85% towards your monthly savings goal.",
        change: "85%",
        color: "purple",
      },
      {
        icon: Zap,
        title: "Top Category",
        description: `${
          categorySpending[0]?.name || "N/A"
        } is your largest expense.`,
        change: "",
        color: "red",
      },
    ],
    [categorySpending, timeRange]
  );

  if (isError) {
    return (
      <div className="text-center p-8 text-red-400">
        Error loading analytics data. Please try again.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="w-full space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
        <Header timeRange={timeRange} setTimeRange={setTimeRange} />
        <StatCard stats={stats} isLoading={isLoading} />
        <Chart
          categorySpending={categorySpending}
          spendingTrend={spendingTrend}
          weeklyComparison={weeklyComparison}
          isLoading={isLoading}
        />
        <KeyInsight
          insights={insights}
          topTransactions={topTransactions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

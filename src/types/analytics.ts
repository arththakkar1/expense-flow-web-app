import type { LucideIcon } from "lucide-react";

// The shape of the JSON object returned by the Supabase RPC function
export interface AnalyticsData {
  stats: {
    totalSpent: number;
    avgDaily: number;
    transactionCount: number;
    savingsRate: number;
  };
  categorySpending: CategorySpending[];
  topTransactions: TopTransaction[];
  spendingTrend: SpendingTrend[];
}

// Type for the main statistics cards
export interface Stat {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: string;
}

// Spending trend over months (for the line/bar chart)
export interface SpendingTrend {
  date: string;
  spending: number;
  income: number;
  budget?: number; // Optional as it might not always be present
}

// Spending by category (for the pie chart)
export interface CategorySpending {
  name: string;
  value: number;
  color: string;
  percentage?: number; // Optional as it might be calculated on the fly
  // Index signature updated to be more specific than 'any' for Recharts compatibility
  [key: string]: string | number | undefined;
}

// Individual top transactions list
export interface TopTransaction {
  name: string;
  amount: number;
  category: string;
  date: string;
}

// Insight cards with icons and color indicators
export interface Insight {
  icon: LucideIcon;
  title: string;
  description: string;
  change: string;
  color: string;
}

// Data for the weekly comparison chart
export interface WeeklyComparison {
  day: string;
  thisWeek: number;
  lastWeek: number;
}

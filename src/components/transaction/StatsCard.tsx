import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ElementType;
};

interface StatsCardProps {
  stats: StatCard[];
  isLoading: boolean;
}

function StatCardSkeleton() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
      <div className="flex items-end justify-between">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

function StatsCard({ stats, isLoading }: StatsCardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        let valueColorClass = "text-white";
        if (stat.label === "Total Income") {
          valueColorClass = "text-green-400";
        } else if (
          stat.label === "Total Expenses" ||
          stat.label === "Total Spent"
        ) {
          valueColorClass = "text-red-400";
        } else if (stat.label === "Net Balance") {
          valueColorClass = stat.value.includes("-")
            ? "text-red-400"
            : "text-green-400";
        }

        const trendColorClass =
          stat.trend === "up"
            ? "bg-green-500/10 text-green-400"
            : stat.trend === "down"
            ? "bg-red-500/10 text-red-400"
            : "bg-zinc-500/10 text-zinc-400";

        return (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-700 transition-all hover:shadow-lg hover:shadow-blue-500/5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm text-zinc-400">
                {stat.label}
              </span>
              <div className="p-2 bg-zinc-800 rounded-lg">
                <Icon className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <h3
                className={`text-xl sm:text-2xl font-bold ${valueColorClass}`}
              >
                {stat.value}
              </h3>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${trendColorClass}`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCard;

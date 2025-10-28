"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Stat } from "../../types/analytics"; // Corrected import path

type StatCardProps = {
  stats: Stat[];
  isLoading?: boolean;
};

// Color mapping to solve dynamic Tailwind class issue
const colorClasses: { [key: string]: { bg: string; text: string } } = {
  red: { bg: "bg-red-500/10", text: "text-red-400" },
  green: { bg: "bg-green-500/10", text: "text-green-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
};

// Skeleton loader for when data is loading
const StatCardSkeleton = () => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="w-8 h-8 rounded-lg bg-zinc-800"></div>
      <div className="w-12 h-4 rounded bg-zinc-800"></div>
    </div>
    <div className="w-24 h-8 mb-1 rounded bg-zinc-800"></div>
    <div className="w-32 h-4 rounded bg-zinc-800"></div>
  </div>
);

export default function StatCard({ stats, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

        // Determine color based on label (Expense = red, Income = green)
        let statColor = colorClasses[stat.color] || colorClasses.blue;
        let trendColor =
          stat.trend === "up" ? "text-green-400" : "text-red-400";

        const labelLower = stat.label.toLowerCase();

        if (labelLower.includes("expense") || labelLower.includes("spent")) {
          statColor = colorClasses.red;
          // For expenses, down trend is good (green), up trend is bad (red)
          trendColor = stat.trend === "up" ? "text-red-400" : "text-green-400";
        } else if (
          labelLower.includes("income") ||
          labelLower.includes("earned")
        ) {
          statColor = colorClasses.green;
          // For income, up trend is good (green), down trend is bad (red)
          trendColor = stat.trend === "up" ? "text-green-400" : "text-red-400";
        }

        return (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 ${statColor.bg} rounded-lg`}>
                <Icon className={`w-5 h-5 ${statColor.text}`} />
              </div>
              {stat.trend !== "neutral" && stat.change && (
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}
                >
                  <TrendIcon className="w-3 h-3" />
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-zinc-400">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

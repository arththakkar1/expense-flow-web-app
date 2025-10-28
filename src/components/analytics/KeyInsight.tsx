"use client";

import React from "react";
import { Insight, TopTransaction } from "../../types/analytics";
import { ListX, Wallet } from "lucide-react";

type KeyInsightProps = {
  insights: Insight[];
  topTransactions: TopTransaction[];
  isLoading?: boolean;
};

// Color mapping
const colorClasses: { [key: string]: { bg: string; text: string } } = {
  red: { bg: "bg-red-500/10", text: "text-red-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
  green: { bg: "bg-green-500/10", text: "text-green-400" },
};

// Skeleton component
const KeyInsightSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
    <div className="lg:col-span-2 space-y-4">
      <div className="h-7 w-48 bg-zinc-800 rounded"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
          >
            <div className="w-10 h-10 bg-zinc-800 rounded-lg mb-3"></div>
            <div className="h-5 w-3/4 bg-zinc-800 rounded mb-2"></div>
            <div className="h-4 w-full bg-zinc-800 rounded mb-2"></div>
            <div className="h-7 w-1/2 bg-zinc-800 rounded"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="h-7 w-48 bg-zinc-800 rounded mb-4"></div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3">
            <div className="flex-1">
              <div className="h-4 w-24 bg-zinc-800 rounded mb-2"></div>
              <div className="h-3 w-16 bg-zinc-800 rounded"></div>
            </div>
            <div className="text-right ml-4">
              <div className="h-4 w-16 bg-zinc-800 rounded mb-2"></div>
              <div className="h-3 w-12 bg-zinc-800 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const NoDataPlaceholder = ({
  message,
  icon: Icon,
}: {
  message: string;
  icon: React.ElementType;
}) => (
  <div className="flex flex-col items-center justify-center text-zinc-500 py-8">
    <Icon className="w-10 h-10 mb-2" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default function KeyInsight({
  insights,
  topTransactions,
  isLoading,
}: KeyInsightProps) {
  if (isLoading) {
    return <KeyInsightSkeleton />;
  }

  const noInsights = insights.length === 0;
  const noTopTransactions = topTransactions.length === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Insights */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-semibold">Key Insights</h2>
        {noInsights ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <NoDataPlaceholder
              message="No insights available yet."
              icon={ListX}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              const insightColor =
                colorClasses[insight.color] || colorClasses.blue;
              return (
                <div
                  key={index}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all"
                >
                  <div
                    className={`w-10 h-10 ${insightColor.bg} rounded-lg flex items-center justify-center mb-3`}
                  >
                    <Icon className={`w-5 h-5 ${insightColor.text}`} />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">
                    {insight.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-3 line-clamp-2">
                    {insight.description}
                  </p>
                  <span className={`text-lg font-bold ${insightColor.text}`}>
                    {insight.change}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Transactions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Top Transactions</h2>
        {noTopTransactions ? (
          <NoDataPlaceholder message="No transactions found." icon={Wallet} />
        ) : (
          <div className="space-y-3">
            {topTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-3 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-all"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {transaction.name}
                  </p>
                  <p className="text-xs text-zinc-500">{transaction.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-sm whitespace-nowrap">
                    ₹{transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-zinc-500 truncate max-w-[100px]">
                    {transaction.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

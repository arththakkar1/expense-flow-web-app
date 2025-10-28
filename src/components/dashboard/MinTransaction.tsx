import {
  CategorySpending,
  Transaction,
} from "@/app/(dashboard)/dashboard/page";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import React from "react";

export type Stats = {
  monthlyIncome: number;
  monthlyExpenses: number;
};

type MinTransactionProps = {
  transactions: Transaction[];

  formatCurrency: (amount: number) => string;
  categorySpending: CategorySpending[];
  stats: Stats;
};

function MinTransaction({
  transactions,

  formatCurrency,
  categorySpending,
  stats,
}: MinTransactionProps) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Recent Transactions */}
      <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Transactions</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <p className="mb-2">No transactions yet</p>
            <p className="text-sm">Start by adding your first transaction</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-700 rounded-xl flex items-center justify-center text-2xl">
                    {transaction.category?.icon || "💰"}
                  </div>
                  <div>
                    <div className="font-semibold">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {transaction.category?.name || "Uncategorized"} •{" "}
                      {new Date(transaction.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-lg font-bold ${
                    transaction.type === "income"
                      ? "bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent"
                      : "text-red-500 bg-clip-text"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href={"/transactions"}>
          <button className="w-full cursor-pointer mt-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg font-semibold hover:bg-zinc-700 transition-colors">
            View All Transactions
          </button>
        </Link>
      </div>

      {/* Top Categories */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Top Categories</h2>

        {categorySpending.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <p className="text-sm">No spending data available</p>
          </div>
        ) : (
          <div className="space-y-5">
            {categorySpending.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {category.category_name}
                  </span>
                  <span className="text-sm text-zinc-400">
                    {formatCurrency(category.total_amount)}
                  </span>
                </div>
                <div className="relative w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {category.percentage}% of total
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-400 mb-1">
                Smart Insight
              </div>
              <div className="text-sm text-zinc-300">
                {stats.monthlyIncome > stats.monthlyExpenses
                  ? `Great job! You saved ${formatCurrency(
                      stats.monthlyIncome - stats.monthlyExpenses
                    )} this month.`
                  : "Track your expenses to improve your savings."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinTransaction;

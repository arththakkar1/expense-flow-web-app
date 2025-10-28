import { Budget } from "@/app/(dashboard)/budgets/page";
import { AlertCircle, CheckCircle, PieChart, TrendingUp } from "lucide-react";
import React from "react";

function StatsCard({ budgets }: { budgets: Budget[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <span className="text-xs font-medium text-green-400">On Track</span>
        </div>
        <p className="text-2xl font-bold">
          {budgets.filter((b) => (b.spent / b.amount) * 100 < 80).length}
        </p>
        <p className="text-xs text-zinc-400 mt-1">Budgets</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <span className="text-xs font-medium text-yellow-400">Warning</span>
        </div>
        <p className="text-2xl font-bold">
          {
            budgets.filter(
              (b) =>
                (b.spent / b.amount) * 100 >= 80 &&
                (b.spent / b.amount) * 100 < 100
            ).length
          }
        </p>
        <p className="text-xs text-zinc-400 mt-1">Budgets</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-red-400" />
          </div>
          <span className="text-xs font-medium text-red-400">Exceeded</span>
        </div>
        <p className="text-2xl font-bold">
          {budgets.filter((b) => (b.spent / b.amount) * 100 >= 100).length}
        </p>
        <p className="text-xs text-zinc-400 mt-1">Budgets</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <PieChart className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-xs font-medium text-blue-400">Total</span>
        </div>
        <p className="text-2xl font-bold">{budgets.length}</p>
        <p className="text-xs text-zinc-400 mt-1">Budgets</p>
      </div>
    </div>
  );
}

export default StatsCard;

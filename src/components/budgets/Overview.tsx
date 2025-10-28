import { ChevronDown } from "lucide-react";
import React from "react";

type OverviewProps = {
  selectedPeriod: "weekly" | "monthly" | "yearly";
  setSelectedPeriod: React.Dispatch<
    React.SetStateAction<"weekly" | "monthly" | "yearly">
  >;
  totalBudget: number;
  overallPercentage: number; // e.g., 75 for 75%
  totalSpent: number;
  totalRemaining: number;
};

function Overview({
  selectedPeriod,
  setSelectedPeriod,
  totalBudget,
  overallPercentage,
  totalSpent,
  totalRemaining,
}: OverviewProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-900/20 border border-zinc-800 rounded-xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg sm:text-xl font-semibold">Monthly Overview</h2>
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) =>
              setSelectedPeriod(
                e.target.value as "weekly" | "monthly" | "yearly"
              )
            }
            className="pl-3 pr-8 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div>
          <p className="text-xs sm:text-sm text-zinc-400 mb-1">Total Budget</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">
            ₹{totalBudget.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-zinc-400 mb-1">Total Spent</p>
          <p className="text-2xl sm:text-3xl font-bold text-red-400">
            ₹{totalSpent.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-zinc-400 mb-1">Remaining</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-400">
            ₹{totalRemaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-400">Overall Progress</span>
          <span className="font-semibold">{overallPercentage.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              overallPercentage >= 100
                ? "bg-red-500"
                : overallPercentage >= 80
                ? "bg-yellow-500"
                : "bg-green-500"
            }`}
            style={{ width: `${Math.min(overallPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default Overview;

"use client";

import React, { useState, useEffect } from "react";
import {
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import {
  CategorySpending,
  SpendingTrend,
  WeeklyComparison,
} from "@/types/analytics";

type ChartProps = {
  categorySpending: CategorySpending[];
  spendingTrend: SpendingTrend[];
  weeklyComparison?: WeeklyComparison[];
  isLoading?: boolean;
};

const ChartSkeleton = () => (
  <div className="space-y-4">
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[372px] animate-pulse">
      <div className="h-7 w-40 bg-zinc-800 rounded mb-6"></div>
      <div className="h-[250px] w-full bg-zinc-800 rounded-md"></div>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[300px] animate-pulse"></div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 h-[300px] animate-pulse"></div>
    </div>
  </div>
);

const NoDataPlaceholder = ({
  message,
  height,
}: {
  message: string;
  height: number;
}) => (
  <div
    className="flex flex-col items-center justify-center text-zinc-500"
    style={{ height: `${height}px` }}
  >
    <PieChartIcon className="w-10 h-10 mb-2" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

function Chart({
  categorySpending,
  spendingTrend,
  weeklyComparison = [],
  isLoading,
}: ChartProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isLoading || !isClient) {
    return <ChartSkeleton />;
  }

  // Check if all relevant values are zero
  const isSpendingTrendEmpty = spendingTrend.every(
    (d) => d.spending === 0 && d.income === 0
  );
  const isCategorySpendingEmpty = categorySpending.every((c) => c.value === 0);
  const isWeeklyComparisonEmpty = weeklyComparison.every(
    (w) => w.thisWeek === 0 && w.lastWeek === 0
  );

  return (
    <div className="space-y-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Spending Trend</h2>
        </div>
        {isSpendingTrendEmpty ? (
          <NoDataPlaceholder
            message="No spending trend data to display."
            height={300}
          />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={spendingTrend}>
                <defs>
                  <linearGradient
                    id="colorSpending"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#e5e7eb" }}
                  labelStyle={{ color: "#a1a1aa" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="spending"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorSpending)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="budget"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Category Breakdown</h2>
          {isCategorySpendingEmpty ? (
            <NoDataPlaceholder
              message="No category spending data."
              height={200}
            />
          ) : (
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="w-full lg:w-1/2 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={categorySpending}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categorySpending.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        border: "1px solid #27272a",
                        borderRadius: "8px",
                      }}
                      itemStyle={{ color: "#e5e7eb" }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 space-y-3">
                {categorySpending.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-zinc-300">
                        {category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">
                        ₹{category.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Weekly Comparison</h2>
          {isWeeklyComparisonEmpty ? (
            <NoDataPlaceholder
              message="No weekly comparison data."
              height={240}
            />
          ) : (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#e5e7eb" }}
                    labelStyle={{ color: "#a1a1aa" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="thisWeek"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="lastWeek"
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chart;

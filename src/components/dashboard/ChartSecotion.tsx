"use client";

import React from "react";
import {
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
}

interface PieChartItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface ChartSectionProps {
  monthlyTrendData: MonthlyTrend[];
  pieChartData: PieChartItem[];
  formatCurrency: (amount: number) => string;
  CustomTooltip: React.FC<{
    active?: boolean;
    payload?: {
      name: string;
      color: string;
      value: number;
      payload: { month: string };
    }[];
  }>;
  isLoading?: boolean;
}

export const Spinner = () => (
  <div className="flex items-center justify-center h-[300px]">
    <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

const NoDataPlaceholder = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500">
    <PieChartIcon className="w-10 h-10 mb-2" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

const ChartSecotion: React.FC<ChartSectionProps> = ({
  monthlyTrendData,
  pieChartData,
  formatCurrency,
  CustomTooltip,
  isLoading = false,
}) => {
  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Income vs Expenses</h2>
        {isLoading ? (
          <Spinner />
        ) : monthlyTrendData.length === 0 ? (
          <NoDataPlaceholder message="No trend data for this period." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#71717a" />
              <YAxis stroke="#71717a" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: "#22c55e", r: 4 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", r: 4 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Spending by Category</h2>
        {isLoading ? (
          <Spinner />
        ) : pieChartData.length === 0 ? (
          <NoDataPlaceholder message="No spending data for this period." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RePieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) =>
                  `${(Number(percent) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                        <p className="text-sm font-semibold">
                          {payload[0].name}
                        </p>
                        <p className="text-sm text-zinc-400">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-white">{value}</span>
                )}
              />
            </RePieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ChartSecotion;

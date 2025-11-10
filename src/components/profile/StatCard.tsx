import React from "react";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

// Color map is now co-located with the component that uses it
const colorMap: { [key: string]: { bg: string; text: string } } = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
  green: { bg: "bg-green-500/10", text: "text-green-400" },
  yellow: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
};

export default function StatCard({
  label,
  value,
  icon: Icon, // Rename prop for use as component
  color,
}: StatCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-700 transition-all duration-300 transform hover:-translate-y-1">
      <div
        className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}
      >
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
      </div>
      <p className="text-2xl sm:text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs sm:text-sm text-zinc-400">{label}</p>
    </div>
  );
}

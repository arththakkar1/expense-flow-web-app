import React from "react";
import { StatCardData } from "@/types/profile";
import StatCard from "@/components/profile/StatCard"; // Import the new StatCard component

interface StatCardGridProps {
  stats: StatCardData[];
}

export default function StatCardGrid({ stats }: StatCardGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}

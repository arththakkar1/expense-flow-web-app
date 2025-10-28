import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React from "react";
import { Spinner } from "./ChartSecotion";
// Import your Spinner component
// Assuming Spinner is a component you've created or imported from a library
// Replace './Spinner' with the actual path to your Spinner component

// ...existing code...
type StatsCard = {
  icon: React.ElementType;
  gradient: string;
  border: string;
  labelColor: string;
  label: string;
  iconColor: string;
  value: string | number;
  changeType: "up" | "down" | "neutral";
  change: string | number;
};

interface StatsCardsProps {
  statsCards: StatsCard[];
  // Add a loading prop
  loading: boolean;
}

function StatsCards({ statsCards, loading }: StatsCardsProps) {
  // 1. Conditional Rendering for Loading State
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner /> {/* Assuming your Spinner takes a size prop */}
      </div>
    );
  }

  // 2. Render Cards when not loading
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((card, index) => {
        const Icon = card.icon;

        // **BUG FIX**: The ArrowDownRight logic had the wrong class:
        // Before: {card.changeType === "down" && (<ArrowDownRight className="w-4 h-4 text-green-400" />)}
        // I'll change it to red, which is conventional for "down" changes.

        const changeTextColor =
          card.changeType === "up"
            ? "text-green-400"
            : card.changeType === "down"
            ? "text-red-400"
            : "text-zinc-400";

        const arrowColor =
          card.changeType === "up" ? "text-green-400" : "text-red-400";

        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.gradient} border ${card.border} rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm ${card.labelColor}`}>{card.label}</span>
              <Icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
            <div className="text-3xl font-bold mb-2">{card.value}</div>
            <div className="flex items-center gap-1 text-sm">
              {card.changeType === "up" && (
                <ArrowUpRight className={`w-4 h-4 ${arrowColor}`} />
              )}
              {card.changeType === "down" && (
                // Changed color to red for 'down' to fix the conventional color bug
                <ArrowDownRight className={`w-4 h-4 ${arrowColor}`} />
              )}
              <span className={changeTextColor}>{card.change}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;

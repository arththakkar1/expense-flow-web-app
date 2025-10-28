import { Calendar, ChevronDown, Filter, Search } from "lucide-react";
import React from "react";

export type FilterState = {
  searchQuery: string;
  selectedFilter: "all" | "income" | "expense";
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSelectedFilter: React.Dispatch<
    React.SetStateAction<"all" | "income" | "expense">
  >;
  // UPDATED: Added "all" to the dateRange type
  dateRange: "all" | "week" | "month" | "year";
  setDateRange: React.Dispatch<
    React.SetStateAction<"all" | "week" | "month" | "year">
  >;
};

function Filters({
  searchQuery,
  selectedFilter,
  setSearchQuery,
  setSelectedFilter,
  dateRange,
  setDateRange,
}: FilterState) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 sm:p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Search */}
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
          <select
            value={selectedFilter}
            onChange={(e) =>
              setSelectedFilter(e.target.value as "all" | "income" | "expense")
            }
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm sm:text-base text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="income">Income</option>
            <option value="expense">Expenses</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 pointer-events-none" />
        </div>

        {/* Date Range */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
          <select
            value={dateRange}
            onChange={(e) =>
              // UPDATED: Cast target value to include "all"
              setDateRange(e.target.value as "all" | "week" | "month" | "year")
            }
            className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-2 sm:py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm sm:text-base text-white appearance-none focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
          >
            {/* UPDATED: Added All Time option */}
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-500 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

export default Filters;

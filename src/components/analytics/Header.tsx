import React from "react";

function Header({
  timeRange,
  setTimeRange,
}: {
  timeRange: "week" | "month" | "quarter" | "year";
  setTimeRange: React.Dispatch<
    React.SetStateAction<"week" | "month" | "quarter" | "year">
  >;
}) {
  return (
    <>
      <div className="flex justify-between items-center h-14">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-zinc-400 mt-1 text-sm sm:text-base">
              Deep insights into your spending patterns
            </p>
          </div>
        </div>
        {/* Time Range Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["week", "month", "quarter", "year"].map((range) => (
            <button
              key={range}
              onClick={() =>
                setTimeRange(range as "week" | "month" | "quarter" | "year")
              }
              className={`px-4 cursor-pointer py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                timeRange === range
                  ? "bg-blue-600 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default Header;

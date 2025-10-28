import { Plus } from "lucide-react";
import React from "react";

function Header({
  setShowAddModal,
}: {
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Budgets
        </h1>
        <p className="text-zinc-400 mt-1 text-sm sm:text-base">
          Monitor and control your spending
        </p>
      </div>
      <button
        onClick={() => setShowAddModal(true)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium">Create Budget</span>
      </button>
    </div>
  );
}

export default Header;

"use client";

import { Trash2 } from "lucide-react";
import React from "react";

interface DangerZoneProps {
  // Prop is changed to be more specific
  onOpenConfirm: () => void;
}

export default function DangerZone({ onOpenConfirm }: DangerZoneProps) {
  return (
    <div className="bg-zinc-900 border flex flex-col md:flex-row justify-between items-center w-full h-auto border-red-600/30 rounded-xl p-6 sm:p-8">
      <div>
        <h3 className="text-xl font-bold text-red-400 mb-2">Danger Zone</h3>
        <p className="text-zinc-400 mb-4 text-sm sm:text-base">
          This action will permanently delete all your transaction records. This
          cannot be undone.
        </p>
      </div>

      <button
        onClick={onOpenConfirm} // Updated onClick
        // disabled state is removed from here
        className="flex cursor-pointer w-full md:w-[350px] h-10 items-center justify-center gap-2 px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 rounded-lg transition-all text-sm sm:text-base"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete All Transactions</span>
      </button>
    </div>
  );
}

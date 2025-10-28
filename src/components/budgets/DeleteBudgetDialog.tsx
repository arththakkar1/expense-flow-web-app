"use client";

import { AlertTriangle } from "lucide-react";
import React from "react";

interface DeleteBudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  budgetName: string;
  isLoading: boolean;
}

export default function DeleteBudgetDialog({
  isOpen,
  onClose,
  onConfirm,
  budgetName,
  isLoading,
}: DeleteBudgetDialogProps) {
  if (!isOpen) return null;

  return (
    // Modal Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-sm p-6 shadow-lg animate-in fade-in-0 zoom-in-95"
      >
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-12 h-12 flex items-center justify-center bg-red-500/10 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>

          {/* Text */}
          <h2 className="text-xl font-semibold text-white mb-2">
            Delete Budget
          </h2>
          <p className="text-zinc-400 mb-6">
            Are you sure you want to delete the budget for{" "}
            <strong className="text-white">{budgetName}</strong>? This action
            cannot be undone.
          </p>

          {/* Buttons */}
          <div className="flex justify-center gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

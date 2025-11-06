"use client";

import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Budget } from "@/app/(dashboard)/budgets/page"; // Import your Budget type

// --- Props Interface ---
interface EditBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget | null;
}

// --- Component ---
export default function EditBudgetModal({
  isOpen,
  onClose,
  budget,
}: EditBudgetModalProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Form state
  const [amount, setAmount] = useState(0);
  const [period, setPeriod] = useState<Budget["period"]>("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form when 'budget' prop changes
  useEffect(() => {
    if (budget) {
      setAmount(budget.amount);
      setPeriod(budget.period);
      setError(null);
    }
  }, [budget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget) return;

    setIsLoading(true);
    setError(null);

    const { error } = await supabase
      .from("budgets")
      .update({
        amount: Number(amount),
        period: period,
      })
      .eq("id", budget.id);

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Success! Invalidate cache and close modal.
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing on content click
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-lg animate-in fade-in-0 zoom-in-95"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Edit Budget:{" "}
          <span className="text-blue-400">{budget?.categoryName}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Field */}
          <div>
            <label
              htmlFor="edit-amount"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Amount (₹)
            </label>
            <input
              type="number"
              id="edit-amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full [appearance:textfield] focus:outline-none  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 focus:ring-blue-500 focus:ring-2 focus:border-blue-500"
              placeholder="e.g., 5000"
              required
              min="0"
            />
          </div>

          {/* Period Field */}
          <div>
            <label
              htmlFor="edit-period"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Period
            </label>
            <select
              id="edit-period"
              value={period}
              onChange={(e) => setPeriod(e.target.value as Budget["period"])}
              className="w-full bg-zinc-800 border focus:ring-2 focus:outline-none border-zinc-700 text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <p className="text-xs text-zinc-400">
            Category and start date are not editable.
          </p>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

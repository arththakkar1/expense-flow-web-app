"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Skeleton } from "@/components/ui/skeleton";

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

// Type for categories fetched from DB
interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
}

// Fetcher function for categories
const fetchExpenseCategories = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon")
    .eq("type", "expense")
    .eq("type", "expense")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw new Error(error.message);
  }
  return data;
};

export default function AddBudgetModal({
  isOpen,
  onClose,
  user,
}: AddBudgetModalProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">(
    "monthly"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories when the modal is open
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery<BudgetCategory[]>({
    queryKey: ["expense_categories", user?.id],
    queryFn: () => fetchExpenseCategories(),
    enabled: !!user && isOpen, // Only fetch when modal is open and user exists
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory("");
      setAmount("");
      setPeriod("monthly");
      setError(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedCategory || !amount) {
      setError("Please fill all fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("budgets").insert({
      user_id: user.id,
      category_id: selectedCategory,
      amount: Number(amount),
      period: period,
      start_date: new Date().toISOString(), // Sets start date to now
    });

    setIsSubmitting(false);

    if (insertError) {
      if (insertError.code === "23505") {
        // Unique constraint violation
        setError("A budget for this category already exists.");
      } else {
        setError(insertError.message);
      }
    } else {
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-md p-6 shadow-lg animate-in fade-in-0 zoom-in-95"
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Create New Budget
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selector */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Category
            </label>
            {isLoadingCategories ? (
              <Skeleton className="h-10 w-full rounded-lg" />
            ) : (
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-zinc-800 border focus:ring-2 focus:outline-none transition border-zinc-700 text-white rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>
                  {categoriesError
                    ? "Error loading categories"
                    : "Select a category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full [appearance:textfield] focus:ring-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-zinc-800 border border-zinc-700 text-white rounded-lg p-2.5 focus:outline-none transition focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 5000"
              required
              min="0"
            />
          </div>

          {/* Period */}
          <div>
            <label
              htmlFor="period"
              className="block text-sm font-medium text-zinc-300 mb-1"
            >
              Period
            </label>
            <select
              id="period"
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as "weekly" | "monthly" | "yearly")
              }
              className="w-full bg-zinc-800 border focus:ring-2 border-zinc-700 text-white rounded-lg p-2.5  focus:outline-none transition focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingCategories}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Budget"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

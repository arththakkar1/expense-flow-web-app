"use client";

import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
// --- 1. Import useQuery and createClient ---
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addTransaction, NewTransactionData } from "@/lib/supabase/queries";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

// --- 2. Define Profile type ---
interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
}

type Category = {
  id: string;
  name: string;
  type: string;
  icon: string;
  color: string;
};

// --- (PREDEFINED_CATEGORIES, variants, etc. are unchanged) ---
const PREDEFINED_CATEGORIES: Category[] = [
  {
    id: "5d3b340a-16c6-4b3a-80c3-6cdd550d13ab",
    name: "Food & Groceries",
    icon: "🍔",
    color: "#f97316",
    type: "expense",
  },
  {
    id: "6e14b707-21a0-45ca-af5b-9321af13e6d6",
    name: "Entertainment",
    icon: "🎬",
    color: "#ec4899",
    type: "expense",
  },
  {
    id: "9487f269-7984-4460-8297-ae2a5410f4f9",
    name: "Salary",
    icon: "💼",
    color: "#10b981",
    type: "income",
  },
  {
    id: "a64ba9e1-6f81-4c77-b77f-f6c80699f744",
    name: "Freelance",
    icon: "💻",
    color: "#34d399",
    type: "income",
  },
  {
    id: "b0bc88c3-9ac1-4180-add8-8fa25cc3a1fa",
    name: "Shopping",
    icon: "🛍️",
    color: "#8b5cf6",
    type: "expense",
  },
  {
    id: "bf9402e7-f762-4973-b107-87dca8721730",
    name: "Transport",
    icon: "🚌",
    color: "#0ea5e9",
    type: "expense",
  },
  {
    id: "fa8b5739-05c1-48be-b9ec-636863c22d66",
    name: "Utilities",
    icon: "💡",
    color: "#eab308",
    type: "expense",
  },
];

const overlayVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const dialogVariants = {
  visible: { scale: 1, opacity: 1, y: 0 },
  hidden: { scale: 0.95, opacity: 0, y: 20 },
};

// --- (AddTransactionDialog component is unchanged) ---
const AddTransactionDialog = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<"expense" | "income">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !date) {
      console.error("Submit failed: Missing user or date");
      return;
    }

    setIsSubmitting(true);

    const transactionData: NewTransactionData = {
      description,
      amount: parseFloat(amount),
      date: format(date, "yyyy-MM-dd"),
      account_id: "default-account-id", // Replace with actual account ID logic
      type,
      user_id: user.id,
      category_id: categoryId || null,
    };

    console.log("Submitting transaction:", transactionData);

    try {
      await addTransaction(transactionData);

      await queryClient.invalidateQueries({ queryKey: ["dashboardData"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["budgets"] });
      await queryClient.invalidateQueries({
        queryKey: ["analyticsTransactions"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["transactionStats"],
      });

      // Reset form
      setDescription("");
      setAmount("");
      setDate(new Date());
      setCategoryId("");

      onClose();
    } catch (error) {
      console.error("Failed to add transaction", error);
      alert("Failed to add transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = PREDEFINED_CATEGORIES.filter(
    (c) => c.type === type
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            variants={dialogVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl shadow-blue-500/10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-white">
              Add New Transaction
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Groceries"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "expense" | "income")
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Category (Optional)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full cursor-pointer justify-start text-left font-normal bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-zinc-900 border-zinc-800 text-zinc-50"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Adding..." : "Add Transaction"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface DashboardHeaderProps {
  user: User | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: profile, isLoading: isLoadingProfile } =
    useQuery<Profile | null>({
      queryKey: ["profile", user?.id],
      queryFn: async () => {
        if (!user) return null; // Don't fetch if no user
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return null;
        }
        return data;
      },
      enabled: !!user, // Only run query when user object exists
    });

  // Determine the name to display
  const displayName =
    profile?.full_name ?? user?.user_metadata?.full_name ?? "User";

  return (
    <>
      <div>
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              {/* --- 4. Use Skeleton for loading state --- */}
              {isLoadingProfile ? (
                <Skeleton className="h-10 w-64 mb-2" />
              ) : (
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Welcome Back, {displayName}! {/* 5. Use displayName */}
                </h1>
              )}
              <p className="text-zinc-400 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex  items-center gap-3">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 px-6 py-2 cursor-pointer rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Transaction
              </button>
            </div>
          </div>
        </div>
      </div>
      <AddTransactionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        user={user}
      />
    </>
  );
}

"use client";

import { Calendar as CalendarIcon, Loader2, X } from "lucide-react";
import React, { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { UpdateTransactionData } from "@/lib/supabase/queries";
type TransactionType = "expense" | "income";

type Category = {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
};

// Define the shape of a transaction being passed for editing
interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category_id: string | null;
  transaction_date: string; // ISO date string from DB
}

// Define the shape for the mutation payload
interface MutationPayload {
  transactionId: string;
  transactionData: UpdateTransactionData;
}

interface EditTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  // This prop handles the actual DB update and query invalidation in the parent
  onUpdate: (payload: MutationPayload) => Promise<void>;
}

// --- Constants (No change here) ---

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

const NULL_CATEGORY_VALUE = "NULL_CATEGORY";

// Animation variants (No change here)
const overlayVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};
const dialogVariants = {
  visible: { scale: 1, opacity: 1, y: 0 },
  hidden: { scale: 0.95, opacity: 0, y: 20 },
};

// --- EditTransactionDialog Component ---

export default function EditTransactionDialog({
  isOpen,
  onClose,
  transaction,
  onUpdate,
}: EditTransactionDialogProps) {
  // State for form fields
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [type, setType] = useState<TransactionType>("expense");
  const [categoryId, setCategoryId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (transaction && isOpen) {
      setDescription(transaction.description || "");
      setAmount(transaction.amount);
      setType(transaction.type);

      const dateString = transaction.transaction_date;
      if (dateString) {
        try {
          setDate(parseISO(dateString));
        } catch (e) {
          console.error("Error parsing transaction date:", dateString, e);
          setDate(new Date());
        }
      } else {
        setDate(new Date());
      }

      // 1. UPDATED: Use NULL_CATEGORY_VALUE if category_id is null/undefined
      setCategoryId(transaction.category_id || NULL_CATEGORY_VALUE);
      setErrors({});
    } else if (!isOpen) {
      setErrors({});
    }
  }, [transaction, isOpen]);

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

  const validateForm = () => {
    const newErrors: Record<string, string | null> = {};
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;

    if (typeof numAmount !== "number" || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Amount must be a positive number.";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!date) {
      newErrors.date = "A date is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Submission Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction) return;

    if (!validateForm()) {
      console.warn("Validation failed.");
      return;
    }

    setIsSubmitting(true);

    const finalAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    const finalCategoryId =
      categoryId === NULL_CATEGORY_VALUE ? null : categoryId;

    const transactionData: UpdateTransactionData = {
      description,
      amount: finalAmount as number,
      type,
      category_id: finalCategoryId,

      transaction_date: format(date as Date, "yyyy-MM-dd"),
    };

    try {
      await onUpdate({
        transactionId: transaction.id,
        transactionData,
      });

      // No need for query invalidation here if onUpdate handles it
      onClose();
    } catch (error) {
      console.error("Failed to update transaction", error);
      // Optionally, show a toast error here
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = PREDEFINED_CATEGORIES.filter(
    (c) => c.type === type
  );

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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            variants={dialogVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={(e) => e.stopPropagation()}
            // Styling to match AddTransactionDialog: bg-zinc-900 border-zinc-800
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl shadow-blue-500/10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-white">
              Edit Transaction
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount Field */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setErrors((prev) => ({ ...prev, amount: null }));
                  }}
                  placeholder="0.00"
                  className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />
                {errors.amount && (
                  <p className="text-xs text-red-400 mt-1">{errors.amount}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    setErrors((prev) => ({ ...prev, description: null }));
                  }}
                  placeholder="e.g., Groceries"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  required
                />
                {errors.description && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Type Field */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value as TransactionType);
                    setCategoryId(NULL_CATEGORY_VALUE); // Use NULL_CATEGORY_VALUE
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Category (Optional)
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                  {/* 2. UPDATED: Use NULL_CATEGORY_VALUE for the initial option value */}
                  <option value={NULL_CATEGORY_VALUE}>No Category</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-white"
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
                      onSelect={(newDate) => {
                        setDate(newDate);
                        setErrors((prev) => ({ ...prev, date: null }));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && (
                  <p className="text-xs text-red-400 mt-1">{errors.date}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 px-6 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

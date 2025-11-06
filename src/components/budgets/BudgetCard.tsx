import { Budget } from "@/app/(dashboard)/budgets/page";
import { Calendar, Edit, Target, Trash2 } from "lucide-react";
import React from "react";
import { LucideIcon } from "lucide-react";
import { Category } from "@/app/(dashboard)/dashboard/page";

type BudgetCardType = {
  budgets: Budget[];
  // ... (rest of your props)
  getStatusInfo: (
    spent: number,
    amount: number
  ) => {
    status: "exceeded" | "warning" | "good";
    icon: LucideIcon;
    color: string;
  };
  setShowAddModal: (value: boolean) => void;
  getColorClasses: (color: string) => {
    bg: string;
    text: string;
    border: string;
    progress: string;
  };
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
};

// Your predefined categories (same as you provided)
const PREDEFINED_CATEGORIES: Category[] = [
  // ... (your list of categories)
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

function BudgetCard({
  budgets,
  getStatusInfo,
  setShowAddModal,
  getColorClasses,
  onEdit,
  onDelete,
}: BudgetCardType) {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {budgets.map((budget, index) => {
          const percentage =
            budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
          const statusInfo = getStatusInfo(budget.spent, budget.amount);
          const StatusIcon = statusInfo.icon;
          const colorClasses = getColorClasses(budget.color);

          // --- THIS IS THE NEW LOGIC ---
          // Find the matching category from your array
          const category = PREDEFINED_CATEGORIES.find(
            (cat) => cat.id === budget.category_id
          );

          // Use the found data, or provide a fallback
          const categoryIcon = category ? category.icon : "❓";
          const categoryName = category ? category.name : "Unknown Category";
          // --- END OF NEW LOGIC ---

          return (
            <div
              key={budget.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 hover:border-zinc-700 transition-all group"
              style={{
                animation: `fadeIn 0.3s ease-out ${index * 0.05}s both`,
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 ${colorClasses.bg} rounded-xl flex items-center justify-center text-2xl`}
                  >
                    {/* Use the new categoryIcon variable */}
                    {categoryIcon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      {/* Use the new categoryName variable */}
                      {categoryName}
                    </h3>
                    <p className="text-xs text-zinc-500 capitalize">
                      {budget.period} budget
                    </p>
                  </div>
                </div>
                {/* ... (rest of the card) ... */}
                <div className="flex items-center gap-2">
                  <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                </div>
              </div>

              {/* Amount Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-zinc-400 mb-1">Spent</p>
                  <p className="text-lg font-bold text-red-400">
                    ₹{budget.spent.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400 mb-1">Budget</p>
                  <p className="text-lg font-bold text-white">
                    ₹{budget.amount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">
                    ₹{(budget.amount - budget.spent).toLocaleString()} left
                  </span>
                  <span className={`font-semibold ${colorClasses.text}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${colorClasses.progress}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(budget.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {budget.endDate
                      ? new Date(budget.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : "Ongoing"}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(budget)}
                    className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                  >
                    <Edit className="w-4 h-4 text-zinc-400 hover:text-white" />
                  </button>
                  <button
                    onClick={() => onDelete(budget)}
                    className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-zinc-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {budgets.length === 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No budgets yet</h3>
          <p className="text-zinc-400 mb-6">
            Create your first budget to start tracking your spending
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all hover:scale-105 active:scale-95"
          >
            Create Budget
          </button>
        </div>
      )}
    </div>
  );
}

export default BudgetCard;

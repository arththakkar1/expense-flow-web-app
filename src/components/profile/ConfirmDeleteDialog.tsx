"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";

// Animation variants
const overlayVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const dialogVariants = {
  visible: { scale: 1, opacity: 1, y: 0 },
  hidden: { scale: 0.95, opacity: 0, y: 20 },
};

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: ConfirmDeleteDialogProps) {
  // Handle Escape key
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
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md relative shadow-2xl shadow-red-500/10"
            variants={dialogVariants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>

              <h2 className="text-2xl font-bold mb-3 text-white text-center">
                Are you absolutely sure?
              </h2>
              <p className="text-zinc-400 mb-8 text-center text-sm sm:text-base">
                This action will permanently delete all your transaction
                records. This cannot be undone.
              </p>

              <div className="flex w-full justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isDeleting}
                  className="px-4 py-2 cursor-pointer bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="px-4 py-2 cursor-pointer bg-[#ac0000] hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete Transactions"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

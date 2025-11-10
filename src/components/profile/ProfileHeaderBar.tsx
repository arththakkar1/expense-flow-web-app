"use client"; // Needs to be a client component for the onClick handler

import React from "react";
import { LogOut } from "lucide-react";

interface ProfileHeaderBarProps {
  onSignOut: () => void;
}

export default function ProfileHeaderBar({ onSignOut }: ProfileHeaderBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-zinc-400 mt-1 text-sm sm:text-base">
          Your account information and activity summary.
        </p>
      </div>
      <button
        onClick={onSignOut}
        className="flex cursor-pointer items-center justify-center gap-2 px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 rounded-lg transition-all text-sm sm:text-base"
      >
        <LogOut className="w-4 h-4" />
        <span>Logout</span>
      </button>
    </div>
  );
}

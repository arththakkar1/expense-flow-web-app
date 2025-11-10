import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex-1 text-center sm:text-left">
            <Skeleton className="h-8 w-48 rounded mb-3" />
            <Skeleton className="h-5 w-64 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6"
          >
            <Skeleton className="w-12 h-12 rounded-lg mb-3" />
            <Skeleton className="h-8 w-20 rounded mb-2" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

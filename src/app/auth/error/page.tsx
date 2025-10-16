"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const message =
    searchParams.get("message") || "An error occurred during authentication";

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Authentication Error
        </h1>

        <p className="text-center text-gray-600 mb-6">{message}</p>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition"
          >
            Back to Login
          </Link>

          <Link
            href="/signup"
            className="block w-full bg-gray-100 text-gray-700 text-center py-2 rounded-md hover:bg-gray-200 transition"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}

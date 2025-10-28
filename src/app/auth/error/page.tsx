import { Suspense } from "react";
import ErrorDisplay from "./ErrorDisplay"; // Import your new client component

function ErrorLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center p-8">
        <p className="text-gray-600">Loading error message...</p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<ErrorLoadingFallback />}>
      <ErrorDisplay />
    </Suspense>
  );
}

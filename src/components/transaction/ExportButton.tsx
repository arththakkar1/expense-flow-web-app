// components/ExportButton.tsx

"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import { mkConfig, generateCsv, download } from "export-to-csv";

interface ExportButtonProps {
  data: Record<string, string | number | boolean>[];
  fileName?: string;
  headers?: string[];
  children?: React.ReactNode;
}

export default function ExportButton({
  data,
  fileName = "export.csv",
  headers,
  children,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = () => {
    setIsExporting(true);
    setError(null);

    try {
      if (!data || data.length === 0) {
        setError("No data available to export.");
        return;
      }

      const csvConfig = mkConfig({
        fieldSeparator: ",",
        quoteStrings: true,
        decimalSeparator: ".",
        useBom: true,
        useKeysAsHeaders: !headers || headers.length === 0,

        filename: fileName.replace(/\.csv$/, ""),
      });

      const csv = generateCsv(csvConfig)(data);

      // Trigger the download
      download(csvConfig)(csv);
    } catch (err: unknown) {
      console.error("CSV Export failed:", err);
      let errorMessage = "An unknown error occurred during export.";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      } else {
        errorMessage = JSON.stringify(err);
      }
      setError(`Failed to export data: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <button
        onClick={handleExport}
        disabled={isExporting || !data || data.length === 0}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 rounded-lg transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {children ? (
          children
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span className="font-medium">
              {isExporting ? "Exporting..." : "Export CSV"}
            </span>
          </>
        )}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </>
  );
}

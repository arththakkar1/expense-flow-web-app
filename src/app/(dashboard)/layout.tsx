// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import { Providers } from "./providers";

const outfit = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ExpenseFlow",
  description: "Modern money management made simple.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`flex min-h-screen bg-zinc-950 ${outfit.className}`}>
      <Providers>
        <Sidebar />

        <main className="min-h-screen w-full">
          <main className="flex-1 w-full">{children}</main>
        </main>
      </Providers>
    </div>
  );
}

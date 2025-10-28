// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
    <div
      className={`${outfit.className} bg-black text-white antialiased tracking-tight`}
    >
      <Navbar />
      <div className="h-5"></div>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}

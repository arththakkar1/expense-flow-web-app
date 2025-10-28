import Link from "next/link";
import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/logo.svg"
            alt="ExpenseFlow Logo"
            width={32}
            height={32}
            className="w-28 h-8"
          />

          <span className="text-xs text-zinc-400">
            Smart expense management
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="#" className="hover:text-white transition">
            Privacy
          </Link>
          <Link href="#" className="hover:text-white transition">
            Terms
          </Link>
          <Link href="#" className="hover:text-white transition">
            Contact
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-zinc-500">
          © 2025 ExpenseFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

"use client";

import { Menu, X } from "lucide-react";
// Removed import Link from "next/link";
import React, { useState } from "react";
// Fixed import path from "motion/react" to "framer-motion"
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#about", label: "About" },
  { href: "/login", label: "Login" },
];

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Unified scroll handler
  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // If the element is an anchor to a hash, prevent default navigation
    if (href.startsWith("#")) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        setMobileMenuOpen(false);
      }
    }
  };

  const DesktopNav = () => (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="hidden md:flex items-center justify-between max-w-7xl mx-auto backdrop-blur-xl bg-zinc-900/70 border border-zinc-800/50 shadow-2xl rounded-full px-6 py-4"
    >
      <Link href="/" className="flex items-center gap-2 ml-2 group">
        <motion.span whileHover={{ scale: 1.05 }} className="text-xl font-bold">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={128}
            height={128}
            className="h-[30px] w-80"
          />
        </motion.span>
      </Link>

      <div className="flex items-center gap-8">
        {navLinks.map((link, index) => (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            {/* Replaced Next.js Link with native <a> tag */}
            <Link
              href={link.href}
              onClick={(e) => handleSmoothScroll(e, link.href)}
              className="text-zinc-400 hover:text-white transition-colors duration-200 relative group"
            >
              {link.label}
              <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: navLinks.length * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Replaced Next.js Link with native <a> tag */}
          <Link
            href="/dashboard"
            className="bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            Dashboard
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );

  const MobileNav = () => (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,

        borderRadius: mobileMenuOpen ? "0.75rem 0.75rem 0 0" : "0.75rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="md:hidden max-w-7xl mx-auto backdrop-blur-xl bg-zinc-900/70 border border-zinc-800/50 shadow-2xl"
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex justify-start items-center  group">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold"
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                width={128}
                height={128}
                className="h-[20px] w-40"
              />
            </motion.span>
          </Link>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-white p-2 hover:bg-zinc-800/50 rounded-full transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Link
                      href={link.href}
                      onClick={(e) => handleSmoothScroll(e, link.href)}
                      className="block text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1, duration: 0.3 }}
                >
                  {/* Replaced Next.js Link with native <a> tag */}
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <DesktopNav />
      <MobileNav />
    </motion.div>
  );
}

export default Navbar;

"use client";

import { TrendingUp, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const dashboardCards = [
  {
    gradient: "from-blue-500/20 to-blue-600/20",
    border: "border-blue-500/30",
    label: "Total Expenses",
    labelColor: "text-blue-400",
    value: "₹1,03,500",
    change: "↓ 12% from last month",
    changeColor: "text-green-400",
  },
  {
    gradient: "from-purple-500/20 to-purple-600/20",
    border: "border-purple-500/30",
    label: "Monthly Budget",
    labelColor: "text-purple-400",
    value: "₹1,25,000",
    change: "83% utilized",
    changeColor: "text-zinc-400",
  },
  {
    gradient: "from-green-500/20 to-green-600/20",
    border: "border-green-500/30",
    label: "Savings Goal",
    labelColor: "text-green-400",
    value: "₹21,500",
    change: "↑ On track",
    changeColor: "text-green-400",
  },
];

function HeroSection() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute("href");

    if (href && href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div>
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-8"
            >
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">
                Now with AI-powered insights
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent"
            >
              Manage Your Money,
              <br />
              Effortlessly
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
            >
              Track expenses, analyze spending patterns, and achieve your
              financial goals with our intelligent expense management platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col gap-y-7 sm:flex-row gap-4 items-center justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/signup"
                  className="bg-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <TrendingUp className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#features"
                  onClick={handleSmoothScroll}
                  className="bg-zinc-800 border border-zinc-700 px-8 py-4 rounded-lg font-semibold hover:bg-zinc-700 transition"
                >
                  See How It Works
                </Link>
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-sm text-zinc-500 mt-6"
            >
              100% Free Forever • No Credit Card Required
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid md:grid-cols-3 gap-6"
              >
                {dashboardCards.map((card, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{
                      y: -10,
                      transition: { duration: 0.3 },
                    }}
                    className={`bg-gradient-to-br ${card.gradient} border ${card.border} rounded-xl p-6 cursor-pointer`}
                  >
                    <div className={`${card.labelColor} mb-2`}>
                      {card.label}
                    </div>
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="text-3xl font-bold"
                    >
                      {card.value}
                    </motion.div>
                    <div className={`text-sm ${card.changeColor} mt-2`}>
                      {card.change}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HeroSection;

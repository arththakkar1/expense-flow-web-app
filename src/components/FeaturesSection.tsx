"use client";

import {
  Bell,
  IndianRupeeIcon,
  PieChart,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

const Data = [
  {
    icon: PieChart,
    title: "Smart Analytics",
    description:
      "Visualize your spending with intuitive charts and gain actionable insights into your financial habits.",
    color: "blue",
  },
  {
    icon: Bell,
    // UPDATED: Title changed for a local focus
    title: "Localized Support",
    // UPDATED: Description changed to focus on local expenses/payments (e.g., UPI)
    description:
      "Seamlessly manage all local payments and transactions, from UPI to card expenses.",
    color: "purple",
  },
  {
    icon: Shield,
    title: "Bank-level Security",
    description:
      "Your financial data is protected with enterprise-grade encryption and security measures.",
    color: "green",
  },
  {
    icon: TrendingUp,
    title: "Budget Planning",
    description:
      "Set realistic budgets and track your progress with intelligent forecasting tools.",
    color: "blue",
  },
  {
    icon: IndianRupeeIcon,
    title: "Expense Tracking",
    description:
      "Automatically categorize expenses and never lose track of where your money goes.",
    color: "purple",
  },
  {
    icon: Zap,
    title: "Quick Entry",
    description:
      "Add expenses in seconds with our streamlined interface and receipt scanning.",
    color: "green",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    hoverBorder: "hover:border-blue-500/40",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    hoverBorder: "hover:border-purple-500/40",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-400",
    hoverBorder: "hover:border-green-500/40",
  },
};

function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div>
      <section id="features" className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-zinc-400">
              Powerful features to take control of your finances
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {Data.map((feature, index) => {
              const Icon = feature.icon;
              const colors =
                colorClasses[feature.color as keyof typeof colorClasses];

              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3 },
                  }}
                  className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-8 ${colors.hoverBorder} transition-colors cursor-pointer`}
                >
                  <motion.div
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.6 }}
                    className={`w-14 h-14 ${colors.bg} border ${colors.border} rounded-xl flex items-center justify-center ${colors.text} mb-6`}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-zinc-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default FeaturesSection;

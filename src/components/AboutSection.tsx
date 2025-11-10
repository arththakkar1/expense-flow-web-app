"use client";

import { motion } from "motion/react";
import { Shield, Zap, Heart, Users, Target, Sparkles } from "lucide-react";
import React from "react";

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your financial data is encrypted and secure. We never share your information with third parties.",
    color: "blue",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Add expenses in seconds with our intuitive interface. No complex forms or unnecessary steps.",
    color: "purple",
  },
  {
    icon: Heart,
    title: "Made with Care",
    description:
      "Built by people who understand the importance of financial wellness and peace of mind.",
    color: "green",
  },
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "100%", label: "Free Forever" },
  { value: "24/7", label: "Available" },
];

function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="about" className="relative py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">About ExpenseFlow</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for Financial Freedom
          </h2>
          <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
            We believe everyone deserves simple, powerful tools to manage their
            money. That{"'"}s why ExpenseFlow is completely free, forever.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          // FIX: Changed from grid-cols-2 md:grid-cols-4 to match the 3 items
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:border-zinc-700 transition-colors"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-zinc-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            const colorClasses = {
              blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
              purple:
                "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
              green:
                "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
            };

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 bg-gradient-to-br ${
                    colorClasses[value.color as keyof typeof colorClasses]
                  } border rounded-xl flex items-center justify-center mb-6`}
                >
                  <Icon className="w-7 h-7" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8 md:p-12"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Target className="w-8 h-8 text-blue-400" />
              <h3 className="text-3xl font-bold">Our Mission</h3>
            </div>
            <p className="text-lg text-zinc-300 text-center leading-relaxed mb-8">
              We{"'"}re on a mission to democratize financial management. Too
              many expense tracking tools hide basic features behind paywalls.
              ExpenseFlow is different — we believe powerful financial tools
              should be accessible to everyone, regardless of budget.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-green-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Community Driven</h4>
                    <p className="text-sm text-zinc-400">
                      Built with feedback from thousands of users worldwide who
                      helped shape every feature.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-6"
              >
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Open & Transparent</h4>
                    <p className="text-sm text-zinc-400">
                      No hidden fees, no premium tiers, no feature locks.
                      Everything is free, always.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-400 mb-4">
            Have questions or feedback? We{"'"}d love to hear from you.
          </p>
          <motion.a
            href="mailto:hello@expenseflow.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block bg-zinc-800 border border-zinc-700 px-8 py-3 rounded-full font-medium hover:bg-zinc-700 transition-colors"
          >
            Get in Touch
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;

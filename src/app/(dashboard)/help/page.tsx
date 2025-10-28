"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  Mail,
  Users,
  ChevronDown,
  User,
  Target,
} from "lucide-react";

// Define the type for FAQ objects
type FaqType = {
  question: string;
  answer: string;
};

// Expanded FAQ list
const faqs: FaqType[] = [
  {
    question: "How do I add a new transaction?",
    answer:
      "To add a transaction, navigate to the 'Transactions' page from the main dashboard. Click the 'Add New' button, fill in the details such as amount, category, and date, and then click 'Save'. Your new transaction will immediately appear in your list.",
  },
  {
    question: "Can I create and manage budgets?",
    answer:
      "Yes! Go to the 'Budgets' section. You can create monthly or custom-period budgets for different categories like 'Groceries', 'Transport', or 'Entertainment'. The app will automatically track your spending against these budgets.",
  },
  {
    question: "How is the 'Money Saved' stat calculated?",
    answer:
      "'Money Saved' is a projection based on your budgeting performance. It's calculated by taking the total amount you budgeted for a period and subtracting your actual spending. Positive differences from all your budgets are summed up to show your total savings.",
  },
  {
    question: "How do I customize transaction categories?",
    answer:
      "In the 'Settings' menu, you can find a 'Categories' section. Here you can add new categories, edit the names and icons of existing ones, or delete categories you don't use.",
  },
  {
    question: "How do I export my transaction data from the transactions page?",
    answer:
      "To export your data, navigate to the 'Transactions' page. Use the date filters to select the specific time range you wish to export. Next, click the 'Export Data' button (usually located near the filtering options). You will then be prompted to choose an export format, such as CSV for spreadsheets or PDF for a print-friendly document. The generated file will download automatically.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. We prioritize your security. All your data is encrypted both in transit and at rest. We use industry-standard security protocols to ensure your financial information is kept private and safe.",
  },
];

// Troubleshooting section content
const troubleshootingFaqs: FaqType[] = [
  {
    question: "The app is running slow, what can I do?",
    answer:
      "If the app feels slow, please try clearing the application cache in your device's settings. Also, ensure you have a stable internet connection. If the problem persists, contact our support team.",
  },
  {
    question: "My transaction data seems incorrect or is not syncing.",
    answer:
      "First, try a manual refresh by pulling down on the transaction list. If a specific transaction is incorrect, you can tap on it to edit the details manually. For persistent sync issues, signing out and signing back in can often resolve the problem.",
  },
];

// Define props for AccordionItem
interface AccordionItemProps {
  faq: FaqType;
}

// Mimics a shadcn/ui AccordionItem for smooth animation and clean aesthetic
const AccordionItem: React.FC<AccordionItemProps> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Toggle function for click and keyboard events
  const toggleOpen = () => setIsOpen(!isOpen);

  // Explicitly typing the keyboard event
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleOpen();
    }
  };

  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      {/* Accordion Trigger */}
      <div
        className="flex justify-between items-center py-4 cursor-pointer hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900/50"
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
      >
        <span className="text-sm sm:text-base font-medium text-white">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-blue-400" : ""
          }`}
        />
      </div>

      <div
        style={{
          maxHeight: isOpen ? "1000px" : "0px",
        }}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
      >
        <div className="pb-4 text-zinc-400 text-sm sm:text-base">
          {faq.answer}
        </div>
      </div>
    </div>
  );
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="w-full max-w-4xl mx-auto space-y-12 p-4 sm:p-6 lg:p-8">
        {/* --- Header --- */}
        <div className="text-center">
          <div className="inline-block bg-zinc-900 border border-zinc-800 rounded-full p-3 mb-4">
            <HelpCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Help & Support
          </h1>
          <p className="text-zinc-400 mt-2 text-sm sm:text-base max-w-xl mx-auto">
            Have questions? We{"'"}re here to help. Find answers to common
            questions or get in touch with our support team.
          </p>
        </div>

        {/* --- Getting Started Guide --- */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            Getting Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold text-white">Step 1: Set Up Profile</h3>
              <p className="text-zinc-400 text-sm mt-1">
                Complete your profile to personalize your experience.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white">Step 2: Create a Budget</h3>
              <p className="text-zinc-400 text-sm mt-1">
                Set up your first budget to start managing your finances.
              </p>
            </div>
          </div>
        </div>

        {/* --- FAQ Section - Using Shadcn-style Accordion --- */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Frequently Asked Questions
          </h2>
          {/* Outer container for shadcn-style border/background */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 sm:px-6">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} faq={faq} />
            ))}
          </div>
        </div>

        {/* --- Troubleshooting Section - Using Shadcn-style Accordion --- */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Troubleshooting
          </h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 sm:px-6">
            {troubleshootingFaqs.map((faq, index) => (
              <AccordionItem key={index} faq={faq} />
            ))}
          </div>
        </div>

        {/* --- Contact Section --- */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center">
            Still Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-all hover:border-blue-500/50">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Email Support</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Get a direct response from our team for any issue.
              </p>
              <a
                href="mailto:support@yourapp.com"
                className="inline-block text-sm font-medium text-blue-400 hover:text-blue-300"
              >
                Contact Support &rarr;
              </a>
            </div>

            {/* Community Card */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 transition-all hover:border-purple-500/50">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-1">Community Forum</h3>
              <p className="text-zinc-400 text-sm mb-4">
                Ask questions and share tips with other users.
              </p>
              <a
                href="#"
                className="inline-block text-sm font-medium text-purple-400 hover:text-purple-300"
              >
                Visit Community &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

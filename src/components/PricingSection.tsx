import { Check, IndianRupee, Shield, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

function PricingSection() {
  return (
    <div>
      {/* Why Free Section */}
      <section id="pricing" className="relative py-20 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">100% Free. Forever.</h2>
            <p className="text-xl text-zinc-400">
              Powerful expense management without the price tag
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Everything Included
                  </h3>
                  <ul className="space-y-4">
                    {[
                      "Unlimited transactions",
                      "Advanced analytics & charts",
                      "Budget planning tools",
                      "Export to CSV/Excel",
                      "Mobile & desktop access",
                      "Secure cloud backup",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-zinc-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
                    <div className="text-center">
                      <div className="text-6xl font-bold mb-2">₹0</div>
                      <div className="text-zinc-400 mb-4">Forever Free</div>
                      <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">
                          No hidden costs
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <span className="text-sm">No credit card required</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="text-sm">Instant access</span>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-400">
                      <IndianRupee className="w-5 h-5 text-green-400" />
                      <span className="text-sm">All currencies supported</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
                <Link
                  href="/signup"
                  className="inline-block bg-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30"
                >
                  Start Managing Your Expenses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PricingSection;

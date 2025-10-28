"use client";
import React from "react";

import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import CTASection from "@/components/CTASection";

import AboutSection from "@/components/AboutSection";

export default function ExpenseLandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}

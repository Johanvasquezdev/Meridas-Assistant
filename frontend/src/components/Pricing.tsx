"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Starter",
    description: "For teams needing accurate, policy-grounded AI answers",
    price: "$49.99",
    cta: "Start Free Trial",
    features: [
      "1,000 Verified Answers",
      "Document Library Upload",
      "Exact Source Citations",
      "5 Team Member Seats",
      "REST API Access",
    ],
  },
  {
    name: "Professional",
    description: "For businesses needing complete verification & voice chat",
    price: "$99.99",
    cta: "Start Free Trial",
    featured: true,
    features: [
      "10,000 Verified Answers",
      "Real-Time ElevenLabs Voice",
      "Full Audit Trail & History",
      "Unlimited Team Seats",
      "Policy Conflict Detection",
      "Embeddable Website Widget",
      "Priority Support SLA",
    ],
  },
  {
    name: "Enterprise",
    description: "Dedicated isolated environments & custom integrations",
    price: "Custom",
    cta: "Contact Enterprise Sales",
    features: [
      "Unlimited Volume",
      "Dedicated Private Cloud / On-Prem",
      "Custom Model Fine-Tuning",
      "Single Sign-On (SAML / SSO)",
      "Dedicated Solutions Architect",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-[120px] border-b border-[#2A2832] bg-[#151417]">
      <div className="mx-auto max-w-[1240px] px-6">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-[#C9A227]/30 bg-[#9E1B32]/10 mb-4">
            <span className="font-sans text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
              Simple Pricing
            </span>
          </div>
          <h2 className="font-sans text-[40px] sm:text-[48px] font-bold text-[#F7F3EA] mb-4">
            Predictable Enterprise Tiers
          </h2>
          <p className="font-sans text-[16px] text-[#8C8A94] max-w-[560px]">
            Every tier includes strict evidence grounding and zero hallucinations by default.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`flex flex-col bg-[#1C1B20] border rounded-[16px] p-8 relative shadow-xl transition-all ${
                plan.featured 
                  ? "border-[#C9A227] shadow-[#9E1B32]/10 ring-1 ring-[#C9A227]/30" 
                  : "border-[#2A2832] hover:border-[#C9A227]/40"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#9E1B32] border border-[#C9A227] font-sans text-[10px] uppercase tracking-wider text-[#F7F3EA] font-bold shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-sans text-[20px] font-bold text-[#F7F3EA] mb-2">{plan.name}</h3>
                <p className="font-sans text-[13px] text-[#8C8A94] leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8 flex items-baseline gap-1.5">
                <span className="font-sans text-[48px] sm:text-[52px] font-bold text-[#F7F3EA] leading-none tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && (
                  <span className="font-sans text-[14px] text-[#8C8A94]">/month</span>
                )}
              </div>

              <div className="flex-1 mb-8">
                <div className="space-y-2.5">
                  {plan.features.map((feature) => (
                    <div 
                      key={feature} 
                      className="flex items-center gap-2.5 text-[13px] text-[#F7F3EA]/90 font-sans"
                    >
                      <span className="text-[#C9A227] font-bold">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.cta.includes("Contact") ? "#faq" : "/sign-up"}
                className={`w-full py-3.5 rounded-[8px] font-sans text-xs font-bold uppercase tracking-widest text-center transition-all ${
                  plan.featured 
                    ? "bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] border border-[#C9A227]/50 shadow-lg shadow-[#9E1B32]/25" 
                    : "border border-[#2A2832] bg-[#151417] text-[#F7F3EA] hover:border-[#C9A227] hover:text-[#C9A227]"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}

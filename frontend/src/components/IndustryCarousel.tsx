"use client";

import { motion } from "framer-motion";

const industries = [
  {
    title: "Operational & Logistics Support",
    description: "Handle warranty dispatches, RMA tracking, and inventory exceptions with strict SLA citations.",
    metric: "99.4%",
    label: "Audit compliance",
  },
  {
    title: "Infrastructure procedures",
    description: "Hold an old VPN standard beside the current one until someone declares which port and MFA the next answer may cite.",
    metric: "2",
    label: "Versions in conflict",
  },
  {
    title: "Healthcare & Regulatory Services",
    description: "Enforce strict compliance protocols with zero tolerance for generative hallucinations.",
    metric: "100%",
    label: "Traceable references",
  },
  {
    title: "Financial & Corporate Governance",
    description: "Provide verified policy interpretations and procedural audit logs for internal staff.",
    metric: "99.9%",
    label: "Grounding confidence",
  },
];

export function IndustryCarousel() {
  return (
    <section id="industries" className="py-[120px] border-b border-[#2A2832] bg-[#151417]">
      <div className="mx-auto max-w-[1240px] px-6">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-[#C9A227]/30 bg-[#9E1B32]/10 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
              Deployment Matrix
            </span>
          </div>
          <h2 className="font-sans text-[40px] sm:text-[48px] font-bold text-[#F7F3EA] mb-4">
            Where Precision Is Non-Negotiable
          </h2>
          <p className="font-sans text-[16px] text-[#8C8A94] max-w-[560px]">
            MERIDAS scales across compliance-heavy environments where wrong answers carry serious consequences.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {industries.map((item, idx) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#1C1B20] border border-[#2A2832] rounded-[16px] p-8 group hover:border-[#C9A227]/50 transition-all duration-300 shadow-xl"
            >
              <div className="flex flex-col h-full justify-between gap-8">
                <div>
                  <h3 className="font-sans text-[20px] font-bold text-[#F7F3EA] mb-3 group-hover:text-[#C9A227] transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[14px] text-[#8C8A94] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#2A2832] flex items-baseline gap-3">
                  <span className="font-mono text-[36px] font-bold text-[#C9A227] leading-none">
                    {item.metric}
                  </span>
                  <span className="font-sans text-xs text-[#8C8A94] uppercase tracking-wider">
                    {item.label}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}

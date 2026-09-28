"use client";

import { motion } from "framer-motion";

const features = [
  {
    id: "01",
    title: "Verified Answers with Citations",
    description: "Every response is backed by exact references from your manuals and policies. Meridas never guesses or invents answers.",
  },
  {
    id: "02",
    title: "Policy & Guideline Alignment",
    description: "Answers always follow your current company rules, customer agreements, and active operating procedures.",
  },
  {
    id: "03",
    title: "Private & Secure Workspaces",
    description: "Strict workspace isolation ensures your proprietary documents are encrypted, private, and never used to train public models.",
  },
  {
    id: "04",
    title: "Smart Document Library",
    description: "Easily upload PDFs, manuals, and policy documents with automatic organization and fast, accurate search.",
  },
  {
    id: "05",
    title: "Real-Time Voice Assistant",
    description: "Natural, low-latency voice interaction powered by ElevenLabs, allowing team members and customers to ask questions aloud.",
  },
  {
    id: "06",
    title: "Embeddable Website Widget",
    description: "Add Meridas to your company intranet, customer portal, or public website with a single line of script.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-[120px] border-b border-[#2A2832] bg-[#151417] font-sans">
      <div className="mx-auto max-w-[1240px] px-6">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-[#C9A227]/30 bg-[#9E1B32]/10 mb-4">
            <span className="font-sans text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
              Built For Reliability
            </span>
          </div>
          <h2 className="font-sans text-[40px] sm:text-[48px] font-bold text-[#F7F3EA] mb-4">
            Answers You Can Count On
          </h2>
          <p className="font-sans text-[16px] text-[#8C8A94] max-w-[600px]">
            Where generic chatbots fail, Meridas provides accurate, cited, and dependable support intelligence.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#2A2832] rounded-[16px] overflow-hidden border border-[#2A2832]">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group flex items-start gap-6 p-10 bg-[#1C1B20] hover:bg-[#232128] transition-all border-l-2 border-l-transparent hover:border-l-[#C9A227]"
            >
              <span className="font-sans text-[16px] font-bold text-[#C9A227] group-hover:scale-110 transition-transform">
                {feature.id}
              </span>
              <div>
                <h3 className="font-sans text-[20px] font-bold text-[#F7F3EA] mb-2.5">
                  {feature.title}
                </h3>
                <p className="font-sans text-[14px] leading-relaxed text-[#8C8A94]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

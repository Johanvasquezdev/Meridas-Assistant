"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What does \"Evidence first. Answer second.\" mean in practice?",
    answer: "Meridas retrieves passages from the evidence graph before it writes an answer. If nothing supports the question, or two active versions contradict each other, it refuses instead of producing a fluent guess.",
  },
  {
    question: "What happens when two procedures disagree?",
    answer: "Ingest keeps both versions and opens a conflict. The chat can refuse while that conflict is open. A person on the conflict desk declares which version stays. The other is marked superseded.",
  },
  {
    question: "Does that decision change the next answer?",
    answer: "Yes. Retrieval drops passages that belong to a superseded version. The following question is answered from the version that was declared binding.",
  },
  {
    question: "Who is Meridas for?",
    answer: "Operations and security teams that cannot afford an answer from an outdated procedure. It is a private system for those teams, not a public subscription product.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-[120px] border-b border-[#2A2832] bg-[#151417]">
      <div className="mx-auto max-w-[1240px] px-6">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-[#C9A227]/30 bg-[#9E1B32]/10 mb-4">
            <span className="font-sans text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
              FAQ
            </span>
          </div>
          <h2 className="font-sans text-[40px] sm:text-[48px] font-bold text-[#F7F3EA] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-[16px] text-[#8C8A94] max-w-[560px]">
            Key insights on how Meridas provides grounded intelligence for mission-critical operations.
          </p>
        </div>

        {/* Accordion */}
        <div className="border-t border-[#2A2832]">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-[#2A2832]">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between py-6 text-left group"
              >
                <span className="font-sans text-[16px] font-bold text-[#F7F3EA] group-hover:text-[#C9A227] transition-colors">
                  {faq.question}
                </span>
                <span className="font-mono text-[22px] text-[#C9A227] shrink-0 ml-4">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 font-sans text-[14px] leading-relaxed text-[#8C8A94] max-w-[800px]">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

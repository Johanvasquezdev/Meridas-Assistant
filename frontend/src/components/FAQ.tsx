"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What does \"Evidence first. Answer second.\" mean in practice?",
    answer: "Unlike traditional generative chatbots that prioritize generating fluent conversational text regardless of factual basis, Meridas operates with mandatory proof gating. It retrieves verified passages from your uploaded documentation first; if no direct evidence is found, it refuses to speculate.",
  },
  {
    question: "How do inline citations work?",
    answer: "Every response embeds interactive citation tags [1], [2] linked to exact document sections, pages, and similarity confidence scores. Users and compliance officers can click any citation to view the underlying source excerpt.",
  },
  {
    question: "Which AI models power Meridas?",
    answer: "Meridas is architected to utilize precision RAG models including Cohere Command R+, Google Gemini, and Groq LLaMA models, optimized specifically for grounding, citation extraction, and sub-second latency.",
  },
  {
    question: "Can our proprietary documents be seen by other companies?",
    answer: "No. Meridas uses strict multi-tenant isolation. Each enterprise customer has isolated vector namespaces, isolated database partitions, and dedicated encryption keys. Your documentation is never exposed or used to train public models.",
  },
  {
    question: "How is Meridas integrated into our existing website or portal?",
    answer: "You can embed our lightweight JavaScript widget into any web platform with one line of code, or connect your customer portal directly via our authenticated REST and WebSocket APIs.",
  },
  {
    question: "Is voice support included?",
    answer: "Yes. Meridas integrates low-latency ElevenLabs speech synthesis and transcription, allowing real-time voice interactions backed by the same rigorous evidence verification.",
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

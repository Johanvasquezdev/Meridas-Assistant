"use client";

import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { title: "Private Documents", text: "Your company manuals and documents are never used to train public AI models." },
  { title: "End-to-End Encryption", text: "All data is encrypted in transit (TLS 1.3) and at rest with enterprise AES-256 standards." },
  { title: "Strict Workspace Isolation", text: "Separate, private workspaces ensure your data is never accessible by other organizations." },
  { title: "Complete Audit Trail", text: "Every user query, source citation, and response is recorded with full audit history." },
];

export function Security() {
  return (
    <section id="security" className="py-[120px] border-b border-[#2A2832] bg-[#151417] font-sans">
      <div className="mx-auto max-w-[1240px] px-6">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-[#C9A227]/30 bg-[#9E1B32]/10 mb-4">
            <span className="font-sans text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
              Security &amp; Trust
            </span>
          </div>
          <h2 className="font-sans text-[40px] sm:text-[48px] font-bold text-[#F7F3EA] mb-4">
            Enterprise-Grade Security
          </h2>
          <p className="font-sans text-[16px] text-[#8C8A94] max-w-[560px]">
            Dependable AI assistance requires uncompromising security, privacy, and full data protection.
          </p>
        </div>

        {/* 4-Column Horizontal Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 rounded-[16px] overflow-hidden border border-[#2A2832] bg-[#1C1B20]">
          {items.map((item, idx) => (
            <motion.article 
              key={item.title} 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`p-10 border-[#2A2832] ${
                idx !== items.length - 1 ? "lg:border-r" : ""
              } ${
                idx % 2 === 0 ? "sm:border-r lg:border-r" : ""
              } border-b lg:border-b-0 hover:bg-[#232128] transition-colors`}
            >
              <div className="space-y-5">
                <CheckCircle className="size-5 text-[#C9A227]" strokeWidth={2} />
                <h3 className="font-sans text-[16px] font-bold text-[#F7F3EA]">
                  {item.title}
                </h3>
                <p className="font-sans text-[13px] text-[#8C8A94] leading-relaxed">
                  {item.text}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}

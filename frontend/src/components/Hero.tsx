"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChatDemo } from "./ChatDemo";
import { ShieldCheck, Cpu, GitCompare, Lock } from "lucide-react";

const systemSpecs = [
  { icon: ShieldCheck, label: "Policy-Grounded", desc: "Every answer verified" },
  { icon: Cpu, label: "Smart Search", desc: "Finds exact paragraphs" },
  { icon: GitCompare, label: "Conflict Detector", desc: "Flags contradictory rules" },
  { icon: Lock, label: "Enterprise Security", desc: "Private data & full audit" },
];

export function Hero() {
  return (
    <section className="relative min-h-[92vh] bg-[#151417] pt-28 pb-16 flex items-center">
      {/* Precision hairline grid background */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(#F7F3EA 1px, transparent 1px), linear-gradient(90deg, #F7F3EA 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="mx-auto max-w-[1240px] px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column — Strategic Thesis */}
          <div className="lg:col-span-6 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-5"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-[#C9A227]/30 bg-[#1C1B20]">
                <span className="size-1.5 rounded-full bg-[#C9A227]" />
                <span className="font-sans text-xs uppercase tracking-wider text-[#C9A227] font-semibold">
                  AI Support Agent • Grounded in Company Policies
                </span>
              </div>

              <h1 className="font-sans text-[44px] sm:text-[62px] lg:text-[68px] font-bold leading-[1.04] tracking-[-0.03em] text-[#F7F3EA]">
                Evidence first.<br />
                <span className="text-[#C9A227]">
                  Answer second.
                </span>
              </h1>
              
              <p className="font-sans text-[16px] sm:text-[18px] text-[#8C8A94] max-w-[490px] leading-relaxed">
                Meridas gives your team and customers accurate answers directly from your company manuals and policies. 
                Every response is verified with exact citations, preventing guesses or hallucinations.
              </p>
            </motion.div>

            {/* Grounded System Specs */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="grid grid-cols-2 gap-3 max-w-[480px]"
            >
              {systemSpecs.map((spec) => {
                const Icon = spec.icon;
                return (
                  <div 
                    key={spec.label}
                    className="p-3 rounded-[10px] bg-[#1C1B20] border border-[#2A2832] flex items-center gap-3"
                  >
                    <div className="size-8 rounded-[6px] bg-[#151417] border border-[#2A2832] flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-[#C9A227]" />
                    </div>
                    <div>
                      <div className="font-sans text-[13px] font-semibold text-[#F7F3EA] leading-tight">
                        {spec.label}
                      </div>
                      <div className="font-sans text-[11px] text-[#8C8A94]">
                        {spec.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Action Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="flex items-center gap-4 pt-2"
            >
              <Link
                href="/sign-up"
                className="bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] font-sans text-xs font-bold uppercase tracking-wider px-7 py-3.5 rounded-[8px] border border-[#C9A227]/30 shadow-lg shadow-[#9E1B32]/25 transition-all"
              >
                Try MERIDAS Assistant Free
              </Link>
            </motion.div>
          </div>

          {/* Right Column — Operational Console */}
          <div className="lg:col-span-6 relative">
             <motion.div
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
             >
               <ChatDemo />
             </motion.div>
          </div>

        </div>
      </div>
      
      {/* Bottom Hairline */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-[#2A2832]" />
    </section>
  );
}

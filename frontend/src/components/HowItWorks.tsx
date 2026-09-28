"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Ingest Verified Documentation",
    description: "Upload internal manuals, technical SOPs, and customer policies. Meridas establishes a clean, isolated knowledge boundary for your enterprise.",
    features: [
      "PDFs, Markdown, raw policies, and technical guidelines",
      "Instant multi-tenant isolation and encryption",
      "Automated deduplication and version tracking",
    ],
  },
  {
    step: "02",
    title: "Vector Geometry & Semantic Indexing",
    description: "Meridas breaks your knowledge into semantic evidence strata, generating high-dimension vectors stored in dedicated tenant collections.",
    features: [
      "Sentence-boundary aware chunking protects logical context",
      "Sub-second vector indexing via Pinecone & pgvector",
      "Cryptographic mapping between chunks and original files",
    ],
  },
  {
    step: "03",
    title: "Grounded Querying & Mandatory Citations",
    description: "When queries arrive, Meridas searches for proof first. Every claim in the generated answer references the exact source line and page.",
    features: [
      "Mandatory source provenance on every statement",
      "Zero-hallucination refusal when evidence is missing",
      "Interactive evidence drawer with similarity confidence",
    ],
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-[120px] border-b border-[#2A2832] bg-[#151417]">
      <div className="mx-auto max-w-[1240px] px-6">
        
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] border border-[#C9A227]/30 bg-[#9E1B32]/10 mb-4">
            <span className="font-mono text-xs uppercase tracking-widest text-[#C9A227] font-semibold">
              The Evidence Engine
            </span>
          </div>
          <h2 className="font-sans text-[40px] sm:text-[48px] font-bold text-[#F7F3EA] mb-4">
            How Meridas Enforces Truth
          </h2>
          <p className="font-sans text-[16px] text-[#8C8A94] max-w-[560px]">
            From raw organizational files to an unshakeable, citation-backed intelligence layer.
          </p>
        </div>

        {/* Step Navigation */}
        <div className="flex gap-12 mb-16 border-b border-[#2A2832]">
          {steps.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(i)}
              className={`pb-4 font-mono text-sm tracking-widest transition-all relative ${
                activeStep === i ? "text-[#C9A227] font-bold" : "text-[#8C8A94] hover:text-[#F7F3EA]"
              }`}
            >
              STEP {s.step}
              {activeStep === i && (
                <motion.div 
                  layoutId="activeHowItWorksTab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A227]" 
                />
              )}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Column */}
              <div className="relative">
                <div className="absolute -top-24 -left-10 font-mono text-[140px] font-bold text-[#1C1B20] select-none z-0 pointer-events-none">
                  {steps[activeStep].step}
                </div>
                <div className="relative z-10 space-y-6">
                  <h3 className="font-sans text-[26px] sm:text-[32px] font-bold text-[#F7F3EA]">
                    {steps[activeStep].title}
                  </h3>
                  <p className="font-sans text-[15px] text-[#8C8A94] leading-relaxed max-w-[480px]">
                    {steps[activeStep].description}
                  </p>
                  <ul className="space-y-3.5 pt-2">
                    {steps[activeStep].features.map((f, idx) => (
                      <li key={idx} className="font-sans text-sm text-[#F7F3EA]/90 flex items-center gap-3">
                        <span className="text-[#C9A227] font-bold">→</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column (Visual) */}
              <div className="bg-[#1C1B20] border border-[#2A2832] rounded-[16px] p-10 flex items-center justify-center min-h-[360px] shadow-2xl">
                {activeStep === 0 && <Step1Illustration />}
                {activeStep === 1 && <Step2Illustration />}
                {activeStep === 2 && <Step3Illustration />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}

function Step1Illustration() {
  return (
    <div className="w-full max-w-[260px] space-y-4">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.6, delay: i * 0.15 }}
          className="h-2 bg-[#151417] rounded-full overflow-hidden border border-[#2A2832]"
        >
          <motion.div 
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-1/3 h-full bg-gradient-to-r from-[#9E1B32] to-[#C9A227]" 
          />
        </motion.div>
      ))}
      <div className="pt-2 flex justify-between font-mono text-[10px] text-[#8C8A94]">
        <span>INGESTING_RECORDS</span>
        <span className="text-[#C9A227]">STREAM ACTIVE</span>
      </div>
    </div>
  );
}

function Step2Illustration() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="relative size-28 rounded-full border-2 border-dashed border-[#C9A227]/40 flex items-center justify-center animate-spin" style={{ animationDuration: "20s" }}>
        <div className="size-16 rounded-full border border-[#9E1B32] bg-[#9E1B32]/10 flex items-center justify-center">
          <span className="font-mono text-xs text-[#C9A227] font-bold">VEC</span>
        </div>
      </div>
      <div className="font-mono text-xs text-[#8C8A94]">
        <span>DIMENSIONS: 1536</span> · <span className="text-[#C9A227]">COSINE SIMILARITY</span>
      </div>
    </div>
  );
}

function Step3Illustration() {
  return (
    <div className="w-full max-w-[320px] space-y-3">
      <div className="p-3.5 rounded-[10px] bg-[#151417] border border-[#C9A227]/30 text-left">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="size-2 rounded-full bg-[#C9A227]" />
          <span className="font-mono text-[10px] text-[#C9A227] font-bold">CITED EXCERPT [SOP-NET-2025-001-v3.0]</span>
        </div>
        <p className="font-sans text-xs text-[#F7F3EA]/90 leading-snug">
          &ldquo;Gateway Address: vpn-hq.internal.bluehawk.com. Mandatory Port: Port 8443 (TLS 1.3 Strict). Authentication: Active Directory + Mandatory Duo Mobile Hardware Push MFA.&rdquo;
        </p>
      </div>
      <div className="flex justify-between items-center px-1 font-mono text-[10px] text-[#8C8A94]">
        <span>MATCH: 98.2%</span>
        <span className="text-[#C9A227]">VERIFIED ✓</span>
      </div>
    </div>
  );
}

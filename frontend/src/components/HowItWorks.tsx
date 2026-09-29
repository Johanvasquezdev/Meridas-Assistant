"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Ingest writes the evidence graph",
    description: "Each upload becomes a source, a version, passages, and claims. A later revision stays beside the previous one and opens a conflict. Nothing is silently replaced.",
    features: [
      "Source, version, passage, and claim are written on ingest",
      "A second version of the same directive opens a conflict",
      "Both versions remain in force until a person decides",
    ],
  },
  {
    step: "02",
    title: "The chat reads only active evidence",
    description: "An answer is assembled from passages that are still in force. If the evidence is missing or the versions contradict, Meridas refuses instead of guessing.",
    features: [
      "Supported, conditional, or refused",
      "Superseded passages are left out of retrieval",
      "No answer is issued without a passage behind it",
    ],
  },
  {
    step: "03",
    title: "Adjudication changes the next answer",
    description: "On the conflict desk a person declares which version stays. The other version is marked superseded, and the following question no longer retrieves it.",
    features: [
      "Declare which revision remains binding",
      "The losing version is marked superseded",
      "The next answer follows that decision",
    ],
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-[120px] border-b border-[#2A2832] bg-[#151417]">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-[6px] border border-[#C9A227]/40 bg-[#9E1B32]/15 px-3 py-1">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#C9A227]">
              The Evidence Engine
            </span>
          </div>
          <h2 className="font-sans text-[40px] sm:text-[48px] font-bold text-[#F7F3EA] mb-4">
            How Meridas Enforces Truth
          </h2>
          <p className="font-sans text-[16px] text-[#8C8A94] max-w-[560px]">
            Upload a directive, refuse when versions disagree, and let a person decide what the next answer may use.
          </p>
        </div>

        <div className="mb-16 flex gap-12 border-b border-[#C9A227]/20">
          {steps.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setActiveStep(i)}
              className={`pb-4 font-mono text-sm tracking-widest transition-all relative ${
                activeStep === i ? "font-bold text-[#C9A227]" : "text-[#8C8A94] hover:text-[#F7F3EA]"
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
              <div className="relative">
                <div className="absolute -top-24 -left-10 font-mono text-[140px] font-bold text-[#2A1218] select-none z-0 pointer-events-none">
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
                        <span className="font-bold text-[#C9A227]">→</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex min-h-[360px] items-center justify-center rounded-[16px] border border-[#C9A227]/25 bg-[#1C1B20] p-10 shadow-2xl shadow-black/40">
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
          className="h-2 bg-[#151417] rounded-full overflow-hidden"
        >
          <motion.div
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.2 }}
            className="w-1/3 h-full bg-[#9E1B32]"
          />
        </motion.div>
      ))}
      <div className="pt-2 flex justify-between font-mono text-[12px] text-[#B7B4BE]">
        <span>Writing the graph</span>
        <span className="text-[#F6D5DC]">Both versions stay</span>
      </div>
    </div>
  );
}

function Step2Illustration() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div className="size-28 rounded-[18px] bg-[#9E1B32] flex items-center justify-center">
        <span className="font-sans text-lg font-bold text-[#F7F3EA]">Refused</span>
      </div>
      <p className="font-sans text-[14px] text-[#F6D5DC] max-w-[240px]">
        Two versions contradict, so there is no blended answer.
      </p>
    </div>
  );
}

function Step3Illustration() {
  return (
    <div className="w-full max-w-[320px] space-y-3">
      <div className="p-3.5 rounded-[10px] bg-[#151417] border border-[#C9A227]/30 text-left">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="size-2 rounded-full bg-[#C9A227]" />
          <span className="font-sans text-[12px] text-[#C9A227] font-bold">v3.0 stays in the next answer</span>
        </div>
        <p className="font-sans text-[13px] text-[#F7F3EA]/90 leading-snug">
          Port 8443, TLS 1.3, and Duo push. The earlier VPN standard is out.
        </p>
      </div>
      <div className="flex justify-between items-center px-1 font-sans text-[12px] text-[#F6D5DC]">
        <span>v2.4 superseded</span>
        <span className="text-[#C9A227]">Declared</span>
      </div>
    </div>
  );
}

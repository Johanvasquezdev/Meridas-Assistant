"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, FileText, CheckCircle2, ShieldCheck, Star } from "lucide-react";
import { MeridasIcon } from "./brand/MeridasLogo";

interface Scenario {
  id: string;
  badge: string;
  question: string;
  time: string;
  answer: string;
  citations: Array<{
    id: number;
    source: string;
    page: string;
    confidence: string;
    fate?: "stays" | "loses";
  }>;
}

const SCENARIOS: Scenario[] = [
  {
    id: "vpn-mfa",
    badge: "SOP-NET-2025-001",
    question: "What is the active port and mandatory MFA method for GlobalProtect VPN?",
    time: "10:14 AM",
    answer:
      "Refused. v3.0 [1] routes GlobalProtect on port 8443 with Duo Mobile push. v2.4 [2] still says port 443 and SMS OTP. Two active versions disagree, so there is no blended answer.",
    citations: [
      {
        id: 1,
        source: "SOP-NET-2025-001-v3.0.md",
        page: "§1.2",
        confidence: "Stays",
        fate: "stays",
      },
      {
        id: 2,
        source: "VPN-GlobalProtect-v2.4-Superseded.md",
        page: "§3.1",
        confidence: "Superseded",
        fate: "loses",
      },
    ],
  },
  {
    id: "hardware-custody",
    badge: "POL-OPS-2026-001",
    question: "Can an engineer retain a testing laptop for 21 days without checking into the central warehouse?",
    time: "10:15 AM",
    answer:
      "No. Under POL-OPS-2026-001 (Section 1) [1], no collaborator may retain a hardware asset on temporary loan for more than fifteen (15) continuous calendar days. On day 15, the asset must be physically presented to the IT Equipment Custodian at the central warehouse for functional verification [1].",
    citations: [
      {
        id: 1,
        source: "Hardware-Custody-15-Day-Policy.md",
        page: "§1.1–1.2",
        confidence: "99.1%",
      },
    ],
  },
  {
    id: "server-decommission",
    badge: "SOP-SEC-2025-009",
    question: "Under SOP-SEC-2025-009, who are the required dual-authorization signatories to decommission a server?",
    time: "10:16 AM",
    answer:
      "Under SOP-SEC-2025-009 (Section 1) [1], emergency server decommissioning and cryptographic sanitization require explicit written dual-authorization from the Lead Systems Custodian and the Director of Infrastructure Operations or CISO [1]. Autonomous decommissions are immediate security violations.",
    citations: [
      {
        id: 1,
        source: "Emergency-Server-Decommissioning.md",
        page: "§1.0",
        confidence: "99.5%",
      },
    ],
  },
];

const SETTLED_VPN_ANSWER =
  "Under v3.0 [1], the GlobalProtect gateway uses port 8443 with TLS 1.3 and mandatory Duo Mobile push. The earlier standard is out of this answer.";

export function ChatDemo() {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [animationStep, setAnimationStep] = useState<"question" | "thinking" | "answer" | "evidence">("evidence");
  const [vpnSettled, setVpnSettled] = useState(false);
  const pausedRef = useRef(false);
  const vpnSettledRef = useRef(false);

  const scenario = SCENARIOS[activeScenarioIndex];
  const vpnConflict = scenario.id === "vpn-mfa" && !vpnSettled;
  const shownAnswer = scenario.id === "vpn-mfa" && vpnSettled ? SETTLED_VPN_ANSWER : scenario.answer;
  const shownCitations = scenario.citations.filter(
    (citation) => !(scenario.id === "vpn-mfa" && vpnSettled && citation.fate === "loses"),
  );

  // Orchestrate progressive animation sequence for current scenario
  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    let t3: NodeJS.Timeout;
    let t4: NodeJS.Timeout | undefined;

    // Start with question appearing
    setAnimationStep("question");

    // After 900ms, start thinking/verification state
    t1 = setTimeout(() => {
      setAnimationStep("thinking");
    }, 900);

    // After 2100ms, reveal the grounded answer
    t2 = setTimeout(() => {
      setAnimationStep("answer");
    }, 2100);

    // After 2800ms, reveal the verified evidence drawer
    t3 = setTimeout(() => {
      setAnimationStep("evidence");
    }, 2800);

    const waitingForDecision = scenario.id === "vpn-mfa" && !vpnSettledRef.current;
    if (!waitingForDecision) {
      t4 = setTimeout(() => {
        if (!pausedRef.current) {
          setActiveScenarioIndex((prev) => (prev + 1) % SCENARIOS.length);
        }
      }, 9500);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [activeScenarioIndex, scenario.id]);

  return (
    <div
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
      className="w-full max-w-[540px] bg-[#151417] border border-[#2A2832] rounded-[18px] overflow-hidden shadow-2xl shadow-black/90 transition-all duration-300 hover:border-[#C9A227]/40 font-sans"
    >
      <div className="flex items-center px-5 py-3.5 border-b border-[#2A2832] bg-[#18171C]">
        <div className="flex items-center gap-2.5">
          <MeridasIcon size={20} />
          <span className="truncate font-sans text-[11px] text-[#F7F3EA] uppercase tracking-wide font-bold sm:text-xs sm:tracking-wider">
            MERIDAS AI SUPPORT ASSISTANT
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 border-b border-[#2A2832] bg-[#1C1B20] px-4 py-2 font-sans text-[11px] text-[#C9A227] sm:px-5">
        <Star className="mt-0.5 size-3 shrink-0 fill-[#C9A227] text-[#C9A227]" />
        <span className="min-w-0">AI Assistant Notice: Responses are verified directly from active company policies.</span>
      </div>

      {/* Scenario Tabs Bar */}
      <div className="flex items-center gap-2 overflow-hidden bg-[#121114] border-b border-[#2A2832]/60 px-3 py-2 text-[10px] font-sans sm:px-5">
        <span className="hidden shrink-0 items-center gap-1 uppercase tracking-wider text-[#8C8A94] sm:flex">
          <ShieldCheck className="size-3 text-[#C9A227]" />
          Verified Policies
        </span>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto">
          {SCENARIOS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveScenarioIndex(idx);
                setAnimationStep("question");
              }}
              className={`shrink-0 whitespace-nowrap px-2 py-0.5 rounded-[4px] transition-all font-sans ${
                activeScenarioIndex === idx
                  ? "bg-[#9E1B32] text-[#F7F3EA] font-bold border border-[#C9A227]/40"
                  : "text-[#8C8A94] hover:text-[#F7F3EA] bg-[#1C1B20] border border-[#2A2832]"
              }`}
            >
              {s.badge}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Flow Area */}
      <div className="flex min-h-[320px] flex-col justify-start space-y-4 p-4 sm:min-h-[360px] sm:p-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={scenario.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 flex-1"
          >
            {/* 1. Operator Question Bubble (Right-aligned, Burgundy/Wine styled) */}
            <div className="flex flex-col items-end">
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="max-w-[88%] p-4 rounded-[14px] bg-[#9E1B32]/25 border border-[#9E1B32]/45 text-[#F7F3EA] font-sans text-[13px] leading-relaxed shadow-lg shadow-[#9E1B32]/10"
              >
                {scenario.question}
              </motion.div>
              <span className="mt-1 font-sans text-[10px] text-[#8C8A94] pr-1">
                {scenario.time}
              </span>
            </div>

            {/* 2. Verification In-Progress Indicator (Thinking State) */}
            {animationStep === "thinking" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 p-3 rounded-[10px] bg-[#1C1B20] border border-[#2A2832] w-fit"
              >
                <Star className="size-3 fill-[#C9A227] text-[#C9A227]" />
                <span className="font-sans text-xs text-[#C9A227]">
                  Checking answers against {scenario.badge}...
                </span>
              </motion.div>
            )}

            {/* 3. Certified Assistant Response Bubble */}
            {(animationStep === "answer" || animationStep === "evidence") && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="p-4 rounded-[14px] bg-[#1C1B20] border border-[#2A2832] text-[#F7F3EA] font-sans text-[13px] leading-relaxed space-y-3 shadow-lg"
              >
                {scenario.id === "vpn-mfa" && vpnSettled && (
                  <p className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#C9A227]">
                    Same question. Next answer.
                  </p>
                )}
                <p className="text-[#F7F3EA]/90 leading-relaxed">
                  {shownAnswer.split(/(\[\d+\])/).map((part, i) => {
                    if (/^\[\d+\]$/.test(part)) {
                      return (
                        <span
                          key={i}
                          className="inline-block text-[#C9A227] font-mono font-bold mx-0.5 text-xs select-none hover:underline cursor-pointer"
                        >
                          {part}
                        </span>
                      );
                    }
                    return part;
                  })}
                </p>

                {/* 4. Verified Evidence Sources Tray */}
                {animationStep === "evidence" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="pt-2 border-t border-[#2A2832] space-y-2 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${vpnConflict ? "text-[#BA243F]" : "text-[#C9A227]"}`}>
                        <CheckCircle2 className={`size-3 ${vpnConflict ? "text-[#BA243F]" : "text-[#C9A227]"}`} />
                        {vpnConflict ? "Refused" : scenario.id === "vpn-mfa" ? "Version that stays" : "Verified sources"}
                      </span>
                      <span className="font-sans text-xs text-[#8C8A94]">
                        {vpnConflict ? "Two versions" : "Official citations"}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <AnimatePresence initial={false}>
                        {shownCitations.map((c) => {
                          const loses = c.fate === "loses";
                          return (
                            <motion.div
                              key={c.source}
                              layout
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 36, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.45, ease: "easeIn" }}
                              className={`flex items-center justify-between overflow-hidden px-3 py-2 rounded-[8px] bg-[#151417] border text-xs font-mono ${
                                loses
                                  ? "border-[#9E1B32] bg-[#9E1B32]/20"
                                  : "border-[#C9A227]/30"
                              }`}
                            >
                              <div className="flex items-center gap-2 text-[#F7F3EA]/90 truncate">
                                <span className={`font-bold ${loses ? "text-[#BA243F]" : "text-[#C9A227]"}`}>[{c.id}]</span>
                                <FileText className="size-3 text-[#8C8A94] shrink-0" />
                                <span className="truncate">{c.source} ({c.page})</span>
                              </div>
                              <span className={`font-bold px-2 py-0.5 rounded-[4px] border shrink-0 ml-2 ${
                                loses
                                  ? "text-[#F6D5DC] bg-[#9E1B32]/40 border-[#9E1B32]"
                                  : "text-[#C9A227] bg-[#C9A227]/10 border-[#C9A227]/20"
                              }`}>
                                {c.confidence}
                              </span>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    {vpnConflict && (
                      <button
                        type="button"
                        onClick={() => {
                          vpnSettledRef.current = true;
                          setVpnSettled(true);
                        }}
                        className="w-full rounded-[8px] border border-[#C9A227]/50 bg-[#9E1B32] px-3 py-2 font-sans text-xs font-bold text-[#F7F3EA] transition-colors hover:bg-[#BA243F]"
                      >
                        v3.0 stays
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Interactive Query Input Bar */}
      <div className="p-3.5 border-t border-[#2A2832] bg-[#18171C]">
        <div className="flex items-center gap-2 bg-[#151417] border border-[#2A2832] rounded-[10px] px-3.5 py-2.5">
          <input
            type="text"
            readOnly
            value="Query verified enterprise knowledge..."
            className="flex-1 bg-transparent font-sans text-xs text-[#8C8A94] outline-none select-none cursor-default"
          />
          <button
            type="button"
            title="Evidence Verification Active"
            className="size-7 rounded-[7px] bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] border border-[#C9A227]/30 flex items-center justify-center transition-all shadow-md shadow-[#9E1B32]/30 shrink-0"
          >
            <Send className="size-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChatDemoSection() {
  return null;
}

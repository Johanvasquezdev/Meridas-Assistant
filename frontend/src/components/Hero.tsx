"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { ChatDemo } from "./ChatDemo";
import { ShieldCheck, Cpu, GitCompare, Lock } from "lucide-react";

const systemSpecs = [
  { icon: ShieldCheck, label: "Three states", desc: "Supported, conditional, or refused" },
  { icon: Cpu, label: "Active versions", desc: "The chat reads the evidence graph" },
  { icon: GitCompare, label: "Conflict desk", desc: "A person picks the binding version" },
  { icon: Lock, label: "Next answer changes", desc: "The losing version drops out" },
];

export function Hero() {
  const { isSignedIn, isLoaded } = useAuth();
  const href = isLoaded && isSignedIn ? "/dashboard/conflicts" : "/sign-in";
  const label = isLoaded && isSignedIn ? "Access console" : "Sign in";

  return (
    <section className="relative flex min-h-[92vh] items-center overflow-x-hidden bg-[#151417] pt-24 pb-16 sm:pt-28">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute right-[8%] top-16 h-[420px] w-[420px] rounded-full bg-[#9E1B32]/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[28%] top-40 h-[280px] w-[280px] rounded-full bg-[#C9A227]/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-5"
            >
              <h1 className="font-sans text-[40px] font-bold leading-[1.04] tracking-[-0.03em] text-[#F7F3EA] sm:text-[62px] lg:text-[68px]">
                Evidence first.<br />
                <span className="text-[#C9A227]">
                  Answer second.
                </span>
              </h1>

              <p className="font-sans text-[16px] sm:text-[18px] text-[#8C8A94] max-w-[490px] leading-relaxed">
                Meridas answers only from the procedures you ingested. If two versions disagree, it refuses. A person declares which version stays, and the next answer leaves the other one out.
              </p>
            </motion.div>

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
                    className="flex items-center gap-3 rounded-[10px] border border-[#C9A227]/25 bg-[#1C1B20] p-3"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-[6px] bg-[#151417]">
                      <Icon className="size-4 text-[#C9A227]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-sans text-[13px] font-semibold leading-tight text-[#F7F3EA]">
                        {spec.label}
                      </div>
                      <div className="font-sans text-[13px] text-[#B7B4BE] leading-snug">
                        {spec.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="flex items-center gap-4 pt-2"
            >
              <Link
                href={href}
                className="whitespace-nowrap rounded-[8px] border border-[#C9A227] bg-[#9E1B32] px-5 py-3 font-sans text-xs font-bold uppercase tracking-wide text-[#F7F3EA] shadow-lg shadow-[#9E1B32]/25 transition-colors hover:bg-[#BA243F] sm:px-7 sm:py-3.5 sm:tracking-wider"
              >
                {label}
              </Link>
            </motion.div>
          </div>

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

      <div className="absolute inset-x-0 bottom-0 h-px bg-[#C9A227]/30" />
    </section>
  );
}

"use client";

import { Bot, Send, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "./SectionHeading";

const messages = [
  {
    role: "user" as const,
    text: "Can an engineer retain a testing laptop for 21 days during the remote site audit?",
    time: "10:14 AM",
  },
  {
    role: "assistant" as const,
    text: "No. Under POL-OPS-2026-001 (Section 1), no hardware asset may be retained on temporary loan for more than fifteen (15) continuous calendar days. On day 15, the asset must be physically presented to Johan Vasquez at the central warehouse.",
    time: "10:14 AM",
  },
  {
    role: "user" as const,
    text: "Is there an exception process for field audits?",
    time: "10:15 AM",
  },
  {
    role: "assistant" as const,
    text: "Yes. Extensions require prior written approval from the IT Operations Directorate or Lead Systems Custodian (Johan Vasquez) before the 15-day expiration date.",
    time: "10:15 AM",
  },
];

export function ChatMockup() {
  const sectionRef = useRef<HTMLElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  // Trigger animation when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  // Stagger messages appearing one by one
  useEffect(() => {
    if (!hasStarted) return;
    if (visibleCount >= messages.length) return;

    const delay = visibleCount === 0 ? 300 : 800;
    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [hasStarted, visibleCount]);

  // Auto-scroll chat container as messages appear
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [visibleCount]);

  return (
    <section ref={sectionRef} className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="AI That Actually"
          highlight="Understands"
          subtitle="Watch how MERIDAS validates operational inquiries against authoritative enterprise knowledge."
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Chat window */}
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card/40 shadow-2xl shadow-[#9E1B32]/10 backdrop-blur-md">
            {/* Highlight gradient */}
            <div className="absolute inset-x-0 -top-px mx-auto h-1 w-2/3 rounded-t-2xl bg-gradient-to-r from-[#9E1B32] via-[#C9A227] to-transparent blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute inset-x-0 -top-px mx-auto h-[2px] w-2/3 rounded-t-2xl bg-gradient-to-r from-[#9E1B32] to-[#C9A227] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <span className="size-3 rounded-full bg-red-500" />
                  <span className="size-3 rounded-full bg-yellow-500" />
                  <span className="size-3 rounded-full bg-green-500" />
                </div>
                <span className="text-sm text-muted-foreground">Support Chat</span>
              </div>
              <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-600 dark:text-green-400">
                <span className="mr-1">•</span> AI Active
              </span>
            </div>

            {/* Scrollable chat body */}
            <div
              ref={chatContainerRef}
              className="h-[420px] space-y-6 overflow-y-auto scroll-smooth p-6 md:p-8 chat-scrollbar"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(201, 162, 39, 0.4) transparent",
              }}
            >
              {messages.slice(0, visibleCount).map((message, i) => {
                const isUser = message.role === "user";
                return (
                  <div
                    key={`${message.role}-${message.time}-${i}`}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div
                      className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                    >
                      {!isUser && (
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#2A2832] bg-[#151417] text-[#C9A227] shadow-sm">
                          <Bot className="size-4" />
                        </span>
                      )}
                      <div className={`max-w-md ${isUser ? "text-right" : ""}`}>
                        <div
                          className={`rounded-2xl px-4 py-3 text-left text-sm leading-relaxed ${
                            isUser
                              ? "bg-[#9E1B32] text-[#F7F3EA] shadow-md shadow-[#9E1B32]/20 font-medium"
                              : "border border-[#2A2832] bg-[#1C1B20] text-[#F7F3EA]"
                          }`}
                        >
                          {message.text}
                        </div>
                        <p className="mt-1.5 text-xs text-[#8C8A94]">{message.time}</p>
                      </div>
                      {isUser && (
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#2A2832] bg-[#151417] text-[#F7F3EA]">
                          <UserRound className="size-4 text-[#8C8A94]" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator while messages still loading */}
              {hasStarted && visibleCount < messages.length && (
                <div className="flex items-start gap-3 animate-fade-in-up">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#2A2832] bg-[#151417] text-[#C9A227]">
                    <Bot className="size-4" />
                  </span>
                  <div className="rounded-2xl border border-[#2A2832] bg-[#1C1B20] px-4 py-3">
                    <div className="flex gap-1">
                      <span className="size-2 animate-bounce rounded-full bg-[#C9A227]" style={{ animationDelay: "0ms" }} />
                      <span className="size-2 animate-bounce rounded-full bg-[#C9A227]" style={{ animationDelay: "150ms" }} />
                      <span className="size-2 animate-bounce rounded-full bg-[#C9A227]" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-[#2A2832] p-4 bg-[#151417]">
              <div className="flex items-center gap-3 rounded-xl border border-[#2A2832] bg-[#1C1B20] px-4 py-2.5 text-[#8C8A94]">
                <span className="flex-1 text-xs">Ask a question about operational policies...</span>
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#9E1B32] text-[#F7F3EA] transition-transform hover:scale-105 shadow-md shadow-[#9E1B32]/20">
                  <Send className="size-3.5 text-[#F7F3EA]" />
                </span>
              </div>
            </div>
          </div>

          {/* View Dashboard CTA */}
          <div className="mt-6 flex justify-end">
            <Link
              href="/dashboard/chat"
              className="group inline-flex items-center gap-2 rounded-lg bg-[#9E1B32] hover:bg-[#BA243F] border border-[#C9A227]/40 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#F7F3EA] shadow-lg shadow-[#9E1B32]/25 transition-all active:scale-95"
            >
              Open AI Chat Assistant
              <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

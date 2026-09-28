"use client";

import { UserButton } from "@clerk/nextjs";
import { ArrowLeft, Check, Clock, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TRIAL_DAYS_TOTAL = 14;
const TRIAL_DAYS_REMAINING = 14;

const plans = [
  {
    name: "Standard Grounding",
    price: "$49",
    period: "/month",
    description: "For teams requiring evidence-backed support",
    features: [
      "5 Knowledge Vault documents",
      "1,000 Verified queries/month",
      "1 Operations seat",
      "Standard email support",
      "Sub-sentence citation engine",
    ],
    cta: "Subscribe to Standard",
    highlighted: false,
    href: "/checkout?plan=basic"
  },
  {
    name: "Enterprise Intelligence",
    price: "$99",
    period: "/month",
    description: "For scaling operations & strict SLA compliance",
    features: [
      "Unlimited Knowledge Vault documents",
      "10,000 Verified queries/month",
      "10 Operations seats",
      "Priority SLA support",
      "Low-Latency ElevenLabs Voice",
      "Custom vector namespace",
      "Evidence Analytics dashboard",
    ],
    cta: "Subscribe to Enterprise",
    highlighted: true,
    href: "/checkout?plan=pro"
  },
];

export default function BillingPage() {
  const trialProgress =
    ((TRIAL_DAYS_TOTAL - TRIAL_DAYS_REMAINING) / TRIAL_DAYS_TOTAL) * 100;

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-[#9E1B32]/30">
      {/* Top bar */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card/60 px-6 backdrop-blur-xl sticky top-0 z-50">
        <Link
          href="/dashboard/chat"
          className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 text-[#C9A227]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#F7F3EA]">Back to Dashboard</span>
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-8 border-2 border-[#C9A227]/60 rounded-[8px]",
            },
          }}
        />
      </header>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* Trial status */}
        <section className="group relative mb-12 rounded-[16px] border border-border bg-card/70 p-8 shadow-2xl overflow-hidden">
          <div className="flex items-start gap-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-[12px] bg-[#9E1B32]/15 border border-[#C9A227]/30">
              <Clock className="size-6 text-[#C9A227]" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                    Sovereign Trial Active
                  </h2>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {TRIAL_DAYS_REMAINING} days remaining out of {TRIAL_DAYS_TOTAL}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9E1B32] to-[#C9A227] transition-all duration-700 ease-out"
                  style={{ width: `${trialProgress || 10}%` }}
                />
              </div>
              <p className="text-[12px] font-sans text-muted-foreground leading-relaxed max-w-md">
                Your trial includes full access to Enterprise Intelligence features, including sub-sentence evidence citations and voice capabilities.
              </p>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-[#F7F3EA]">
              Choose Your Operations Plan
            </h2>
            <p className="text-sm text-muted-foreground font-mono">
              Evidence first. Answer second. Scale with complete confidence.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  "group relative flex flex-col rounded-[16px] border p-8 transition-all duration-300 shadow-xl",
                  plan.highlighted
                    ? "border-[#C9A227] bg-[#1C1B20] shadow-[0_0_50px_-12px_rgba(158,27,50,0.25)] ring-1 ring-[#C9A227]/30"
                    : "border-border bg-card hover:border-[#C9A227]/40"
                )}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#9E1B32] border border-[#C9A227] font-mono text-[10px] uppercase tracking-wider text-[#F7F3EA] font-bold shadow-md">
                    RECOMMENDED
                  </div>
                )}

                <div className="mb-8 space-y-3">
                  <h3 className="text-2xl font-bold text-[#F7F3EA]">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-sans">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground uppercase">{plan.period}</span>
                  </div>
                </div>

                <ul className="mb-10 flex-1 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <Check
                        className="size-4 shrink-0 mt-0.5 text-[#C9A227]"
                      />
                      <span className="text-[13px] font-sans text-[#F7F3EA]/90">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-[8px] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-all active:scale-95",
                    plan.highlighted
                      ? "bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] border border-[#C9A227]/50 shadow-lg shadow-[#9E1B32]/30"
                      : "border border-border bg-muted text-foreground hover:bg-[#1C1B20] hover:border-[#C9A227]/40"
                  )}
                >
                  <Zap className="size-3.5 text-[#C9A227]" />
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Footer info */}
        <div className="mt-16 pt-8 border-t border-border text-center flex items-center justify-center gap-2">
          <ShieldCheck className="size-4 text-[#C9A227]" />
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Enterprise Grade Security · PCI DSS & SOC 2 Ready
          </p>
        </div>
      </div>
    </div>
  );
}

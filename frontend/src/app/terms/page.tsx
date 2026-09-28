"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, Scale } from "lucide-react";
import { MeridasLogo } from "@/components/brand/MeridasLogo";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#151417] text-[#F7F3EA] font-sans selection:bg-[#9E1B32]/40 selection:text-[#F7F3EA]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#151417]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <MeridasLogo size="sm" withTagline={false} />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 font-mono text-xs text-[#8C8A94] hover:text-[#F7F3EA] transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Return to Platform</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-3 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 font-mono text-xs text-[#C9A227] uppercase tracking-widest font-semibold">
            <Scale className="size-4" />
            <span>Governance & Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F3EA]">
            Terms of Use
          </h1>
          <p className="font-mono text-xs text-[#8C8A94]">
            Effective Date: 2026 Operational Period · Status: Active
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">1.0</span> License Grant
          </h2>
          <p className="text-sm text-[#8C8A94] leading-relaxed font-sans">
            Access to the MERIDAS platform is granted on a limited, revocable, non-exclusive, and non-transferable basis strictly for authorized operational intelligence, evidence verification, and documentation query purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">2.0</span> Acceptable Use
          </h2>
          <div className="space-y-3 text-sm text-[#8C8A94] leading-relaxed">
            <p>
              Authorized operators may query ingested repositories, inspect atomic claim entailment, verify passage provenance, and adjudicate cross-directive conflicts.
            </p>
            <p className="font-semibold text-[#F7F3EA]">Prohibited activities include:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs font-mono text-[#8C8A94]">
              <li>Attempting to bypass role-based access control (RBAC), tenant isolation, or rate limits.</li>
              <li>Performing automated high-concurrency scraping, denial-of-service, or prompt injection attacks.</li>
              <li>Using the system to generate deceptive, harmful, or ungrounded operational mandates.</li>
              <li>Reverse-engineering backend APIs, client-side bundles, or proprietary entailment verification algorithms.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">3.0</span> Intellectual Property
          </h2>
          <p className="text-sm text-[#8C8A94] leading-relaxed">
            The architecture, proprietary verification pipelines, UI/UX designs, trademarks, logos, and software code of MERIDAS are the exclusive intellectual property of the platform developers and their respective open-source licensors.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">4.0</span> System Availability & Disclaimer
          </h2>
          <p className="text-sm text-[#8C8A94] leading-relaxed">
            MERIDAS provides evidence-based analysis and algorithmic entailment checks on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While the system enforces rigorous tri-state decision gating (<code>SUPPORTED</code>, <code>CONDITIONAL</code>, <code>CANNOT_ESTABLISH</code>), operational decisions and infrastructure modifications remain subject to human verification and approval.
          </p>
        </section>

        <div className="border-t border-white/10 pt-8 flex items-center justify-between text-xs font-mono text-[#8C8A94]">
          <span>Operational Evidence Intelligence</span>
          <Link href="/privacy" className="text-[#C9A227] hover:underline">
            View Privacy Policy →
          </Link>
        </div>
      </main>
    </div>
  );
}

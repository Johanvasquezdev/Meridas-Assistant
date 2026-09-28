"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, EyeOff, CheckCircle2 } from "lucide-react";
import { MeridasLogo } from "@/components/brand/MeridasLogo";

export default function PrivacyPage() {
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
            <Shield className="size-4" />
            <span>Privacy & Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F3EA]">
            Privacy Policy
          </h1>
          <p className="font-mono text-xs text-[#8C8A94]">
            Effective Date: 2026 Operational Period · Status: Active
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">1.0</span> Strict Data Minimization
          </h2>
          <p className="text-sm text-[#8C8A94] leading-relaxed font-sans">
            MERIDAS collects and stores only the data strictly necessary for operational authentication, retrieval indexing, and immutable auditability:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs font-mono text-[#8C8A94]">
            <li>Operator identity (email, unique user identifier, role).</li>
            <li>Ingested documentation and extracted passage vectors.</li>
            <li>Interaction timestamps, claim verification scores, and conflict resolution records.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">2.0</span> Zero Data Commercialization
          </h2>
          <p className="text-sm text-[#8C8A94] leading-relaxed font-sans">
            User queries, internal documentation, operational directives, and interaction metrics are never sold, rented, monetized, or shared with third parties for advertising or unauthorized commercial tracking.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">3.0</span> Zero-Leakage & API Sanitization
          </h2>
          <div className="space-y-3 text-sm text-[#8C8A94] leading-relaxed">
            <p>
              To ensure confidentiality when interfacing with external model providers:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs font-mono text-[#8C8A94]">
              <li>
                <strong>Automated Payload Scrubbing:</strong> Internal RFC 1918 IPv4 addresses, hardware MAC addresses, bearer tokens, and cryptographic secrets are sanitized and redacted prior to external model dispatch.
              </li>
              <li>
                <strong>No Model Training:</strong> Customer queries and proprietary operational documentation are never utilized to train public, multi-tenant, or third-party AI models.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">4.0</span> Cryptography & Custody
          </h2>
          <div className="space-y-2 text-sm text-[#8C8A94] leading-relaxed">
            <p>
              <strong>In Transit:</strong> All communications between client, server, and vector infrastructure are strictly encrypted using TLS 1.3 / HTTPS.
            </p>
            <p>
              <strong>At Rest:</strong> Relational database storage, vector embeddings, and audit ledgers are secured using industry-standard AES-256 encryption.
            </p>
            <p>
              <strong>Audit Integrity:</strong> Critical human adjudications and policy overrides are recorded with tamper-evident SHA-256 cryptographic hashes.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#F7F3EA] flex items-center gap-2">
            <span className="text-[#C9A227] font-mono">5.0</span> AI Transparency & Human Agency
          </h2>
          <div className="space-y-2 text-sm text-[#8C8A94] leading-relaxed">
            <p>
              The platform visibly and permanently discloses that operational answers, claim evaluations, and entailment scores are generated by algorithmic intelligence. Conflict resolution, policy overrides, and authority declarations mandate explicit human adjudication.
            </p>
          </div>
        </section>

        <div className="border-t border-white/10 pt-8 flex items-center justify-between text-xs font-mono text-[#8C8A94]">
          <span>Operational Evidence Intelligence</span>
          <Link href="/terms" className="text-[#C9A227] hover:underline">
            View Terms of Use →
          </Link>
        </div>
      </main>
    </div>
  );
}

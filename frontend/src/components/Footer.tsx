"use client";

import Link from "next/link";
import { MeridasLogo } from "./brand/MeridasLogo";

const platformLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Documentation", href: "/docs" },
];

const governanceLinks = [
  { label: "Terms of Use", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Security & Trust", href: "/#security" },
  { label: "Conflict Desk", href: "/dashboard/conflicts" },
];

export function Footer() {
  return (
    <footer id="footer" className="bg-[#151417] py-[100px] border-t border-[#2A2832] font-sans">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Logo & Copyright (6 columns) */}
          <div className="md:col-span-6 space-y-6">
            <Link href="/" className="inline-block">
              <MeridasLogo size="sm" withTagline={true} />
            </Link>
            <div className="space-y-3">
              <p className="font-sans text-[13px] text-[#8C8A94] max-w-[400px] leading-relaxed">
                MERIDAS is an AI support intelligence platform grounded in corporate truth.
                Citations aren&apos;t decoration — they&apos;re a requirement for an answer to be trusted.
              </p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#C9A227] animate-pulse" />
                  <span className="font-sans text-[11px] text-[#8C8A94] uppercase tracking-wider">
                    AI Assistant Active
                  </span>
                </div>
                <span className="text-[#2A2832]">|</span>
                <span className="font-sans text-[11px] text-[#8C8A94]">
                  © 2026 MERIDAS. All rights reserved.
                </span>
              </div>
            </div>
          </div>

          {/* Links (6 columns) */}
          <div className="md:col-span-6 grid grid-cols-2 gap-8 lg:pl-16 font-sans">
            <div className="space-y-4">
              <h4 className="font-sans text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Platform
              </h4>
              <ul className="space-y-2.5">
                {platformLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="font-sans text-[13px] text-[#8C8A94] hover:text-[#F7F3EA] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-sans text-[11px] font-bold text-[#C9A227] uppercase tracking-wider">
                Governance
              </h4>
              <ul className="space-y-2.5">
                {governanceLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="font-sans text-[13px] text-[#8C8A94] hover:text-[#F7F3EA] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

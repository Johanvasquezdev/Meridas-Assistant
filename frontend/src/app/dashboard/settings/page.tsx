"use client";

import Link from "next/link";
import { UserProfile, useUser } from "@clerk/nextjs";
import { Check, Copy, Key, Mail, RefreshCw, Shield, Lock, Compass, ArrowRight } from "lucide-react";
import { useState } from "react";
import { clerkUserProfileAppearance } from "@/lib/clerk-appearance";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { user } = useUser();
  const [apiKey] = useState("mrd_live_8f3b299ae71a45cd90bc");
  const [copied, setCopied] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      
      {/* Account Section */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Mail className="size-4 text-[#C9A227]" />
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#F7F3EA]">
            Operational Custodian Account
          </h3>
        </div>
        <div className="space-y-4 rounded-[16px] border border-[#2A2832] bg-[#1C1B20] p-6 shadow-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[#8C8A94]">Email Address</label>
              <p className="font-sans text-sm font-medium text-[#F7F3EA]">
                {user?.primaryEmailAddress?.emailAddress ?? "-"}
              </p>
            </div>
            <div className="space-y-1">
              <label className="font-mono text-[11px] uppercase tracking-wider text-[#8C8A94]">Custodian Name</label>
              <p className="font-sans text-sm font-medium text-[#F7F3EA]">
                {user?.fullName ?? "-"}
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-[#2A2832]">
            <button
              type="button"
              onClick={() => setShowProfile((value) => !value)}
              className="font-mono text-xs text-[#C9A227] hover:text-[#DFB943] transition-colors"
            >
              {showProfile ? "Hide Profile Security Configuration" : "Manage Account, Passkeys & Credentials →"}
            </button>
          </div>
        </div>
      </section>

      {showProfile ? (
        <section className="overflow-hidden rounded-[16px] border border-[#2A2832] shadow-2xl">
          <UserProfile appearance={clerkUserProfileAppearance} />
        </section>
      ) : null}

      {/* Programmatic API Key */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Key className="size-4 text-[#C9A227]" />
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#F7F3EA]">
            Enterprise Ingress API Key
          </h3>
        </div>
        <div className="space-y-4 rounded-[16px] border border-[#2A2832] bg-[#1C1B20] p-6 shadow-xl">
          <p className="font-sans text-xs text-[#8C8A94] leading-relaxed">
            Use this cryptographic token to authenticate programmatic operational requests to your Meridas instance.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-[10px] border border-[#2A2832] bg-[#151417] px-4 py-2.5 font-mono text-xs text-[#F7F3EA] select-all">
              {apiKey}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                "flex size-10 items-center justify-center rounded-[8px] border border-[#2A2832] bg-[#151417] text-[#F7F3EA] transition-all hover:border-[#C9A227]/40 hover:text-[#C9A227]",
                copied && "border-[#C9A227] text-[#C9A227]",
              )}
              title="Copy API key"
            >
              {copied ? <Check className="size-4 text-[#C9A227]" /> : <Copy className="size-4" />}
            </button>
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-[8px] border border-[#2A2832] bg-[#151417] text-[#8C8A94] transition-all hover:border-[#C9A227]/40 hover:text-[#F7F3EA]"
              title="Rotate Ingress Key"
            >
              <RefreshCw className="size-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#8C8A94]">
            <Lock className="size-3 text-[#C9A227]" />
            <span>Authorized for authenticated Bearer and x-api-key headers only. Never commit to public repositories.</span>
          </div>
        </div>
      </section>

      {/* Embeddable Intelligence Widget */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-[#C9A227]" />
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#F7F3EA]">
            Website Chat Widget
          </h3>
        </div>
        <div className="space-y-4 rounded-[16px] border border-[#2A2832] bg-[#1C1B20] p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-sans text-sm font-bold text-[#F7F3EA]">Meridas assistant</h4>
              <p className="font-sans text-xs text-[#8C8A94] leading-relaxed max-w-xl">
                Add the Meridas assistant to your company website, intranet, or portal. Customize the theme, greeting, and launcher position.
              </p>
            </div>
            <Link
              href="/dashboard/settings/widget"
              className="flex items-center justify-center gap-2 rounded-[8px] bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] border border-[#C9A227]/40 px-4 py-2.5 text-xs font-sans font-bold uppercase tracking-wider transition-all whitespace-nowrap shadow-md shadow-[#9E1B32]/20"
            >
              <span>Configure Widget</span>
              <ArrowRight className="size-3.5 text-[#C9A227]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Security Architecture */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-[#C9A227]" />
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#F7F3EA]">
            Security &amp; Data Protection
          </h3>
        </div>
        <div className="space-y-3 rounded-[16px] border border-[#2A2832] bg-[#1C1B20] p-6 shadow-xl">
          {[
            ["User Authentication", "Secure SSO / Login Protection"],
            ["API Key Security", "Encrypted & Hashed Server-Side"],
            ["Workspace Privacy", "Strict Data Isolation per Company"],
            ["Sensitive Data Masking", "Automatic IP & MAC Redaction Enabled"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-1">
              <span className="font-sans text-xs text-[#8C8A94]">{label}</span>
              <span className="rounded-[6px] border border-[#C9A227]/30 bg-[#C9A227]/10 px-2.5 py-1 font-sans text-[11px] font-semibold text-[#C9A227]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

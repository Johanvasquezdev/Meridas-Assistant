"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { MeridasLogo } from "@/components/brand/MeridasLogo";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security & Trust", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#2A2832] bg-[#151417]/90 backdrop-blur-md">
      <div className="mx-auto max-w-[1240px] px-6">
        <div className="flex h-18 items-center justify-between">
          <Link href="/" className="flex items-center">
            <MeridasLogo size="sm" withTagline={true} />
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-sans text-xs uppercase tracking-wider text-[#8C8A94] transition-colors hover:text-[#C9A227]"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden items-center gap-4 md:flex">
              <span className="font-sans text-xs text-[#8C8A94] uppercase tracking-wider cursor-pointer hover:text-[#C9A227] transition-colors">
                EN
              </span>
              <div className="h-4 w-px bg-[#2A2832]" />
            </div>

            {isLoaded && !isSignedIn && (
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="font-sans text-xs font-semibold uppercase tracking-wider text-[#F7F3EA] hover:text-[#C9A227] px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="font-sans text-xs font-bold uppercase tracking-wider text-[#F7F3EA] bg-[#9E1B32] hover:bg-[#BA243F] border border-[#C9A227]/40 px-5 py-2.5 rounded-[8px] shadow-lg shadow-[#9E1B32]/25 transition-all"
                >
                  Start Free Trial
                </Link>
              </div>
            )}

            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/chat"
                  className="font-sans text-xs font-bold uppercase tracking-wider text-[#F7F3EA] bg-[#9E1B32] hover:bg-[#BA243F] border border-[#C9A227]/40 px-5 py-2.5 rounded-[8px] shadow-lg shadow-[#9E1B32]/25 transition-all"
                >
                  Dashboard
                </Link>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "size-8 border border-[#C9A227]/40 rounded-[6px]",
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

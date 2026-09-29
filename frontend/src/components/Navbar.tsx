"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { MeridasLogo } from "@/components/brand/MeridasLogo";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Security & Trust", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const href = isLoaded && isSignedIn ? "/dashboard/conflicts" : "/sign-in";
  const label = isLoaded && isSignedIn ? "Access console" : "Sign in";

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#C9A227]/25 bg-[#151417]/90 backdrop-blur-md">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-18">
          <Link href="/" className="flex min-w-0 items-center" onClick={() => setOpen(false)}>
            <MeridasLogo size="sm" withTagline={true} taglineClassName="hidden sm:block" />
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

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            {mounted && isLoaded && (
              <Link
                href={href}
                className="whitespace-nowrap rounded-[8px] border border-[#C9A227] bg-[#9E1B32] px-2.5 py-2 font-sans text-[10px] font-bold uppercase tracking-wide text-[#F7F3EA] shadow-lg shadow-[#9E1B32]/25 transition-colors hover:bg-[#BA243F] sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-wider"
              >
                {label}
              </Link>
            )}

            {mounted && isLoaded && isSignedIn && (
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-8 border border-[#C9A227]/40 rounded-[6px]",
                  },
                }}
              />
            )}

            <button
              type="button"
              className="inline-flex size-9 items-center justify-center text-[#F7F3EA] md:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#C9A227]/25 bg-[#151417] px-6 py-4 md:hidden">
          <div className="flex flex-col">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-3 font-sans text-sm uppercase tracking-wider text-[#F7F3EA]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

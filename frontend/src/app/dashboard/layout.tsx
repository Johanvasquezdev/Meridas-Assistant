"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { clerkUserProfileAppearance } from "@/lib/clerk-appearance";
import {
  MessageSquare,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  BarChart3,
  Search,
  Code,
  Laptop,
  Plus,
  ShieldCheck,
  Scale,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { MeridasIcon } from "@/components/brand/MeridasLogo";

const sidebarLinks = [
  { label: "Assistant", href: "/dashboard/chat", icon: MessageSquare },
  { label: "Knowledge Vault", href: "/dashboard/documents", icon: FileText },
  { label: "Conflict Desk", href: "/dashboard/conflicts", icon: Scale },
  { label: "Evidence Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "API Governance", href: "/dashboard/api-reference", icon: Code },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useUser();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutLabel] = useState(() =>
    typeof navigator !== "undefined" &&
    navigator.platform.toLowerCase().includes("mac")
      ? "⌘K"
      : "Ctrl+K",
  );

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-background font-sans text-foreground transition-colors duration-300">
      <div className="flex flex-1 overflow-hidden">
        {mobileOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
        )}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 flex w-[min(18rem,88vw)] flex-col border-r border-border bg-[#151417] transition-transform duration-300 md:relative md:inset-auto md:z-20 md:w-64 md:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
            collapsed && "md:w-20"
          )}
        >
          <div className="flex h-16 items-center gap-3 border-b border-border/60 px-5 sm:h-18">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <MeridasIcon size={collapsed && !mobileOpen ? 32 : 36} />
              {(!collapsed || mobileOpen) && (
                <div className="flex min-w-0 flex-col">
                  <span className="text-sm font-bold tracking-[0.2em] text-[#F7F3EA] uppercase leading-none font-sans">
                    MERIDAS
                  </span>
                  <span className="font-sans text-[10px] text-[#C9A227] tracking-wider mt-1 font-medium">
                    Support Intelligence
                  </span>
                </div>
              )}
            </Link>
            <button
              type="button"
              className="ml-auto inline-flex size-8 shrink-0 items-center justify-center text-[#8C8A94] md:hidden"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <X className="size-4" />
            </button>
          </div>

          {/* New Chat Quick Action */}
          <div className="px-3 pt-4 pb-2">
            <Link
              href="/dashboard/chat"
              className={cn(
                "flex items-center justify-center gap-2 rounded-[10px] bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] border border-[#C9A227]/40 py-2.5 px-3 text-xs font-semibold tracking-wide shadow-md shadow-[#9E1B32]/25 transition-all font-sans",
                collapsed && !mobileOpen && "px-0 md:px-0"
              )}
            >
              <Plus className="size-4 shrink-0 text-[#C9A227]" />
              {(!collapsed || mobileOpen) && <span>New Inquiry</span>}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto chat-scrollbar font-sans">
            {sidebarLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-xs font-medium transition-all font-sans",
                    isActive
                      ? "bg-[#9E1B32]/15 text-[#F7F3EA] border-l-2 border-[#C9A227] font-semibold"
                      : "text-[#8C8A94] hover:bg-[#1C1B20] hover:text-[#F7F3EA]"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4.5 shrink-0 transition-transform group-hover:scale-110",
                      isActive ? "text-[#C9A227]" : "text-[#8C8A94]"
                    )}
                  />
                  {(!collapsed || mobileOpen) && <span className="tracking-wide font-sans">{link.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Search Shortcut */}
          <div className="border-t border-border px-3 py-2 font-sans">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "flex w-full items-center rounded-[8px] px-3 py-2 text-xs font-medium text-[#8C8A94] transition-colors hover:bg-[#1C1B20] hover:text-[#F7F3EA]",
                collapsed && !mobileOpen ? "justify-center" : "justify-between"
              )}
              aria-label="Open search"
            >
              <span className="flex items-center gap-2.5">
                <Search className="size-4 shrink-0" />
                {(!collapsed || mobileOpen) && <span>Search Policies</span>}
              </span>
              {(!collapsed || mobileOpen) && (
                <span className="font-sans text-[10px] font-medium text-[#C9A227] bg-[#1C1B20] px-1.5 py-0.5 rounded border border-border">
                  {shortcutLabel}
                </span>
              )}
            </button>
          </div>

          {/* Grounded Status Banner */}
          {(!collapsed || mobileOpen) && (
            <div className="mx-3 my-2 rounded-[12px] border border-[#C9A227]/40 bg-[#F6F1E6] p-3.5 font-sans shadow-sm dark:border-[#C9A227]/30 dark:bg-gradient-to-b dark:from-[#1C1B20] dark:to-[#151417] dark:shadow-lg">
              <div className="mb-1.5 flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#7A6112] dark:text-[#C9A227]" />
                <span className="font-sans text-xs font-semibold text-[#151417] dark:text-[#F7F3EA]">
                  Verified Documents
                </span>
              </div>
              <p className="mb-2.5 font-sans text-[11px] leading-relaxed text-[#5E5C66] dark:text-[#8C8A94]">
                A superseded version stays out of the next answer.
              </p>
              <Link
                href="/dashboard/conflicts"
                onClick={() => setMobileOpen(false)}
                className="block rounded-[6px] border border-[#C9A227]/50 bg-[#9E1B32] px-3 py-1.5 text-center font-sans text-xs font-medium text-[#F7F3EA] transition-all hover:bg-[#BA243F] dark:border-[#C9A227]/40 dark:bg-[#9E1B32]/30 dark:text-[#C9A227] dark:hover:bg-[#9E1B32]/50"
              >
                Open the conflict desk
              </Link>
            </div>
          )}

          {/* User Profile */}
          <div className="border-t border-border px-3 py-3 font-sans">
            <div className={cn(
              "flex items-center gap-2.5 rounded-[8px] px-1",
              collapsed && !mobileOpen ? "justify-center" : "min-w-0"
            )}>
              <div className="shrink-0 [&_.cl-userButtonBox]:!w-auto [&_.cl-userButtonTrigger]:!w-auto [&_.cl-userButtonOuterIdentifier]:!hidden">
                <UserButton
                  userProfileProps={{
                    appearance: clerkUserProfileAppearance,
                  }}
                  appearance={{
                    elements: {
                      rootBox: "shrink-0",
                      userButtonBox: "w-auto shrink-0",
                      userButtonTrigger: "w-auto shrink-0 p-0",
                      userButtonOuterIdentifier: "hidden",
                      avatarBox:
                        "size-8 border-2 border-[#C9A227]/60 rounded-full",
                    },
                  }}
                />
              </div>
              {(!collapsed || mobileOpen) && (
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 font-sans">
                  <p className="truncate text-[13px] font-semibold leading-4 text-[#F7F3EA]">
                    {user?.fullName || "Operator"}
                  </p>
                  <p className="truncate text-[11px] leading-4 text-[#8C8A94]">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="hidden border-t border-border px-3 py-2 font-sans md:block">
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="flex w-full items-center justify-center gap-2 rounded-[6px] px-3 py-1.5 text-[#8C8A94] transition-colors hover:bg-[#1C1B20] hover:text-[#F7F3EA]"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <>
                  <ChevronLeft className="size-4" />
                  <span className="text-xs font-medium font-sans">
                    Collapse
                  </span>
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-background font-sans">
          {/* Top bar */}
          <header className="flex h-14 items-center justify-between border-b border-border bg-[#151417]/90 px-4 backdrop-blur-xl md:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                className="inline-flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-border text-[#F7F3EA] md:hidden"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="size-4" />
              </button>
              <h2 className="truncate text-sm font-semibold tracking-wide text-[#F7F3EA] font-sans">
                {sidebarLinks.find(
                  (l) => pathname === l.href || pathname.startsWith(l.href + "/")
                )?.label ?? "Dashboard"}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(isDark ? "light" : "dark")}
                  className="flex size-8 shrink-0 items-center justify-center rounded-[8px] border border-border text-[#8C8A94] transition-all hover:bg-[#1C1B20] hover:text-[#F7F3EA] active:scale-95"
                  aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDark ? (
                    <Sun className="size-4 text-[#C9A227]" />
                  ) : (
                    <Moon className="size-4" />
                  )}
                </button>
              )}
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 flex flex-col min-h-0 relative">
            {children}
          </main>
        </div>
      </div>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}

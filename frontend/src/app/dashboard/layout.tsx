"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { clerkUserProfileAppearance } from "@/lib/clerk-appearance";
import {
  MessageSquare,
  Settings,
  CreditCard,
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
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { MeridasIcon } from "@/components/brand/MeridasLogo";

const sidebarLinks = [
  { label: "AI Chat Assistant", href: "/dashboard/chat", icon: MessageSquare },
  { label: "Knowledge Vault", href: "/dashboard/documents", icon: FileText },
  { label: "Conflict Desk", href: "/dashboard/conflicts", icon: Scale },
  { label: "Evidence Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "API Governance", href: "/dashboard/api-reference", icon: Code },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Billing & Plans", href: "/billing", icon: CreditCard },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
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
        {/* Sidebar */}
        <aside
          className={cn(
            "relative flex flex-col border-r border-border bg-[#151417] transition-all duration-300 z-20",
            collapsed ? "w-20" : "w-64"
          )}
        >
          {/* Sidebar Logo */}
          <div className="flex h-18 items-center px-5 border-b border-border/60">
            <Link href="/" className="flex items-center gap-3">
              <MeridasIcon size={collapsed ? 32 : 36} />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-[0.2em] text-[#F7F3EA] uppercase leading-none font-sans">
                    MERIDAS
                  </span>
                  <span className="font-sans text-[10px] text-[#C9A227] tracking-wider mt-1 font-medium">
                    Support Intelligence
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* New Chat Quick Action */}
          <div className="px-3 pt-4 pb-2">
            <Link
              href="/dashboard/chat"
              className={cn(
                "flex items-center justify-center gap-2 rounded-[10px] bg-[#9E1B32] hover:bg-[#BA243F] text-[#F7F3EA] border border-[#C9A227]/40 py-2.5 px-3 text-xs font-semibold tracking-wide shadow-md shadow-[#9E1B32]/25 transition-all font-sans",
                collapsed && "px-0"
              )}
            >
              <Plus className="size-4 shrink-0 text-[#C9A227]" />
              {!collapsed && <span>New Inquiry</span>}
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
                  {!collapsed && <span className="tracking-wide font-sans">{link.label}</span>}
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
                collapsed ? "justify-center" : "justify-between"
              )}
              aria-label="Open search"
            >
              <span className="flex items-center gap-2.5">
                <Search className="size-4 shrink-0" />
                {!collapsed && <span>Search Policies</span>}
              </span>
              {!collapsed && (
                <span className="font-sans text-[10px] font-medium text-[#C9A227] bg-[#1C1B20] px-1.5 py-0.5 rounded border border-border">
                  {shortcutLabel}
                </span>
              )}
            </button>
          </div>

          {/* Grounded Status Banner */}
          {!collapsed && (
            <div className="mx-3 my-2 p-3.5 rounded-[12px] bg-gradient-to-b from-[#1C1B20] to-[#151417] border border-[#C9A227]/30 shadow-lg font-sans">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="size-4 text-[#C9A227]" />
                <span className="font-sans text-xs font-semibold text-[#F7F3EA]">
                  Verified Documents
                </span>
              </div>
              <p className="text-[11px] text-[#8C8A94] leading-relaxed mb-2.5 font-sans">
                Every response is cross-checked against official company guidelines.
              </p>
              <Link
                href="/billing"
                className="block text-center py-1.5 px-3 rounded-[6px] bg-[#9E1B32]/30 hover:bg-[#9E1B32]/50 border border-[#C9A227]/40 text-xs font-sans text-[#C9A227] font-medium transition-all"
              >
                View Plans & Usage
              </Link>
            </div>
          )}

          {/* User Profile */}
          <div className="border-t border-border px-3 py-3 font-sans">
            <div className={cn(
              "flex items-center gap-3 rounded-[8px] px-2 py-1.5",
              collapsed ? "justify-center" : "justify-start"
            )}>
              <UserButton
                userProfileProps={{
                  appearance: clerkUserProfileAppearance,
                }}
                appearance={{
                  elements: {
                    avatarBox:
                      "size-8 border-2 border-[#C9A227]/60 rounded-[8px]",
                  },
                }}
              />
              {!collapsed && (
                <div className="flex flex-col min-w-0 overflow-hidden font-sans">
                  <p className="text-xs font-bold text-[#F7F3EA] leading-snug">
                    {user?.fullName || "Operator"}
                  </p>
                  <p className="text-[10px] text-[#8C8A94] truncate leading-tight mt-0.5">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Collapse toggle */}
          <div className="border-t border-border px-3 py-2 font-sans">
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
        <div className="flex flex-1 flex-col overflow-hidden bg-background font-sans">
          {/* Top bar */}
          <header className="flex h-14 items-center justify-between border-b border-border bg-[#151417]/90 px-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold tracking-wide text-[#F7F3EA] font-sans">
                {sidebarLinks.find(
                  (l) => pathname === l.href || pathname.startsWith(l.href + "/")
                )?.label ?? "Dashboard"}
              </h2>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 text-[11px] text-[#C9A227] font-medium font-sans">
                <span className="size-1.5 rounded-full bg-[#C9A227] animate-pulse" />
                <span>AI Assistant Grounded</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex size-8 items-center justify-center rounded-[8px] border border-border text-[#8C8A94] hover:bg-[#1C1B20] hover:text-[#F7F3EA] transition-all active:scale-95"
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? (
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

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MeridasIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
  withGlow?: boolean;
}

/**
 * Precision SVG vector representation of the Meridas Compass & Evidence Stack emblem.
 * Features:
 * - 4-point Cardinal Compass Rose
 * - 3-tier Isometric Evidence / Document Stack
 * - Sovereign Gold Verification Checkmark
 */
export function MeridasIcon({
  size = 40,
  className,
  withGlow = false,
  ...props
}: MeridasIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <defs>
        {withGlow && (
          <filter id="meridas-gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
        <linearGradient id="meridas-crimson-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#BA243F" />
          <stop offset="100%" stopColor="#9E1B32" />
        </linearGradient>
        <linearGradient id="meridas-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DFB943" />
          <stop offset="100%" stopColor="#C9A227" />
        </linearGradient>
        <linearGradient id="meridas-gold-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#997816" />
        </linearGradient>
      </defs>

      {/* Compass Circular Frame */}
      <circle
        cx="50"
        cy="50"
        r="34"
        stroke="#9E1B32"
        strokeWidth="4.5"
      />
      <circle
        cx="50"
        cy="50"
        r="39.5"
        stroke="#C9A227"
        strokeWidth="1.2"
        strokeDasharray="2 4"
        opacity="0.6"
      />

      {/* North Compass Arrow */}
      <path
        d="M50 4L55.5 24H44.5L50 4Z"
        fill="url(#meridas-gold-gradient)"
      />
      <path
        d="M50 4L44.5 24H50V4Z"
        fill="url(#meridas-gold-dark)"
      />

      {/* South Compass Arrow */}
      <path
        d="M50 96L44.5 76H55.5L50 96Z"
        fill="url(#meridas-gold-gradient)"
      />
      <path
        d="M50 96L55.5 76H50V96Z"
        fill="url(#meridas-gold-dark)"
      />

      {/* East Compass Arrow */}
      <path
        d="M96 50L76 44.5V55.5L96 50Z"
        fill="url(#meridas-gold-gradient)"
      />
      <path
        d="M96 50L76 55.5V50L96 50Z"
        fill="url(#meridas-gold-dark)"
      />

      {/* West Compass Arrow */}
      <path
        d="M4 50L24 55.5V44.5L4 50Z"
        fill="url(#meridas-gold-gradient)"
      />
      <path
        d="M4 50L24 44.5V50L4 50Z"
        fill="url(#meridas-gold-dark)"
      />

      {/* 3-Tier Isometric Evidence Stack */}
      {/* Tier 1 - Bottom Plate */}
      <g transform="translate(0, 14)">
        {/* Left facet */}
        <path d="M28 50L50 61V65L28 54V50Z" fill="#5A0816" />
        {/* Right facet */}
        <path d="M50 61L72 50V54L50 65V61Z" fill="#780E1F" />
        {/* Top facet */}
        <path d="M50 45L72 54L50 63L28 54L50 45Z" fill="#9B1B30" stroke="#F5F2EB" strokeWidth="0.8" />
      </g>

      {/* Tier 2 - Middle Plate */}
      <g transform="translate(0, 6)">
        {/* Left facet */}
        <path d="M28 47L50 58V62L28 51V47Z" fill="#5A0816" />
        {/* Right facet */}
        <path d="M50 58L72 47V51L50 62V58Z" fill="#780E1F" />
        {/* Top facet */}
        <path d="M50 41L72 50L50 59L28 50L50 41Z" fill="#A6192E" stroke="#F5F2EB" strokeWidth="0.8" />
      </g>

      {/* Tier 3 - Top Plate (Evidence Core) */}
      <g transform="translate(0, -2)">
        {/* Left facet */}
        <path d="M28 44L50 55V59L28 48V44Z" fill="#6A0D1E" />
        {/* Right facet */}
        <path d="M50 55L72 44V48L50 59V55Z" fill="#881225" />
        {/* Top facet */}
        <path
          d="M50 37L72 46L50 55L28 46L50 37Z"
          fill="url(#meridas-crimson-gradient)"
          stroke="#C5A059"
          strokeWidth="1.2"
        />

        {/* Verification Checkmark on Top Face */}
        <path
          d="M44 46.5L48.2 50.8L57 41.5"
          fill="none"
          stroke="url(#meridas-gold-gradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={withGlow ? "url(#meridas-gold-glow)" : undefined}
        />
      </g>
    </svg>
  );
}

interface MeridasLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "stacked";
  withTagline?: boolean;
  taglineClassName?: string;
  className?: string;
  href?: string;
}

export function MeridasLogo({
  size = "md",
  variant = "full",
  withTagline = false,
  taglineClassName,
  className,
  href,
}: MeridasLogoProps) {
  const iconSizes = {
    sm: 30,
    md: 38,
    lg: 48,
    xl: 64,
  };

  const textSizes = {
    sm: "text-base tracking-[0.22em]",
    md: "text-lg tracking-[0.24em]",
    lg: "text-2xl tracking-[0.26em]",
    xl: "text-4xl tracking-[0.28em]",
  };

  const taglineSizes = {
    sm: "text-[8px] tracking-[0.2em]",
    md: "text-[9.5px] tracking-[0.22em]",
    lg: "text-[11px] tracking-[0.25em]",
    xl: "text-[13px] tracking-[0.3em]",
  };

  const content = (
    <div
      className={cn(
        "inline-flex items-center gap-3 select-none group",
        variant === "stacked" && "flex-col items-center text-center gap-2",
        className
      )}
    >
      <MeridasIcon
        size={iconSizes[size]}
        className="transition-transform duration-300 group-hover:scale-105"
      />

      {variant !== "icon" && (
        <div className={cn("flex flex-col", variant === "stacked" && "items-center")}>
          <span
            className={cn(
              "font-sans font-bold uppercase leading-none text-[#F7F3EA] dark:text-[#F7F3EA] group-hover:text-white transition-colors",
              textSizes[size]
            )}
          >
            MERIDAS
          </span>
          {withTagline && (
            <span
              className={cn(
                "mt-1 font-mono uppercase text-[#C9A227] font-medium leading-tight",
                taglineSizes[size],
                taglineClassName
              )}
            >
              Evidence first. Answer second.
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}

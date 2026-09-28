"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ContextItem } from "@/lib/parse-citations";
import { cn } from "@/lib/utils";

interface CitationBadgeProps {
  index: number;
  item: ContextItem;
  onClick: (index: number) => void;
}

export function CitationBadge({ index, item, onClick }: CitationBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span className="relative inline-block align-baseline mx-0.5">
      <button
        onClick={() => onClick(index)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative -top-1.5 inline-flex h-4.5 min-w-[18px] items-center justify-center rounded-[4px] border border-[#C9A227]/40 bg-[#9E1B32]/20 px-1.5 transition-all hover:bg-[#9E1B32]/40 hover:border-[#C9A227] hover:scale-105 shadow-sm",
          "font-mono text-[10px] font-bold text-[#C9A227]"
        )}
        title="View Verified Evidence Source"
      >
        [{index}]
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            className="absolute bottom-full left-1/2 z-[100] mb-2 w-[300px] -translate-x-1/2 pointer-events-none"
          >
            <div className="rounded-[10px] border border-[#C9A227]/40 bg-[#1C1B20] p-3.5 shadow-2xl shadow-black/80">
              <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-white/5">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#C9A227] font-bold flex items-center gap-1">
                  <span>✓</span> VERIFIED EVIDENCE
                </span>
                <span className="font-mono text-[9px] text-[#8C8A94]">
                  CHUNK #{index}
                </span>
              </div>
              <p className="font-sans text-[12px] leading-relaxed text-[#F7F3EA]/90 line-clamp-3">
                &ldquo;{item.text.length > 140 ? `${item.text.slice(0, 140)}...` : item.text}&rdquo;
              </p>
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-[#C9A227]/40 bg-[#1C1B20]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

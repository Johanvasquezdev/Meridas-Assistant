"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { ContextItem } from "@/lib/parse-citations";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SourceCardProps {
  item: ContextItem;
  index: number;
  isHighlighted: boolean;
}

export function SourceCard({ item, index, isHighlighted }: SourceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const getScoreColor = (score: number) => {
    if (score > 0.85) return "text-[#C9A227]"; // vibrant gold
    if (score >= 0.6) return "text-[#BA243F]"; // crimson
    return "text-[#8C8A94]"; // muted
  };

  const getBarColor = (score: number) => {
    if (score > 0.85) return "#C9A227";
    if (score >= 0.6) return "#9E1B32";
    return "#2A2832";
  };

  const handleNavigate = () => {
    router.push(`/dashboard/documents?id=${item.metadata.documentId}`);
  };

  return (
    <motion.div
      id={`source-card-${index}`}
      animate={{
        borderColor: isHighlighted ? "#C9A227" : "rgba(201, 162, 39, 0.2)",
        backgroundColor: isHighlighted ? "rgba(158, 27, 50, 0.15)" : "rgba(28, 27, 32, 0.75)",
      }}
      transition={{ duration: 0.2 }}
      className="flex w-full flex-col border p-3.5 rounded-[10px] transition-all shadow-sm"
    >
      <div className="flex items-start gap-3.5">
        {/* Left: Index badge */}
        <div className="shrink-0 pt-0.5">
          <span className="flex items-center justify-center size-5 rounded-[4px] bg-[#9E1B32]/30 border border-[#C9A227]/40 font-mono text-[10px] font-bold text-[#C9A227]">
            {index < 10 ? `0${index}` : index}
          </span>
        </div>

        {/* Center: Content */}
        <div className="flex-1 space-y-1.5">
          <div 
            className={cn(
              "font-sans text-[13px] leading-relaxed text-[#F7F3EA]",
              !isExpanded && "line-clamp-2"
            )}
          >
            {item.text}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-sans text-xs text-[#8C8A94] transition-colors hover:text-[#C9A227]"
          >
            {isExpanded ? "Show less" : "Expand source excerpt"}
          </button>
        </div>

        {/* Right: Metrics & Link */}
        <div className="shrink-0 flex flex-col items-end gap-2.5 pt-0.5 ml-3 font-sans">
          <div className="flex items-center gap-1.5">
            <div className="h-[3px] w-[36px] bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min(100, Math.max(0, item.score * 100))}%`,
                  backgroundColor: getBarColor(item.score)
                }}
                className="h-full rounded-full"
              />
            </div>
            <span className={cn("font-sans text-xs font-semibold", getScoreColor(item.score))}>
              {(item.score * 100).toFixed(0)}%
            </span>
          </div>

          <button
            onClick={handleNavigate}
            title="Inspect in Knowledge Vault"
            className="text-[#8C8A94] transition-colors hover:text-[#C9A227]"
          >
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

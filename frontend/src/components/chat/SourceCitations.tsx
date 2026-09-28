"use client";

import { motion } from "framer-motion";
import { FileText, ExternalLink, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  vectorId: string;
  score: number;
  text: string;
  metadata?: {
    documentId?: string;
    documentTitle?: string;
    chunkIndex?: number;
  };
}

interface SourceCitationsProps {
  sources: Source[];
}

export function SourceCitations({ sources }: SourceCitationsProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
          Sources & Citations
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/5 to-transparent dark:via-white/5" />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {sources.map((source, index) => (
          <motion.div
            key={source.vectorId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col rounded-[10px] border border-[#2A2832] bg-[#1C1B20] p-3 transition-all hover:border-[#C9A227]/40 hover:bg-[#222027]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-[#151417] text-[#C9A227] shadow-sm">
                  <FileText className="size-3 text-[#C9A227]" />
                </div>
                <span className="truncate text-xs font-semibold text-[#F7F3EA]">
                  {source.metadata?.documentTitle || "Untitled Document"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 font-sans text-[10px] font-bold text-emerald-400">
                {(source.score * 100).toFixed(0)}% match
              </div>
            </div>

            <p className="mt-2 line-clamp-2 font-sans text-xs leading-relaxed text-[#8C8A94] italic">
              &quot;{source.text}&quot;
            </p>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-sans text-[10px] font-semibold text-[#8C8A94]">
                REF-{index + 1}
              </span>
              <button className="flex items-center gap-1 font-sans text-xs font-semibold text-[#C9A227] transition-colors hover:text-[#DFB943]">
                View Source <ExternalLink size={10} />
              </button>
            </div>
            
            {/* Hover accent */}
            <div className="pointer-events-none absolute -inset-px rounded-[10px] border border-[#C9A227]/0 transition-all group-hover:border-[#C9A227]/20" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

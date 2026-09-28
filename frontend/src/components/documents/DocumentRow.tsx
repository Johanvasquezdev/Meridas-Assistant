"use client";

import { motion } from "framer-motion";
import { AlignLeft, Diamond, Play, RefreshCw, Table2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileIcon } from "./FileIcon";
import { StatusBadge } from "./StatusBadge";
import type { SourceDocument } from "./types";

interface DocumentRowProps {
  doc: SourceDocument;
  onDelete: () => void;
  onRetry: () => void;
  onSummarize: () => void;
  onTextSummary: () => void;
  onTables: () => void;
  onInsights: () => void;
  highlighted?: boolean;
  textSummaryOpen?: boolean;
  tablesOpen?: boolean;
  insightsOpen?: boolean;
}

export function DocumentRow({
  doc,
  onDelete,
  onRetry,
  onSummarize,
  onTextSummary,
  onTables,
  onInsights,
  highlighted = false,
  textSummaryOpen = false,
  tablesOpen = false,
  insightsOpen = false,
}: DocumentRowProps) {
  const uploadDate = new Date(doc.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      id={`document-${doc.id}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={cn(
        "group relative grid grid-cols-12 items-center gap-2 rounded-[10px] border bg-[#1C1B20] px-4 py-3.5 transition-colors hover:bg-[#222027]",
        highlighted
          ? "border-[#C9A227] bg-[#C9A227]/10"
          : "border-[#2A2832]",
      )}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-[#2A2832]" />

      {/* — Col 1: Name (5 cols) — */}
      <div className="col-span-5 flex min-w-0 items-center gap-3 pr-2">
        <FileIcon filename={doc.title} size={18} />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold leading-snug text-[#F7F3EA]">
            {doc.title}
          </span>
          <span className="font-sans text-xs text-[#8C8A94]">
            {uploadDate}
          </span>
        </div>
      </div>

      {/* — Col 2: Details (3 cols) — */}
      <div className="col-span-3 flex gap-6 font-sans text-xs text-[#8C8A94]">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
            Chunks
          </span>
          <span className="font-sans font-bold text-[#F7F3EA]">{doc.chunksCount ?? "—"}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
            Tokens
          </span>
          <span className="font-sans font-bold text-[#F7F3EA]">{doc.tokensCount ?? "—"}</span>
        </div>
      </div>

      {/* — Col 3: Status + Actions (4 cols) — */}
      <div className="col-span-4 flex items-center justify-end gap-3">
        <div className="flex flex-col items-end">
          <StatusBadge status={doc.status} />
          {doc.status === "FAILED" && doc.errorMsg && (
            <span className="mt-0.5 max-w-[140px] truncate font-sans text-[11px] text-red-400">
              {doc.errorMsg}
            </span>
          )}
        </div>

        {/* Actions */}
        <div
          className={cn(
            "flex items-center gap-1.5 transition-opacity",
            "opacity-0 group-hover:opacity-100"
          )}
        >
          {doc.status === "READY" && (
            <div className="flex h-8 overflow-hidden rounded-[6px] border border-[#2A2832] bg-[#151417]">
              <button
                type="button"
                onClick={onSummarize}
                className="flex items-center gap-1.5 border-r border-[#2A2832] px-2.5 font-sans text-xs font-semibold text-[#F7F3EA] transition-colors hover:bg-[#9E1B32]/15 hover:text-[#C9A227]"
              >
                <Play size={11} className="text-[#C9A227]" />
                Audio
              </button>
              <button
                type="button"
                onClick={onTextSummary}
                className={cn(
                  "flex items-center gap-1.5 border-r border-[#2A2832] px-2.5 font-sans text-xs font-semibold transition-colors hover:bg-[#9E1B32]/15 hover:text-[#C9A227]",
                  textSummaryOpen ? "text-[#C9A227] bg-[#C9A227]/15" : "text-[#F7F3EA]",
                )}
              >
                <AlignLeft size={12} />
                Text
              </button>
              <button
                type="button"
                onClick={onTables}
                className={cn(
                  "flex items-center gap-1.5 border-r border-[#2A2832] px-2.5 font-sans text-xs font-semibold transition-colors hover:bg-[#9E1B32]/15 hover:text-[#C9A227]",
                  tablesOpen ? "text-[#C9A227] bg-[#C9A227]/15" : "text-[#F7F3EA]",
                )}
              >
                <Table2 size={12} />
                Tables
              </button>
              <button
                type="button"
                onClick={onInsights}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 font-sans text-xs font-semibold transition-colors hover:bg-[#9E1B32]/15 hover:text-[#C9A227]",
                  insightsOpen ? "text-[#C9A227] bg-[#C9A227]/15" : "text-[#F7F3EA]",
                )}
              >
                <Diamond size={11} />
                Insights
              </button>
            </div>
          )}

          {doc.status === "FAILED" && (
            <button
              onClick={onRetry}
              className="flex h-8 items-center gap-1.5 rounded-[6px] border border-[#9E1B32]/40 bg-[#9E1B32]/10 px-3 font-sans text-xs font-semibold text-[#C9A227] transition-colors hover:bg-[#9E1B32]/20"
            >
              <RefreshCw size={11} />
              Retry
            </button>
          )}

          <button
            onClick={onDelete}
            title="Delete document"
            className="flex size-8 items-center justify-center rounded-[6px] border border-[#2A2832] text-[#8C8A94] transition-all hover:border-red-500/40 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

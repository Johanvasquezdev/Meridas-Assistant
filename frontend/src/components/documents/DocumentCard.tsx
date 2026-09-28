"use client";

import { motion } from "framer-motion";
import { RefreshCw, Trash2 } from "lucide-react";
import { FileIcon } from "./FileIcon";
import { StatusBadge } from "./StatusBadge";
import type { SourceDocument } from "./types";

interface DocumentCardProps {
  doc: SourceDocument;
  onDelete: () => void;
  onRetry: () => void;
  onSummarize: () => void;
}

export function DocumentCard({
  doc,
  onDelete,
  onRetry,
  onSummarize,
}: DocumentCardProps) {
  const uploadDate = new Date(doc.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.18 }}
      className="group relative flex flex-col gap-4 rounded-[10px] border border-[#2A2832] bg-[#1C1B20] p-5 transition-colors hover:bg-[#222027]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[#2A2832]" />

      {/* Top row: icon + status */}
      <div className="flex items-start justify-between">
        <FileIcon filename={doc.title} size={32} />
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={doc.status} />
          {doc.status === "FAILED" && doc.errorMsg && (
            <span className="max-w-[110px] truncate font-sans text-[11px] text-red-400">
              {doc.errorMsg}
            </span>
          )}
        </div>
      </div>

      {/* Filename + date */}
      <div className="space-y-1">
        <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-snug text-[#F7F3EA]">
          {doc.title}
        </h3>
        <p className="font-sans text-xs text-[#8C8A94]">{uploadDate}</p>
      </div>

      {/* Footer: stats + actions */}
      <div className="flex items-center justify-between border-t border-[#2A2832] pt-4">
        <div className="flex gap-5 font-sans text-xs text-[#8C8A94]">
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

        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
          {doc.status === "READY" && (
            <button
              onClick={onSummarize}
              className="flex h-8 items-center gap-1.5 rounded-[6px] border border-[#2A2832] bg-[#151417] px-3 font-sans text-xs font-semibold text-[#F7F3EA] transition-colors hover:border-[#C9A227]/40 hover:bg-[#9E1B32]/15 hover:text-[#C9A227]"
            >
              Summary
            </button>
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

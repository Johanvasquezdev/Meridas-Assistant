"use client";

import { Filter, Upload, Plus } from "lucide-react";
import type { SourceDocument } from "./types";
import type { DocumentStatus } from "./types";

interface EmptyStateProps {
  searchQuery: string;
  statusFilter: DocumentStatus | "ALL";
  hasAnyDocuments: boolean;
  onClearFilters: () => void;
  onUploadClick: () => void;
}

export function EmptyState({
  searchQuery,
  statusFilter,
  hasAnyDocuments,
  onClearFilters,
  onUploadClick,
}: EmptyStateProps) {
  const isFiltered = !!searchQuery || statusFilter !== "ALL";

  if (!hasAnyDocuments && !isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-[16px] border border-[#2A2832] bg-[#1C1B20] py-24 text-center shadow-xl">
        <div className="flex size-14 items-center justify-center rounded-[10px] border border-[#2A2832] bg-[#151417] text-[#C9A227]">
          <Upload size={28} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold tracking-tight text-[#F7F3EA]">
            Knowledge Vault is Empty
          </h3>
          <p className="mx-auto max-w-sm text-xs text-[#8C8A94] leading-relaxed">
            Upload company policies, operating manuals, or handbooks. MERIDAS indexes your files so your AI assistant can accurately answer questions with direct citations.
          </p>
        </div>
        <button
          onClick={onUploadClick}
          className="flex items-center gap-2 rounded-[8px] bg-[#9E1B32] px-6 py-2.5 font-sans text-xs font-bold text-[#F7F3EA] border border-[#C9A227]/30 shadow-lg shadow-[#9E1B32]/25 transition-all hover:bg-[#BA243F] active:scale-95"
        >
          <Plus size={14} />
          Upload Document
        </button>
      </div>
    );
  }

  // Filtered empty state
  const filterLabel =
    statusFilter !== "ALL" ? statusFilter.toLowerCase() : "matching";

  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-[16px] border border-[#2A2832] bg-[#1C1B20] py-20 text-center shadow-xl">
      <div className="flex size-12 items-center justify-center rounded-[10px] border border-[#2A2832] bg-[#151417] text-[#C9A227]">
        <Filter size={20} />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-sm font-bold text-[#F7F3EA]">
          {searchQuery
            ? `No ${filterLabel} documents match "${searchQuery}"`
            : `No ${filterLabel} documents`}
        </h3>
        <p className="text-xs text-[#8C8A94]">
          Try adjusting your filters or search terms.
        </p>
      </div>
      <button
        onClick={onClearFilters}
        className="rounded-[6px] border border-[#2A2832] bg-[#151417] px-5 py-2 font-sans text-xs font-semibold text-[#8C8A94] transition-all hover:border-[#C9A227]/40 hover:text-[#C9A227]"
      >
        Clear Filters
      </button>
    </div>
  );
}

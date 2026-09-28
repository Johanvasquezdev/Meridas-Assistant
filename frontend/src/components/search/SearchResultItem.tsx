"use client";

import { FileText, FileType, Sheet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HybridSearchResult } from "@/hooks/useSearch";

interface SearchResultItemProps {
  result: HybridSearchResult;
  query: string;
  isActive?: boolean;
  onClick: () => void;
}

function FileIconForTitle({ title }: { title: string }) {
  const lower = title.toLowerCase();

  if (lower.endsWith(".pdf")) return <FileType size={16} />;
  if (lower.endsWith(".md")) return <Sheet size={16} />;
  return <FileText size={16} />;
}

function getScoreColor(score: number) {
  if (score > 0.7) return "#C9A227";
  if (score >= 0.5) return "#F7F3EA";
  return "#8C8A94";
}

function createExcerpt(text: string, query: string) {
  const cleanQuery = query.trim().toLowerCase();
  const compactText = text.replace(/\s+/g, " ").trim();

  if (!cleanQuery) return compactText.slice(0, 180);

  const firstTerm = cleanQuery.split(/\s+/)[0];
  const index = compactText.toLowerCase().indexOf(firstTerm);

  if (index < 0) return compactText.slice(0, 180);

  const start = Math.max(0, index - 70);
  const end = Math.min(compactText.length, index + 120);
  return `${start > 0 ? "... " : ""}${compactText.slice(start, end)}${end < compactText.length ? " ..." : ""}`;
}

function HighlightedExcerpt({ text, query }: { text: string; query: string }) {
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 1)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  if (terms.length === 0) {
    return <>{text}</>;
  }

  const pattern = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = terms.some((term) =>
          new RegExp(`^${term}$`, "i").test(part),
        );

        return isMatch ? (
          <mark
            key={`${part}-${index}`}
            className="rounded-[2px] bg-[#C9A227]/20 px-1 font-semibold text-[#C9A227]"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </>
  );
}

export function SearchResultItem({
  result,
  query,
  isActive,
  onClick,
}: SearchResultItemProps) {
  const scorePercent = Math.min(
    100,
    Math.max(0, Math.round(result.hybridScore * 100)),
  );
  const scoreColor = getScoreColor(result.hybridScore);
  const excerpt = createExcerpt(result.text, query);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid w-full grid-cols-[24px_minmax(0,1fr)_46px] gap-3 rounded-[8px] px-3 py-3 text-left transition-colors",
        isActive ? "bg-[#222027]" : "hover:bg-[#222027]",
      )}
    >
      <div className="mt-0.5 flex size-6 items-center justify-center text-[#C9A227]">
        <FileIconForTitle title={result.documentTitle} />
      </div>

      <div className="min-w-0 space-y-1">
        <div className="truncate text-xs font-semibold text-[#F7F3EA]">
          {result.documentTitle}
        </div>
        <p className="line-clamp-2 font-sans text-xs leading-5 text-[#8C8A94]">
          <HighlightedExcerpt text={excerpt} query={query} />
        </p>
      </div>

      <div className="flex flex-col items-end gap-1 pt-1">
        <div className="h-1 w-8 rounded-full bg-[#151417]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${scorePercent}%`,
              backgroundColor: scoreColor,
            }}
          />
        </div>
        <span className="font-sans text-[10px] font-semibold text-[#8C8A94]">
          {scorePercent}%
        </span>
      </div>
    </button>
  );
}

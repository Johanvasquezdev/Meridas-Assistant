"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import { useMemo, useState } from "react";
import { useApi } from "@/hooks/use-api";

interface TextSummaryPanelProps {
  documentId: string;
}

interface TextSummaryResponse {
  summary: string;
  generatedAt: string;
  cached: boolean;
}

const SUMMARY_PREVIEW_CHARS = 900;

export function TextSummaryPanel({ documentId }: TextSummaryPanelProps) {
  const api = useApi();
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data, error, isLoading, mutate } = useSWR<TextSummaryResponse>(
    ["document-summary", documentId],
    async () => {
      const response = await api.get<TextSummaryResponse>(
        `/documents/${documentId}/summary/text`,
      );
      return response.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const visibleSummary = useMemo(() => {
    if (!data?.summary || expanded) return data?.summary ?? "";
    if (data.summary.length <= SUMMARY_PREVIEW_CHARS) return data.summary;
    return `${data.summary.slice(0, SUMMARY_PREVIEW_CHARS).trim()}...`;
  }, [data?.summary, expanded]);

  const canExpand = Boolean(data?.summary && data.summary.length > SUMMARY_PREVIEW_CHARS);

  async function copySummary() {
    if (!data?.summary) return;
    await navigator.clipboard.writeText(data.summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  async function regenerate() {
    await api.post(`/documents/${documentId}/summary/invalidate`);
    await mutate();
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-b-[10px] border border-t-0 border-[#2A2832] bg-[#1C1B20]"
    >
      <div className="relative px-6 py-5">
        {isLoading && (
          <div className="space-y-3">
            <p className="font-sans text-xs text-[#8C8A94]">
              Generating summary...
            </p>
            <div className="h-0.5 overflow-hidden rounded-full bg-[#151417]">
              <motion.div
                className="h-full w-1/3 bg-[#C9A227]"
                animate={{ x: ["-100%", "320%"] }}
                transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}

        {!isLoading && error && (
          <p className="font-sans text-xs text-red-400">
            Failed to generate summary. Try again.
          </p>
        )}

        {!isLoading && data && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#F7F3EA]">
                {visibleSummary || "No summary was generated for this document."}
              </p>
              {data.cached && (
                <span className="shrink-0 rounded-[6px] border border-[#2A2832] bg-[#151417] px-2 py-0.5 font-sans text-[10px] font-semibold tracking-wider text-[#8C8A94]">
                  CACHED
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#2A2832] pt-3">
              <div className="flex items-center gap-4">
                {canExpand && (
                  <button
                    type="button"
                    onClick={() => setExpanded((value) => !value)}
                    className="font-sans text-xs text-[#8C8A94] transition-colors hover:text-[#C9A227]"
                  >
                    {expanded ? "Show less" : "Show full summary"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={copySummary}
                  className="font-sans text-xs text-[#8C8A94] transition-colors hover:text-[#C9A227]"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
                <button
                  type="button"
                  onClick={regenerate}
                  className="font-sans text-xs text-[#8C8A94] transition-colors hover:text-[#C9A227]"
                >
                  Regenerate
                </button>
              </div>
              <p className="font-sans text-xs text-[#8C8A94]">
                Generated {new Date(data.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

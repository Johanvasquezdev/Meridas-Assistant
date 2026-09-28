"use client";

import { Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearch, type HybridSearchResult } from "@/hooks/useSearch";

interface SearchBarProps {
  onResults: (query: string, results: HybridSearchResult[]) => void;
  onClear: () => void;
}

const SEARCH_DEBOUNCE_MS = 300;

export function SearchBar({ onResults, onClear }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const { search, clear, isLoading } = useSearch();

  useEffect(() => {
    const cleanQuery = query.trim();

    if (!cleanQuery) {
      clear();
      onClear();
      return;
    }

    const id = window.setTimeout(async () => {
      const results = await search(cleanQuery);
      onResults(cleanQuery, results);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(id);
  }, [clear, onClear, onResults, query, search]);

  const handleClear = useCallback(() => {
    setQuery("");
    clear();
    onClear();
  }, [clear, onClear]);

  return (
    <div className="relative w-full min-w-[220px]">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8C8A94]" />
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search knowledge vault..."
        className="h-9 w-full rounded-[8px] border border-[#2A2832] bg-[#1C1B20] pl-9 pr-10 font-sans text-xs text-[#F7F3EA] outline-none placeholder:text-[#8C8A94] focus:border-[#C9A227]/60"
      />
      {isLoading ? (
        <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-[#C9A227]" />
      ) : query ? (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-[4px] text-[#8C8A94] hover:bg-[#151417] hover:text-[#F7F3EA]"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}

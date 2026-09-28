"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { SearchResultItem } from "@/components/search/SearchResultItem";
import { useSearch } from "@/hooks/useSearch";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SEARCH_DEBOUNCE_MS = 300;

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { results, suggestions, isLoading, error, search, suggest, clear } =
    useSearch();

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;

    const cleanQuery = query.trim();
    if (!cleanQuery) {
      clear();
      return;
    }

    const id = window.setTimeout(() => {
      void suggest(cleanQuery);
      void search(cleanQuery);
      setActiveIndex(0);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(id);
  }, [clear, open, query, search, suggest]);

  const close = useCallback(() => {
    setQuery("");
    setActiveIndex(0);
    clear();
    onOpenChange(false);
  }, [clear, onOpenChange]);

  const openResult = useCallback(
    (documentId: string) => {
      router.push(`/dashboard/documents?document=${encodeURIComponent(documentId)}`);
      close();
    },
    [close, router],
  );

  const handleOverlayClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        close();
      }
    },
    [close],
  );

  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (results.length === 0) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % results.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((index) => (index - 1 + results.length) % results.length);
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const result = results[activeIndex];
        if (result) openResult(result.documentId);
      }
    },
    [activeIndex, openResult, results],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-3 pt-20 backdrop-blur-sm sm:items-center sm:pt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          onMouseDown={handleOverlayClick}
        >
          <motion.div
            className="w-full max-w-[640px] overflow-hidden rounded-[12px] border border-[#2A2832] bg-[#1C1B20] shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.1 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-[#2A2832] px-4 py-3">
              <Search size={16} className="text-[#C9A227]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Search knowledge vault..."
                className="h-9 flex-1 bg-transparent font-sans text-sm text-[#F7F3EA] outline-none placeholder:text-[#8C8A94]"
              />
              <button
                type="button"
                onClick={close}
                className="flex size-8 items-center justify-center rounded-[6px] text-[#8C8A94] transition-colors hover:bg-[#151417] hover:text-[#F7F3EA]"
                aria-label="Close search"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-2">
              {query.trim() && suggestions.length > 0 && results.length === 0 && (
                <div className="px-2">
                  {suggestions.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      className="block w-full rounded-[6px] px-3 py-2 text-left font-sans text-xs text-[#8C8A94] hover:bg-[#222027]"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {isLoading && (
                <div className="space-y-2 px-4 py-3">
                  {[0, 1, 2].map((item) => (
                    <div
                      key={item}
                      className="h-14 animate-pulse rounded-[8px] bg-[#151417]"
                    />
                  ))}
                </div>
              )}

              {!isLoading && error && (
                <div className="px-6 py-8 text-center text-[14px] text-[#FF4545]">
                  {error}
                </div>
              )}

              {!isLoading && !error && query.trim() && results.length === 0 && (
                <div className="px-6 py-8 text-center text-[14px] text-[#6B6A72]">
                  No results for &quot;{query.trim()}&quot;
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="px-2">
                  {results.map((result, index) => (
                    <SearchResultItem
                      key={result.chunkId}
                      result={result}
                      query={query}
                      isActive={index === activeIndex}
                      onClick={() => openResult(result.documentId)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

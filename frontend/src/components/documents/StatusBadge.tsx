"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "./types";

interface StatusBadgeProps {
  status: DocumentStatus;
}

const STATUS_CONFIG: Record<
  DocumentStatus,
  { color: string; dotClass: string; label: string; spinner?: boolean }
> = {
  READY: {
    color: "text-emerald-400",
    dotClass: "bg-emerald-500",
    label: "Ready",
  },
  PROCESSING: {
    color: "text-amber-400",
    dotClass: "bg-amber-500 animate-pulse",
    label: "Processing",
  },
  PENDING: {
    color: "text-amber-400",
    dotClass: "bg-amber-500 animate-pulse",
    label: "Processing",
  },
  FAILED: {
    color: "text-red-400",
    dotClass: "bg-red-500",
    label: "Failed",
  },
  UPLOADING: {
    color: "text-[#C9A227]",
    dotClass: "bg-[#C9A227]",
    label: "Uploading",
    spinner: true,
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    color: "text-[#8C8A94]",
    dotClass: "bg-[#8C8A94]",
    label: status,
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 font-sans text-xs font-semibold",
        config.color
      )}
    >
      {config.spinner ? (
        <Loader2 size={11} className="animate-spin text-[#C9A227]" />
      ) : (
        <div className={cn("size-1.5 rounded-full", config.dotClass)} />
      )}
      {config.label}
    </div>
  );
}

"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FileUploadState {
  file: File;
  progress: number;
  status: "queued" | "uploading" | "completed" | "error";
  error?: string;
}

interface UploadZoneProps {
  uploadQueue: Record<string, FileUploadState>;
  onFiles: (files: File[]) => void;
  onRetryFile: (id: string) => void;
  onDismissFile: (id: string) => void;
}

export function UploadZone({
  uploadQueue,
  onFiles,
  onRetryFile,
  onDismissFile,
}: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFiles(droppedFiles);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (selectedFiles.length > 0) {
      onFiles(selectedFiles);
    }
    e.target.value = "";
  };

  const queueEntries = Object.entries(uploadQueue);

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed py-10 transition-all shadow-md",
          isDragOver
            ? "border-[#C9A227] bg-[#9E1B32]/10"
            : "border-[#2A2832] bg-[#1C1B20] hover:border-[#C9A227]/40 hover:bg-[#9E1B32]/5"
        )}
      >
        <motion.div
          animate={{ scale: isDragOver ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={cn(
            "flex size-12 items-center justify-center rounded-[10px] border transition-colors",
            isDragOver
              ? "border-[#C9A227] bg-[#9E1B32]/20 text-[#C9A227]"
              : "border-[#2A2832] bg-[#151417] text-[#C9A227]"
          )}
        >
          <Upload size={22} />
        </motion.div>

        <div className="text-center">
          <p className="text-sm font-semibold text-[#F7F3EA]">
            {isDragOver ? "Drop documents here" : "Upload documents into Knowledge Vault"}
          </p>
          <p className="mt-0.5 font-sans text-xs text-[#8C8A94]">
            PDF, TXT, MD — max 10 MB per file
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".txt,.pdf,.md"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Upload queue */}
      <AnimatePresence mode="popLayout">
        {queueEntries.map(([id, state]) => (
          <motion.div
            key={id}
            layout
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-4 rounded-[12px] border border-[#C9A227]/30 bg-[#1C1B20] px-4 py-3 shadow-md"
          >
            <FileText size={20} className="shrink-0 text-[#C9A227]" />

            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="truncate text-xs font-semibold text-[#F7F3EA]">
                  {state.file.name}
                </span>
                <span className="ml-4 shrink-0 font-sans text-xs text-[#8C8A94]">
                  {(state.file.size / 1024).toFixed(1)} KB
                </span>
              </div>

              {state.status === "error" ? (
                <div className="flex items-center gap-1.5 font-sans text-xs text-red-400">
                  <AlertCircle size={10} />
                  {state.error ?? "Upload failed"}
                </div>
              ) : (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#151417]">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#9E1B32] to-[#C9A227]"
                    initial={{ width: 0 }}
                    animate={{ width: `${state.progress}%` }}
                    transition={{ ease: "linear", duration: 0.2 }}
                  />
                </div>
              )}
            </div>

            {/* Status indicator + controls */}
            <div className="shrink-0 flex items-center gap-2">
              {state.status === "uploading" && (
                <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-[#C9A227]">
                  <Loader2 size={11} className="animate-spin" />
                  {state.progress}%
                </div>
              )}
              {state.status === "completed" && (
                <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-emerald-400">
                  <CheckCircle2 size={11} />
                  Ready
                </div>
              )}
              {state.status === "error" && (
                <button
                  onClick={() => onRetryFile(id)}
                  className="flex h-6 items-center gap-1 rounded-[6px] border border-[#C9A227]/40 bg-[#9E1B32]/20 px-2 font-sans text-xs font-semibold text-[#C9A227] transition-colors hover:bg-[#9E1B32]/40"
                >
                  <RefreshCw size={9} />
                  Retry
                </button>
              )}
              {state.status !== "uploading" && (
                <button
                  onClick={() => onDismissFile(id)}
                  className="flex size-6 items-center justify-center rounded-[6px] border border-[#2A2832] text-[#8C8A94] transition-all hover:border-red-500/40 hover:text-red-400"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

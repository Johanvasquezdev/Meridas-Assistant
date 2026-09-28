"use client";

import { FileText, FileCode } from "lucide-react";

interface FileIconProps {
  filename: string;
  size?: number;
}

export function FileIcon({ filename, size = 20 }: FileIconProps) {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf")
    return <FileText size={size} className="shrink-0 text-[#9E1B32]" />;
  if (ext === "md")
    return <FileCode size={size} className="shrink-0 text-[#C9A227]" />;
  if (ext === "txt")
    return <FileText size={size} className="shrink-0 text-blue-400" />;
  return <FileText size={size} className="shrink-0 text-[#8C8A94]" />;
}

"use client";

import { motion } from 'framer-motion';
import { ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface KnowledgeHealthProps {
  data: any;
  isLoading: boolean;
}

export function KnowledgeHealth({ data, isLoading }: KnowledgeHealthProps) {
  if (isLoading) {
    return (
      <div className="h-[250px] animate-pulse rounded-[16px] border border-[#2A2832] bg-[#1C1B20]" />
    );
  }

  const score = data?.healthScore || 0;
  const coverage = data?.coveragePercentage || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-[16px] border border-[#2A2832] bg-[#1C1B20] p-7 shadow-xl overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-6">
          <div className="relative flex size-28 items-center justify-center shrink-0">
            <svg className="absolute size-full -rotate-90 transform">
              <circle
                cx="56"
                cy="56"
                r="48"
                stroke="#2A2832"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="56"
                cy="56"
                r="48"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={301.6}
                initial={{ strokeDashoffset: 301.6 }}
                animate={{ strokeDashoffset: 301.6 - (301.6 * score) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className={`${
                  score > 80 ? "text-[#C9A227]" : score > 50 ? "text-amber-500" : "text-[#9E1B32]"
                }`}
              />
            </svg>
            <div className="text-center">
              <span className="font-sans text-2xl font-bold text-[#F7F3EA]">{score}</span>
              <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-[#8C8A94]">Score</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-[#F7F3EA] tracking-tight">Knowledge Base Health</h3>
            <p className="max-w-md text-xs text-[#8C8A94] mt-1 leading-relaxed">
              Overall reliability score based on verified document coverage, search accuracy, and policy updates.
            </p>
            
            <div className="mt-3 flex flex-wrap gap-2.5">
              <div className="flex items-center gap-1.5 rounded-[6px] bg-[#C9A227]/10 border border-[#C9A227]/30 px-2.5 py-1 font-sans text-xs font-semibold text-[#C9A227]">
                <ShieldCheck className="size-3" />
                {data?.readyDocs || 0} Documents Ready
              </div>
              <div className="flex items-center gap-1.5 rounded-[6px] bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 font-sans text-xs font-semibold text-amber-400">
                <RefreshCw className="size-3 animate-spin" />
                {data?.totalDocs - data?.readyDocs - data?.failedDocs || 0} Processing
              </div>
              <div className="flex items-center gap-1.5 rounded-[6px] bg-[#9E1B32]/15 border border-[#9E1B32]/40 px-2.5 py-1 font-sans text-xs font-semibold text-[#BA243F]">
                <AlertCircle className="size-3" />
                {data?.failedDocs || 0} Failed
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-[12px] border border-[#2A2832] bg-[#151417] p-5 lg:w-72">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs font-semibold text-[#8C8A94]">Topic Coverage</span>
            <span className="font-sans text-xs font-bold text-[#C9A227]">{coverage}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#2A2832]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${coverage}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-[#C9A227]"
            />
          </div>
          <p className="mt-1 font-sans text-xs leading-relaxed text-[#8C8A94]">
            {coverage}% of operational topics covered by uploaded documents.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

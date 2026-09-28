"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  User,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo } from "react";
import { useApi } from "@/hooks/use-api";
import { cn } from "@/lib/utils";

type InsightType =
  | "METRIC"
  | "FACT"
  | "DATE"
  | "PERSON"
  | "PROCESS"
  | "REQUIREMENT";

interface DocumentInsight {
  id: string;
  type: InsightType;
  label: string;
  value: string;
  unit: string | null;
  context: string | null;
  extractedAt: string;
}

interface MetricChartPoint {
  label: string;
  value: number;
}

function parseMetric(value: string): number | null {
  const match = value.replace(/,/g, "").match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function InsightCard({ insight, index }: { insight: DocumentInsight; index: number }) {
  const borderByType: Record<InsightType, string> = {
    METRIC: "border-l-[#C9A227]",
    FACT: "border-l-[#2A2832]",
    DATE: "border-l-[#C9A227]",
    PERSON: "border-l-[#9E1B32]",
    PROCESS: "border-l-[#C9A227]",
    REQUIREMENT: "border-l-[#9E1B32]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.15 }}
      className={cn(
        "rounded-[8px] border border-l-2 border-[#2A2832] bg-[#151417] px-5 py-4 transition-colors hover:border-[#C9A227]/50",
        borderByType[insight.type],
      )}
    >
      {insight.type === "METRIC" ? (
        <div className="space-y-2">
          <div className="flex items-end gap-2">
            <span className="font-sans text-3xl font-bold leading-none text-[#C9A227]">
              {insight.value}
            </span>
            {insight.unit && (
              <span className="pb-1 font-sans text-xs text-[#8C8A94]">
                {insight.unit}
              </span>
            )}
          </div>
          <p className="font-sans text-xs text-[#8C8A94]">{insight.label}</p>
          {insight.context && (
            <p className="font-sans text-[11px] italic text-[#8C8A94]">
              {insight.context}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-[#8C8A94]">
            {insight.label}
          </p>
          <div className="flex items-start gap-2">
            {insight.type === "DATE" && (
              <Calendar className="mt-0.5 size-3.5 shrink-0 text-[#C9A227]" />
            )}
            {insight.type === "PERSON" && (
              <User className="mt-0.5 size-3.5 shrink-0 text-[#9E1B32]" />
            )}
            {insight.type === "PROCESS" && (
              <ArrowRight className="mt-0.5 size-3 shrink-0 text-[#C9A227]" />
            )}
            {insight.type === "REQUIREMENT" && (
              <AlertCircle className="mt-0.5 size-3 shrink-0 text-red-400" />
            )}
            <p
              className={cn(
                "text-[#F7F3EA] font-sans",
                insight.type === "DATE" && "text-base font-bold",
                insight.type === "PERSON" && "text-sm font-bold",
                insight.type !== "DATE" &&
                  insight.type !== "PERSON" &&
                  "text-xs leading-relaxed",
              )}
            >
              {insight.value}
            </p>
          </div>
          {insight.context && (
            <p className="font-sans text-[11px] italic text-[#8C8A94]">
              {insight.context}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function InsightsPanel({ documentId }: { documentId: string }) {
  const api = useApi();
  const { data, error, isLoading } = useSWR<DocumentInsight[]>(
    ["document-insights", documentId],
    async () => {
      const response = await api.get<DocumentInsight[]>(
        `/documents/${documentId}/insights`,
      );
      return response.data;
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  const chartData = useMemo<MetricChartPoint[]>(() => {
    return (data ?? [])
      .filter((insight) => insight.type === "METRIC")
      .map((insight) => ({
        label:
          insight.label.length > 15
            ? `${insight.label.slice(0, 15)}...`
            : insight.label,
        value: parseMetric(insight.value),
      }))
      .filter((point): point is MetricChartPoint => point.value !== null);
  }, [data]);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden rounded-b-[10px] border border-t-0 border-[#2A2832] bg-[#1C1B20]"
    >
      <div className="space-y-5 px-6 py-5">
        {isLoading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-[8px] border border-[#2A2832] bg-[#151417]"
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <p className="font-sans text-xs text-red-400">
            Failed to extract insights. Try again.
          </p>
        )}

        {!isLoading && data?.length === 0 && (
          <p className="text-sm font-semibold text-[#8C8A94]">
            No key insights found in this document.
          </p>
        )}

        {!isLoading && chartData.length >= 3 && (
          <div className="hidden h-64 rounded-[8px] border border-[#2A2832] bg-[#151417] p-4 md:block">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid stroke="#2A2832" vertical={false} />
                <XAxis dataKey="label" stroke="#8C8A94" fontSize={11} />
                <YAxis stroke="#8C8A94" fontSize={11} />
                <Tooltip
                  cursor={{ fill: "#222027" }}
                  contentStyle={{
                    background: "#151417",
                    border: "1px solid #2A2832",
                    borderRadius: 6,
                    color: "#F7F3EA",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="#C9A227" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {!isLoading && data && data.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((insight, index) => (
              <InsightCard key={insight.id} insight={insight} index={index} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

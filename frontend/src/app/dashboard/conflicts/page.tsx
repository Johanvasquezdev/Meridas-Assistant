"use client";

import { useEffect, useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/components/ui/Toast";
import {
  Scale,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  FileText,
  RefreshCw,
  Filter,
  Check,
  X,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MeridasIcon } from "@/components/brand/MeridasLogo";

interface HealthSummary {
  activeConflicts: number;
  totalSources: number;
  totalVersions: number;
  staleVersions: number;
  recentAuditEvents: number;
  complianceStatus: "HEALTHY" | "ATTENTION_REQUIRED";
}

interface ConflictItem {
  id: string;
  tenantId: string;
  claimAId: string;
  claimBId: string;
  conflictType: string;
  severity: string;
  status: "DETECTED" | "IN_REVIEW" | "RESOLVED" | "FALSE_POSITIVE";
  assignedTo: string | null;
  detectedAt: string;
  resolvedAt: string | null;
  claimA: {
    id: string;
    statement: string;
    scopeKey?: string | null;
    sourceVersion?: {
      versionNumber: string;
      status: string;
      effectiveDate: string;
      source: {
        title: string;
        domain: string;
        scopeSite?: string | null;
        scopeSystem?: string | null;
      };
    };
  };
  claimB: {
    id: string;
    statement: string;
    scopeKey?: string | null;
    sourceVersion?: {
      versionNumber: string;
      status: string;
      effectiveDate: string;
      source: {
        title: string;
        domain: string;
        scopeSite?: string | null;
        scopeSystem?: string | null;
      };
    };
  };
  decisions: Array<{
    id: string;
    decidedByUserId: string;
    decision: string;
    scopeOverride?: string | null;
    rationale: string;
    decidedAt: string;
    user?: {
      email?: string;
    };
  }>;
}

export default function ConflictsPage() {
  const api = useApi();
  const { show: toast } = useToast();

  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Adjudication Dialog State
  const [selectedConflict, setSelectedConflict] = useState<ConflictItem | null>(null);
  const [adjudicationDecision, setAdjudicationDecision] = useState<
    "OVERRIDE_AUTHORITY" | "MARK_FALSE_POSITIVE" | "REQUEST_DOC_UPDATE"
  >("OVERRIDE_AUTHORITY");
  const [adjudicationRationale, setAdjudicationRationale] = useState("");
  const [adjudicationScope, setAdjudicationScope] = useState("");
  const [authoritativeClaimId, setAuthoritativeClaimId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentReceipt, setRecentReceipt] = useState<{
    conflictId: string;
    decision: string;
    timestamp: string;
  } | null>(null);

  const fetchData = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      else setIsLoading(true);

      const [conflictsRes, healthRes] = await Promise.all([
        api.get<ConflictItem[]>("/conflicts"),
        api.get<HealthSummary>("/conflicts/health-summary"),
      ]);

      setConflicts(conflictsRes.data);
      setHealthSummary(healthRes.data);
    } catch (err: any) {
      console.error("Failed to load conflict data", err);
      toast("Unable to synchronize conflict desk.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [api, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleResolve = async () => {
    if (!selectedConflict) return;
    if (!adjudicationRationale.trim() || adjudicationRationale.trim().length < 5) {
      toast("Adjudication requires an explicit operational rationale (min 5 characters).");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post(`/conflicts/${selectedConflict.id}/resolve`, {
        decision: adjudicationDecision,
        scopeOverride: adjudicationScope.trim() || undefined,
        rationale: adjudicationRationale.trim(),
        authoritativeClaimId:
          adjudicationDecision === "OVERRIDE_AUTHORITY" ? authoritativeClaimId : undefined,
      });

      setRecentReceipt({
        conflictId: selectedConflict.id,
        decision: adjudicationDecision,
        timestamp: new Date().toISOString(),
      });

      toast("Adjudication recorded in tamper-evident audit log.");
      setSelectedConflict(null);
      setAdjudicationRationale("");
      setAdjudicationScope("");
      setAuthoritativeClaimId("");
      await fetchData(true);
    } catch (err: any) {
      console.error("Resolution failed", err);
      toast(err.response?.data?.message || "Failed to commit adjudication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredConflicts = conflicts.filter((c) => {
    if (statusFilter === "ALL") return true;
    return c.status === statusFilter;
  });

  return (
    <div className="flex flex-1 flex-col h-full overflow-y-auto bg-gradient-to-b from-[#151417] via-[#17161A] to-[#151417] text-[#F7F3EA] chat-scrollbar">
      {/* Header Banner */}
      <div className="border-b border-white/10 bg-[#1C1B20]/60 px-8 py-6 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-[14px] border border-[#C9A227]/40 bg-[#1C1B20] shadow-xl">
              <Scale className="size-6 text-[#C9A227]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-[#F7F3EA] font-sans">
                  Policy Conflict Desk
                </h1>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-wider bg-[#9E1B32]/30 text-[#C9A227] px-2 py-0.5 rounded-[4px] border border-[#C9A227]/30">
                  Policy Review
                </span>
              </div>
              <p className="font-sans text-xs text-[#8C8A94] mt-0.5">
                Detects and helps you resolve contradictory rules across company documents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 font-sans">
            <button
              onClick={() => fetchData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 rounded-[8px] border border-white/10 bg-[#151417] px-3.5 py-2 font-sans text-xs text-[#8C8A94] hover:text-[#F7F3EA] hover:border-white/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw
                className={cn("size-3.5", isRefreshing && "animate-spin text-[#C9A227]")}
              />
              <span>Refresh Desk</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="border-b border-white/10 bg-[#151417]/80 px-8 py-5 font-sans">
        <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-[12px] border border-white/10 bg-[#1C1B20] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-[#8C8A94]">
                Active Conflicts
              </span>
              <AlertTriangle className="size-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-sans text-[#F7F3EA]">
              {healthSummary?.activeConflicts ?? 0}
            </div>
            <div className="font-sans text-[11px] text-[#8C8A94] mt-0.5">
              Requires review
            </div>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-[#1C1B20] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-[#8C8A94]">
                Total Documents
              </span>
              <FileText className="size-4 text-[#C9A227]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-sans text-[#F7F3EA]">
              {healthSummary?.totalSources ?? 0}
            </div>
            <div className="font-sans text-[11px] text-[#8C8A94] mt-0.5">
              {healthSummary?.totalVersions ?? 0} active versions
            </div>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-[#1C1B20] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-[#8C8A94]">
                Outdated Policies
              </span>
              <Clock className="size-4 text-[#9E1B32]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-sans text-[#9E1B32]">
              {healthSummary?.staleVersions ?? 0}
            </div>
            <div className="font-sans text-[11px] text-[#8C8A94] mt-0.5">
              Superseded policies
            </div>
          </div>

          <div className="rounded-[12px] border border-white/10 bg-[#1C1B20] p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs uppercase tracking-wider text-[#8C8A94]">
                Resolved Conflicts
              </span>
              <Lock className="size-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold font-sans text-emerald-400">
              {healthSummary?.recentAuditEvents ?? 0}
            </div>
            <div className="font-sans text-[11px] text-[#8C8A94] mt-0.5">
              Logged in history
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-6xl w-full px-8 py-6 space-y-6 font-sans">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-4 font-sans">
          <div className="flex items-center gap-1.5 bg-[#1C1B20] p-1 rounded-[10px] border border-white/10">
            {[
              { id: "ALL", label: "All Conflicts" },
              { id: "DETECTED", label: "Needs Review" },
              { id: "RESOLVED", label: "Resolved" },
              { id: "FALSE_POSITIVE", label: "False Positives" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-[8px] font-sans text-xs transition-all",
                  statusFilter === tab.id
                    ? "bg-[#9E1B32] text-[#F7F3EA] border border-[#C9A227]/40 shadow-sm font-semibold"
                    : "text-[#8C8A94] hover:text-[#F7F3EA]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="font-sans text-xs text-[#8C8A94]">
            Showing {filteredConflicts.length} of {conflicts.length} recorded items
          </div>
        </div>

        {/* Cryptographic Receipt Banner if just adjudicated */}
        {recentReceipt && (
          <div className="rounded-[12px] border border-emerald-500/40 bg-emerald-500/10 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Adjudication Receipt Generated
                </span>
                <p className="text-xs text-[#F7F3EA]/90 mt-0.5">
                  Conflict ID <code className="text-[#C9A227]">{recentReceipt.conflictId.slice(0, 8)}</code> committed as{" "}
                  <strong className="text-emerald-300">{recentReceipt.decision}</strong>. Immutable SHA-256 audit entry registered.
                </p>
              </div>
            </div>
            <button
              onClick={() => setRecentReceipt(null)}
              className="text-emerald-400 hover:text-[#F7F3EA] font-mono text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Conflicts List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="size-6 text-[#C9A227] animate-spin" />
            <span className="font-mono text-xs text-[#8C8A94] uppercase tracking-wider">
              Querying Knowledge Consistency Engine...
            </span>
          </div>
        ) : filteredConflicts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[16px] border border-white/10 bg-[#1C1B20]/40 py-20 text-center space-y-3">
            <div className="flex size-14 items-center justify-center rounded-[14px] bg-[#1C1B20] border border-white/10">
              <CheckCircle2 className="size-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-semibold text-[#F7F3EA]">
              Zero Inconsistencies Under Current Filter
            </h3>
            <p className="text-xs text-[#8C8A94] max-w-sm">
              All directives adhere to mathematical entailment standards without detected cross-policy contradictions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConflicts.map((c) => {
              const isOpen = c.status === "DETECTED" || c.status === "IN_REVIEW";
              const isResolved = c.status === "RESOLVED";

              return (
                <div
                  key={c.id}
                  className="rounded-[16px] border border-white/10 bg-[#1C1B20] p-6 shadow-xl space-y-5 transition-all hover:border-white/20"
                >
                  {/* Conflict Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "font-mono text-[9px] font-bold px-2 py-0.5 rounded-[4px] uppercase tracking-wider",
                          c.severity === "HIGH" &&
                            "bg-red-500/20 text-red-300 border border-red-500/30",
                          c.severity === "CRITICAL" &&
                            "bg-[#9E1B32] text-[#F7F3EA] border border-[#C9A227]/40",
                          c.severity !== "HIGH" &&
                            c.severity !== "CRITICAL" &&
                            "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        )}
                      >
                        {c.severity} SEVERITY
                      </span>

                      <span className="font-mono text-xs font-semibold text-[#F7F3EA] uppercase tracking-wide">
                        {c.conflictType.replace(/_/g, " ")}
                      </span>

                      <span className="font-mono text-[10px] text-[#8C8A94]">
                        Detected {new Date(c.detectedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-[6px] uppercase tracking-wider flex items-center gap-1.5",
                          isOpen && "bg-amber-500/10 text-amber-400 border border-amber-500/30",
                          isResolved && "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
                          !isOpen && !isResolved && "bg-white/5 text-[#8C8A94] border border-white/10"
                        )}
                      >
                        {isOpen && <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />}
                        {isResolved && <Check className="size-3" />}
                        {c.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>

                  {/* Side-by-Side Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Directive A */}
                    <div className="rounded-[12px] border border-red-500/20 bg-[#151417] p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="size-3.5 text-red-400 shrink-0" />
                          <span className="font-mono text-xs font-bold text-[#F7F3EA] truncate">
                            {c.claimA?.sourceVersion?.source?.title || "Directive A"}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] bg-red-500/15 text-red-300 px-1.5 py-0.5 rounded border border-red-500/20 uppercase">
                          {c.claimA?.sourceVersion?.status || "SUPERSEDED"}
                        </span>
                      </div>

                      <div className="font-mono text-[9px] text-[#8C8A94]">
                        Rev: {c.claimA?.sourceVersion?.versionNumber || "v1.0"} · Domain: {c.claimA?.sourceVersion?.source?.domain || "SOP"}
                      </div>

                      <div className="text-xs text-[#F7F3EA] bg-[#1C1B20] p-3 rounded-[8px] border border-white/5 font-sans leading-relaxed">
                        &ldquo;{c.claimA?.statement}&rdquo;
                      </div>
                    </div>

                    {/* Directive B */}
                    <div className="rounded-[12px] border border-emerald-500/20 bg-[#151417] p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="size-3.5 text-emerald-400 shrink-0" />
                          <span className="font-mono text-xs font-bold text-[#F7F3EA] truncate">
                            {c.claimB?.sourceVersion?.source?.title || "Directive B"}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase">
                          {c.claimB?.sourceVersion?.status || "ACTIVE"}
                        </span>
                      </div>

                      <div className="font-mono text-[9px] text-[#8C8A94]">
                        Rev: {c.claimB?.sourceVersion?.versionNumber || "v2.0"} · Domain: {c.claimB?.sourceVersion?.source?.domain || "SOP"}
                      </div>

                      <div className="text-xs text-[#F7F3EA] bg-[#1C1B20] p-3 rounded-[8px] border border-white/5 font-sans leading-relaxed">
                        &ldquo;{c.claimB?.statement}&rdquo;
                      </div>
                    </div>
                  </div>

                  {/* Adjudication Decisions History */}
                  {c.decisions && c.decisions.length > 0 && (
                    <div className="rounded-[10px] bg-[#151417] p-3.5 border border-white/5 space-y-2">
                      <div className="flex items-center gap-2 font-mono text-[10px] text-[#C9A227] uppercase tracking-wider font-bold">
                        <Lock className="size-3 text-[#C9A227]" />
                        Adjudication Record & SHA-256 Audit Trail
                      </div>
                      {c.decisions.map((d) => (
                        <div key={d.id} className="text-xs space-y-1 pt-1">
                          <div className="flex items-center justify-between font-mono text-[10px] text-[#8C8A94]">
                            <span className="text-emerald-400 font-bold uppercase">{d.decision}</span>
                            <span>{new Date(d.decidedAt).toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-[#F7F3EA]/90 font-sans italic">
                            &ldquo;{d.rationale}&rdquo;
                          </p>
                          {d.scopeOverride && (
                            <div className="font-mono text-[10px] text-[#C9A227]">
                              Scope Override Applied: {d.scopeOverride}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions Bar for Open Conflicts */}
                  {isOpen && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="font-mono text-[10px] text-[#8C8A94]">
                        Adjudication will record an unalterable audit event.
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedConflict(c);
                            setAdjudicationDecision("MARK_FALSE_POSITIVE");
                          }}
                          className="px-3 py-1.5 rounded-[8px] bg-[#151417] hover:bg-[#151417]/80 border border-white/10 text-xs font-mono text-[#8C8A94] hover:text-[#F7F3EA] transition-all"
                        >
                          Mark False Positive
                        </button>
                        <button
                          onClick={() => {
                            setSelectedConflict(c);
                            setAdjudicationDecision("REQUEST_DOC_UPDATE");
                          }}
                          className="px-3 py-1.5 rounded-[8px] bg-[#151417] hover:bg-[#151417]/80 border border-white/10 text-xs font-mono text-amber-400 hover:border-amber-500/40 transition-all"
                        >
                          Request Doc Update
                        </button>
                        <button
                          onClick={() => {
                            setSelectedConflict(c);
                            setAdjudicationDecision("OVERRIDE_AUTHORITY");
                            setAuthoritativeClaimId(c.claimB?.id || c.claimBId);
                          }}
                          className="px-3.5 py-1.5 rounded-[8px] bg-[#9E1B32] hover:bg-[#BA243F] border border-[#C9A227]/40 text-xs font-mono font-bold text-[#F7F3EA] shadow-md shadow-[#9E1B32]/25 transition-all"
                        >
                          Adjudicate Conflict →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Human Adjudication Modal */}
      {selectedConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-[16px] border border-[#C9A227]/50 bg-[#1C1B20] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="size-4 text-[#C9A227]" />
                <h3 className="font-bold text-sm text-[#F7F3EA] tracking-wide">
                  Adjudicate Operational Conflict
                </h3>
              </div>
              <button
                onClick={() => setSelectedConflict(null)}
                className="text-[#8C8A94] hover:text-[#F7F3EA] transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Decision selector */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-widest text-[#8C8A94]">
                Adjudication Action
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "OVERRIDE_AUTHORITY", label: "Declare Active" },
                  { id: "MARK_FALSE_POSITIVE", label: "False Alarm" },
                  { id: "REQUEST_DOC_UPDATE", label: "Trigger Update" },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      setAdjudicationDecision(act.id as any);
                      if (act.id === "OVERRIDE_AUTHORITY" && !authoritativeClaimId) {
                        setAuthoritativeClaimId(selectedConflict.claimB?.id || selectedConflict.claimBId);
                      }
                    }}
                    className={cn(
                      "p-2.5 rounded-[8px] border text-center font-mono text-[10px] font-bold uppercase tracking-wider transition-all",
                      adjudicationDecision === act.id
                        ? "bg-[#9E1B32] border-[#C9A227] text-[#F7F3EA] shadow-sm"
                        : "bg-[#151417] border-white/10 text-[#8C8A94] hover:text-[#F7F3EA]"
                    )}
                  >
                    {act.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scope override */}
            {adjudicationDecision === "OVERRIDE_AUTHORITY" && selectedConflict && (
              <div className="space-y-2">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#8C8A94]">
                  Version that stays in the next answer
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[selectedConflict.claimA, selectedConflict.claimB].filter(Boolean).map((claim) => (
                    <button
                      key={claim.id}
                      type="button"
                      onClick={() => setAuthoritativeClaimId(claim.id)}
                      className={cn(
                        "p-2.5 rounded-[8px] border text-left transition-all",
                        authoritativeClaimId === claim.id
                          ? "bg-[#9E1B32] border-[#C9A227] text-[#F7F3EA]"
                          : "bg-[#151417] border-white/10 text-[#8C8A94]"
                      )}
                    >
                      <div className="font-mono text-[10px] font-bold uppercase tracking-wider">
                        {claim.sourceVersion?.versionNumber || "Version"}
                      </div>
                      <div className="mt-1 text-[10px] leading-snug line-clamp-2">
                        {claim.statement}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {adjudicationDecision === "OVERRIDE_AUTHORITY" && (
              <div className="space-y-1.5">
                <label className="font-mono text-[9px] uppercase tracking-widest text-[#8C8A94]">
                  Operational Perimeter / Scope Restriction (Optional)
                </label>
                <input
                  type="text"
                  value={adjudicationScope}
                  onChange={(e) => setAdjudicationScope(e.target.value)}
                  placeholder="e.g. Scope: HQ-Central & Remote Only"
                  className="w-full rounded-[8px] border border-white/10 bg-[#151417] px-3 py-2 text-xs text-[#F7F3EA] placeholder:text-[#8C8A94] focus:border-[#C9A227]/60 focus:outline-none"
                />
              </div>
            )}

            {/* Rationale Input */}
            <div className="space-y-1.5">
              <label className="font-mono text-[9px] uppercase tracking-widest text-[#8C8A94]">
                Audit Rationale (Mandatory for Compliance Logging)
              </label>
              <textarea
                value={adjudicationRationale}
                onChange={(e) => setAdjudicationRationale(e.target.value)}
                placeholder="State operational grounds for this adjudication (e.g. v3.0 supersedes v2.4 per SecOps directive 2026-03)..."
                rows={3}
                className="w-full resize-none rounded-[8px] border border-white/10 bg-[#151417] p-3 text-xs text-[#F7F3EA] placeholder:text-[#8C8A94] focus:border-[#C9A227]/60 focus:outline-none"
              />
            </div>

            {/* Submit / Cancel */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedConflict(null)}
                className="px-4 py-2 rounded-[8px] border border-white/10 bg-[#151417] text-xs font-mono text-[#8C8A94] hover:text-[#F7F3EA]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolve}
                disabled={isSubmitting || adjudicationRationale.trim().length < 5}
                className="px-4 py-2 rounded-[8px] bg-[#9E1B32] hover:bg-[#BA243F] border border-[#C9A227]/40 text-xs font-mono font-bold text-[#F7F3EA] shadow-md shadow-[#9E1B32]/30 disabled:opacity-40 transition-all"
              >
                {isSubmitting ? "Committing Audit Log..." : "Commit Adjudication"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { useAuth } from "@clerk/nextjs";
import { useApi } from "./use-api";

export function useAnalytics() {
  const api = useApi();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const ready = Boolean(isLoaded && isSignedIn);

  const fetcher = useCallback(
    async (url: string) => {
      const token = await getToken();
      const res = await api.get(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      return res.data;
    },
    [api, getToken],
  );

  const { data: overview, error: overviewError, isLoading: overviewLoading } = useSWR(
    ready ? "/analytics/overview" : null,
    fetcher,
    { refreshInterval: 30000 },
  );

  const { data: usage, error: usageError, isLoading: usageLoading } = useSWR(
    ready ? "/analytics/usage" : null,
    fetcher,
    { refreshInterval: 60000 },
  );

  const { data: conversations, error: conversationsError, isLoading: conversationsLoading } = useSWR(
    ready ? "/analytics/conversations" : null,
    fetcher,
    { refreshInterval: 30000 },
  );

  const { data: documents, error: documentsError, isLoading: documentsLoading } = useSWR(
    ready ? "/analytics/documents" : null,
    fetcher,
    { refreshInterval: 60000 },
  );

  const { data: health, error: healthError, isLoading: healthLoading } = useSWR(
    ready ? "/analytics/health" : null,
    fetcher,
    { refreshInterval: 300000 },
  );

  return {
    overview,
    usage,
    conversations,
    documents,
    health,
    isLoading:
      !ready ||
      overviewLoading ||
      usageLoading ||
      conversationsLoading ||
      documentsLoading ||
      healthLoading,
    isError: Boolean(
      ready &&
        (overviewError || usageError || conversationsError || documentsError || healthError),
    ),
  };
}

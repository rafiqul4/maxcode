"use client";

import { useEffect, useState } from "react";
import { getData, healthCheck } from "@/services/api";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { HealthData, SampleData } from "@/types/api";

interface ApiStatusState {
  health: HealthData | null;
  sampleData: SampleData | null;
  isLoading: boolean;
  error: string | null;
}

export function ApiStatusPanel() {
  const [state, setState] = useState<ApiStatusState>({
    health: null,
    sampleData: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
      setState((current) => ({ ...current, isLoading: true, error: null }));

      try {
        const [healthResponse, dataResponse] = await Promise.all([healthCheck(), getData()]);

        if (!isMounted) {
          return;
        }

        setState({
          health: healthResponse.data,
          sampleData: dataResponse.data,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState({
          health: null,
          sampleData: null,
          isLoading: false,
          error: error instanceof Error ? error.message : "Failed to load API status.",
        });
      }
    }

    void loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  if (state.isLoading) {
    return (
      <section className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-1)] px-5 py-5 shadow-[var(--card-shadow)] md:px-6">
        <LoadingSpinner />
      </section>
    );
  }

  if (state.error) {
    return (
      <section className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-1)] px-5 py-5 shadow-[var(--card-shadow)] md:px-6">
        <ErrorBanner message={state.error} />
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-[var(--border-color)] bg-[var(--surface-1)] px-5 py-5 shadow-[var(--card-shadow)] md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-dim)]">Deployment check</p>
          <h2 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">Frontend connected to backend</h2>
        </div>
        <span className="rounded-full border border-[var(--accent)] bg-[rgba(240,180,41,0.08)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
          {state.health?.status ?? "unknown"}
        </span>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-dim)]">Health</p>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{state.health?.timestamp ?? "No timestamp available"}</p>
        </article>

        <article className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface-2)] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-dim)]">Sample data</p>
          <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{state.sampleData?.title}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{state.sampleData?.description}</p>
        </article>
      </div>
    </section>
  );
}
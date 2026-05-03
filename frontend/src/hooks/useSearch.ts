/**
 * Custom hook for searching with debouncing
 */

import { useEffect, useState } from "react";
import { apiConfig, apiFetch } from "../utils/api";
import type { SearchResult, SearchResponse } from "../types";

interface UseSearchOptions {
  debounceMs?: number;
  maxResults?: number;
}

export function useSearch(options: UseSearchOptions = {}) {
  const { debounceMs = 250, maxResults = 40 } = options;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `${apiConfig.endpoints.search}?q=${encodeURIComponent(searchQuery)}`;
      const response = await apiFetch<SearchResponse>(url);
      setResults(response.results.slice(0, maxResults));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to search";
      setError(message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;
    const timeoutId = window.setTimeout(() => {
      if (!isActive) return;
      void performSearch(query);
    }, debounceMs);

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [query, debounceMs]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}

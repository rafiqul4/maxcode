/**
 * Custom hook for searching with debouncing
 */

import { useEffect, useState } from "react";
import { searchQuran } from "../services/api";
import type { SearchResult } from "../types";

interface UseSearchOptions {
  debounceMs?: number;
  maxResults?: number;
}

interface UseSearchResult {
  query: string;
  setQuery: (value: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchResult {
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
      const response = await searchQuran(searchQuery);
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

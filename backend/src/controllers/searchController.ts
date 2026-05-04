import type { Context } from "hono";
import { searchQuran, validateSearchQuery } from "../lib/quran.js";
import type { ErrorResponse, SearchResponse } from "../types/quran.js";

export function getSearchResults(c: Context): Response {
  const query = c.req.query("q");

  if (!validateSearchQuery(query)) {
    const error: ErrorResponse = {
      error: "Query parameter 'q' must be at least 2 characters",
      status: 400,
      timestamp: new Date().toISOString(),
    };

    return c.json(error, 400);
  }

  const results = searchQuran(query, 40);

  const response: SearchResponse = {
    results,
    total: results.length,
    query,
  };

  return c.json(response, 200);
}
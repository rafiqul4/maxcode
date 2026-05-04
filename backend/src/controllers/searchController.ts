import type { Context } from "hono";
import { searchQuran, validateSearchQuery } from "../lib/quran.js";
import type { ApiResponse } from "../types/api.js";
import type { SearchResponse } from "../types/quran.js";

export function getSearchResults(c: Context): Response {
  const query = c.req.query("q");

  if (!validateSearchQuery(query)) {
    const error: ApiResponse<null> = {
      success: false,
      data: null,
      error: "Query parameter 'q' must be at least 2 characters",
    };

    return c.json(error, 400);
  }

  const results = searchQuran(query, 40);

  const data: SearchResponse = {
    results,
    total: results.length,
    query,
  };

  const response: ApiResponse<SearchResponse> = {
    success: true,
    data,
    message: "Search results loaded successfully.",
  };

  return c.json(response, 200);
}
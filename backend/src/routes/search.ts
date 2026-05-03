import { Hono } from "hono";
import type { Context } from "hono";
import { searchQuran, validateSearchQuery } from "../lib/quran.js";
import type { SearchResponse, ErrorResponse } from "../types/quran.js";

const searchRouter = new Hono();

/**
 * GET /search?q=query
 * Search Quran verses by translation or Arabic text
 */
searchRouter.get("/", (c: Context) => {
  try {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Search error:", message);

    const errorResponse: ErrorResponse = {
      error: message,
      status: 500,
      timestamp: new Date().toISOString(),
    };

    return c.json(errorResponse, 500);
  }
});

export default searchRouter;

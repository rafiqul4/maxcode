import { Hono } from "hono";
import searchRouter from "./routes/search.js";
import healthRouter from "./routes/health.js";
import dataRouter from "./routes/data.js";
import { corsMiddleware } from "./middleware/cors.js";
import { handleError } from "./middleware/errorHandler.js";
import type { ApiResponse } from "./types/api.js";

const app = new Hono();

app.use("*", corsMiddleware);

app.get("/", (c) => {
  const response: ApiResponse<{
    name: string;
    version: string;
    endpoints: Record<string, string>;
  }> = {
    success: true,
    data: {
      name: "Quran API",
      version: "1.0.0",
      endpoints: {
        health: "/api/health",
        data: "/api/data",
        search: "/api/search?q=query",
      },
    },
    message: "API root loaded successfully.",
  };

  return c.json(response, 200);
});

app.route("/api/search", searchRouter);
app.route("/api/health", healthRouter);
app.route("/api/data", dataRouter);

app.notFound((c) => {
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    error: `Endpoint not found: ${c.req.path}`,
  };

  return c.json(response, 404);
});

app.onError(handleError);

export default app;

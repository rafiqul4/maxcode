import { Hono } from "hono";
import searchRouter from "./routes/search.js";
import healthRouter from "./routes/health.js";
import { corsMiddleware } from "./middleware/cors.js";
import { handleError } from "./middleware/errorHandler.js";

const app = new Hono();

app.use("*", corsMiddleware);

app.get("/", (c) => {
  return c.json(
    {
      name: "Quran API",
      version: "1.0.0",
      environment: process.env.NODE_ENV ?? "development",
      endpoints: {
        search: "/search?q=query",
        health: "/health",
      },
    },
    200
  );
});

app.route("/search", searchRouter);
app.route("/health", healthRouter);

app.notFound((c) => {
  return c.json(
    {
      error: "Endpoint not found",
      status: 404,
      path: c.req.path,
      timestamp: new Date().toISOString(),
    },
    404
  );
});

app.onError(handleError);

export default app;

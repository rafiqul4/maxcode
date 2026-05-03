import { Hono } from "hono";
import type { Context } from "hono";
import searchRouter from "./routes/search.js";
import healthRouter from "./routes/health.js";
import { env, isDevelopment } from "./lib/env.js";

const app = new Hono();

app.use("*", async (c: Context, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  c.header("X-Powered-By", "Hono");

  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }

  await next();
});

if (isDevelopment) {
  app.use("*", async (c: Context, next) => {
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    console.log(`${c.req.method} ${c.req.path} - ${duration}ms`);
  });
}

app.get("/", (c: Context) => {
  return c.json(
    {
      name: "Quran API",
      version: "1.0.0",
      environment: env.NODE_ENV,
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

app.notFound((c: Context) => {
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

app.onError((err, c: Context) => {
  console.error("Unhandled error:", err);

  return c.json(
    {
      error: isDevelopment ? err.message : "Internal server error",
      status: 500,
      timestamp: new Date().toISOString(),
    },
    500
  );
});

export default app;

import { Hono } from "hono";
import type { Context } from "hono";
import { isDevelopment, isProduction } from "../lib/env.js";
import type { HealthResponse } from "../types/quran.js";

const healthRouter = new Hono();

const startTime = Date.now();

/**
 * GET /health
 * Health check endpoint for monitoring
 */
healthRouter.get("/", (c: Context) => {
  const uptime = Date.now() - startTime;

  const response: HealthResponse = {
    status: "healthy",
    uptime,
    timestamp: new Date().toISOString(),
    environment: isProduction ? "production" : isDevelopment ? "development" : "test",
  };

  return c.json(response, 200);
});

export default healthRouter;

import type { Context } from "hono";
import { isDevelopment, isProduction } from "../lib/env.js";
import type { HealthResponse } from "../types/quran.js";

const startTime = Date.now();

export function getHealth(c: Context): Response {
  const response: HealthResponse = {
    status: "healthy",
    uptime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
    environment: isProduction ? "production" : isDevelopment ? "development" : "test",
  };

  return c.json(response, 200);
}
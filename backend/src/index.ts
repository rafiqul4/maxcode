import { serve } from "@hono/node-server";
import app from "./app.js";
import { env } from "./lib/env.js";

/**
 * Start server
 */
serve({ fetch: app.fetch, port: env.PORT });

// Graceful shutdown
process.on("SIGTERM", () => {
  process.exit(0);
});

process.on("SIGINT", () => {
  process.exit(0);
});


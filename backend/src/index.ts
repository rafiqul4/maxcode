import { serve } from "@hono/node-server";
import app from "./app.js";
import { env } from "./lib/env.js";

/**
 * Start server
 */
const port = env.PORT;

serve({ fetch: app.fetch, port });

console.log(`
✅ Quran API Server Started
   Environment: ${env.NODE_ENV}
   URL: http://localhost:${port}
   Search: http://localhost:${port}/search?q=light
   Health: http://localhost:${port}/health
`);

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully...");
  process.exit(0);
});


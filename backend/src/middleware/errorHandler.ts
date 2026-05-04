import type { Context } from "hono";
import { isDevelopment } from "../lib/env.js";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Internal server error";
}

export function handleError(error: Error, c: Context): Response {
  console.error("Unhandled error:", error);

  return c.json(
    {
      error: isDevelopment ? getErrorMessage(error) : "Internal server error",
      status: 500,
      timestamp: new Date().toISOString(),
    },
    500
  );
}
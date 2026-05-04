import type { Context } from "hono";
import { isDevelopment } from "../config/env.js";
import type { ApiResponse } from "../types/api.js";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Internal server error";
}

export function handleError(error: Error, c: Context): Response {
  const response: ApiResponse<null> = {
    success: false,
    data: null,
    error: isDevelopment ? getErrorMessage(error) : "Internal server error",
  };

  return c.json(response, 500);
}
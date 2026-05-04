import type { Context } from "hono";
import type { ApiResponse, HealthData } from "../types/api.js";

export function getHealth(c: Context): Response {
  const data: HealthData = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  const response: ApiResponse<HealthData> = {
    success: true,
    data,
    message: "Service is healthy.",
  };

  return c.json(response, 200);
}
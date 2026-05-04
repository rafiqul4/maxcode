import type { Context } from "hono";
import { sampleData } from "../models/sampleData.js";
import type { ApiResponse, SampleData } from "../types/api.js";

export function getSampleData(c: Context): Response {
  const response: ApiResponse<SampleData> = {
    success: true,
    data: sampleData,
    message: "Sample data loaded successfully.",
  };

  return c.json(response, 200);
}
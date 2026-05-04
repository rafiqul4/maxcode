import type { ApiResponse, HealthData, SampleData, SearchData } from "@/types/api";

const DEFAULT_FETCH_ERROR = "The request could not be completed.";

export interface ApiErrorResponse {
  error: string;
  status: number;
  timestamp: string;
}

function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  return apiUrl.replace(/\/$/, "");
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, `${getApiBaseUrl()}/`).toString();
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(buildApiUrl(path), {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as ApiErrorResponse | null;
      const message = errorBody?.error ?? `API error: ${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    return (await response.json()) as ApiResponse<T>;
  } catch (error) {
    const message = error instanceof Error ? error.message : DEFAULT_FETCH_ERROR;
    throw new Error(`Failed to fetch: ${message}`);
  }
}

export async function healthCheck(): Promise<ApiResponse<HealthData>> {
  return apiFetch<HealthData>("/health");
}

export async function getData(): Promise<ApiResponse<SampleData>> {
  return apiFetch<SampleData>("/data");
}

export async function searchQuran(query: string): Promise<ApiResponse<SearchData>> {
  return apiFetch<SearchData>(`/search?q=${encodeURIComponent(query)}`);
}
/**
 * API configuration and utilities
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    search: `${API_BASE_URL}/search`,
    health: `${API_BASE_URL}/health`,
  },
} as const;

/**
 * Custom fetch wrapper with error handling
 */
export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to fetch: ${message}`);
  }
}

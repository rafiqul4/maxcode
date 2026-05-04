import "dotenv/config";

/**
 * Environment variable validation
 */

export interface Environment {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  ALLOWED_ORIGINS: string[];
}

function parseOrigins(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function getEnvironment(): Environment {
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  const nodeEnv = (process.env.NODE_ENV || "development") as Environment["NODE_ENV"];

  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}`);
  }

  return {
    PORT: port,
    NODE_ENV: nodeEnv,
    ALLOWED_ORIGINS: parseOrigins(process.env.ALLOWED_ORIGINS ?? process.env.FRONTEND_ORIGIN),
  };
}

export const env = getEnvironment();

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

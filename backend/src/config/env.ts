import "dotenv/config";

export interface Environment {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  CORS_ORIGIN: string[];
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
    CORS_ORIGIN: parseOrigins(process.env.CORS_ORIGIN),
  };
}

export const env = getEnvironment();

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";

/**
 * Environment variable validation
 */

interface Environment {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
}

function getEnvironment(): Environment {
  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  const nodeEnv = (process.env.NODE_ENV || "development") as "development" | "production" | "test";

  if (Number.isNaN(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid PORT: ${process.env.PORT}`);
  }

  return {
    PORT: port,
    NODE_ENV: nodeEnv,
  };
}

export const env = getEnvironment();

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";

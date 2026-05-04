import type { Context, Next } from "hono";
import { env, isDevelopment } from "../lib/env.js";

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  if (env.ALLOWED_ORIGINS.length === 0) {
    return isDevelopment;
  }

  return env.ALLOWED_ORIGINS.includes(origin);
}

export async function corsMiddleware(c: Context, next: Next): Promise<Response | void> {
  const requestOrigin = c.req.header("Origin");

  if (isOriginAllowed(requestOrigin) && requestOrigin) {
    c.header("Access-Control-Allow-Origin", requestOrigin);
    c.header("Vary", "Origin");
  }

  c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  c.header("Access-Control-Allow-Credentials", "true");
  c.header("X-Powered-By", "Hono");

  if (c.req.method === "OPTIONS") {
    return c.body(null, 204);
  }

  await next();
}
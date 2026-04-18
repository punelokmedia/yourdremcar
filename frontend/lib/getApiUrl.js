const DEV_API_URL = "http://localhost:5000/api";

/**
 * Backend API base (must end with /api for this codebase).
 *
 * Production options:
 * 1) Full URL: NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
 * 2) Same-origin + rewrites: set BACKEND_ORIGIN on Vercel (frontend project) and
 *    NEXT_PUBLIC_API_URL=/api so fetch("/api/cars") is proxied to the real API.
 */
export function getApiUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) {
    const c = configured.replace(/\/$/, "");
    if (c === "/api" || c === "") return "/api";
    return c;
  }
  if (process.env.NODE_ENV === "development") return DEV_API_URL;
  return "";
}

export function isApiUrlConfigured() {
  return Boolean(getApiUrl());
}

export const MISSING_NEXT_PUBLIC_API_URL =
  "Set NEXT_PUBLIC_API_URL on the frontend (full backend URL ending in /api, or /api if BACKEND_ORIGIN rewrites are configured), redeploy, then refresh.";

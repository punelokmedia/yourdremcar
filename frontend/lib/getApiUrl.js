const DEV_API_URL = "http://localhost:5000/api";

/**
 * Backend API base (must end with /api in this project).
 * Production: set NEXT_PUBLIC_API_URL on the frontend (e.g. https://your-backend.vercel.app/api).
 * Do not rely on same-origin /api unless you added Next.js rewrites — split deploys need the full URL.
 */
export function getApiUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.NODE_ENV === "development") return DEV_API_URL;
  return "";
}

export function isApiUrlConfigured() {
  return Boolean(getApiUrl());
}

/** Shown when production build has no NEXT_PUBLIC_API_URL (split frontend/backend). */
export const MISSING_NEXT_PUBLIC_API_URL =
  "Set NEXT_PUBLIC_API_URL on the frontend (e.g. https://your-backend.vercel.app/api), redeploy, then refresh.";

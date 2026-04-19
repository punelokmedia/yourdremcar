const DEV_API_URL = "http://localhost:5000/api";

/**
 * If the user sets only the origin (e.g. https://yourdremcar.vercel.app) without /api,
 * fetches go to /cars on the Next.js app and return HTML → "Unexpected token '<'" on .json().
 */
function normalizeConfiguredApiUrl(configured) {
  const c = configured.trim().replace(/\/$/, "");
  if (c === "/api" || c === "") return "/api";

  // "https://host" or "https://host:port" with no path — append /api
  if (/^https?:\/\/[^/?#]+$/i.test(c)) {
    return `${c}/api`;
  }

  try {
    const withProto = /^https?:\/\//i.test(c) ? c : `https://${c}`;
    const u = new URL(withProto);
    const path = (u.pathname || "").replace(/\/$/, "") || "/";
    if (path === "/") {
      return `${u.origin}/api`;
    }
  } catch {
    // keep c
  }
  return c;
}

/**
 * Backend API base (must end with /api for this codebase).
 *
 * Production options:
 * 1) Full URL: NEXT_PUBLIC_API_URL=https://your-backend.vercel.app/api
 *    (Bare https://your-backend.vercel.app is accepted and normalized to .../api)
 * 2) Same-origin + rewrites: set BACKEND_ORIGIN on Vercel (frontend project) and
 *    NEXT_PUBLIC_API_URL=/api so fetch("/api/cars") is proxied to the real API.
 */
export function getApiUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) {
    return normalizeConfiguredApiUrl(configured);
  }
  if (process.env.NODE_ENV === "development") return DEV_API_URL;
  return "";
}

export function isApiUrlConfigured() {
  return Boolean(getApiUrl());
}

/**
 * Build a full request URL: base (/api) + path segment (e.g. "sell-requests").
 * Avoids duplicate or missing slashes.
 */
export function apiUrl(...pathSegments) {
  const base = getApiUrl().replace(/\/+$/, "");
  const path = pathSegments
    .map((s) => String(s).replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  return path ? `${base}/${path}` : base;
}

export const MISSING_NEXT_PUBLIC_API_URL =
  "Set NEXT_PUBLIC_API_URL on the frontend (full backend URL ending in /api, or /api if BACKEND_ORIGIN rewrites are configured), redeploy, then refresh.";

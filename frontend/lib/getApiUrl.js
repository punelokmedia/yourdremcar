const DEV_API_URL = "http://localhost:5000/api";

/**
 * Never default to localhost in production; it triggers private-network prompts.
 * If NEXT_PUBLIC_API_URL is missing in production, use same-origin /api.
 */
export function getApiUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return process.env.NODE_ENV === "development" ? DEV_API_URL : "/api";
}


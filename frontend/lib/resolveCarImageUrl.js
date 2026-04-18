const DEFAULT_DEV_API = "http://localhost:5000/api";

function getApiOrigin(apiUrl) {
  const raw = (apiUrl || "").trim();
  // Relative bases (e.g. "/api") cannot produce a real origin — would break rewriting.
  if (!raw || raw.startsWith("/")) return "";
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return u.origin;
  } catch {
    return "";
  }
}

/**
 * Maps localhost / relative upload URLs to the deployed API origin (NEXT_PUBLIC_API_URL).
 * Leaves Cloudinary and other absolute URLs unchanged.
 */
export function resolveCarImageUrl(imageUrl, apiUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return "";
  const resolvedApi =
    apiUrl ??
    (typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_URL : undefined);
  const effectiveBase =
    (resolvedApi && String(resolvedApi).trim()) ||
    (process.env.NODE_ENV === "development" ? DEFAULT_DEV_API : "");
  const origin = getApiOrigin(effectiveBase);
  const trim = imageUrl.trim();
  if (!trim) return "";

  try {
    const u = new URL(trim);
    const h = u.hostname.toLowerCase();
    if (u.protocol === "http:" && h !== "localhost" && h !== "127.0.0.1") {
      return `https://${u.host}${u.pathname}${u.search}${u.hash}`;
    }
    if (h === "localhost" || h === "127.0.0.1") {
      if (origin) return `${origin}${u.pathname}${u.search}${u.hash}`;
      return `${u.pathname}${u.search}${u.hash}`;
    }
    return trim;
  } catch {
    if (trim.startsWith("/uploads/")) {
      return origin ? `${origin}${trim}` : trim;
    }
    return trim;
  }
}

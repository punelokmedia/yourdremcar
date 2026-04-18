const DEFAULT_API_URL = "http://localhost:5000/api";

function getApiOrigin(apiUrl) {
  const raw = (apiUrl || DEFAULT_API_URL).trim();
  try {
    const u = new URL(raw.includes("://") ? raw : `http://${raw}`);
    return u.origin;
  } catch {
    return new URL(DEFAULT_API_URL).origin;
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
  const origin = getApiOrigin(resolvedApi);
  const trim = imageUrl.trim();
  if (!trim) return "";

  try {
    const u = new URL(trim);
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h === "127.0.0.1") {
      return `${origin}${u.pathname}${u.search}${u.hash}`;
    }
    return trim;
  } catch {
    if (trim.startsWith("/uploads/")) {
      return `${origin}${trim}`;
    }
    return trim;
  }
}

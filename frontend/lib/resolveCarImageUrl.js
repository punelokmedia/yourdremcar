const DEFAULT_DEV_API = "http://localhost:5000/api";

function getApiOrigin(apiUrl) {
  const raw = (apiUrl || "").trim();
  if (!raw || raw.startsWith("/")) return "";
  try {
    const u = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return u.origin;
  } catch {
    return "";
  }
}

function effectiveApiBase(apiUrl) {
  const passed = apiUrl?.trim?.();
  if (passed) return passed;
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL?.trim()) {
    return process.env.NEXT_PUBLIC_API_URL.trim();
  }
  return process.env.NODE_ENV === "development" ? DEFAULT_DEV_API : "";
}

/**
 * Origin used to turn localhost/relative upload paths into absolute URLs on deploy.
 * - Full NEXT_PUBLIC_API_URL → backend origin
 * - Same-origin proxy (/api + rewrites): use NEXT_PUBLIC_SITE_ORIGIN or browser origin
 */
function getImagePublicOrigin(apiUrl) {
  const base = effectiveApiBase(apiUrl);
  const fromApi = getApiOrigin(base);
  if (fromApi) return fromApi;

  const site =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_SITE_ORIGIN?.trim()?.replace(/\/$/, "")
      : "";
  if (site) return site;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

/**
 * Maps localhost / relative upload URLs to a working HTTPS URL on production.
 * Leaves Cloudinary and other absolute URLs unchanged.
 */
export function resolveCarImageUrl(imageUrl, apiUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return "";
  const publicOrigin = getImagePublicOrigin(apiUrl);

  let trim = imageUrl.trim().replace(/\u00a0/g, "");
  if (!trim) return "";

  if (trim.startsWith("//")) {
    trim = `https:${trim}`;
  }

  if (
    !/^https?:\/\//i.test(trim) &&
    (trim.startsWith("res.cloudinary.com/") || trim.includes("res.cloudinary.com/"))
  ) {
    trim = `https://${trim.replace(/^\/+/, "")}`;
  }

  try {
    const u = new URL(trim);
    const h = u.hostname.toLowerCase();
    if (u.protocol === "http:" && h !== "localhost" && h !== "127.0.0.1") {
      return `https://${u.host}${u.pathname}${u.search}${u.hash}`;
    }
    if (h === "localhost" || h === "127.0.0.1") {
      if (publicOrigin) return `${publicOrigin}${u.pathname}${u.search}${u.hash}`;
      return `${u.pathname}${u.search}${u.hash}`;
    }
    return trim;
  } catch {
    if (trim.startsWith("/uploads/")) {
      return publicOrigin ? `${publicOrigin}${trim}` : trim;
    }
    if (/^car-\d+-[a-z0-9]+\.(png|jpe?g|webp)$/i.test(trim) && publicOrigin) {
      return `${publicOrigin}/uploads/${trim}`;
    }
    return trim;
  }
}

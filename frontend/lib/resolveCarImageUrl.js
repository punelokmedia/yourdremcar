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
 * Where /uploads/* files are reachable in production.
 * Order matters when NEXT_PUBLIC_API_URL is `/api` (no origin in the string) — SSR needs env.
 */
function getUploadsBaseOrigin(apiUrl) {
  const fromEnv = (key) =>
    typeof process !== "undefined"
      ? process.env[key]?.trim()?.replace(/\/$/, "") || ""
      : "";

  const explicit = fromEnv("NEXT_PUBLIC_UPLOADS_ORIGIN");
  if (explicit) return explicit;

  const backend = fromEnv("NEXT_PUBLIC_BACKEND_ORIGIN");
  if (backend) return backend;

  const fromApi = getApiOrigin(effectiveApiBase(apiUrl));
  if (fromApi) return fromApi;

  const site = fromEnv("NEXT_PUBLIC_SITE_ORIGIN");
  if (site) return site;

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
}

/**
 * Maps localhost / relative upload URLs to a working HTTPS URL on production.
 * Leaves Cloudinary, Vercel Blob, and other absolute URLs unchanged.
 */
export function resolveCarImageUrl(imageUrl, apiUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return "";
  const uploadsBase = getUploadsBaseOrigin(apiUrl);

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
      if (uploadsBase) return `${uploadsBase}${u.pathname}${u.search}${u.hash}`;
      return `${u.pathname}${u.search}${u.hash}`;
    }
    return trim;
  } catch {
    if (trim.startsWith("/uploads/")) {
      return uploadsBase ? `${uploadsBase}${trim}` : trim;
    }
    if (/^car-\d+-[a-z0-9]+\.(png|jpe?g|webp)$/i.test(trim) && uploadsBase) {
      return `${uploadsBase}/uploads/${trim}`;
    }
    return trim;
  }
}

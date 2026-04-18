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
 * Maps localhost / relative upload URLs to the deployed API origin (NEXT_PUBLIC_API_URL).
 * Leaves Cloudinary and other absolute URLs unchanged.
 */
export function resolveCarImageUrl(imageUrl, apiUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return "";
  const base = effectiveApiBase(apiUrl);
  const origin = getApiOrigin(base);

  let trim = imageUrl.trim().replace(/\u00a0/g, "");
  if (!trim) return "";

  // Protocol-relative (//res.cloudinary.com/...)
  if (trim.startsWith("//")) {
    trim = `https:${trim}`;
  }

  // Common mistake: "res.cloudinary.com/..." without scheme
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
      if (origin) return `${origin}${u.pathname}${u.search}${u.hash}`;
      return `${u.pathname}${u.search}${u.hash}`;
    }
    return trim;
  } catch {
    if (trim.startsWith("/uploads/")) {
      return origin ? `${origin}${trim}` : trim;
    }
    // Bare filename stored by mistake — only when it looks like our upload names
    if (/^car-\d+-[a-z0-9]+\.(png|jpe?g|webp)$/i.test(trim) && origin) {
      return `${origin}/uploads/${trim}`;
    }
    return trim;
  }
}

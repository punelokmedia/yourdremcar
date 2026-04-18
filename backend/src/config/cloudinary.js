import { v2 as cloudinary } from "cloudinary";

const normalizeEnv = (value) => {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim().replace(/^\uFEFF/, "");
  return trimmed.replace(/^["']|["']$/g, "");
};

const cloudinaryUrl = normalizeEnv(process.env.CLOUDINARY_URL);
const cloudName = normalizeEnv(
  process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME
);
const apiKey = normalizeEnv(process.env.CLOUDINARY_API_KEY || process.env.API_KEY);
const apiSecret = normalizeEnv(
  process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET
);

const hasExplicitTriple = Boolean(cloudName && apiKey && apiSecret);

/**
 * Prefer CLOUDINARY_CLOUD_NAME + KEY + SECRET when all three are set.
 * If CLOUDINARY_URL is also set with different credentials, using the URL alone causes 401/403.
 */
export const isCloudinaryConfigured = () =>
  Boolean(hasExplicitTriple || cloudinaryUrl);

if (isCloudinaryConfigured()) {
  if (hasExplicitTriple) {
    // Never mix: if CLOUDINARY_URL is also set in the dashboard with old/wrong values,
    // the SDK must only use the three explicit vars (see isCloudinaryConfigured).
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  } else if (cloudinaryUrl) {
    cloudinary.config({ cloudinary_url: cloudinaryUrl, secure: true });
  }
}

export default cloudinary;

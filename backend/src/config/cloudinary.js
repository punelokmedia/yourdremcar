import { v2 as cloudinary } from "cloudinary";

const normalizeEnv = (value) => {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  // Handles accidental wrapping quotes from copy/paste in env dashboards.
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

/** All three must be set, or uploads should use local /uploads only. */
export const isCloudinaryConfigured = () =>
  Boolean(cloudinaryUrl || (cloudName && apiKey && apiSecret));

if (isCloudinaryConfigured()) {
  if (cloudinaryUrl) {
    cloudinary.config({ cloudinary_url: cloudinaryUrl });
  } else {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }
}

export default cloudinary;

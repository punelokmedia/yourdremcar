import { v2 as cloudinary } from "cloudinary";

const normalizeEnv = (value) => {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  // Handles accidental wrapping quotes from copy/paste in env dashboards.
  return trimmed.replace(/^["']|["']$/g, "");
};

const cloudName = normalizeEnv(process.env.CLOUDINARY_CLOUD_NAME);
const apiKey = normalizeEnv(process.env.CLOUDINARY_API_KEY);
const apiSecret = normalizeEnv(process.env.CLOUDINARY_API_SECRET);

/** All three must be set, or uploads should use local /uploads only. */
export const isCloudinaryConfigured = () =>
  Boolean(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export default cloudinary;

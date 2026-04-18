/** Browser → Cloudinary (unsigned preset). Avoids server API secret for the upload step on Vercel. */

export function isDirectCloudinaryUploadEnabled() {
  return Boolean(
    typeof process !== "undefined" &&
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim()
  );
}

/**
 * @returns {{ secure_url: string, public_id: string }}
 */
export async function uploadCarImageClientSide(file) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();
  if (!file || !cloud || !preset) {
    throw new Error("Cloudinary direct upload is not configured");
  }
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", preset);
  fd.append("folder", "car-sells");
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloud)}/image/upload`,
    { method: "POST", body: fd }
  );
  const data = await res.json();
  if (!res.ok) {
    const msg = data.error?.message || "Cloudinary upload failed";
    throw new Error(msg);
  }
  return { secure_url: data.secure_url, public_id: data.public_id };
}

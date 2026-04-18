import Car from "../models/Car.js";
import cloudinary, {
  isCloudinaryConfigured,
} from "../config/cloudinary.js";
import { del as deleteBlob, put as putBlob } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

const uploadImageToCloudinary = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "car-sells" },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(result);
      }
    );

    stream.end(fileBuffer);

  });

const isServerlessRuntime = () =>
  Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.RENDER ||
    process.env.RAILWAY_ENVIRONMENT ||
    process.env.FLY_APP_NAME
  );

const SERVERLESS_UPLOAD_MESSAGE =
  "Image upload failed. On Vercel (backend project): add BLOB_READ_WRITE_TOKEN — Dashboard → Storage → Blob → copy token into Environment Variables, then redeploy. Or fix CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (remove conflicting CLOUDINARY_URL if present). Local disk is not available on serverless.";

const saveImageLocally = async (fileBuffer, originalName = "car-image.jpg") => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const ext = path.extname(originalName) || ".jpg";
  const safeExt = ext.slice(0, 6);
  const fileName = `car-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt}`;
  const filePath = path.join(uploadsDir, fileName);
  await fs.writeFile(filePath, fileBuffer);
  return fileName;
};

const isBlobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

const uploadBufferToVercelBlob = async (fileBuffer, originalName = "car.jpg") => {
  const ext = path.extname(originalName) || ".jpg";
  const safeExt = ext.slice(0, 8);
  const pathname = `car-sells/car-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) throw new Error("BLOB_READ_WRITE_TOKEN missing");
  const lower = safeExt.toLowerCase();
  const contentType =
    lower === ".png"
      ? "image/png"
      : lower === ".webp"
        ? "image/webp"
        : lower === ".gif"
          ? "image/gif"
          : "image/jpeg";
  const result = await putBlob(pathname, fileBuffer, {
    access: "public",
    token,
    contentType,
  });
  return result.url;
};

const deleteBlobImageIfAny = async (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return;
  if (!imageUrl.includes("blob.vercel-storage.com")) return;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return;
  try {
    await deleteBlob(imageUrl, { token });
  } catch {
    /* ignore */
  }
};

/** After a new image is saved, remove the previous asset (Cloudinary / Blob / local). */
const deleteStoredImage = async (imageUrl, imagePublicId) => {
  if (imagePublicId && isCloudinaryConfigured()) {
    try {
      await cloudinary.uploader.destroy(imagePublicId);
      return;
    } catch {
      /* fall through */
    }
  }
  await deleteBlobImageIfAny(imageUrl);
  await deleteLocalImageIfAny(imageUrl);
};

/**
 * Serverless (Vercel): Vercel Blob first when BLOB_READ_WRITE_TOKEN is set — one env var, no Cloudinary needed.
 * Then Cloudinary (if configured). Non-serverless: Cloudinary → Blob → local ./uploads.
 */
const persistUploadedFile = async (fileBuffer, originalName, req) => {
  let warning = "";
  let blobAttempted = false;

  const tryBlob = async () => {
    if (!isBlobConfigured()) return null;
    blobAttempted = true;
    try {
      const url = await uploadBufferToVercelBlob(fileBuffer, originalName);
      return { imageUrl: url, imagePublicId: "" };
    } catch (blobErr) {
      console.error("Vercel Blob upload error:", blobErr);
      warning += `Vercel Blob failed: ${blobErr.message}. `;
      return null;
    }
  };

  if (isServerlessRuntime() && isBlobConfigured()) {
    const blobFirst = await tryBlob();
    if (blobFirst) {
      return {
        imageUrl: blobFirst.imageUrl,
        imagePublicId: "",
        warning: undefined,
      };
    }
  }

  if (shouldUseCloudinaryUpload()) {
    try {
      const uploaded = await uploadImageToCloudinary(fileBuffer);
      return {
        imageUrl: uploaded.secure_url,
        imagePublicId: uploaded.public_id,
        warning: warning || undefined,
      };
    } catch (uploadError) {
      logCloudinaryFailure(uploadError);
      warning += "Cloudinary upload failed; trying other storage. ";
    }
  }

  if (isBlobConfigured() && !blobAttempted) {
    const blobSecond = await tryBlob();
    if (blobSecond) {
      const w = warning.trim();
      return {
        imageUrl: blobSecond.imageUrl,
        imagePublicId: "",
        warning: w ? `${w} Stored with Vercel Blob.` : undefined,
      };
    }
  }

  if (!isServerlessRuntime()) {
    const localFileName = await saveImageLocally(fileBuffer, originalName);
    const baseUrl = getPublicBaseUrl(req);
    return {
      imageUrl: `${baseUrl}/uploads/${localFileName}`,
      imagePublicId: "",
      warning: warning ? `${warning.trim()} Saved under ./uploads on this machine.` : undefined,
    };
  }
  throw new Error(`${warning} ${SERVERLESS_UPLOAD_MESSAGE}`);
};

/**
 * Public origin of *this API deployment* (where /uploads and Express live).
 * Never use X-Forwarded-Host alone — behind a Next.js proxy it is the marketing site, so /uploads URLs
 * would point at the frontend (404). Prefer PUBLIC_BASE_URL, then VERCEL_URL.
 */
const getDeploymentPublicOrigin = () => {
  const explicit = process.env.PUBLIC_BASE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "";
};

const getPublicBaseUrl = (req) => {
  const deploy = getDeploymentPublicOrigin();
  if (deploy) return deploy;
  const host = req.get("host");
  const proto = req.get("x-forwarded-proto") || req.protocol;
  return `${proto}://${host}`;
};

/**
 * JSON responses me imageUrl fix:
 * - `/uploads/...` → absolute using deployment origin (PUBLIC_BASE_URL / VERCEL_URL), not forwarded client host
 * - `http://localhost.../uploads/...` → same
 * - `https://frontend.vercel.app/uploads/...` (galat host DB me) → deployment origin par rewrite jab PUBLIC_BASE_URL na ho tab bhi VERCEL_URL se
 */
const normalizeImageUrlForResponse = (imageUrl, req) => {
  if (!imageUrl || typeof imageUrl !== "string") return imageUrl;
  const trimmed = imageUrl.trim();
  const deploymentOrigin = getDeploymentPublicOrigin();

  if (trimmed.startsWith("/uploads/")) {
    const origin = deploymentOrigin || getPublicBaseUrl(req);
    return `${origin}${trimmed}`;
  }

  try {
    const u = new URL(trimmed);
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h === "127.0.0.1") {
      const origin = deploymentOrigin || getPublicBaseUrl(req);
      return `${origin}${u.pathname}${u.search}${u.hash}`;
    }
    if (
      deploymentOrigin &&
      u.pathname.startsWith("/uploads/") &&
      !trimmed.includes("blob.vercel-storage.com")
    ) {
      let baseUrl;
      try {
        baseUrl = new URL(
          deploymentOrigin.startsWith("http")
            ? deploymentOrigin
            : `https://${deploymentOrigin}`
        );
      } catch {
        return trimmed;
      }
      if (u.origin !== baseUrl.origin) {
        return `${baseUrl.origin}${u.pathname}${u.search}${u.hash}`;
      }
    }
  } catch {
    return trimmed;
  }
  return trimmed;
};

const carForJson = (car, req) => {
  if (!car) return car;
  const plain =
    typeof car.toObject === "function" ? car.toObject() : { ...car };
  if (plain.imageUrl) {
    plain.imageUrl = normalizeImageUrlForResponse(plain.imageUrl, req);
  }
  return plain;
};

const getLocalImageFileFromUrl = (imageUrl) => {
  if (!imageUrl) return "";
  try {
    const parsed = new URL(imageUrl);
    const fileName = parsed.pathname.startsWith("/uploads/")
      ? parsed.pathname.replace("/uploads/", "")
      : "";
    return fileName ? path.join(process.cwd(), "uploads", fileName) : "";
  } catch (_error) {
    // Handle relative paths as fallback.
    if (imageUrl.startsWith("/uploads/")) {
      const fileName = imageUrl.replace("/uploads/", "");
      return path.join(process.cwd(), "uploads", fileName);
    }
    return "";
  }
};

const deleteLocalImageIfAny = async (imageUrl) => {
  const localFilePath = getLocalImageFileFromUrl(imageUrl);
  if (!localFilePath) return;
  try {
    await fs.unlink(localFilePath);
  } catch (_error) {
    // Ignore if file already removed or not found.
  }
};

const logCloudinaryFailure = (uploadError) => {
  const code = uploadError?.http_code ?? uploadError?.statusCode;
  console.error("Cloudinary upload error:", {
    message: uploadError?.message,
    http_code: code,
    name: uploadError?.name,
  });
  if (code === 403 || code === 401) {
    console.error(
      "Cloudinary 403/401: Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in backend/.env — copy from Cloudinary Console → Settings → API Keys (same product environment). Restart the server after changing .env."
    );
  }
};

const getCloudinaryFailureClientMessage = (uploadError) => {
  const code = uploadError?.http_code ?? uploadError?.statusCode;
  const nested =
    typeof uploadError?.error === "object" && uploadError.error?.message
      ? String(uploadError.error.message).trim()
      : "";
  const top =
    typeof uploadError?.message === "string" && uploadError.message.trim()
      ? uploadError.message.trim()
      : "";
  const reason = nested || top || "Unknown Cloudinary error";
  if (code === 401 || code === 403) {
    return `Cloudinary auth failed (${code}): ${reason}. Use API keys from the same Cloudinary product (Console → API Keys). If both CLOUDINARY_URL and CLOUDINARY_* are set, remove the wrong one or keep only the three separate vars.`;
  }
  return `Cloudinary upload failed: ${reason}`;
};

/**
 * Cloudinary when credentials exist and disk is not reliable:
 * - CAR_USE_CLOUDINARY=true, or
 * - serverless (Vercel, Lambda, Render, Railway, …), or
 * - NODE_ENV=production (Railway/Render/VPS — avoids ENOENT on read-only or missing ./uploads)
 * Local `npm run dev`: NODE_ENV is usually development → fast local ./uploads unless CAR_USE_CLOUDINARY=true.
 * Opt out of Cloudinary: CAR_USE_CLOUDINARY=false (needs writable ./uploads).
 */
const shouldUseCloudinaryUpload = () => {
  if (!isCloudinaryConfigured()) return false;
  if (process.env.CAR_USE_CLOUDINARY === "false") return false;
  if (process.env.CAR_USE_CLOUDINARY === "true") return true;
  if (isServerlessRuntime()) return true;
  if (process.env.NODE_ENV === "production") return true;
  return false;
};

const OWNERSHIP_VALUES = [
  "Single Owner",
  "Second Owner",
  "Third Owner",
  "Multiple Owners",
];

/** Accept only URLs from our Cloudinary cloud (browser direct-upload path). */
const isTrustedCloudinaryImageUrl = (imageUrl) => {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME?.trim()?.replace(/^["']|["']$/g, "");
  if (!cloud || !imageUrl || typeof imageUrl !== "string") return false;
  try {
    const u = new URL(imageUrl.trim());
    if (u.protocol !== "https:") return false;
    if (u.hostname !== "res.cloudinary.com") return false;
    const pathLower = u.pathname.toLowerCase();
    const cloudLower = cloud.toLowerCase();
    return pathLower.includes(`/${cloudLower}/`);
  } catch {
    return false;
  }
};

/** Browser may send Vercel Blob URL after server-side upload (persistUploadedFile). */
const isTrustedVercelBlobUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== "string") return false;
  try {
    const u = new URL(imageUrl.trim());
    if (u.protocol !== "https:") return false;
    if (!u.hostname.endsWith(".blob.vercel-storage.com")) return false;
    return u.pathname.includes("/car-sells/");
  } catch {
    return false;
  }
};

const isTrustedClientImageUrl = (imageUrl) =>
  isTrustedCloudinaryImageUrl(imageUrl) || isTrustedVercelBlobUrl(imageUrl);

const getValidatedCarData = (payload) => {
  const { title, brand, model, fuelType, year, price, description, ownership } =
    payload;
  if (
    !title ||
    !brand ||
    !model ||
    !fuelType ||
    year === undefined ||
    price === undefined
  ) {
    return {
      error: "Title, brand, model, fuel type, year, and price are required",
    };
  }

  const allowedFuelTypes = ["Petrol", "CNG"];
  if (!allowedFuelTypes.includes(fuelType)) {
    return {
      error: "Fuel type must be Petrol or CNG",
    };
  }

  const ownershipValue =
    ownership && String(ownership).trim() !== ""
      ? String(ownership).trim()
      : "Single Owner";
  if (!OWNERSHIP_VALUES.includes(ownershipValue)) {
    return {
      error: `Ownership must be one of: ${OWNERSHIP_VALUES.join(", ")}`,
    };
  }

  const parsedYear = Number(year);
  const parsedPrice = Number(price);

  if (!Number.isFinite(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
    return {
      error: "Please provide a valid year between 1900 and 2100",
    };
  }

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return {
      error: "Please provide a valid non-negative price",
    };
  }

  return {
    data: {
      title,
      brand,
      model,
      fuelType,
      year: parsedYear,
      price: parsedPrice,
      description: description || "",
      ownership: ownershipValue,
    },
  };
};

export const getCars = async (req, res, next) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 }).lean();
    const data = cars.map((c) => carForJson(c, req));
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const createCar = async (req, res, next) => {
  try {
    const validated = getValidatedCarData(req.body);
    if (validated.error) {
      return res.status(400).json({
        success: false,
        message: validated.error,
      });
    }
    const carData = validated.data;
    let uploadWarning = "";

    const clientImageUrl =
      typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : "";
    const clientPublicId =
      typeof req.body.imagePublicId === "string" ? req.body.imagePublicId.trim() : "";

    if (req.file?.buffer) {
      try {
        const persisted = await persistUploadedFile(
          req.file.buffer,
          req.file.originalname || "car-image.jpg",
          req
        );
        carData.imageUrl = persisted.imageUrl;
        carData.imagePublicId = persisted.imagePublicId;
        if (persisted.warning) uploadWarning = persisted.warning;
      } catch (e) {
        return res.status(503).json({
          success: false,
          message: e.message || "Image upload failed",
        });
      }
    } else if (clientImageUrl) {
      if (!isTrustedClientImageUrl(clientImageUrl)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid image URL. Use browser upload with your Cloudinary cloud name, or upload a file.",
        });
      }
      carData.imageUrl = clientImageUrl;
      carData.imagePublicId = clientPublicId;
    }

    const car = await Car.create(carData);
    res.status(201).json({
      success: true,
      data: carForJson(car, req),
      warning: uploadWarning || undefined,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    const validated = getValidatedCarData(req.body);
    if (validated.error) {
      return res.status(400).json({
        success: false,
        message: validated.error,
      });
    }

    const carData = validated.data;
    let uploadWarning = "";

    const clientImageUrl =
      typeof req.body.imageUrl === "string" ? req.body.imageUrl.trim() : "";
    const clientPublicId =
      typeof req.body.imagePublicId === "string" ? req.body.imagePublicId.trim() : "";

    if (req.file?.buffer) {
      const oldUrl = car.imageUrl;
      const oldPid = car.imagePublicId;
      try {
        const persisted = await persistUploadedFile(
          req.file.buffer,
          req.file.originalname || "car-image.jpg",
          req
        );
        carData.imageUrl = persisted.imageUrl;
        carData.imagePublicId = persisted.imagePublicId;
        if (persisted.warning) uploadWarning = persisted.warning;
        await deleteStoredImage(oldUrl, oldPid);
      } catch (e) {
        return res.status(503).json({
          success: false,
          message: e.message || "Image upload failed",
        });
      }
    } else if (clientImageUrl) {
      if (!isTrustedClientImageUrl(clientImageUrl)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid image URL. Use browser upload with your Cloudinary cloud name, or upload a file.",
        });
      }
      const oldUrl = car.imageUrl;
      const oldPid = car.imagePublicId;
      carData.imageUrl = clientImageUrl;
      carData.imagePublicId = clientPublicId;
      await deleteStoredImage(oldUrl, oldPid);
    }

    Object.assign(car, carData);
    await car.save();

    return res.status(200).json({
      success: true,
      data: carForJson(car, req),
      warning: uploadWarning || undefined,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    await deleteStoredImage(car.imageUrl, car.imagePublicId);

    await car.deleteOne();
    return res.status(200).json({ success: true, message: "Car deleted" });
  } catch (error) {
    return next(error);
  }
};

import Car from "../models/Car.js";
import cloudinary, {
  isCloudinaryConfigured,
} from "../config/cloudinary.js";
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
  "Image storage on this host requires Cloudinary. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in the server environment (Vercel: Project Settings → Environment Variables). Optional: CAR_USE_CLOUDINARY=true.";

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

/** Public origin for stored image URLs (Vercel: prefer PUBLIC_BASE_URL or VERCEL_URL over internal host). */
const getPublicBaseUrl = (req) => {
  const explicit = process.env.PUBLIC_BASE_URL?.trim()?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const host = req.get("x-forwarded-host") || req.get("host");
  const proto = req.get("x-forwarded-proto") || req.protocol;
  return `${proto}://${host}`;
};

/** DB me purane `http://localhost:5000/uploads/...` ko production par reachable URL me badal kar bhejta hai. */
const rewriteLocalhostImageUrl = (imageUrl, req) => {
  if (!imageUrl || typeof imageUrl !== "string") return imageUrl;
  try {
    const u = new URL(imageUrl);
    const h = u.hostname.toLowerCase();
    if (h === "localhost" || h === "127.0.0.1") {
      const base = getPublicBaseUrl(req);
      return `${base}${u.pathname}${u.search}${u.hash}`;
    }
  } catch {
    // ignore
  }
  return imageUrl;
};

const carForJson = (car, req) => {
  if (!car) return car;
  const plain =
    typeof car.toObject === "function" ? car.toObject() : { ...car };
  if (plain.imageUrl) {
    plain.imageUrl = rewriteLocalhostImageUrl(plain.imageUrl, req);
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

    if (req.file?.buffer) {
      if (shouldUseCloudinaryUpload()) {
        try {
          const uploaded = await uploadImageToCloudinary(req.file.buffer);
          carData.imageUrl = uploaded.secure_url;
          carData.imagePublicId = uploaded.public_id;
        } catch (uploadError) {
          if (isServerlessRuntime()) {
            logCloudinaryFailure(uploadError);
            return res.status(503).json({
              success: false,
              message: `${getCloudinaryFailureClientMessage(
                uploadError
              )} Cannot fall back to disk on this host.`,
            });
          }
          const localFileName = await saveImageLocally(
            req.file.buffer,
            req.file.originalname || "car-image.jpg"
          );
          const baseUrl = getPublicBaseUrl(req);
          carData.imageUrl = `${baseUrl}/uploads/${localFileName}`;
          logCloudinaryFailure(uploadError);
          uploadWarning =
            "Cloudinary upload failed. Image saved on local server storage.";
        }
      } else if (isServerlessRuntime()) {
        return res.status(503).json({
          success: false,
          message: SERVERLESS_UPLOAD_MESSAGE,
        });
      } else {
        const localFileName = await saveImageLocally(
          req.file.buffer,
          req.file.originalname || "car-image.jpg"
        );
        const baseUrl = getPublicBaseUrl(req);
        carData.imageUrl = `${baseUrl}/uploads/${localFileName}`;
      }
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

    if (req.file?.buffer) {
      if (shouldUseCloudinaryUpload()) {
        try {
          const uploaded = await uploadImageToCloudinary(req.file.buffer);
          carData.imageUrl = uploaded.secure_url;
          carData.imagePublicId = uploaded.public_id;

          if (car.imagePublicId) {
            await cloudinary.uploader.destroy(car.imagePublicId);
          } else {
            await deleteLocalImageIfAny(car.imageUrl);
          }
        } catch (uploadError) {
          if (isServerlessRuntime()) {
            logCloudinaryFailure(uploadError);
            return res.status(503).json({
              success: false,
              message: `${getCloudinaryFailureClientMessage(
                uploadError
              )} Cannot fall back to disk on this host.`,
            });
          }
          const localFileName = await saveImageLocally(
            req.file.buffer,
            req.file.originalname || "car-image.jpg"
          );
          const baseUrl = getPublicBaseUrl(req);
          carData.imageUrl = `${baseUrl}/uploads/${localFileName}`;
          carData.imagePublicId = "";

          if (car.imagePublicId) {
            await cloudinary.uploader.destroy(car.imagePublicId);
          } else {
            await deleteLocalImageIfAny(car.imageUrl);
          }

          uploadWarning =
            "Cloudinary upload failed. New image saved on local server storage.";
          logCloudinaryFailure(uploadError);
        }
      } else if (isServerlessRuntime()) {
        return res.status(503).json({
          success: false,
          message: SERVERLESS_UPLOAD_MESSAGE,
        });
      } else {
        const localFileName = await saveImageLocally(
          req.file.buffer,
          req.file.originalname || "car-image.jpg"
        );
        const baseUrl = getPublicBaseUrl(req);
        carData.imageUrl = `${baseUrl}/uploads/${localFileName}`;
        carData.imagePublicId = "";
        await deleteLocalImageIfAny(car.imageUrl);
      }
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

    if (car.imagePublicId && isCloudinaryConfigured()) {
      try {
        await cloudinary.uploader.destroy(car.imagePublicId);
      } catch (_err) {
        // Continue delete even if Cloudinary cleanup fails
      }
    } else {
      await deleteLocalImageIfAny(car.imageUrl);
    }

    await car.deleteOne();
    return res.status(200).json({ success: true, message: "Car deleted" });
  } catch (error) {
    return next(error);
  }
};

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { put as putBlob, del as deleteBlob } from "@vercel/blob";
import HappyClient from "../models/HappyClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isBlobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());

const isServerlessReadOnlyFs = () =>
  Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY
  );

/** Default: repo `frontend/public/images/happy-clients`. Local dev only when filesystem is writable. */
export function getHappyClientsUploadDir() {
  const env = process.env.HAPPY_CLIENTS_IMAGES_DIR?.trim();
  if (env) {
    return path.resolve(env);
  }
  return path.join(__dirname, "../../../frontend/public/images/happy-clients");
}

async function deleteBlobImageIfAny(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return;
  if (!imageUrl.includes("blob.vercel-storage.com")) return;
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!token) return;
  try {
    await deleteBlob(imageUrl, { token });
  } catch {
    /* ignore */
  }
}

async function uploadBufferToVercelBlob(fileBuffer, originalName = "photo.jpg") {
  const ext = path.extname(originalName) || ".jpg";
  const safeExt = ext.slice(0, 8);
  const pathname = `car-sells/happy-clients/hc-${Date.now()}-${randomUUID().slice(0, 10)}${safeExt}`;
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
}

export const getHappyClients = async (_req, res, next) => {
  try {
    const list = await HappyClient.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return next(error);
  }
};

export const createHappyClient = async (req, res, next) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image (JPG, PNG, WebP, or GIF).",
      });
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter the client name (at least 2 characters).",
      });
    }

    if (!text || text.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please enter a short message (at least 5 characters).",
      });
    }

    const buffer = req.file.buffer;
    const originalName = req.file.originalname || "photo.jpg";
    let imagePath;

    if (isBlobConfigured()) {
      imagePath = await uploadBufferToVercelBlob(buffer, originalName);
    } else if (isServerlessReadOnlyFs()) {
      return res.status(503).json({
        success: false,
        message:
          "This server cannot write to disk. Add BLOB_READ_WRITE_TOKEN to your backend (Vercel → Storage → Blob), redeploy, then upload again.",
      });
    } else {
      const ext = path.extname(originalName).toLowerCase() || ".jpg";
      const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      const safeExt = allowed.includes(ext) ? ext : ".jpg";
      const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${safeExt}`;
      const dir = getHappyClientsUploadDir();
      await fs.mkdir(dir, { recursive: true });
      const filePath = path.join(dir, fileName);
      await fs.writeFile(filePath, buffer);
      imagePath = `/images/happy-clients/${fileName}`;
    }

    const doc = await HappyClient.create({ name, text, imagePath });

    return res.status(201).json({
      success: true,
      message: "Happy client added.",
      data: doc,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateHappyClient = async (req, res, next) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter the client name (at least 2 characters).",
      });
    }

    if (!text || text.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Please enter a short message (at least 5 characters).",
      });
    }

    const updated = await HappyClient.findByIdAndUpdate(
      req.params.id,
      { name, text },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Happy customer updated.",
      data: updated,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteHappyClient = async (req, res, next) => {
  try {
    const doc = await HappyClient.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Entry not found",
      });
    }

    const p = doc.imagePath || "";
    if (p.startsWith("http")) {
      await deleteBlobImageIfAny(p);
    } else {
      const base = path.basename(p);
      if (base && !base.includes("..") && base.length > 0) {
        const filePath = path.join(getHappyClientsUploadDir(), base);
        await fs.unlink(filePath).catch(() => {});
      }
    }

    await HappyClient.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    return next(error);
  }
};

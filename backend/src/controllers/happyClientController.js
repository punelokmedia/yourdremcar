import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import HappyClient from "../models/HappyClient.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Default: repo `frontend/public/images/happy-clients`. Override with absolute path on the server. */
export function getHappyClientsUploadDir() {
  const env = process.env.HAPPY_CLIENTS_IMAGES_DIR?.trim();
  if (env) {
    return path.resolve(env);
  }
  return path.join(__dirname, "../../../frontend/public/images/happy-clients");
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
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please choose an image (JPG, PNG, WebP, or GIF).",
      });
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const text = typeof req.body.text === "string" ? req.body.text.trim() : "";

    if (!name || name.length < 2) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        success: false,
        message: "Please enter the client name (at least 2 characters).",
      });
    }

    if (!text || text.length < 5) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(400).json({
        success: false,
        message: "Please enter a short message (at least 5 characters).",
      });
    }

    const imagePath = `/images/happy-clients/${req.file.filename}`;
    const doc = await HappyClient.create({ name, text, imagePath });

    return res.status(201).json({
      success: true,
      message: "Happy client added.",
      data: doc,
    });
  } catch (error) {
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch(() => {});
    }
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

    const base = path.basename(doc.imagePath || "");
    if (base && !base.includes("..") && base.length > 0) {
      const filePath = path.join(getHappyClientsUploadDir(), base);
      await fs.unlink(filePath).catch(() => {});
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

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import {
  getHappyClients,
  createHappyClient,
  deleteHappyClient,
  getHappyClientsUploadDir,
} from "../controllers/happyClientController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = getHappyClientsUploadDir();
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const safeExt = allowed.includes(ext) ? ext : ".jpg";
    cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|gif)$/i.test(file.mimetype);
    if (ok) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WebP, or GIF images are allowed."));
    }
  },
});

router.get("/", getHappyClients);
router.post("/", upload.single("image"), createHappyClient);
router.delete("/:id", deleteHappyClient);

export default router;

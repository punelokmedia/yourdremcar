import express from "express";
import multer from "multer";
import {
  getHappyClients,
  createHappyClient,
  updateHappyClient,
  deleteHappyClient,
} from "../controllers/happyClientController.js";

const router = express.Router();

/** Memory storage — Vercel has read-only disk; controller uploads to Blob or local ./ path on dev machines. */
const upload = multer({
  storage: multer.memoryStorage(),
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
router.patch("/:id", updateHappyClient);
router.delete("/:id", deleteHappyClient);

export default router;

import express from "express";
import multer from "multer";
import {
  createCar,
  deleteCar,
  getCars,
  updateCar,
} from "../controllers/carController.js";

const router = express.Router();

// Vercel serverless request body limit is ~4.5 MB total — stay under it or upload fails with 413.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
});

/** JSON body (browser → Cloudinary direct upload) must not go through multer or body is lost. */
const multipartImageUpload = (req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("application/json")) {
    return next();
  }
  return upload.single("image")(req, res, next);
};

router.get("/", getCars);
router.post("/", multipartImageUpload, createCar);
router.patch("/:id", multipartImageUpload, updateCar);
router.delete("/:id", deleteCar);

export default router;

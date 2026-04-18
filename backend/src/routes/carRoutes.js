import express from "express";
import multer from "multer";
import {
  createCar,
  deleteCar,
  getCars,
  updateCar,
} from "../controllers/carController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.get("/", getCars);
router.post("/", upload.single("image"), createCar);
router.patch("/:id", upload.single("image"), updateCar);
router.delete("/:id", deleteCar);

export default router;

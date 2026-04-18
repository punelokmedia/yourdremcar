import express from "express";
import {
  createReview,
  deleteReview,
  getReviews,
} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", createReview);
router.delete("/:id", deleteReview);

export default router;

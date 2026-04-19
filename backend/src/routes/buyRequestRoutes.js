import express from "express";
import {
  createBuyRequest,
  deleteBuyRequest,
  getBuyRequests,
} from "../controllers/buyRequestController.js";

const router = express.Router();

router.post("/", createBuyRequest);
router.get("/", getBuyRequests);
router.delete("/:id", deleteBuyRequest);

export default router;

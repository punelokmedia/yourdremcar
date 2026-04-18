import express from "express";
import {
  createBuyRequest,
  getBuyRequests,
} from "../controllers/buyRequestController.js";

const router = express.Router();

router.post("/", createBuyRequest);
router.get("/", getBuyRequests);

export default router;

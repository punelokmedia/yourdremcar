import express from "express";
import {
  createSellCarRequest,
  deleteSellCarRequest,
  getSellCarRequests,
} from "../controllers/sellCarRequestController.js";

const router = express.Router();

router.post("/", createSellCarRequest);
router.get("/", getSellCarRequests);
router.delete("/:id", deleteSellCarRequest);

export default router;

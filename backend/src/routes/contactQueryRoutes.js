import express from "express";
import {
  createContactQuery,
  getContactQueries,
  updateContactQueryStatus,
} from "../controllers/contactQueryController.js";

const router = express.Router();

router.post("/", createContactQuery);
router.get("/", getContactQueries);
router.patch("/:id/status", updateContactQueryStatus);

export default router;

import express from "express";
import {
  createCookieConsent,
  getCookieConsents,
} from "../controllers/cookieConsentController.js";

const router = express.Router();

router.post("/", createCookieConsent);
router.get("/", getCookieConsents);

export default router;

import CookieConsent from "../models/CookieConsent.js";

const ALLOWED_DECISIONS = ["accepted", "essential_only", "rejected"];

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.trim()) {
    return xf.split(",")[0].trim().slice(0, 120);
  }
  const raw = req.ip || req.socket?.remoteAddress || "";
  return String(raw).slice(0, 120);
}

function preferencesForDecision(decision) {
  if (decision === "accepted") {
    return { necessary: true, analytics: true, marketing: true };
  }
  return { necessary: true, analytics: false, marketing: false };
}

export const createCookieConsent = async (req, res, next) => {
  try {
    const { decision, sourceUrl, preferences: bodyPrefs } = req.body || {};

    if (!ALLOWED_DECISIONS.includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "decision must be one of: accepted, essential_only, rejected",
      });
    }

    let preferences = preferencesForDecision(decision);
    if (bodyPrefs && typeof bodyPrefs === "object") {
      preferences = {
        necessary: true,
        analytics: Boolean(bodyPrefs.analytics),
        marketing: Boolean(bodyPrefs.marketing),
      };
      if (decision !== "accepted" && (preferences.analytics || preferences.marketing)) {
        preferences.analytics = false;
        preferences.marketing = false;
      }
    }

    const ua = req.headers["user-agent"];
    const doc = await CookieConsent.create({
      decision,
      preferences,
      sourceUrl: typeof sourceUrl === "string" ? sourceUrl.slice(0, 2048) : "",
      userAgent: typeof ua === "string" ? ua.slice(0, 512) : "",
      ip: clientIp(req),
      expiresAt: CookieConsent.defaultExpiresAt(),
    });

    return res.status(201).json({
      success: true,
      message: "Cookie preference recorded",
      data: doc,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCookieConsents = async (_req, res, next) => {
  try {
    const rows = await CookieConsent.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    return next(error);
  }
};

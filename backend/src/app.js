import compression from "compression";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import carRoutes from "./routes/carRoutes.js";
import buyRequestRoutes from "./routes/buyRequestRoutes.js";
import contactQueryRoutes from "./routes/contactQueryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import happyClientRoutes from "./routes/happyClientRoutes.js";
import sellCarRoutes from "./routes/sellCarRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";
import cloudinary, { isCloudinaryConfigured } from "./config/cloudinary.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(compression());
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});
/**
 * CORS: default `origin: true` reflects the browser's Origin — works for localhost,
 * production, and every Vercel preview URL (e.g. *-i22s.vercel.app).
 * Optional lock-down: set CORS_ALLOWED_ORIGINS=https://a.com,https://b.com
 * (do not use FRONTEND_URL for CORS — it caused localhost-only headers on Vercel).
 */
const corsOrigin =
  process.env.CORS_ALLOWED_ORIGINS?.trim()
    ? (() => {
        const allowed = process.env.CORS_ALLOWED_ORIGINS.split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        return (origin, callback) => {
          if (!origin || allowed.includes(origin)) {
            callback(null, true);
            return;
          }
          callback(null, false);
        };
      })()
    : true;

app.use(
  cors({
    origin: corsOrigin,
    methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "OPTIONS"],
    // Do not pin allowedHeaders — let the cors package reflect
    // Access-Control-Request-Headers so multipart/form-data preflight succeeds.
  })
);
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Car Sells API running" });
});

/**
 * What the admin UI needs to choose browser vs server upload (no secrets exposed).
 */
app.get("/api/health/storage", async (_req, res) => {
  const blob = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  let cloudinaryAuthOk = false;
  if (isCloudinaryConfigured()) {
    try {
      await cloudinary.api.ping();
      cloudinaryAuthOk = true;
    } catch {
      cloudinaryAuthOk = false;
    }
  }
  return res.status(200).json({
    success: true,
    vercel: Boolean(process.env.VERCEL),
    blob,
    cloudinaryConfigured: isCloudinaryConfigured(),
    cloudinaryAuthOk,
  });
});

/** Debug Cloudinary credentials on the deployed server (no upload). */
app.get("/api/health/cloudinary", async (_req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(200).json({
      success: true,
      configured: false,
      message:
        "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (backend Vercel project).",
    });
  }
  try {
    await cloudinary.api.ping();
    return res.json({ success: true, configured: true, auth: "ok" });
  } catch (err) {
    const code = err.http_code ?? err.statusCode;
    return res.status(503).json({
      success: false,
      configured: true,
      auth: "failed",
      message: err.message,
      httpCode: code,
      hint:
        "401/403: Keys do not match this cloud, or CLOUDINARY_URL in Vercel conflicts — delete CLOUDINARY_URL and use only the three vars from Cloudinary → Settings → API Keys (same product). Redeploy.",
    });
  }
});

app.use("/api/cars", carRoutes);
app.use("/api/buy-requests", buyRequestRoutes);
app.use("/api/contact-queries", contactQueryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/happy-clients", happyClientRoutes);
app.use("/api/sell-requests", sellCarRoutes);

app.use(errorHandler);

export default app;

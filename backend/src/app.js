import compression from "compression";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import carRoutes from "./routes/carRoutes.js";
import buyRequestRoutes from "./routes/buyRequestRoutes.js";
import contactQueryRoutes from "./routes/contactQueryRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

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
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  })
);
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => {
  res.json({ success: true, message: "Car Sells API running" });
});

app.use("/api/cars", carRoutes);
app.use("/api/buy-requests", buyRequestRoutes);
app.use("/api/contact-queries", contactQueryRoutes);

app.use(errorHandler);

export default app;

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
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
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

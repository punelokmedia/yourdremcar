/**
 * Vercel serverless entry — do not use server.js listen() here.
 * Set env: MONGODB_URI, optional CLOUDINARY_*.
 * On Vercel, use Cloudinary for images (CAR_USE_CLOUDINARY=true); /uploads is ephemeral.
 */
import connectDB from "../src/config/db.js";
import app from "../src/app.js";

await connectDB();

export default app;

import mongoose from "mongoose";

/** Home page “Sell your car” leads — shown in admin dashboard. */
const sellCarRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    carMakeModel: { type: String, required: true, trim: true },
    year: { type: String, default: "", trim: true },
    expectedPrice: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

sellCarRequestSchema.index({ createdAt: -1 });

export default mongoose.models.SellCarRequest ||
  mongoose.model("SellCarRequest", sellCarRequestSchema);

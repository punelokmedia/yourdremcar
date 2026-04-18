import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "CNG"],
      required: true,
    },
    ownership: {
      type: String,
      enum: ["Single Owner", "Second Owner", "Third Owner", "Multiple Owners"],
      default: "Single Owner",
    },
    year: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    availability: {
      type: String,
      enum: ["Available", "Sold", "Sold out"],
      default: "Available",
    },
  },
  { timestamps: true }
);

carSchema.index({ createdAt: -1 });

export default mongoose.model("Car", carSchema);

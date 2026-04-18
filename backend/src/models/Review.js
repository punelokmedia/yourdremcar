import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 800,
    },
  },
  { timestamps: true }
);

reviewSchema.index({ createdAt: -1 });

export default mongoose.model("Review", reviewSchema);

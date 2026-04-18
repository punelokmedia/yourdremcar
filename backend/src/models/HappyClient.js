import mongoose from "mongoose";

const happyClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 800,
    },
    imagePath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

happyClientSchema.index({ createdAt: -1 });

export default mongoose.model("HappyClient", happyClientSchema);

import mongoose from "mongoose";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const cookieConsentSchema = new mongoose.Schema(
  {
    decision: {
      type: String,
      enum: ["accepted", "essential_only", "rejected"],
      required: true,
    },
    preferences: {
      necessary: { type: Boolean, default: true },
      analytics: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
    },
    sourceUrl: {
      type: String,
      trim: true,
      default: "",
    },
    userAgent: {
      type: String,
      trim: true,
      default: "",
    },
    ip: {
      type: String,
      trim: true,
      default: "",
    },
    /** MongoDB TTL: document removed when this time passes (7 days from submission). */
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

cookieConsentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

cookieConsentSchema.statics.defaultExpiresAt = () => new Date(Date.now() + SEVEN_DAYS_MS);

export default mongoose.model("CookieConsent", cookieConsentSchema);

import mongoose from "mongoose";

/**
 * Recruiter account linked to Google OAuth + Gmail API tokens.
 * refresh_token is required for long-lived access; access_token is refreshed as needed.
 */
const atsUserSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, default: "" },
    picture: { type: String, default: "" },
    accessToken: { type: String, default: "" },
    refreshToken: { type: String, default: "" },
    tokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("AtsUser", atsUserSchema);

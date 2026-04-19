import mongoose from "mongoose";

const atsEmailSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AtsUser",
      required: true,
      index: true,
    },
    gmailMessageId: { type: String, required: true },
    threadId: { type: String, required: true, index: true },
    from: { type: String, default: "" },
    to: { type: String, default: "" },
    subject: { type: String, default: "" },
    snippet: { type: String, default: "" },
    bodyText: { type: String, default: "" },
    internalDate: { type: Date, default: null },
    labelIds: [{ type: String }],
  },
  { timestamps: true }
);

atsEmailSchema.index({ userId: 1, gmailMessageId: 1 }, { unique: true });
atsEmailSchema.index({ userId: 1, threadId: 1, internalDate: -1 });

export default mongoose.model("AtsEmail", atsEmailSchema);

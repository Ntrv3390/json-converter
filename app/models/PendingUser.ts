import mongoose from "mongoose";

const PendingUserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    passwordHash: String,
    verificationCode: String,
    expiresAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.PendingUser ||
  mongoose.model("PendingUser", PendingUserSchema);

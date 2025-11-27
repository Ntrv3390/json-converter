import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    passwordHash: { type: String, required: true },

    apiKey: { type: String, required: true, unique: true },
    apiToken: { type: String, required: true, unique: true },

    isVerified: { type: Boolean, default: false },

    verificationCode: { type: String }, // For signup email validation
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);

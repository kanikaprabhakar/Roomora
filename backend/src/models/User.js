import mongoose from "mongoose";

const matchProfileSchema = new mongoose.Schema(
  {
    bio: { type: String, trim: true },
    budget: { type: Number, min: 0 },
    preferredLocation: { type: String, trim: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    role: {
      type: String,
      enum: ["owner", "student"],
      default: "student"
    },
    matchProfile: {
      type: matchProfileSchema,
      default: undefined
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

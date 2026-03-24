const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["member", "trainer"],
      required: true,
      default: "member",
    },
    heightCm: {
      type: Number,
      min: 80,
      max: 250,
    },
    weightKg: {
      type: Number,
      min: 20,
      max: 300,
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

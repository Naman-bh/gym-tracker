const mongoose = require("mongoose");

const bodyMetricSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    weightKg: {
      type: Number,
      min: 20,
      max: 300,
    },
    bodyFat: {
      type: Number,
      min: 0,
      max: 80,
    },
    waistCm: {
      type: Number,
      min: 40,
      max: 200,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

bodyMetricSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model("BodyMetric", bodyMetricSchema);


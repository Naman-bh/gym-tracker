const mongoose = require("mongoose");

const progressLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
  },
  { timestamps: true }
);

progressLogSchema.index({ userId: 1, programId: 1, createdAt: -1 });

module.exports = mongoose.model("ProgressLog", progressLogSchema);


const Enrollment = require("../models/Enrollment");
const Program = require("../models/Program");
const ProgressLog = require("../models/ProgressLog");

const joinProgram = async (req, res) => {
  try {
    const { programId } = req.params;

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const existing = await Enrollment.findOne({ userId: req.user.id, programId });
    if (existing) {
      return res.status(200).json({ message: "Already joined", enrollment: existing });
    }

    const enrollment = await Enrollment.create({
      userId: req.user.id,
      programId,
      progress: 0,
    });

    return res.status(201).json(enrollment);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to join program" });
  }
};

const getMyPrograms = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user.id })
      .populate({
        path: "programId",
        populate: { path: "trainerId", select: "name" },
      })
      .sort({ createdAt: -1 });

    const data = enrollments
      .filter((e) => e.programId)
      .map((e) => ({
        enrollmentId: e._id,
        progress: e.progress,
        joinedAt: e.createdAt,
        program: {
          _id: e.programId._id,
          title: e.programId.title,
          description: e.programId.description,
          duration: e.programId.duration,
          difficulty: e.programId.difficulty,
          exercises: e.programId.exercises,
          trainerName: e.programId.trainerId?.name || "Unknown Trainer",
        },
      }));

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch joined programs" });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { programId } = req.params;
    const { progress } = req.body;

    const safeProgress = Number(progress);
    if (Number.isNaN(safeProgress) || safeProgress < 0 || safeProgress > 100) {
      return res.status(400).json({ message: "Progress must be between 0 and 100" });
    }

    const enrollment = await Enrollment.findOneAndUpdate(
      { userId: req.user.id, programId },
      { progress: safeProgress },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    await ProgressLog.create({
      userId: req.user.id,
      programId,
      progress: safeProgress,
    });

    return res.json(enrollment);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to update progress" });
  }
};

module.exports = {
  joinProgram,
  getMyPrograms,
  updateProgress,
};

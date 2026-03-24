const Program = require("../models/Program");
const Enrollment = require("../models/Enrollment");

const VALID_DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];

function normalizeExercises(exercises) {
  if (!Array.isArray(exercises)) return [];
  return exercises.map((x) => String(x).trim()).filter(Boolean);
}

const createProgram = async (req, res) => {
  try {
    const { title, description, duration, difficulty, exercises } = req.body;

    if (!title || !description || !duration || !difficulty) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!VALID_DIFFICULTY.includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty" });
    }

    const program = await Program.create({
      title,
      description,
      duration,
      difficulty,
      exercises: normalizeExercises(exercises),
      trainerId: req.user.id,
    });

    const populated = await program.populate("trainerId", "name email role");
    return res.status(201).json(populated);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to create program" });
  }
};

const getPrograms = async (req, res) => {
  try {
    const { search, difficulty, duration, trainer } = req.query;

    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (difficulty && VALID_DIFFICULTY.includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    if (duration) {
      filter.duration = { $regex: duration, $options: "i" };
    }

    if (trainer) {
      const trainerDocs = await require("../models/User")
        .find({ name: { $regex: trainer, $options: "i" }, role: "trainer" })
        .select("_id");
      filter.trainerId = { $in: trainerDocs.map((t) => t._id) };
    }

    const programs = await Program.find(filter)
      .populate("trainerId", "name")
      .sort({ createdAt: -1 });

    const userId = req.user?.id;
    let joinedMap = new Set();

    if (userId) {
      const enrollments = await Enrollment.find({ userId }).select("programId");
      joinedMap = new Set(enrollments.map((e) => String(e.programId)));
    }

    const result = programs.map((p) => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      duration: p.duration,
      difficulty: p.difficulty,
      exercises: p.exercises,
      trainerId: p.trainerId?._id,
      trainerName: p.trainerId?.name || "Unknown Trainer",
      createdAt: p.createdAt,
      joined: joinedMap.has(String(p._id)),
    }));

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch programs" });
  }
};

const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate("trainerId", "name email");
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const joined = req.user
      ? await Enrollment.exists({ userId: req.user.id, programId: program._id })
      : false;

    return res.json({
      _id: program._id,
      title: program.title,
      description: program.description,
      duration: program.duration,
      difficulty: program.difficulty,
      exercises: program.exercises,
      trainerId: program.trainerId?._id,
      trainerName: program.trainerId?.name || "Unknown Trainer",
      trainerEmail: program.trainerId?.email || "",
      joined: Boolean(joined),
      createdAt: program.createdAt,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch program" });
  }
};

const getTrainerPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ trainerId: req.user.id })
      .populate("trainerId", "name")
      .sort({ createdAt: -1 });

    return res.json(programs.map((p) => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      duration: p.duration,
      difficulty: p.difficulty,
      exercises: p.exercises,
      trainerName: p.trainerId?.name || "Unknown Trainer",
      createdAt: p.createdAt,
    })));
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch trainer programs" });
  }
};

const updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    if (String(program.trainerId) !== req.user.id) {
      return res.status(403).json({ message: "Cannot edit this program" });
    }

    const { title, description, duration, difficulty, exercises } = req.body;

    if (difficulty && !VALID_DIFFICULTY.includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty" });
    }

    const updated = await Program.findByIdAndUpdate(
      req.params.id,
      {
        ...(title ? { title } : {}),
        ...(description ? { description } : {}),
        ...(duration ? { duration } : {}),
        ...(difficulty ? { difficulty } : {}),
        ...(exercises ? { exercises: normalizeExercises(exercises) } : {}),
      },
      { new: true, runValidators: true }
    ).populate("trainerId", "name");

    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to update program" });
  }
};

const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    if (String(program.trainerId) !== req.user.id) {
      return res.status(403).json({ message: "Cannot delete this program" });
    }

    await Program.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ programId: req.params.id });

    return res.json({ message: "Program deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to delete program" });
  }
};

const getTrainerStats = async (req, res) => {
  try {
    const programs = await Program.find({ trainerId: req.user.id }).select("_id");
    const programIds = programs.map((p) => p._id);

    const totalPrograms = programIds.length;
    const totalMembersJoined = await Enrollment.distinct("userId", {
      programId: { $in: programIds },
    }).then((users) => users.length);

    return res.json({ totalPrograms, totalMembersJoined });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch stats" });
  }
};

module.exports = {
  createProgram,
  getPrograms,
  getProgramById,
  getTrainerPrograms,
  updateProgram,
  deleteProgram,
  getTrainerStats,
};

const express = require("express");

const {
  createProgram,
  getPrograms,
  getProgramById,
  getTrainerPrograms,
  updateProgram,
  deleteProgram,
  getTrainerStats,
} = require("../controllers/programController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getPrograms);
router.get("/trainer/mine", authMiddleware, requireRole("trainer"), getTrainerPrograms);
router.get("/trainer/stats", authMiddleware, requireRole("trainer"), getTrainerStats);
router.get("/:id", authMiddleware, getProgramById);

router.post("/", authMiddleware, requireRole("trainer"), createProgram);
router.put("/:id", authMiddleware, requireRole("trainer"), updateProgram);
router.delete("/:id", authMiddleware, requireRole("trainer"), deleteProgram);

module.exports = router;

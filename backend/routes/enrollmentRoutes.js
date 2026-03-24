const express = require("express");

const {
  joinProgram,
  getMyPrograms,
  updateProgress,
} = require("../controllers/enrollmentController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:programId/join", authMiddleware, requireRole("member"), joinProgram);
router.get("/me", authMiddleware, requireRole("member"), getMyPrograms);
router.put("/:programId/progress", authMiddleware, requireRole("member"), updateProgress);

module.exports = router;

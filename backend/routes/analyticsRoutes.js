const express = require("express");

const {
  getMemberSummary,
  getMemberStreaks,
  getMemberProgramHistory,
  getTrainerMembersAnalytics,
  getTrainerProgramsAnalytics,
} = require("../controllers/analyticsController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/member/summary", authMiddleware, requireRole("member"), getMemberSummary);
router.get("/member/streaks", authMiddleware, requireRole("member"), getMemberStreaks);
router.get("/member/program/:programId", authMiddleware, requireRole("member"), getMemberProgramHistory);

router.get("/trainer/members", authMiddleware, requireRole("trainer"), getTrainerMembersAnalytics);
router.get("/trainer/programs", authMiddleware, requireRole("trainer"), getTrainerProgramsAnalytics);

module.exports = router;


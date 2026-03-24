const express = require("express");
const { createBodyMetric, getBodyMetrics } = require("../controllers/bodyMetricController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, requireRole("member"), createBodyMetric);
router.get("/", authMiddleware, requireRole("member"), getBodyMetrics);

module.exports = router;


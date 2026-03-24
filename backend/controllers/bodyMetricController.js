const BodyMetric = require("../models/BodyMetric");

const createBodyMetric = async (req, res) => {
  try {
    const { weightKg, bodyFat, waistCm, date, note } = req.body;

    if (!weightKg && !bodyFat && !waistCm) {
      return res.status(400).json({ message: "At least one metric is required" });
    }

    const metric = await BodyMetric.create({
      userId: req.user.id,
      weightKg,
      bodyFat,
      waistCm,
      note,
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json(metric);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to create metric" });
  }
};

const getBodyMetrics = async (req, res) => {
  try {
    const { range = 90 } = req.query;
    const days = Number(range) || 90;

    const since = new Date();
    since.setDate(since.getDate() - days);

    const metrics = await BodyMetric.find({
      userId: req.user.id,
      date: { $gte: since },
    })
      .sort({ date: 1 })
      .lean();

    return res.json(metrics);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to fetch metrics" });
  }
};

module.exports = {
  createBodyMetric,
  getBodyMetrics,
};


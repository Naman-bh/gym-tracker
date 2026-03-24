const Enrollment = require("../models/Enrollment");
const Program = require("../models/Program");
const ProgressLog = require("../models/ProgressLog");
const User = require("../models/User");

function toDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

const getMemberSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const logs = await ProgressLog.find({
      userId,
      createdAt: { $gte: since },
    })
      .sort({ createdAt: 1 })
      .lean();

    const perDay = new Map();
    logs.forEach((log) => {
      const key = toDateKey(log.createdAt);
      const item = perDay.get(key) || { total: 0, count: 0 };
      item.total += log.progress;
      item.count += 1;
      perDay.set(key, item);
    });

    const dates = Array.from(perDay.keys()).sort();
    const avgProgress = dates.map((d) => {
      const { total, count } = perDay.get(d);
      return count ? Math.round(total / count) : 0;
    });

    const enrollments = await Enrollment.find({ userId }).lean();
    const perProgram = await Program.find({
      _id: { $in: enrollments.map((e) => e.programId) },
    })
      .select("title")
      .lean();

    const programTitleById = new Map(perProgram.map((p) => [String(p._id), p.title]));

    const programAverages = enrollments.map((e) => ({
      programId: e.programId,
      title: programTitleById.get(String(e.programId)) || "Program",
      progress: e.progress ?? 0,
    }));

    return res.json({
      dates,
      avgProgress,
      programAverages,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to load member analytics" });
  }
};

const getMemberStreaks = async (req, res) => {
  try {
    const userId = req.user.id;

    const since = new Date();
    since.setDate(since.getDate() - 90);

    const logs = await ProgressLog.find({
      userId,
      createdAt: { $gte: since },
    })
      .sort({ createdAt: 1 })
      .select("createdAt")
      .lean();

    const uniqueDays = Array.from(new Set(logs.map((l) => toDateKey(l.createdAt)))).sort();

    let currentStreak = 0;
    let bestStreak = 0;
    let prevDate = null;

    uniqueDays.forEach((day) => {
      const date = new Date(day + "T00:00:00.000Z");
      if (!prevDate) {
        currentStreak = 1;
      } else {
        const diffDays = Math.round((date - prevDate) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      }
      bestStreak = Math.max(bestStreak, currentStreak);
      prevDate = date;
    });

    return res.json({
      currentStreak,
      bestStreak,
      activeDays: uniqueDays.length,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to load streaks" });
  }
};

const getMemberProgramHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { programId } = req.params;

    const logs = await ProgressLog.find({ userId, programId })
      .sort({ createdAt: 1 })
      .select("progress createdAt")
      .lean();

    return res.json(
      logs.map((l) => ({
        date: l.createdAt,
        progress: l.progress,
      }))
    );
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to load program history" });
  }
};

const getTrainerMembersAnalytics = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const programs = await Program.find({ trainerId }).select("_id").lean();
    const programIds = programs.map((p) => p._id);

    if (!programIds.length) {
      return res.json([]);
    }

    const enrollments = await Enrollment.find({ programId: { $in: programIds } })
      .select("userId programId progress updatedAt")
      .lean();

    const userIds = Array.from(new Set(enrollments.map((e) => String(e.userId))));
    const users = await User.find({ _id: { $in: userIds } })
      .select("name email")
      .lean();
    const userById = new Map(users.map((u) => [String(u._id), u]));

    const lastLogByUser = await ProgressLog.aggregate([
      { $match: { userId: { $in: users.map((u) => u._id) }, programId: { $in: programIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          lastActive: { $first: "$createdAt" },
        },
      },
    ]);
    const lastActiveMap = new Map(lastLogByUser.map((d) => [String(d._id), d.lastActive]));

    const byUser = new Map();
    enrollments.forEach((e) => {
      const key = String(e.userId);
      const item = byUser.get(key) || {
        userId: e.userId,
        programs: 0,
        totalProgress: 0,
      };
      item.programs += 1;
      item.totalProgress += e.progress ?? 0;
      item.lastUpdated = item.lastUpdated && item.lastUpdated > e.updatedAt ? item.lastUpdated : e.updatedAt;
      byUser.set(key, item);
    });

    const result = Array.from(byUser.values()).map((row) => {
      const userDoc = userById.get(String(row.userId));
      const avgProgress = row.programs ? Math.round(row.totalProgress / row.programs) : 0;
      const lastActive = lastActiveMap.get(String(row.userId)) || row.lastUpdated;
      return {
        userId: row.userId,
        name: userDoc?.name || "Member",
        email: userDoc?.email || "",
        activePrograms: row.programs,
        avgProgress,
        lastActive,
      };
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to load trainer member analytics" });
  }
};

const getTrainerProgramsAnalytics = async (req, res) => {
  try {
    const trainerId = req.user.id;

    const programs = await Program.find({ trainerId }).select("title createdAt").lean();
    const programIds = programs.map((p) => p._id);

    if (!programIds.length) {
      return res.json([]);
    }

    const enrollments = await Enrollment.find({ programId: { $in: programIds } })
      .select("programId progress")
      .lean();

    const byProgram = new Map();
    enrollments.forEach((e) => {
      const key = String(e.programId);
      const item = byProgram.get(key) || { joined: 0, totalProgress: 0 };
      item.joined += 1;
      item.totalProgress += e.progress ?? 0;
      byProgram.set(key, item);
    });

    const result = programs.map((p) => {
      const agg = byProgram.get(String(p._id)) || { joined: 0, totalProgress: 0 };
      const avgProgress = agg.joined ? Math.round(agg.totalProgress / agg.joined) : 0;
      return {
        programId: p._id,
        title: p.title,
        joined: agg.joined,
        avgProgress,
        createdAt: p.createdAt,
      };
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message || "Failed to load trainer program analytics" });
  }
};

module.exports = {
  getMemberSummary,
  getMemberStreaks,
  getMemberProgramHistory,
  getTrainerMembersAnalytics,
  getTrainerProgramsAnalytics,
};


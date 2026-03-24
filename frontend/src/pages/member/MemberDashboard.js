import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, BrainCircuit, Dumbbell, Flame, Gauge, Ruler } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const cardAnim = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.3 },
};

export default function MemberDashboard() {
  const [stats, setStats] = useState({ totalJoined: 0, avgProgress: 0, inProgress: 0 });
  const [summary, setSummary] = useState({ dates: [], avgProgress: [], programAverages: [] });
  const [streaks, setStreaks] = useState({ currentStreak: 0, bestStreak: 0, activeDays: 0 });
  const [profileUser, setProfileUser] = useState(null);
  const { user, updateUser } = useAuth();

  const activeUser = profileUser || user;
  const heightM = activeUser?.heightCm ? activeUser.heightCm / 100 : null;
  const bmi =
    heightM && activeUser?.weightKg ? +(activeUser.weightKg / (heightM * heightM)).toFixed(1) : null;

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: enrollments }, { data: summaryData }, { data: streakData }, { data: me }] = await Promise.all([
        api.get("/enrollment/me"),
        api.get("/analytics/member/summary"),
        api.get("/analytics/member/streaks"),
        api.get("/auth/me"),
      ]);

      const totalJoined = enrollments.length;
      const avgProgress = totalJoined
        ? Math.round(enrollments.reduce((sum, item) => sum + (item.progress || 0), 0) / totalJoined)
        : 0;
      const inProgress = enrollments.filter((item) => item.progress > 0 && item.progress < 100).length;

      setStats({ totalJoined, avgProgress, inProgress });
      setSummary(summaryData);
      setStreaks(streakData);
      setProfileUser(me);
      updateUser(me);
    };

    fetchAll().catch(() => {
      setStats({ totalJoined: 0, avgProgress: 0, inProgress: 0 });
      setSummary({ dates: [], avgProgress: [], programAverages: [] });
      setStreaks({ currentStreak: 0, bestStreak: 0, activeDays: 0 });
    });
  }, [updateUser]);

  const cards = [
    { title: "Progress", value: `${stats.avgProgress}%`, icon: Gauge, tint: "#32d74b" },
    { title: "Programs", value: stats.totalJoined, icon: Dumbbell, tint: "#22D3EE" },
    { title: "Calories", value: "1,920", icon: Flame, tint: "#ff7a00" },
    { title: "Activity", value: `${stats.inProgress} Active`, icon: Activity, tint: "#ff2d55" },
  ];

  return (
    <DashboardShell
      title="Performance Overview"
      subtitle="Track your progress, active plans, and daily movement at a glance."
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-5 items-center">
        <motion.div
          {...cardAnim}
          className="surface p-5 md:p-6 lift-card flex flex-col items-center justify-center"
        >
          <div className="activity-ring">
            <div className="activity-ring-inner">
              {stats.avgProgress}
              <span style={{ fontSize: "0.7rem", marginLeft: 2 }}>%</span>
            </div>
          </div>
          <p className="activity-ring-label">Weekly Progress</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.title} {...cardAnim} className="surface p-5 lift-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.18em] text-secondary">{card.title}</p>
                  <Icon size={18} style={{ color: card.tint }} />
                </div>
                <p className="text-3xl mt-4 font-bold tracking-tight">{card.value}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {summary.dates.length ? (
        <div className="mt-6 grid md:grid-cols-[1.2fr_0.8fr] gap-4">
          <div className="surface p-4 lift-card">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">Last 30 days</p>
            <div className="h-32 flex items-end gap-1">
              {summary.dates.map((date, idx) => {
                const value = summary.avgProgress[idx] || 0;
                const height = 20 + (value / 100) * 80;
                return (
                  <div
                    key={date}
                    className="flex-1 bg-gradient-to-t from-slate-800 to-emerald-500/80 rounded-full"
                    style={{ height: `${height}%`, minWidth: "4px" }}
                    title={`${date}: ${value}%`}
                  />
                );
              })}
            </div>
          </div>

          <div className="surface p-4 lift-card">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">Program progress</p>
            <div className="space-y-2">
              {summary.programAverages.map((p) => (
                <div key={p.programId} className="flex items-center justify-between text-sm">
                  <span className="text-secondary truncate mr-2">{p.title}</span>
                  <span className="font-semibold">{p.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid md:grid-cols-4 gap-4">
        <div className="surface p-4 lift-card">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">BMI</p>
            <BrainCircuit size={16} className="text-[#f97316]" />
          </div>
          <p className="text-2xl mt-3 font-semibold">
            {bmi ?? "--"}
            {bmi ? <span className="text-xs text-secondary ml-2">kg/m²</span> : null}
          </p>
        </div>
        <div className="surface p-4 lift-card">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Height</p>
            <Ruler size={16} className="text-[#38bdf8]" />
          </div>
          <p className="text-2xl mt-3 font-semibold">
            {activeUser?.heightCm ? `${activeUser.heightCm} cm` : "--"}
          </p>
        </div>
        <div className="surface p-4 lift-card">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Weight</p>
            <Dumbbell size={16} className="text-[#22c55e]" />
          </div>
          <p className="text-2xl mt-3 font-semibold">
            {activeUser?.weightKg ? `${activeUser.weightKg} kg` : "--"}
          </p>
        </div>
        <div className="surface p-4 lift-card">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.18em] text-secondary">Streak</p>
            <Activity size={16} className="text-[#facc15]" />
          </div>
          <p className="text-2xl mt-3 font-semibold">
            {streaks.currentStreak} days
            {streaks.bestStreak ? (
              <span className="block text-xs text-secondary mt-1">Best: {streaks.bestStreak} days</span>
            ) : null}
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}

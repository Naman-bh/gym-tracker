import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, BarChart3, Layers3, Users } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import api from "../../utils/api";

export default function TrainerDashboard() {
  const [stats, setStats] = useState({ totalPrograms: 0, totalMembersJoined: 0 });
  const [memberAnalytics, setMemberAnalytics] = useState([]);
  const [programAnalytics, setProgramAnalytics] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      const [{ data: baseStats }, { data: members }, { data: programs }] = await Promise.all([
        api.get("/program/trainer/stats"),
        api.get("/analytics/trainer/members"),
        api.get("/analytics/trainer/programs"),
      ]);
      setStats(baseStats);
      setMemberAnalytics(members);
      setProgramAnalytics(programs);
    };

    fetchAll().catch(() => {
      setStats({ totalPrograms: 0, totalMembersJoined: 0 });
      setMemberAnalytics([]);
      setProgramAnalytics([]);
    });
  }, []);

  const cards = [
    { label: "Programs", value: stats.totalPrograms, icon: Layers3, color: "#32d74b" },
    { label: "Members", value: stats.totalMembersJoined, icon: Users, color: "#0a84ff" },
    { label: "Avg. Completion", value: programAnalytics[0]?.avgProgress ? `${programAnalytics[0].avgProgress}%` : "—", icon: BarChart3, color: "#ff2d55" },
    { label: "Active Members", value: memberAnalytics.length, icon: Activity, color: "#ff9f0a" },
  ];

  return (
    <DashboardShell
      title="Trainer Analytics"
      subtitle="Monitor member engagement, active plans, and training outcomes."
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: idx * 0.04 }}
              className="surface p-5 lift-card"
            >
              <div className="flex items-center justify-between">
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-secondary">{card.label}</p>
                <Icon size={18} style={{ color: card.color }} />
              </div>
              <p className="text-3xl mt-4 font-bold tracking-tight">{card.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-4 items-start">
        <div className="surface p-4 lift-card overflow-x-auto">
          <p className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">Members</p>
          {memberAnalytics.length ? (
            <table className="w-full text-sm border-separate border-spacing-y-1">
              <thead className="text-xs text-secondary">
                <tr>
                  <th className="text-left font-normal">Name</th>
                  <th className="text-left font-normal">Programs</th>
                  <th className="text-left font-normal">Avg. progress</th>
                  <th className="text-left font-normal">Last active</th>
                </tr>
              </thead>
              <tbody>
                {memberAnalytics.map((m) => (
                  <tr key={m.userId}>
                    <td>{m.name}</td>
                    <td>{m.activePrograms}</td>
                    <td>{m.avgProgress}%</td>
                    <td className="text-secondary">
                      {m.lastActive ? new Date(m.lastActive).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-secondary">No member analytics yet.</p>
          )}
        </div>

        <div className="surface p-4 lift-card">
          <p className="text-xs uppercase tracking-[0.18em] text-secondary mb-3">Programs</p>
          <div className="space-y-2 text-sm">
            {programAnalytics.map((p) => (
              <div key={p.programId} className="flex items-center justify-between">
                <span className="truncate mr-2">{p.title}</span>
                <span className="text-secondary text-xs mr-2">{p.joined} members</span>
                <span className="font-semibold">{p.avgProgress}%</span>
              </div>
            ))}
            {!programAnalytics.length ? (
              <p className="text-xs text-secondary">Create programs to see analytics.</p>
            ) : null}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

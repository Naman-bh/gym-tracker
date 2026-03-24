import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import DashboardShell from "../../components/DashboardShell";
import api from "../../utils/api";

export default function MyPrograms() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyPrograms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/enrollment/me");
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPrograms().catch(() => setItems([]));
  }, []);

  const updateProgress = async (programId, progress) => {
    await api.put(`/enrollment/${programId}/progress`, { progress });
    setItems((prev) => prev.map((item) => (item.program._id === programId ? { ...item, progress } : item)));
  };

  return (
    <DashboardShell title="My Programs" subtitle="Update your completion percentage and stay consistent.">
      {loading ? <p className="text-secondary">Loading your programs...</p> : null}

      <div className="space-y-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.enrollmentId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.26, delay: idx * 0.03 }}
            className="surface p-5"
          >
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h3 className="font-semibold text-lg">{item.program.title}</h3>
                <p className="text-secondary text-sm mt-1">Trainer: {item.program.trainerName}</p>
              </div>
              <p className="text-sm text-[#a5f3fc]">{item.progress}% complete</p>
            </div>

            <div className="w-full h-2 bg-[#0b1220] rounded-full mt-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#34D399] to-[#22D3EE]"
                initial={{ width: 0 }}
                animate={{ width: `${item.progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            <div className="mt-4">
              <input
                type="range"
                min="0"
                max="100"
                value={item.progress}
                onChange={(e) => updateProgress(item.program._id, Number(e.target.value))}
                className="w-full accent-[#34D399]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardShell>
  );
}

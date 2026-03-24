import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import api from "../../utils/api";

const difficultyOptions = ["", "Beginner", "Intermediate", "Advanced"];

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [filters, setFilters] = useState({ search: "", difficulty: "", duration: "", trainer: "" });
  const [loading, setLoading] = useState(true);

  const query = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    return params.toString();
  }, [filters]);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/program${query ? `?${query}` : ""}`);
      setPrograms(data);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchPrograms().catch(() => setPrograms([]));
  }, [fetchPrograms]);

  const joinProgram = async (programId) => {
    await api.post(`/enrollment/${programId}/join`);
    setPrograms((prev) => prev.map((item) => (item._id === programId ? { ...item, joined: true } : item)));
  };

  return (
    <DashboardShell title="Program Discovery" subtitle="Find programs by trainer, difficulty, and duration.">
      <div className="surface p-4 md:p-5 mb-6">
        <div className="flex items-center gap-2 text-secondary text-sm mb-4">
          <SlidersHorizontal size={16} />
          Search & Filter
        </div>

        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              placeholder="Search title or description"
              className="input-shell pl-9"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="input-shell"
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
          >
            {difficultyOptions.map((op) => (
              <option key={op || "all"} value={op}>
                {op || "All Difficulties"}
              </option>
            ))}
          </select>
          <input
            placeholder="Duration"
            className="input-shell"
            value={filters.duration}
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
          />
          <input
            placeholder="Trainer name"
            className="input-shell md:col-span-2"
            value={filters.trainer}
            onChange={(e) => setFilters({ ...filters, trainer: e.target.value })}
          />
        </div>
      </div>

      {loading ? <p className="text-secondary">Loading programs...</p> : null}

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {programs.map((p, idx) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: idx * 0.02 }}
            className="surface p-5 lift-card"
          >
            <h3 className="font-semibold text-lg">{p.title}</h3>
            <p className="text-secondary mt-2 text-sm leading-6 min-h-[3.5rem]">{p.description}</p>
            <p className="text-sm mt-4">Trainer: <span className="text-secondary">{p.trainerName}</span></p>
            <p className="text-sm text-secondary mt-1">Difficulty: {p.difficulty}</p>
            <p className="text-sm text-secondary">Duration: {p.duration}</p>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <Link to={`/programs/${p._id}`} className="btn-secondary text-center text-sm py-2.5">
                Details
              </Link>
              <button
                onClick={() => joinProgram(p._id)}
                disabled={p.joined}
                className={`text-sm font-semibold py-2.5 rounded-full ${
                  p.joined ? "bg-white/[0.06] text-[#b9fcd8] border border-white/10" : "btn-primary"
                }`}
              >
                {p.joined ? "Joined" : "Join"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardShell>
  );
}

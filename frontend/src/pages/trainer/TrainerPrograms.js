import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PencilLine, Trash2 } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import api from "../../utils/api";

const defaultForm = {
  title: "",
  description: "",
  duration: "",
  difficulty: "Beginner",
  exercises: "",
};

export default function TrainerPrograms() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/program/trainer/mine");
      setPrograms(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms().catch(() => setPrograms([]));
  }, []);

  const submit = async () => {
    const payload = {
      ...form,
      exercises: form.exercises
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    if (editingId) {
      await api.put(`/program/${editingId}`, payload);
    } else {
      await api.post("/program", payload);
    }

    setForm(defaultForm);
    setEditingId(null);
    fetchPrograms();
  };

  const removeProgram = async (id) => {
    await api.delete(`/program/${id}`);
    fetchPrograms();
  };

  const startEdit = (program) => {
    setEditingId(program._id);
    setForm({
      title: program.title,
      description: program.description,
      duration: program.duration,
      difficulty: program.difficulty,
      exercises: (program.exercises || []).join(", "),
    });
  };

  return (
    <DashboardShell title="Program Studio" subtitle="Create, refine, and manage your training catalog.">
      <div className="grid xl:grid-cols-[0.95fr_1.05fr] gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface p-5">
          <h3 className="font-semibold text-xl mb-4">{editingId ? "Edit Program" : "Create Program"}</h3>

          <input className="input-shell mb-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea
            className="input-shell mb-3 min-h-24"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input className="input-shell mb-3" placeholder="Duration (e.g., 8 weeks)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <select className="input-shell mb-3" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <input
            className="input-shell mb-4"
            placeholder="Exercises (comma separated)"
            value={form.exercises}
            onChange={(e) => setForm({ ...form, exercises: e.target.value })}
          />

          <div className="flex flex-wrap gap-3">
            <button className="btn-primary" onClick={submit}>
              {editingId ? "Update Program" : "Create Program"}
            </button>
            {editingId ? (
              <button
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(defaultForm);
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </motion.div>

        <div className="space-y-3">
          {loading ? <p className="text-secondary">Loading programs...</p> : null}
          {programs.map((program, idx) => (
            <motion.div
              key={program._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: idx * 0.02 }}
              className="surface p-4 lift-card"
            >
              <h4 className="font-semibold">{program.title}</h4>
              <p className="text-sm text-secondary mt-2">{program.description}</p>
              <p className="text-sm mt-2 text-secondary">{program.duration} • {program.difficulty}</p>
              <div className="flex gap-2 mt-4">
                <button className="btn-secondary text-sm inline-flex items-center gap-2" onClick={() => startEdit(program)}>
                  <PencilLine size={14} /> Edit
                </button>
                <button className="btn-secondary text-sm inline-flex items-center gap-2 text-[#ffb6b6]" onClick={() => removeProgram(program._id)}>
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, UserRound } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function MemberProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    heightCm: "",
    weightKg: "",
    age: "",
    gender: "",
  });
  const [joinedCount, setJoinedCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [metrics, setMetrics] = useState([]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        heightCm: user.heightCm ? String(user.heightCm) : "",
        weightKg: user.weightKg ? String(user.weightKg) : "",
        age: user.age ? String(user.age) : "",
        gender: user.gender || "",
      });
    }

    api
      .get("/enrollment/me")
      .then(({ data }) => setJoinedCount(data.length))
      .catch(() => setJoinedCount(0));

    api
      .get("/body-metrics?range=90")
      .then(({ data }) => setMetrics(data))
      .catch(() => setMetrics([]));
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
      };

      const { data } = await api.put("/auth/me", payload);
      updateUser(data);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title="Profile" subtitle="Manage personal details and membership summary.">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid lg:grid-cols-2 gap-6">
        <div className="surface p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#34D399] to-[#22D3EE] text-[#07131c] font-bold text-xl grid place-items-center">
              {form.name?.charAt(0)?.toUpperCase() || "M"}
            </div>
            <div>
              <p className="text-lg font-semibold">{form.name || "Member"}</p>
              <p className="text-secondary text-sm">{form.email || "No email"}</p>
            </div>
          </div>

          <label className="text-sm text-secondary flex items-center gap-2">
            <UserRound size={14} /> Name
          </label>
          <input className="input-shell mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

          <label className="text-sm text-secondary flex items-center gap-2 mt-4">
            <Mail size={14} /> Email
          </label>
          <input
            className="input-shell mt-2"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3 mt-5">
            <div>
              <label className="text-sm text-secondary">Height (cm)</label>
              <input
                className="input-shell mt-2"
                value={form.heightCm}
                onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                placeholder="e.g. 175"
              />
            </div>
            <div>
              <label className="text-sm text-secondary">Weight (kg)</label>
              <input
                className="input-shell mt-2"
                value={form.weightKg}
                onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
                placeholder="e.g. 70"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="text-sm text-secondary">Age</label>
              <input
                className="input-shell mt-2"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="e.g. 28"
              />
            </div>
            <div>
              <label className="text-sm text-secondary">Gender</label>
              <select
                className="input-shell mt-2"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Not specified</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <button onClick={saveProfile} className="btn-primary mt-5" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
          {message ? <p className="text-sm mt-3 text-[#b9fcd8]">{message}</p> : null}
        </div>

        <div className="surface p-6">
          <h3 className="font-semibold text-xl">Profile Stats</h3>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
              <p className="text-secondary text-sm">Programs Joined</p>
              <p className="text-3xl font-bold mt-2">{joinedCount}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
              <p className="text-secondary text-sm">Account Type</p>
              <p className="text-3xl font-bold mt-2">Member</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold text-secondary mb-2">Weight history (last 90 days)</h4>
            {metrics.length ? (
              <div className="h-24 flex items-end gap-1">
                {metrics.map((m) => {
                  const value = m.weightKg || 0;
                  if (!value) return null;
                  const height = 20 + Math.min(80, (value / 120) * 80);
                  return (
                    <div
                      key={m._id}
                      className="flex-1 bg-gradient-to-t from-slate-800 to-emerald-500/80 rounded-full"
                      style={{ height: `${height}%`, minWidth: "4px" }}
                      title={`${new Date(m.date).toLocaleDateString()}: ${value} kg`}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-secondary">Log a new weight entry from your coach if needed.</p>
            )}
          </div>
        </div>
      </motion.div>
    </DashboardShell>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, UserRound } from "lucide-react";
import DashboardShell from "../../components/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function TrainerProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    setMessage("");

    try {
      const { data } = await api.put("/auth/me", form);
      updateUser(data);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title="Trainer Profile" subtitle="Keep your profile polished for members.">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl surface p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#34D399] to-[#22D3EE] text-[#07131c] font-bold text-xl grid place-items-center">
            {form.name?.charAt(0)?.toUpperCase() || "T"}
          </div>
          <div>
            <p className="text-lg font-semibold">{form.name || "Trainer"}</p>
            <p className="text-secondary text-sm">{form.email || "No email"}</p>
          </div>
        </div>

        <label className="text-sm text-secondary flex items-center gap-2"><UserRound size={14} /> Name</label>
        <input className="input-shell mt-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />

        <label className="text-sm text-secondary flex items-center gap-2 mt-4"><Mail size={14} /> Email</label>
        <input className="input-shell mt-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <button onClick={saveProfile} className="btn-primary mt-5" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {message ? <p className="text-sm mt-3 text-[#b9fcd8]">{message}</p> : null}
      </motion.div>
    </DashboardShell>
  );
}

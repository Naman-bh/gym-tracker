import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate(form.role === "trainer" ? "/trainer/dashboard" : "/member/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap flex items-center justify-center px-4 relative">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass p-7 md:p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-2 text-center hero-title">Create account</h2>
        <p className="text-secondary text-center text-sm mb-7">Join as a member or trainer.</p>

        <input
          placeholder="Name"
          className="input-shell mb-4"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          type="email"
          className="input-shell mb-4"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="input-shell mb-4"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="input-shell mb-6"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="member">Member</option>
          <option value="trainer">Trainer</option>
        </select>

        {error ? <p className="text-sm text-[#ffabab] mb-3">{error}</p> : null}

        <button onClick={register} className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-secondary text-center mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#a5f3fc] hover:text-white">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/login", form);
      login(data);

      const role = data.user?.role;
      const fallback = role === "trainer" ? "/trainer/dashboard" : "/member/dashboard";
      const next = location.state?.from?.pathname || fallback;
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass p-7 md:p-9 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold hero-title mb-2">Welcome back</h1>
        <p className="text-secondary text-sm mb-6">Sign in to continue your training journey.</p>

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-shell mb-4"
        />

        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input-shell mb-5"
        />

        {error ? <p className="text-sm text-[#ffabab] mb-3">{error}</p> : null}

        <button onClick={submit} className="btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-secondary mt-5 text-sm">
          No account?{" "}
          <Link to="/register" className="text-[#a5f3fc] hover:text-white">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

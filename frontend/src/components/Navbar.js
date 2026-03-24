import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  const onLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardLink = user?.role === "trainer" ? "/trainer/dashboard" : "/member/dashboard";
  const profileLink = user?.role === "trainer" ? "/trainer/profile" : "/member/profile";

  return (
    <header className="shrink-0 z-50">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="navbar-bar w-full px-4 md:px-8 py-3.5 flex justify-between items-center"
      >
        <Link to="/" className="text-lg md:text-xl font-semibold tracking-tight">
          MotionLab Fitness
        </Link>

        {!user ? (
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/login" className="btn-secondary text-sm md:text-base">
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm md:text-base">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="relative" ref={menuRef}>
            <button
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/10 bg-white/[0.03] text-sm"
              onClick={() => setOpen((s) => !s)}
            >
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#34D399] to-[#22D3EE] text-[#07131c] font-semibold grid place-items-center">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className="hidden sm:block">{user.name}</span>
              <ChevronDown size={16} className={`transition ${open ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0f1627]/95 shadow-2xl overflow-hidden backdrop-blur-xl"
                >
                  <Link to={profileLink} className="px-4 py-3 text-sm hover:bg-white/[0.06] flex items-center gap-2">
                    <UserCircle2 size={16} />
                    Profile
                  </Link>
                  <Link to={dashboardLink} className="px-4 py-3 text-sm hover:bg-white/[0.06] flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-3 text-sm text-[#ffb6b6] hover:bg-white/[0.06] flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.nav>
    </header>
  );
}

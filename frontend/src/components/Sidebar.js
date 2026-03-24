import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Dumbbell, LayoutDashboard, LogOut, Sparkles, UserCircle2, Utensils } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const logoutUser = () => {
    logout();
    navigate("/");
  };

  const memberMenu = [
    { name: "Dashboard", path: "/member/dashboard", icon: LayoutDashboard },
    { name: "Programs", path: "/member/programs", icon: Dumbbell },
    { name: "My Programs", path: "/member/my-programs", icon: Activity },
    { name: "Diet Plan", path: "/member/diet", icon: Utensils },
    { name: "Profile", path: "/member/profile", icon: UserCircle2 },
  ];

  const trainerMenu = [
    { name: "Dashboard", path: "/trainer/dashboard", icon: LayoutDashboard },
    { name: "Manage Programs", path: "/trainer/programs", icon: Dumbbell },
    { name: "Profile", path: "/trainer/profile", icon: UserCircle2 },
  ];

  const menu = user?.role === "trainer" ? trainerMenu : memberMenu;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full md:w-72 md:min-h-[calc(100vh-7rem)] glass md:rounded-3xl flex flex-col justify-between p-4"
    >
      <div>
        <div className="px-3 py-4 mb-2 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-2">
          <Sparkles size={16} className="text-[#34D399]" />
          <p className="text-sm text-secondary">{user?.role === "trainer" ? "Trainer Workspace" : "Member Workspace"}</p>
        </div>

        <nav className="space-y-2">
          {menu.map((item, idx) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.25 }}
              >
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition ${
                    active
                      ? "glow-active text-white"
                      : "border-transparent text-[#a6adbb] hover:text-white hover:bg-white/[0.03] hover:border-white/10"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      <button
        onClick={logoutUser}
        className="mt-6 text-[#ffabab] text-left px-4 py-3 rounded-2xl hover:bg-white/[0.03] border border-transparent hover:border-white/10 flex items-center gap-2"
      >
        <LogOut size={16} />
        Logout
      </button>
    </motion.aside>
  );
}

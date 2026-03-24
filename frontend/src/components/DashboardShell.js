import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function DashboardShell({ title, subtitle, children }) {
  const { user } = useAuth();

  return (
    <div className="md:flex min-h-[calc(100vh-6rem)] px-3 md:px-6 pb-4 pt-2 gap-4 max-w-[1400px] mx-auto w-full">
      <Sidebar />
      <div className="flex-1 mt-3 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
          className="glass p-5 md:p-8 min-h-[calc(100vh-7rem)]"
        >
          <p className="text-[0.65rem] md:text-xs tracking-[0.22em] uppercase text-secondary">
            Dashboard
          </p>
          <h1 className="text-[1.7rem] sm:text-3xl md:text-4xl font-bold hero-title mt-1.5 md:mt-2">
            Welcome back, {user?.name || "Athlete"}
          </h1>
          <p className="text-secondary mt-3 text-sm md:text-base">
            {subtitle || "Close your rings and keep your streak alive today."}
          </p>

          <div className="mt-7">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
            <div className="mt-5">{children}</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Flame, HeartPulse, Users } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="page-wrap">
      <div className="max-w-[1400px] mx-auto pt-6 md:pt-12 pb-10 px-3 md:px-6 w-full">
        <div className="grid md:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12 items-center">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="text-[0.65rem] md:text-xs uppercase tracking-[0.28em] text-secondary">
              Premium Training Hub
            </p>
            <h1 className="hero-title text-[2.1rem] sm:text-5xl lg:text-7xl font-extrabold mt-4">
              Close your rings.
              <br />
              Elevate every session.
            </h1>
            <p className="text-secondary max-w-xl mt-6 text-base md:text-lg">
              A focused coaching experience for members and trainers with clear goals, visual progress, and a
              distraction‑free, modern training interface.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {user ? (
                <Link
                  to={user.role === "trainer" ? "/trainer/dashboard" : "/member/dashboard"}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight size={17} />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary inline-flex items-center gap-2">
                    Get Started
                    <ArrowRight size={17} />
                  </Link>
                  <Link to="/member/programs" className="btn-secondary inline-flex items-center gap-2">
                    Explore Programs
                  </Link>
                </>
              )}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="glass p-6 md:p-7 flex flex-col"
          >
            <div className="flex flex-col items-center">
              <div className="activity-ring">
                <div className="activity-ring-inner">
                  {user ? (
                    <>
                      76<span style={{ fontSize: "0.7rem", marginLeft: 2 }}>%</span>
                    </>
                  ) : (
                    <Flame size={26} className="text-[#fb7185]" />
                  )}
                </div>
              </div>
              <p className="activity-ring-label">
                {user ? "Today\u2019s Move Goal" : "Calories burned preview"}
              </p>
            </div>

            <p className="text-sm text-secondary mt-6">Live Overview</p>
            <h3 className="text-2xl font-semibold mt-2">Momentum Snapshot</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
              <div className="surface p-4 lift-card">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-secondary">Programs</p>
                  <BarChart3 size={18} className="text-[#22D3EE]" />
                </div>
                <p className="text-3xl font-bold mt-3">148</p>
              </div>

              <div className="surface p-4 lift-card">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-secondary">Members</p>
                  <Users size={18} className="text-[#34D399]" />
                </div>
                <p className="text-3xl font-bold mt-3">12.4K</p>
              </div>

              <div className="surface p-4 lift-card">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-secondary">Avg. Progress</p>
                  <HeartPulse size={18} className="text-[#34D399]" />
                </div>
                <p className="text-3xl font-bold mt-3">86%</p>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

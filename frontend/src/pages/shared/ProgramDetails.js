import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock3, Dumbbell, LineChart, User2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

export default function ProgramDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [program, setProgram] = useState(null);
  const [history, setHistory] = useState([]);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    api
      .get(`/program/${id}`)
      .then(({ data }) => setProgram(data))
      .catch(() => navigate(user?.role === "trainer" ? "/trainer/programs" : "/member/programs"));

    if (user?.role === "member") {
      api
        .get(`/analytics/member/program/${id}`)
        .then(({ data }) => setHistory(data))
        .catch(() => setHistory([]));
    }
  }, [id, navigate, user?.role]);

  const joinProgram = async () => {
    setJoining(true);
    try {
      await api.post(`/enrollment/${id}/join`);
      setProgram((prev) => ({ ...prev, joined: true }));
    } finally {
      setJoining(false);
    }
  };

  if (!program) {
    return (
      <div className="page-wrap flex items-center justify-center">
        <div className="glass p-6">Loading program...</div>
      </div>
    );
  }

  return (
    <div className="page-wrap max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="glass p-6 md:p-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold hero-title">{program.title}</h1>
        <p className="text-secondary mt-3 max-w-3xl">{program.description}</p>

        <div className="grid sm:grid-cols-3 gap-3 mt-6">
          <div className="surface p-4">
            <p className="text-xs text-secondary uppercase tracking-wide">Trainer</p>
            <p className="mt-2 flex items-center gap-2"><User2 size={15} />{program.trainerName}</p>
          </div>
          <div className="surface p-4">
            <p className="text-xs text-secondary uppercase tracking-wide">Duration</p>
            <p className="mt-2 flex items-center gap-2"><Clock3 size={15} />{program.duration}</p>
          </div>
          <div className="surface p-4">
            <p className="text-xs text-secondary uppercase tracking-wide">Difficulty</p>
            <p className="mt-2 flex items-center gap-2"><Dumbbell size={15} />{program.difficulty}</p>
          </div>
        </div>

        <div className="mt-7">
          <h3 className="font-semibold text-xl">Exercises</h3>
          <div className="mt-3 grid sm:grid-cols-2 gap-2">
            {(program.exercises || []).map((exercise, idx) => (
              <div key={`${exercise}-${idx}`} className="surface p-3 text-sm">
                {exercise}
              </div>
            ))}
            {!program.exercises?.length ? <p className="text-sm text-secondary">No exercise list added yet.</p> : null}
          </div>
        </div>

        {user?.role === "member" && history.length ? (
          <div className="mt-7">
            <h3 className="font-semibold text-xl flex items-center gap-2">
              <LineChart size={18} />
              Progress History
            </h3>
            <div className="surface p-4 mt-3">
              <div className="h-28 flex items-end gap-1">
                {history.map((point, idx) => {
                  const value = point.progress || 0;
                  const height = 20 + (value / 100) * 80;
                  return (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-slate-800 to-emerald-500/80 rounded-full"
                      style={{ height: `${height}%`, minWidth: "4px" }}
                      title={`${new Date(point.date).toLocaleDateString()}: ${value}%`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-7 flex flex-wrap gap-3">
          {user?.role === "member" ? (
            <button
              onClick={joinProgram}
              disabled={program.joined || joining}
              className={`${program.joined ? "btn-secondary" : "btn-primary"}`}
            >
              {program.joined ? "Joined" : joining ? "Joining..." : "Join Program"}
            </button>
          ) : null}

          <Link to={user?.role === "trainer" ? "/trainer/programs" : "/member/programs"} className="btn-secondary">
            Back
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

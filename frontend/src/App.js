import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import MemberDashboard from "./pages/member/MemberDashboard";
import Programs from "./pages/member/Programs";
import MyPrograms from "./pages/member/MyPrograms";
import MemberProfile from "./pages/member/Profile";
import DietPlan from "./pages/member/DietPlan";

import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerPrograms from "./pages/trainer/TrainerPrograms";
import TrainerProfile from "./pages/trainer/Profile";

import ProgramDetails from "./pages/shared/ProgramDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/member/dashboard"
              element={
                <ProtectedRoute role="member">
                  <MemberDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/programs"
              element={
                <ProtectedRoute role="member">
                  <Programs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/my-programs"
              element={
                <ProtectedRoute role="member">
                  <MyPrograms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/profile"
              element={
                <ProtectedRoute role="member">
                  <MemberProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/member/diet"
              element={
                <ProtectedRoute role="member">
                  <DietPlan />
                </ProtectedRoute>
              }
            />

            <Route
              path="/trainer/dashboard"
              element={
                <ProtectedRoute role="trainer">
                  <TrainerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/programs"
              element={
                <ProtectedRoute role="trainer">
                  <TrainerPrograms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainer/profile"
              element={
                <ProtectedRoute role="trainer">
                  <TrainerProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/programs/:id"
              element={
                <ProtectedRoute>
                  <ProgramDetails />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

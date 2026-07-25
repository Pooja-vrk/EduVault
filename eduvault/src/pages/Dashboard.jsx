import Hero from "../components/dashboard/Hero";
import QuickActions from "../components/dashboard/QuickActions";

import "./Dashboard.css";

export default function Dashboard() {
  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  return (
    <div className="dashboard">
      {/* =========================
          Background Effects
      ========================== */}

      <div className="mesh"></div>

      <div className="light light-blue"></div>
      <div className="light light-purple"></div>
      <div className="light light-pink"></div>

      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>

      {/* =========================
          Hero Section
      ========================== */}

      <Hero user={user} />

      {/* =========================
          Dashboard Content
      ========================== */}

      <main className="dashboard-container">
        <QuickActions />
      </main>
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

export default function Hero({ user }) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();

  let greeting = "Good Evening";
  let emoji = "🌆";

  if (hour < 12) {
    greeting = "Good Morning";
    emoji = "☀️";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
    emoji = "🌤️";
  } else if (hour < 21) {
    greeting = "Good Evening";
    emoji = "🌆";
  } else {
    greeting = "Good Night";
    emoji = "🌙";
  }

  const today = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const time = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <section className="hero">
      <div className="hero-left">
        <span className="hero-badge">
          🎓 Academic Resource Management Portal
        </span>

        <h1>
          {emoji} {greeting},
          <br />
          <span>{user?.name || "Student"}</span>
        </h1>

        <p>
          Welcome back to <strong>EduVault</strong>. Upload, browse,
          download and manage all your academic resources from one
          beautiful platform.
        </p>

        <div className="hero-buttons">
          <button
            className="vault-btn"
            onClick={() => navigate("/materials")}
          >
            <span className="vault-btn-glow"></span>

            <span className="vault-key">🗝️</span>

            <span className="vault-btn-text">
              <small>DISCOVER YOUR RESOURCES</small>
              <strong>Explore the Vault</strong>
            </span>

            <span className="vault-books">📚</span>
            <span className="vault-sparkle sparkle-one">✨</span>
            <span className="vault-sparkle sparkle-two">✦</span>
          </button>

          <button
            className="profile-btn"
            onClick={() => navigate("/profile")}
          >
            <span>👤</span>
            <span>My Profile</span>
          </button>
        </div>
      </div>

      <div className="hero-right">
        <div className="clock-card">
          <div className="clock-icon"></div>
          <h3>{today}</h3>
          <h1>{time}</h1>
          
        </div>
      </div>
    </section>
  );
}
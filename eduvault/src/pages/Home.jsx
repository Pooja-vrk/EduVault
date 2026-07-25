import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowRight,
  FaBookOpen,
  FaBolt,
  FaCloud,
  FaFilePowerpoint,
  FaFlask,
  FaGraduationCap,
  FaLayerGroup,
  FaLock,
  FaMobileAlt,
  FaRegLightbulb,
  FaRocket,
  FaStickyNote,
} from "react-icons/fa";

import "./Home.css";

const Home = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  const goToMaterials = () => {
    navigate("/materials");
  };

  return (
    <main className={`home-container ${show ? "show" : ""}`}>
      {/* DECORATIVE BACKGROUND */}
      <div className="floating-circle circle1"></div>
      <div className="floating-circle circle2"></div>
      <div className="floating-circle circle3"></div>

      {/* HERO */}
      <section className="hero-section">
        <span className="hero-badge">
          <FaGraduationCap />
          Your Smart Academic Space
        </span>

        <h1>
          Welcome to <span>EduVault</span>
        </h1>

        <p>
          A smarter digital workspace designed to organize,
          discover and access academic resources effortlessly.
        </p>

        <button
          className="hero-btn"
          onClick={goToMaterials}
        >
          <span>Explore Resources</span>
          <FaArrowRight />
        </button>
      </section>

      {/* RESOURCE CARDS */}
      <section className="home-grid">
        <div className="home-card ppt-card">
          <div className="card-icon-wrapper">
            <FaFilePowerpoint />
          </div>

          

          <h2>PowerPoint Hub</h2>

          <p>
            Explore organized presentations, seminar slides
            and classroom resources in one place.
          </p>
        </div>

        <div className="home-card notes-card">
          <div className="card-icon-wrapper">
            <FaStickyNote />
          </div>

          

          <h2>Smart Notes</h2>

          <p>
            Access class notes and important academic
            resources quickly and efficiently.
          </p>
        </div>

        <div className="home-card library-card">
          <div className="card-icon-wrapper">
            <FaBookOpen />
          </div>

          

          <h2>Digital Library</h2>

          <p>
            Discover textbooks, reference documents and
            valuable digital learning content.
          </p>
        </div>

        <div className="home-card lab-card">
          <div className="card-icon-wrapper">
            <FaFlask />
          </div>

          

          <h2>Lab Resources</h2>

          <p>
            Access laboratory manuals, practical records
            and experimental resources anytime.
          </p>
        </div>
      </section>

      {/* WHY CHOOSE EDUVAULT */}
      <section className="why-section">
        <span className="section-label">
          <FaRegLightbulb />
          BUILT FOR BETTER LEARNING
        </span>

        <h2>
          Everything You Need,
          <span> One Smart Platform</span>
        </h2>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon secure-icon">
              <FaLock />
            </div>

            <h3>Secure Access</h3>

            <p>
              Keep academic resources organized and
              protected in one trusted workspace.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon speed-icon">
              <FaBolt />
            </div>

            <h3>Lightning Fast</h3>

            <p>
              Find and access the learning material you
              need without wasting valuable time.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon cloud-icon">
              <FaCloud />
            </div>

            <h3>Always Accessible</h3>

            <p>
              Access your academic resources whenever
              and wherever you need them.
            </p>
          </div>

          <div className="why-card">
            <div className="why-icon responsive-icon">
              <FaMobileAlt />
            </div>

            <h3>Fully Responsive</h3>

            <p>
              Enjoy a smooth learning experience across
              desktop, tablet and mobile devices.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="footer-banner">
        <div className="cta-icon">
          <FaLayerGroup />
        </div>

        <span className="cta-small-title">
          YOUR LEARNING SPACE AWAITS
        </span>

        <h2>
          Build a Smarter Way to Learn
        </h2>

        <p>
          Organize, discover and access your academic
          resources with EduVault.
        </p>

        <button
          className="cta-btn"
          onClick={goToMaterials}
        >
          <FaRocket />
          <span>Get Started Now</span>
          <FaArrowRight />
        </button>
      </section>
    </main>
  );
};

export default Home;
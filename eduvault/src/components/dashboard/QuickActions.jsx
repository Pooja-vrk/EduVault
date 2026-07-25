import { Link } from "react-router-dom";
import {
  FaBookOpen,
  FaUserGraduate,
  FaHeadset,
  FaGear,
  FaArrowRight,
  FaLayerGroup,
  FaUserCheck,
  FaComments,
  FaWandMagicSparkles,
} from "react-icons/fa6";

import "./QuickActions.css";

const actions = [
  {
    to: "/materials",
    title: "Browse Materials",
    description:
      "Explore notes, previous papers, PPTs, assignments and study resources.",
    button: "Browse Now",
    icon: <FaBookOpen />,
    badge: <FaLayerGroup />,
    className: "qa-materials",
  },
  {
    to: "/profile",
    title: "My Profile",
    description:
      "View and manage your personal information and account details.",
    button: "View Profile",
    icon: <FaUserGraduate />,
    badge: <FaUserCheck />,
    className: "qa-profile",
  },
  {
    to: "/contact",
    title: "Contact Support",
    description:
      "Get help, send feedback or contact the EduVault support team.",
    button: "Contact Us",
    icon: <FaHeadset />,
    badge: <FaComments />,
    className: "qa-contact",
  },
  {
    to: "/settings",
    title: "Settings",
    description:
      "Manage your account preferences, security and application settings.",
    button: "Open Settings",
    icon: <FaGear />,
    badge: <FaWandMagicSparkles />,
    className: "qa-settings",
  },
];

export default function QuickActions() {
  return (
    <section className="qa-section">
      <div className="qa-header">
        <div className="qa-header-icon">
          <FaWandMagicSparkles />
        </div>

        <div>
          <h2>Quick Actions</h2>
          <p>Everything you need, just one click away.</p>
        </div>
      </div>

      <div className="qa-grid">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.to}
            className={`qa-card ${action.className}`}
          >
            <div className="qa-decoration qa-decoration-one" />
            <div className="qa-decoration qa-decoration-two" />

            <div className="qa-icon-area">
              <div className="qa-orbit">
                <span className="qa-orbit-dot" />
              </div>

              <div className="qa-main-icon">
                {action.icon}
              </div>

              <div className="qa-mini-badge">
                {action.badge}
              </div>
            </div>

            <div className="qa-content">
              <h3>{action.title}</h3>

              <p>{action.description}</p>

              <span className="qa-action">
                {action.button}

                <span className="qa-arrow">
                  <FaArrowRight />
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
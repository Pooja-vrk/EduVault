import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaSearch } from "react-icons/fa";
import "./Header.css";

export default function Header({ user }) {
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    function closeMenu(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("click", closeMenu);

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  // Logout

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <header className="dashboard-header">

      {/* Logo */}

      <Link to="/dashboard" className="header-logo">
  🎓 <span>EduVault</span>
</Link>

      {/* Navigation */}

      <nav className="header-nav">

        <Link to="/home">Home</Link>

        <Link to="/materials">Materials</Link>

        <Link to="/about">About</Link>

        <Link to="/contact">Contact</Link>

        <Link to="/profile">Profile</Link>

        {(user?.role === "admin" ||
          user?.email === "admin@gmail.com") && (
          <Link className="admin-link" to="/admin">
            🛠 Admin
          </Link>
        )}

      </nav>

      {/* Right Side */}

      <div className="header-right">

        {/* Search */}

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search materials..."
          />

        </div>

        {/* Notification */}

        <button className="bell-btn">

          <FaBell />

          <span className="notification-dot"></span>

        </button>

        {/* Profile */}

        <div
          className="profile-area"
          ref={menuRef}
        >

          <div
            className="profile-box"
            onClick={() => setShowMenu(!showMenu)}
          >

            <div className="profile-avatar">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div>

              <small>Welcome</small>

              <h4>{user?.name || "Student"}</h4>

            </div>

          </div>

          {showMenu && (

  <div className="profile-menu">

    <Link
      to="/profile"
      onClick={() => setShowMenu(false)}
    >
      👤 My Profile
    </Link>

    <Link
      to="/settings"
      onClick={() => setShowMenu(false)}
    >
      ⚙ Settings
    </Link>

    {(user?.role === "admin" ||
      user?.email === "admin@gmail.com") && (
      <Link
        to="/admin"
        onClick={() => setShowMenu(false)}
      >
        🛠 Admin Panel
      </Link>
    )}

    <hr />

    <button
      className="dropdown-logout"
      onClick={logout}
    >
      🚪 Logout
    </button>

  </div>

)}

        </div>


      </div>

    </header>
  );
}
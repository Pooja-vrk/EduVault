import axios from "axios";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaBell,
  FaSearch,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import NotificationDropdown from "./NotificationDropdown";

import "./Navbar.css";

export default function Navbar() {

  const navigate = useNavigate();

  /* ===============================
     REFS
  =============================== */

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  /* ===============================
     STATES
  =============================== */

  const [searchQuery, setSearchQuery] = useState("");

  const [showMenu, setShowMenu] =
    useState(false);

  const [
    showNotifications,
    setShowNotifications,
  ] = useState(false);

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  /* ===============================
     USER
  =============================== */

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  const token =
    localStorage.getItem("token");
    /* ===============================
   FETCH NOTIFICATIONS
=============================== */

const fetchNotifications = async () => {

  try {

    if (!token) return;

    const res = await axios.get(
      "http://localhost:5000/api/notifications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setNotifications(
      Array.isArray(res.data)
        ? res.data
        : []
    );

  } catch (error) {

    console.log(
      "Notification Error:",
      error
    );

  }

};

/* ===============================
   LOAD NOTIFICATIONS
=============================== */

useEffect(() => {

  fetchNotifications();

  const interval = setInterval(() => {

    fetchNotifications();

  }, 10000);

  return () => clearInterval(interval);

}, []);

/* ===============================
   CLOSE DROPDOWNS
=============================== */

useEffect(() => {

  const handleClickOutside = (event) => {

    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setShowMenu(false);
    }

    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false);
    }

  };

  document.addEventListener(
    "mousedown",
    handleClickOutside
  );

  return () => {

    document.removeEventListener(
      "mousedown",
      handleClickOutside
    );

  };

}, []);

/* ===============================
   CLOSE MOBILE MENU
=============================== */

const closeMobileMenu = () => {

  setMobileMenu(false);

};

/* ===============================
   SEARCH
=============================== */

const handleSearch = () => {

  const query = searchQuery.trim();

  if (!query) return;

  navigate(
    `/materials?search=${encodeURIComponent(query)}`
  );

  setSearchQuery("");

  closeMobileMenu();

};

/* ===============================
   TOGGLE MENUS
=============================== */

const toggleNotifications = () => {

  setShowNotifications(
    (prev) => !prev
  );

  setShowMenu(false);

};

const toggleProfileMenu = () => {

  setShowMenu(
    (prev) => !prev
  );

  setShowNotifications(false);

};

/* ===============================
   UNREAD COUNT
=============================== */

const unreadCount =
  notifications.filter(
    (item) => !item.read
  ).length;

/* ===============================
   MARK SINGLE NOTIFICATION
=============================== */

const handleNotificationClick =
  async (notification) => {

    try {

      if (!notification.read) {

        await axios.put(

          `http://localhost:5000/api/notifications/${notification._id}/read`,

          {},

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }

        );

        setNotifications((previous) =>
          previous.map((item) =>
            item._id === notification._id
              ? {
                  ...item,
                  read: true,
                }
              : item
          )
        );

      }

      setShowNotifications(false);

      if (notification.link) {

        navigate(notification.link);

      }

    } catch (error) {

      console.log(error);

    }

};

/* ===============================
   MARK ALL READ
=============================== */

const handleMarkAllRead =
  async () => {

    try {

      await axios.put(

        "http://localhost:5000/api/notifications/read-all",

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

      );

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          read: true,
        }))
      );

    } catch (error) {

      console.log(error);

    }

};

/* ===============================
   LOGOUT
=============================== */

const logout = () => {

  localStorage.clear();

  navigate("/login");

  window.location.reload();

};
return (

<header className="navbar">

  {/* ==========================
      LOGO
  ========================== */}

  <Link
    to="/home"
    className="logo"
    onClick={closeMobileMenu}
  >

    <div className="logo-circle">
      🎓
    </div>

    <div className="logo-text">

      <h2>EduVault</h2>

      <span>
        Academic Portal
      </span>

    </div>

  </Link>

  {/* ==========================
      NAVIGATION
  ========================== */}

  <nav
    className={
      mobileMenu
        ? "nav-menu active"
        : "nav-menu"
    }
  >

    <NavLink
      to="/home"
      onClick={closeMobileMenu}
    >
      Home
    </NavLink>

    <NavLink
      to="/dashboard"
      onClick={closeMobileMenu}
    >
      Dashboard
    </NavLink>

    <NavLink
      to="/materials"
      onClick={closeMobileMenu}
    >
      Materials
    </NavLink>

    {user.role === "admin" && (

      <NavLink
        to="/about"
        onClick={closeMobileMenu}
      >
        About
      </NavLink>

    )}

    <NavLink
      to="/contact"
      onClick={closeMobileMenu}
    >
      Contact
    </NavLink>

    <NavLink
      to="/profile"
      onClick={closeMobileMenu}
    >
      Profile
    </NavLink>

  </nav>

  {/* ==========================
      RIGHT SECTION
  ========================== */}

  <div className="right-section">

    {/* SEARCH */}

    <div className="search">

      <FaSearch
        className="search-icon"
        onClick={handleSearch}
      />

      <input
        type="text"
        placeholder="Search materials..."
        value={searchQuery}
        onChange={(e) =>
          setSearchQuery(e.target.value)
        }
        onKeyDown={(e) => {

          if (e.key === "Enter") {

            handleSearch();

          }

        }}
      />

    </div>

    {/* MOBILE BUTTON */}

    <button
      className="mobile"
      type="button"
      onClick={() =>
        setMobileMenu(
          (prev) => !prev
        )
      }
    >

      {
        mobileMenu
          ? <FaTimes />
          : <FaBars />
      }

    </button>
        {/* ===============================
        NOTIFICATION
    ============================== */}

    <div
      className="notification-wrapper"
      ref={notificationRef}
    >

      <button
        className={`bell ${
          unreadCount > 0
            ? "has-notifications"
            : ""
        }`}
        onClick={toggleNotifications}
      >

        <FaBell />

        {unreadCount > 0 && (

          <span className="notification-badge">

            {unreadCount > 99
              ? "99+"
              : unreadCount}

          </span>

        )}

      </button>

      {showNotifications && (

        <NotificationDropdown
          notifications={notifications}
          onNotificationClick={
            handleNotificationClick
          }
          onMarkAllRead={
            handleMarkAllRead
          }
        />

      )}

    </div>

    {/* ===============================
        PROFILE
    ============================== */}

    <div
      className="profile"
      ref={profileRef}
    >

      <button
        className="profile-btn"
        onClick={toggleProfileMenu}
      >

        <div className="avatar">

          {user.profilePic ? (

            <img
              src={user.profilePic}
              alt="Profile"
              className="navbar-profile-img"
            />

          ) : (

            <span>

              {user.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}

            </span>

          )}

        </div>

        <div className="user-info">

          <h4>
            {user.name || "Student"}
          </h4>

          <small>
            {user.role || "User"}
          </small>

        </div>

        <FaChevronDown />

      </button>

      {showMenu && (

        <div className="dropdown">

          <Link
            to="/profile"
            onClick={() =>
              setShowMenu(false)
            }
          >
            🪪 Profile
          </Link>

          <Link
  to="/settings"
  onClick={() =>
    setShowMenu(false)
  }
>
  ⚙️ Settings
</Link>

{/* ==========================
    USER MANAGEMENT (ADMIN ONLY)
========================== */}

{(user.role === "admin" ||
  user.email === "admin@gmail.com") && (

  <Link
    to="/users"
    onClick={() => setShowMenu(false)}
  >
    👥 User Management
  </Link>

)}


{/* ==========================
    ADMIN DASHBOARD
========================== */}

{(user.role === "admin" ||
  user.email === "admin@gmail.com") && (

  <Link
    to="/admin"
    onClick={() =>
      setShowMenu(false)
    }
  >
    🛠️ Admin Dashboard
  </Link>

)}

          <button
            onClick={logout}
          >
            🚪 Logout
          </button>

        </div>

      )}

    </div>

  </div>

  {/* ===============================
      MOBILE OVERLAY
  ============================== */}

  {mobileMenu && (

    <div
      className="mobile-overlay active"
      onClick={closeMobileMenu}
    />

  )}

</header>

);

}

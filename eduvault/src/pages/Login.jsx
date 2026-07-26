import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  FaEye,
  FaEyeSlash,
  FaUserGraduate,
  FaUserShield,
  FaGraduationCap,
  FaBookOpen,
  FaLaptopCode,
  FaDatabase,
  FaShieldAlt,
  FaFingerprint,
  FaArrowLeft,
} from "react-icons/fa";

import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // ==========================
  // STATES
  // ==========================

  const [selectedRole, setSelectedRole] = useState("");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  // ==========================
  // CURSOR GLOW
  // ==========================

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  // ==========================
  // CARD 3D EFFECT
  // ==========================

  const handleCardMove = (e) => {
    if (!cardRef.current) return;

    const rect =
      cardRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX =
      -(y - rect.height / 2) / 18;

    const rotateY =
      (x - rect.width / 2) / 18;

    cardRef.current.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.02)
    `;
  };

  const resetCard = () => {
    if (!cardRef.current) return;

    cardRef.current.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  // ==========================
  // SELECT PORTAL
  // ==========================

  const handleRoleSelect = (role) => {
    setSelectedRole(role);

    // Clear old form values
    setLoginId("");
    setPassword("");
    setShowPassword(false);
  };

  // ==========================
  // GO BACK
  // ==========================

  const handleBack = () => {
    setSelectedRole("");
    setLoginId("");
    setPassword("");
    setShowPassword(false);
  };

  // ==========================
  // LOGIN
  // ==========================

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check portal selection
    if (!selectedRole) {
      toast.error(
        "Please select Student or Administrator portal."
      );
      return;
    }

    // Clean email
    const cleanLoginId = loginId.trim();

     if (!cleanLoginId || !password) {
     toast.error(
    "Please enter your credentials."
  );
  return;
}

    try {
      setLoading(true);

      console.log(
        "========== LOGIN REQUEST =========="
      );

      console.log("Login ID:", cleanLoginId);
      console.log(
        "Selected Portal:",
        selectedRole
      );

      // ==========================
      // SEND LOGIN REQUEST
      // ==========================

      let requestBody = {};

if (selectedRole === "student") {

  requestBody = {
    studentId: cleanLoginId.toUpperCase(),
    password,
  };

} else {

  requestBody = {
    email: cleanLoginId.toLowerCase(),
    password,
  };

}

const res = await axios.post(
  `${API_URL}/api/auth/login`,
  requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        "========== LOGIN RESPONSE =========="
      );

      console.log(res.data);

      // ==========================
      // GET RESPONSE DATA
      // ==========================

      const user = res.data?.user;
      const token = res.data?.token;

      // Validate backend response
      if (!user) {
        toast.error(
          "User information was not received from the server."
        );
        return;
      }

      if (!token) {
        toast.error(
          "Authentication token was not received."
        );
        return;
      }

      // Normalize role
      const actualRole =
        user.role?.trim().toLowerCase();

      console.log(
        "User Role:",
        actualRole
      );

      // ==========================
      // ADMIN PORTAL CHECK
      // ==========================

      if (
        selectedRole === "admin" &&
        actualRole !== "admin"
      ) {
        toast.error(
          "This account is not an administrator. Please use the Student Portal."
        );

        return;
      }

      // ==========================
      // STUDENT PORTAL CHECK
      // ==========================

      if (
        selectedRole === "student" &&
        actualRole === "admin"
      ) {
        toast.error(
          "Administrator accounts must use the Administrator Portal."
        );

        return;
      }

      // ==========================
      // SAVE LOGIN DATA
      // ==========================

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      localStorage.setItem(
        "role",
        actualRole || "student"
      );

      // Update App state safely
      if (
        typeof setIsLoggedIn ===
        "function"
      ) {
        setIsLoggedIn(true);
      }

      console.log(
        "========== LOGIN SUCCESS =========="
      );

      console.log(
        "Saved User:",
        JSON.parse(
          localStorage.getItem("user")
        )
      );

      console.log(
        "Saved Token:",
        localStorage.getItem("token")
      );

      toast.success(
        "Login Successful 🎉"
      );

      // ==========================
      // NAVIGATE BY ROLE
      // ==========================

      if (actualRole === "admin") {
        navigate("/admin", {
          replace: true,
        });
      } else {
        navigate("/dashboard", {
          replace: true,
        });
      }
    } catch (err) {
      console.error(
        "========== LOGIN ERROR =========="
      );

      console.error(
        "Full Error:",
        err
      );

      console.error(
        "HTTP Status:",
        err.response?.status
      );

      console.error(
        "Backend Response:",
        err.response?.data
      );

      console.error(
        "Backend Message:",
        err.response?.data?.message
      );

      // Clear password only
      setPassword("");

      // ==========================
      // HANDLE ERROR STATUS
      // ==========================

      if (!err.response) {
        toast.error(
          "Cannot connect to the server. Make sure the backend is running."
        );

        return;
      }

      if (err.response.status === 400) {
        toast.error(
          err.response?.data?.message ||
            "Invalid email or password."
        );

        return;
      }

      if (err.response.status === 401) {
        toast.error(
          err.response?.data?.message ||
            "Invalid email or password."
        );

        return;
      }

      if (err.response.status === 403) {
        toast.error(
          err.response?.data?.message ||
            "Access denied."
        );

        return;
      }

      toast.error(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // PAGE
  // ==========================

  return (
    <div className="login-page">
      {/* Cursor Glow */}

      <div
        className="cursor-glow"
        style={{
          left: mouse.x,
          top: mouse.y,
        }}
      />

      {/* Animated Background */}

      <div className="aurora"></div>

      {/* Glass Blobs */}

      <div className="glass-blob blob1"></div>
      <div className="glass-blob blob2"></div>
      <div className="glass-blob blob3"></div>
      <div className="glass-blob blob4"></div>

      {/* Animated Background Circles */}

      <div className="bg-circle circle1"></div>
      <div className="bg-circle circle2"></div>
      <div className="bg-circle circle3"></div>

      {/* Sparkles */}

      <div className="sparkles">
        {Array.from({
          length: 10,
        }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      {/* Floating Icons */}

      <div className="floating-icons">
        <FaGraduationCap />
        <FaBookOpen />
        <FaLaptopCode />
        <FaDatabase />
        <FaShieldAlt />
        <FaFingerprint />
      </div>

      {/* Login Container */}

      <div className="login-overlay">
        <div
          ref={cardRef}
          className="welcome-card"
          onMouseMove={
            handleCardMove
          }
          onMouseLeave={
            resetCard
          }
        >
          {!selectedRole ? (
            <>
              {/* Logo */}

              <div className="logo-circle">
                <FaGraduationCap />
              </div>

              <h1 className="main-title">
                EduVault
              </h1>

              <p className="subtitle">
                Academic Resource Management
                Portal
              </p>

              {/* Portal Selection */}

              <div className="portal-container">
                {/* Student */}

                <div
                  className="portal-card"
                  onClick={() =>
                    handleRoleSelect(
                      "student"
                    )
                  }
                >
                  <div className="portal-icon student-icon">
                    <FaUserGraduate />
                  </div>

                  <h2>
                    Student Workspace
                  </h2>

                  <p>
                    Access notes, previous
                    papers, assignments, lab
                    manuals, PPTs, and
                    resources.
                  </p>

                  <button
                    type="button"
                    className="portal-btn"
                  >
                    Continue
                  </button>
                </div>

                {/* Admin */}

                <div
                  className="portal-card"
                  onClick={() =>
                    handleRoleSelect(
                      "admin"
                    )
                  }
                >
                  <div className="portal-icon admin-icon">
                    <FaUserShield />
                  </div>

                  <h2>
                    Admin Workspace
                  </h2>

                  <p>
                    Upload materials, manage
                    users, monitor activity,
                    approve content, and
                    maintain EduVault.
                  </p>

                  <button
                    type="button"
                    className="portal-btn"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              className={`login-form slide-in ${
                selectedRole === "admin"
                  ? "admin-theme"
                  : "student-theme"
              }`}
            >
              {/* Back Button */}

              <button
                type="button"
                className="back-btn"
                onClick={handleBack}
                disabled={loading}
              >
                <FaArrowLeft />

                <span>
                  Back
                </span>
              </button>

              {/* Login Heading */}

              <h1 className="login-title">
                {selectedRole ===
                "admin" ? (
                  <>
                    <FaUserShield className="login-role-icon" />

                    <span>
                      Admin Login
                    </span>
                  </>
                ) : (
                  <>
                    <FaUserGraduate className="login-role-icon" />

                    <span>
                      Student Login
                    </span>
                  </>
                )}
              </h1>

              {/* Description */}

              <p className="login-description">
                {selectedRole ===
                "admin"
                  ? "Manage users, resources, approvals and system activity."
                  : "Access your notes, assignments, previous papers and resources."}
              </p>

              {/* Login Form */}

              <form
                onSubmit={
                  handleLogin
                }
              >
                {/* Email */}

                <div className="input-group">
                  <label>
  {selectedRole === "admin"
    ? "Admin Email"
    : "Student ID"}
</label>

                  <input
  type="text"
  placeholder={
    selectedRole === "admin"
      ? "Enter Admin Email"
      : "Enter Student ID"
  }
  value={loginId}
  disabled={loading}
  autoComplete="off"
  onChange={(e) =>
    setLoginId(e.target.value)
  }
  required
/>
                  
                </div>

                {/* Password */}

                <div className="input-group">
                  <label>
                    Password
                  </label>

                  <div className="password-box">
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="Enter your password"
                      value={password}
                      disabled={
                        loading
                      }
                      autoComplete="current-password"
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      required
                    />

                    <button
                      type="button"
                      className="eye-icon"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword(
                          (
                            previous
                          ) =>
                            !previous
                        )
                      }
                    >
                      {showPassword ? (
                        <FaEyeSlash />
                      ) : (
                        <FaEye />
                      )}
                    </button>
                  </div>
                </div>

                

                {/* Login Button */}

                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className="login-btn ripple"
                >
                  {loading ? (
                    <div className="spinner"></div>
                  ) : (
                    "Login"
                  )}
                </button>
                  
            {selectedRole === "student" ? (

  <div className="bottom-links">
    <span>Don't have an account?</span>

    <Link to="/register">
      Create Account
    </Link>
  </div>

) : (

  <div className="bottom-links">
    <span>
      Administrator accounts are created by the system administrator.
    </span>
  </div>

)}
              </form>

              {/* Security */}

              <div className="login-security">
                <FaShieldAlt />

                <span>
                  Secure and protected
                  login
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import "./Settings.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function Settings() {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(storedUser?.name || "");
  const [email, setEmail] = useState(storedUser?.email || "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ===============================
  // UPDATE PROFILE
  // ===============================

  const saveProfile = async () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.put(
  "https://eduvault-backend-n7na.onrender.com/api/users/profile",
  {
    name,
    email,
  },
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }
);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user || response.data)
      );

      toast.success("✅ Profile Updated Successfully");
    } catch (err) {
      console.log(err);
      toast.error(
        err.response?.data?.message || "Profile Update Failed"
      );
    }
  };

  // ===============================
  // CHANGE PASSWORD
  // ===============================

  const changePassword = async () => {

  if (!oldPassword || !newPassword || !confirmPassword) {
    toast.error("Please fill all fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  try {

    await axios.put(
      "https://eduvault-backend-n7na.onrender.com/api/users/change-password",
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    toast.success("Password Changed Successfully");

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

  } catch (err) {

    console.log(err);

    toast.error(
      err.response?.data?.message ||
      "Password change failed"
    );

  }

};

  return (
    <div className="settings-page">

      <h1>⚙ Account Settings</h1>

      {/* Profile */}

      <div className="settings-card">

        <h2>👤 Profile Information</h2>

        <div className="form-group">
          <label>Name</label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email</label>

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          className="save-btn"
          onClick={saveProfile}
        >
          💾 Save Changes
        </button>

      </div>

      {/* Password */}

      <div className="settings-card">

        <h2>🔒 Change Password</h2>

        <div className="form-group">
          <label>Old Password</label>

          <input
            type={showOld ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <small
            className="toggle-password"
            onClick={() => setShowOld(!showOld)}
          >
            {showOld ? "Hide" : "Show"}
          </small>
        </div>

        <div className="form-group">
          <label>New Password</label>

          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <small
            className="toggle-password"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? "Hide" : "Show"}
          </small>
        </div>

        <div className="form-group">
          <label>Confirm Password</label>

          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
          />

          <small
            className="toggle-password"
            onClick={() =>
              setShowConfirm(!showConfirm)
            }
          >
            {showConfirm ? "Hide" : "Show"}
          </small>
        </div>

        <button
          className="password-btn"
          onClick={changePassword}
        >
          🔒 Change Password
        </button>

      </div>

      {/* Appearance */}

      <div className="settings-card">

        <h2>🎨 Appearance</h2>

        <div className="toggle-row">

          <span>Dark Mode</span>

          <label className="switch">

            <input
              type="checkbox"
              checked={darkMode}
              onChange={() =>
                setDarkMode(!darkMode)
              }
            />

            <span className="slider"></span>

          </label>

        </div>

      </div>

    </div>
  );
}
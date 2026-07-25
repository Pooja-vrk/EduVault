import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AdminProfile.css";

export default function AdminProfile() {
  const navigate = useNavigate();

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const [name, setName] = useState(storedUser?.name || "");
  const [email] = useState(storedUser?.email || "");
  const [password, setPassword] = useState("");

  const saveProfile = () => {
    if (!name.trim()) {
      toast.warning("Name cannot be empty");
      return;
    }

    const updatedUser = {
      ...storedUser,
      name: name.trim(),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setPassword("");
    toast.success("Profile updated successfully");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });

    // Makes App.jsx re-check localStorage
    window.location.reload();
  };

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-header">
        <span>ADMIN ACCOUNT</span>
        <h1>👤 Admin Profile</h1>
        <p>
          Manage your administrator account information.
        </p>
      </div>

      <div className="profile-card">
        <div className="avatar-large">
          {name
            ? name.charAt(0).toUpperCase()
            : "A"}
        </div>

        <div className="profile-form">
          <label>Name</label>

          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(event) =>
              setName(event.target.value)
            }
          />

          <label>Email</label>

          <input
            type="email"
            value={email}
            disabled
          />

          <label>New Password</label>

          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
          />

          <div className="profile-buttons">
            <button
              type="button"
              className="save-btn"
              onClick={saveProfile}
            >
              💾 Save Changes
            </button>

            <button
              type="button"
              className="logout-btn"
              onClick={logout}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
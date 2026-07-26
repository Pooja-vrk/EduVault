import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [stats, setStats] = useState({
    materials: 0,
    downloads: 128,
    favorites: 15,
  });

  /* =============================
     CHECK LOGIN + FETCH DATA
  ============================= */

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      navigate("/login");
      return;
    }

    fetchProfile();
    fetchStats();
  }, [navigate]);

  /* =============================
     FETCH PROFILE
  ============================= */

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "https://eduvault-backend-n7na.onrender.com/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
      setName(res.data.name || "");
      setEmail(res.data.email || "");
    } catch (error) {
      console.error("Profile fetch error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =============================
     FETCH STATISTICS
  ============================= */

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://eduvault-backend-n7na.onrender.com/api/materials/all"
      );

      setStats({
        materials: res.data.length,
        downloads: 128,
        favorites: 15,
      });
    } catch (error) {
      console.error("Stats fetch error:", error);
    }
  };

  /* =============================
     SELECT IMAGE + PREVIEW
  ============================= */

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedFile(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  /* =============================
     UPLOAD PROFILE IMAGE
  ============================= */

  const uploadImage = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();

    formData.append(
      "profilePic",
      selectedFile
    );

    try {
      setUploading(true);

      const res = await axios.post(
        "https://eduvault-backend-n7na.onrender.com/api/users/profile/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = {
        ...user,
        profilePic: res.data.profilePic,
      };

      setUser(updatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setPreview(null);
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(
        "Profile picture updated successfully!"
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Profile picture upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  /* =============================
     CANCEL IMAGE SELECTION
  ============================= */

  const cancelUpload = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(null);
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =============================
     UPDATE PROFILE
  ============================= */

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error(
        "Please enter your full name"
      );
      return;
    }

    if (!email.trim()) {
      toast.error(
        "Please enter your email"
      );
      return;
    }

    try {
      setSaving(true);

      const res = await axios.put(
        "https://eduvault-backend-n7na.onrender.com/api/users/profile",
        {
          name: name.trim(),
          email: email.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(res.data);
      setName(res.data.name || "");
      setEmail(res.data.email || "");

      localStorage.setItem(
        "user",
        JSON.stringify(res.data)
      );

      toast.success(
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =============================
     LOADING SCREEN
  ============================= */

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="profile-loader"></div>
        <h2>Loading Profile...</h2>
      </div>
    );
  }

  /* =============================
     PROFILE NOT FOUND
  ============================= */

  if (!user) {
    return (
      <div className="profile-loading">
        <h2>Unable to load profile</h2>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* BACKGROUND EFFECTS */}

      <div className="profile-blob blob-one"></div>
      <div className="profile-blob blob-two"></div>
      <div className="profile-blob blob-three"></div>

      {/* PROFILE CARD */}

      <div className="profile-card">

        {/* PROFILE IMAGE SECTION */}

        <div className="profile-image-section">

          <div className="profile-image-wrapper">

           <img
  src={
    preview
      ? preview
      : user.profilePic
      ? user.profilePic.startsWith("http")
        ? user.profilePic
        : `${API_URL}/${user.profilePic.replace(/^\/+/, "")}`
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name || "User"
        )}&background=4f46e5&color=fff&size=256`
  }
  alt="Profile"
  className="profile-image"
/>
          </div>

          <h2 className="profile-user-name">
            {name || "Student"}
          </h2>

          <p className="profile-user-role">
            {user.role || "User"}
          </p>

          <button
            type="button"
            className="upload-btn"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            📸 Change Photo
          </button>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            hidden
          />

          {/* PHOTO UPLOAD ACTIONS */}

          {preview && (
            <div className="upload-actions">

              <button
                type="button"
                className="save-photo-btn"
                onClick={uploadImage}
                disabled={uploading}
              >
                {uploading
                  ? "Uploading..."
                  : "✨ Upload Photo"}
              </button>

              <button
                type="button"
                className="cancel-photo-btn"
                onClick={cancelUpload}
                disabled={uploading}
              >
                ✖ Cancel
              </button>

            </div>
          )}

        </div>

        {/* PROFILE INFORMATION */}

        <div className="profile-info">

          <div className="profile-heading">

            <span className="profile-heading-icon">
              👤
            </span>

            <div>
              <h1>My Profile</h1>

              <p>
                Manage your personal information
              </p>
            </div>

          </div>

          {/* FULL NAME */}

          <div className="info-box">

            <label htmlFor="profile-name">
              ✨ Full Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your full name"
            />

          </div>

          {/* EMAIL */}

          <div className="info-box">

            <label htmlFor="profile-email">
              📧 Email Address
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
            />

          </div>

          {/* ROLE */}

          <div className="info-box">

            <label>
              🛡️ Role
            </label>

            <div className="profile-readonly">
              {user.role || "User"}
            </div>

          </div>

          {/* MEMBER SINCE */}

          <div className="info-box">

            <label>
              🗓️ Member Since
            </label>

            <div className="profile-readonly">
              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )
                : "Not available"}
            </div>

          </div>

          {/* ONLY UPDATE BUTTON */}

          <div className="profile-buttons">

            <button
              type="button"
              className="edit-btn"
              onClick={handleUpdate}
              disabled={saving}
            >
              {saving
                ? "⏳ Updating..."
                : "💾 Update Profile"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
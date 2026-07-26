import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaArrowLeft,
  FaDownload,
  FaEye,
  FaFileAlt,
  FaFolderOpen,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

import "./MaterialPages.css";

const API_URL = "https://eduvault-backend-n7na.onrender.com";

export default function MaterialListPage({
  title,
  category,
  description,
  icon,
  themeClass,
}) {
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================================
     LOGGED-IN USER
  ========================================= */

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  const token = localStorage.getItem("token");

  const isAdmin =
    user?.role?.toLowerCase() === "admin" ||
    user?.email?.toLowerCase() === "admin@gmail.com";

  /* =========================================
     FETCH MATERIALS
  ========================================= */

  const fetchMaterials = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/materials/all`
      );

      const allMaterials = Array.isArray(response.data)
        ? response.data
        : [];

      const categoryFiles = allMaterials.filter(
        (file) => file.category === category
      );

      setFiles(categoryFiles);
    } catch (error) {
      console.error("Fetch materials error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load materials"
      );

      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [category]);

  /* =========================================
     GET FILE NAME
  ========================================= */

  const getFileName = (file) => {
    return (
      file.fileName ||
      file.originalName ||
      file.filename ||
      file.name ||
      "Untitled File"
    );
  };

  /* =========================================
     GET FILE URL
  ========================================= */

  const getFileUrl = (file) => {
    const storedPath =
      file.filePath ||
      file.fileUrl ||
      file.url ||
      file.path;

    if (!storedPath) {
      return null;
    }

    if (
      storedPath.startsWith("http://") ||
      storedPath.startsWith("https://")
    ) {
      return storedPath;
    }

    let cleanPath = storedPath.replace(/\\/g, "/");
    cleanPath = cleanPath.replace(/^\/+/, "");

    return `${API_URL}/${cleanPath}`;
  };

  /* =========================================
     GET FILE EXTENSION
  ========================================= */

  const getFileExtension = (fileName) => {
    if (!fileName || !fileName.includes(".")) {
      return "FILE";
    }

    return fileName.split(".").pop()?.toUpperCase() || "FILE";
  };

  /* =========================================
     SEARCH
  ========================================= */

  const filteredFiles = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return files.filter((file) => {
      const fileName = getFileName(file);

      return fileName
        .toLowerCase()
        .includes(searchText);
    });
  }, [files, search]);

  /* =========================================
     FORMAT DATE
  ========================================= */

  const formatDate = (date) => {
    if (!date) {
      return "Recently uploaded";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Recently uploaded";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

 const latestFileId = useMemo(() => {
  if (filteredFiles.length === 0) return null;

  const latest = [...filteredFiles].sort((a, b) => {
    const dateA = new Date(
      a.uploadDate ||
      a.createdAt ||
      a.uploadedAt ||
      0
    );

    const dateB = new Date(
      b.uploadDate ||
      b.createdAt ||
      b.uploadedAt ||
      0
    );

    return dateB - dateA;
  })[0];

  return latest?._id || latest?.id;
}, [filteredFiles]);
  /* =========================================
     VIEW FILE
  ========================================= */

  const handleView = (file) => {
    const id = file._id || file.id;

    if (!id) {
      toast.error("Material ID not found");
      return;
    }

    navigate(`/material-viewer/${id}`);
  };

  /* =========================================
     DOWNLOAD FILE
  ========================================= */

  const handleDownload = (file) => {
    const fileUrl = getFileUrl(file);

    if (!fileUrl) {
      toast.error("File URL not found");
      return;
    }

    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = getFileName(file);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* =========================================
     DELETE MATERIAL - ADMIN ONLY
  ========================================= */

  const handleDelete = async (file) => {
    if (!isAdmin) {
      toast.error(
        "Only administrators can delete materials."
      );
      return;
    }

    const id = file._id || file.id;

    if (!id) {
      toast.error("File ID not found");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${getFileName(file)}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/materials/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Material deleted successfully"
      );

      setFiles((previousFiles) =>
        previousFiles.filter(
          (item) =>
            (item._id || item.id) !== id
        )
      );
    } catch (error) {
      console.error("Delete error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete material"
      );
    }
  };

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="material-page-loading">
        <div className="material-page-spinner"></div>

        <h2>Loading {title}...</h2>

        <p>
          Preparing your academic resources
        </p>
      </div>
    );
  }

  /* =========================================
     MAIN PAGE
  ========================================= */

  return (
    <div
      className={`material-list-page ${
        themeClass || ""
      }`}
    >
      {/* BACKGROUND ORBS */}

      <div className="material-orb orb-one"></div>
      <div className="material-orb orb-two"></div>
      <div className="material-orb orb-three"></div>

      {/* HERO SECTION */}

      <section className="material-list-hero">
        <div className="material-list-hero-content">
          <Link
            to="/materials"
            className="material-back-btn"
          >
            <FaArrowLeft />
            <span>Back to Materials</span>
          </Link>

          <div className="material-title-row">
            <div className="material-title-icon">
              {icon}
            </div>

            <div>
              <span className="material-small-label">
                EDUVAULT RESOURCE LIBRARY
              </span>

              <h1>{title}</h1>

              <p>{description}</p>
            </div>
          </div>
        </div>

        <div className="material-resource-count">
          <FaFolderOpen />

          <strong>{files.length}</strong>

          <span>
            {files.length === 1
              ? "Resource"
              : "Resources"}
          </span>
        </div>
      </section>

      {/* SEARCH TOOLBAR */}

      <section className="material-toolbar">
        <div className="material-search-box">
          <FaSearch />

          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <p>
          Showing{" "}
          <strong>{filteredFiles.length}</strong>
          {" "}of{" "}
          <strong>{files.length}</strong>
          {" "}resources
        </p>
      </section>

      {/* EMPTY STATE OR FILES */}

      {filteredFiles.length === 0 ? (
        <div className="material-empty-state">
          <div className="empty-folder-icon">
            <FaFolderOpen />
          </div>

          <h2>
            {search
              ? "No matching materials found"
              : "No materials uploaded yet"}
          </h2>

          <p>
            {search
              ? "Try searching with another file name."
              : `Upload a file from the ${category} section and it will appear here.`}
          </p>

          <Link
            to="/materials"
            className="empty-upload-link"
          >
            Back to Materials
          </Link>
        </div>
      ) : (
        <section className="material-files-grid">
          {filteredFiles.map((file, index) => {
            const fileName = getFileName(file);

            const uploadDate =
              file.uploadDate ||
              file.createdAt ||
              file.uploadedAt;

            // CHECK NEW STATUS HERE
            const showNewBadge =
  (file._id || file.id) === latestFileId;

            return (
              <article
                className="material-file-card"
                key={
                  file._id ||
                  file.id ||
                  index
                }
              >
                <div className="file-card-glow"></div>

                {/* CARD TOP */}

                <div className="file-card-top">
                  <div className="file-type-icon">
                    <FaFileAlt />
                  </div>

                  <div className="file-card-badges">
                    {/* BLINKING NEW BADGE */}

                    {showNewBadge && (
                      <span className="new-file-badge">
                        <span className="new-badge-dot"></span>
                        NEW
                      </span>
                    )}

                    {/* FILE TYPE */}

                    <span className="file-extension">
                      {getFileExtension(fileName)}
                    </span>
                  </div>
                </div>

                {/* FILE INFORMATION */}

                <div className="file-card-content">
                  <h3 title={fileName}>
                    {fileName}
                  </h3>

                  <p>
                    Uploaded{" "}
                    {formatDate(uploadDate)}
                  </p>
                </div>

                {/* FILE ACTIONS */}

                <div className="file-card-actions">
                  <button
                    type="button"
                    className="file-action-btn view-btn"
                    onClick={() =>
                      handleView(file)
                    }
                  >
                    <FaEye />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    className="file-action-btn download-btn"
                    onClick={() =>
                      handleDownload(file)
                    }
                  >
                    <FaDownload />
                    <span>Download</span>
                  </button>

                  {isAdmin && (
                    <button
                      type="button"
                      className="file-delete-btn"
                      onClick={() =>
                        handleDelete(file)
                      }
                      title="Delete material"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
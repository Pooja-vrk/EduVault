import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  FaArrowLeft,
  FaDownload,
  FaEdit,
  FaTrash,
  FaFolderOpen,
  FaSearch,
  FaFileAlt,
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaSortAmountDown,
  FaTimes,
} from "react-icons/fa";

import Footer from "../components/layout/Footer";
import "./MaterialCategory.css";

const API_URL = import.meta.env.VITE_API_URL;

/* =========================================
   CATEGORY ROUTE MAPPING
========================================= */

const categoryMap = {
  ppts: "PowerPoint PPTs",
  notes: "Lecture Notes",
  documents: "Textbook Documents",
  "lab-manuals": "Lab Manual Materials",
};

/* =========================================
   GET FILE ICON
========================================= */

const getFileIcon = (fileName = "") => {
  const extension = fileName
    .split(".")
    .pop()
    .toLowerCase();

  if (extension === "pdf") {
    return <FaFilePdf />;
  }

  if (
    extension === "doc" ||
    extension === "docx"
  ) {
    return <FaFileWord />;
  }

  if (
    extension === "ppt" ||
    extension === "pptx"
  ) {
    return <FaFilePowerpoint />;
  }

  return <FaFileAlt />;
};

/* =========================================
   GET FILE EXTENSION
========================================= */

const getFileExtension = (fileName = "") => {
  const parts = fileName.split(".");

  if (parts.length < 2) {
    return "FILE";
  }

  return parts.pop().toUpperCase();
};

/* =========================================
   MAIN COMPONENT
========================================= */

export default function MaterialCategory() {
  const { type } = useParams();

  const category = categoryMap[type];

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] =
    useState("newest");
  const [loading, setLoading] =
    useState(true);

  /* =========================================
     FETCH MATERIALS
  ========================================= */

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);

        const response = await axios.get(
          `${API_URL}/api/materials/all`
        );

        const allFiles = Array.isArray(
          response.data
        )
          ? response.data
          : [];

        const categoryFiles =
          allFiles.filter(
            (file) =>
              file.category === category
          );

        setFiles(categoryFiles);
      } catch (error) {
        console.error(
          "Fetch materials error:",
          error
        );

        toast.error(
          "Failed to load materials"
        );
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchMaterials();
    } else {
      setLoading(false);
    }
  }, [category]);

  /* =========================================
     REFRESH MATERIALS
  ========================================= */

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/materials/all`
      );

      const allFiles = Array.isArray(
        response.data
      )
        ? response.data
        : [];

      setFiles(
        allFiles.filter(
          (file) =>
            file.category === category
        )
      );
    } catch (error) {
      console.error(
        "Refresh materials error:",
        error
      );

      toast.error(
        "Failed to refresh materials"
      );
    }
  };

  /* =========================================
     DELETE MATERIAL
  ========================================= */

  const deleteMaterial = async (file) => {
    const result = await Swal.fire({
      title: "Delete Material?",
      text: `Are you sure you want to delete "${file.fileName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await axios.delete(
        `${API_URL}/api/materials/${file._id}`
      );

      setFiles((previousFiles) =>
        previousFiles.filter(
          (item) =>
            item._id !== file._id
        )
      );

      toast.success(
        "Material deleted successfully"
      );
    } catch (error) {
      console.error(
        "Delete material error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  /* =========================================
     EDIT / RENAME MATERIAL
  ========================================= */

  const editMaterial = async (file) => {
    const result = await Swal.fire({
      title: "Edit Material",

      html: `
        <div class="eduvault-edit-modal">
          <div class="edit-file-icon">
            📄
          </div>

          <p class="edit-modal-description">
            Update the name of your academic resource
          </p>

          <label class="edit-modal-label">
            File Name
          </label>

          <input
            id="material-file-name"
            class="swal2-input edit-material-input"
            placeholder="Enter file name"
          />
        </div>
      `,

      showCancelButton: true,
      confirmButtonText: "Save Changes",
      cancelButtonText: "Cancel",

      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#64748b",

      background: "#ffffff",

      focusConfirm: false,

      didOpen: () => {
        const input =
          document.getElementById(
            "material-file-name"
          );

        if (input) {
          input.value =
            file.fileName || "";
        }
      },

      preConfirm: () => {
        const input =
          document.getElementById(
            "material-file-name"
          );

        const newName =
          input?.value.trim();

        if (!newName) {
          Swal.showValidationMessage(
            "File name cannot be empty"
          );

          return false;
        }

        return newName;
      },
    });

    if (!result.isConfirmed) {
      return;
    }

    const newName = result.value;

    if (newName === file.fileName) {
      toast.info(
        "No changes were made"
      );

      return;
    }

    try {
      await axios.put(
        `${API_URL}/api/materials/${file._id}`,
        {
          fileName: newName,
        }
      );

      toast.success(
        "Material updated successfully!"
      );

      await fetchMaterials();
    } catch (error) {
      console.error(
        "Update material error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update material"
      );
    }
  };

  /* =========================================
     SEARCH + SORT
  ========================================= */

  const filteredFiles = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    const result = files.filter(
      (file) =>
        (file.fileName || "")
          .toLowerCase()
          .includes(searchText)
    );

    return [...result].sort(
      (firstFile, secondFile) => {
        const firstDate =
          new Date(
            firstFile.uploadDate ||
              firstFile.createdAt ||
              0
          ).getTime();

        const secondDate =
          new Date(
            secondFile.uploadDate ||
              secondFile.createdAt ||
              0
          ).getTime();

        if (sortOrder === "oldest") {
          return (
            firstDate - secondDate
          );
        }

        if (sortOrder === "az") {
          return (
            firstFile.fileName || ""
          ).localeCompare(
            secondFile.fileName || ""
          );
        }

        if (sortOrder === "za") {
          return (
            secondFile.fileName || ""
          ).localeCompare(
            firstFile.fileName || ""
          );
        }

        return (
          secondDate - firstDate
        );
      }
    );
  }, [files, search, sortOrder]);

  /* =========================================
     INVALID CATEGORY
  ========================================= */

  if (!category) {
    return (
      <>
        <main className="category-materials-page">

          <div className="category-empty-state">

            <FaFolderOpen />

            <h2>
              Category Not Found
            </h2>

            <p>
              The material category you are
              trying to access does not exist.
            </p>

            <Link to="/materials">
              Back to Materials
            </Link>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  /* =========================================
     LOADING SCREEN
  ========================================= */

  if (loading) {
    return (
      <div className="category-loading">

        <div className="category-loader">
        </div>

        <h2>
          Loading {category}...
        </h2>

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
    <>
      <main className="category-materials-page">

        {/* BACK BUTTON */}

        <Link
          to="/materials"
          className="back-materials-btn"
        >
          <FaArrowLeft />

          Back to Materials
        </Link>

        {/* =====================================
            HERO
        ====================================== */}

        <section className="category-page-hero">

          <div className="category-hero-content">

            <span className="category-label">
              ✨ EDUVAULT RESOURCE LIBRARY
            </span>

            <h1>
              {category}
            </h1>

            <p>
              Browse, search, download and
              manage all your uploaded{" "}
              {category.toLowerCase()} from
              one organized workspace.
            </p>

          </div>

          <div className="category-total-box">

            <div className="category-total-icon">
              <FaFolderOpen />
            </div>

            <h2>
              {files.length}
            </h2>

            <span>
              Uploaded Files
            </span>

          </div>

        </section>

        {/* =====================================
            SEARCH + SORT
        ====================================== */}

        <section className="category-toolbar">

          <div className="category-search-box">

            <FaSearch />

            <input
              type="text"
              placeholder={`Search ${category}...`}
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() =>
                  setSearch("")
                }
                aria-label="Clear search"
              >
                <FaTimes />
              </button>
            )}

          </div>

          <div className="category-sort-box">

            <FaSortAmountDown />

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value
                )
              }
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="az">
                Name A - Z
              </option>

              <option value="za">
                Name Z - A
              </option>
            </select>

          </div>

        </section>

        {/* =====================================
            RESULTS HEADER
        ====================================== */}

        <div className="category-results-header">

          <div>

            <span className="category-section-label">
              YOUR FILES
            </span>

            <h2>
              Available Materials
            </h2>

          </div>

          <p>
            Showing{" "}
            <strong>
              {filteredFiles.length}
            </strong>{" "}
            of{" "}
            <strong>
              {files.length}
            </strong>{" "}
            files
          </p>

        </div>

        {/* =====================================
            EMPTY STATE / FILE GRID
        ====================================== */}

        {filteredFiles.length === 0 ? (

          <div className="category-empty-state">

            <div className="empty-folder-icon">
              <FaFolderOpen />
            </div>

            <h2>
              {search
                ? "No Matching Files Found"
                : "No Files Uploaded Yet"}
            </h2>

            <p>
              {search
                ? `No files match "${search}". Try another search.`
                : "Upload files from the Materials page and they will automatically appear here."}
            </p>

            {search ? (

              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
              >
                Clear Search
              </button>

            ) : (

              <Link to="/materials">
                Upload Materials
              </Link>

            )}

          </div>

        ) : (

          <section className="category-files-grid">

            {filteredFiles.map(
              (file, index) => {

                const uploadDate =
                  file.uploadDate ||
                  file.createdAt;

                return (
                  <article
                    className="category-file-card"
                    key={
                      file._id ||
                      `${file.fileName}-${index}`
                    }
                  >

                    <div className="file-card-decoration">
                    </div>

                    {/* FILE TOP */}

                    <div className="category-file-top">

                      <div className="category-file-icon">
                        {getFileIcon(
                          file.fileName
                        )}
                      </div>

                      <span className="file-type-badge">
                        {getFileExtension(
                          file.fileName
                        )}
                      </span>

                    </div>

                    {/* FILE INFORMATION */}

                    <div className="category-file-info">

                      <h3
                        title={
                          file.fileName
                        }
                      >
                        {file.fileName}
                      </h3>

                      <div className="file-details">

                        <p>
                          <strong>
                            Category
                          </strong>

                          <span>
                            {file.category}
                          </span>
                        </p>

                        <p>
                          <strong>
                            Type
                          </strong>

                          <span>
                            {file.fileType ||
                              getFileExtension(
                                file.fileName
                              )}
                          </span>
                        </p>

                        <p>
                          <strong>
                            Uploaded
                          </strong>

                          <span>
                            {uploadDate
                              ? new Date(
                                  uploadDate
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Unknown"}
                          </span>
                        </p>

                      </div>

                    </div>

                    {/* ACTION BUTTONS */}

                    <div className="category-file-actions">

                      <a
                        href={`${API_URL}/api/materials/download/${encodeURIComponent(
                          file.fileName
                        )}`}
                        className="category-download-btn"
                      >
                        <FaDownload />

                        <span>
                          Download
                        </span>
                      </a>

                      <button
                        type="button"
                        className="category-edit-btn"
                        onClick={() =>
                          editMaterial(file)
                        }
                      >
                        <FaEdit />

                        <span>
                          Rename
                        </span>
                      </button>

                      <button
                        type="button"
                        className="category-delete-btn"
                        onClick={() =>
                          deleteMaterial(file)
                        }
                      >
                        <FaTrash />

                        <span>
                          Delete
                        </span>
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </section>

        )}

      </main>

      {/* FOOTER */}

      <Footer />
    </>
  );
}
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";

import {
  FaFilePowerpoint,
  FaBookOpen,
  FaFileAlt,
  FaFlask,
  FaCloudUploadAlt,
  FaArrowRight,
  FaFolderOpen,
  FaSearch,
  FaTimes,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";

import "./Materials.css";

const API_URL = "http://localhost:5000";
const MAX_FILE_SIZE = 25 * 1024 * 1024;

/* =========================================
   MATERIAL CATEGORIES
========================================= */

const categories = [
  {
    title: "PowerPoint PPTs",
    description:
      "Upload and explore presentation slides, seminar PPTs and classroom presentations.",
    route: "/materials/ppts",
    icon: <FaFilePowerpoint />,
    className: "ppt-category",
    accept: ".ppt,.pptx",
    allowedExtensions: ["ppt", "pptx"],
    formatText: "PPT, PPTX",
  },
  {
    title: "Lecture Notes",
    description:
      "Access organized lecture notes, handwritten notes and important study material.",
    route: "/materials/notes",
    icon: <FaBookOpen />,
    className: "notes-category",
    accept: ".pdf,.doc,.docx,.txt",
    allowedExtensions: ["pdf", "doc", "docx", "txt"],
    formatText: "PDF, DOC, DOCX, TXT",
  },
  {
    title: "Textbook Documents",
    description:
      "Store and browse textbooks, PDFs, reference documents and academic resources.",
    route: "/materials/documents",
    icon: <FaFileAlt />,
    className: "documents-category",
    accept: ".pdf,.doc,.docx",
    allowedExtensions: ["pdf", "doc", "docx"],
    formatText: "PDF, DOC, DOCX",
  },
  {
    title: "Lab Manual Materials",
    description:
      "Find laboratory manuals, experiments, practical records and lab resources.",
    route: "/materials/lab-manuals",
    icon: <FaFlask />,
    className: "lab-category",
    accept: ".pdf,.doc,.docx",
    allowedExtensions: ["pdf", "doc", "docx"],
    formatText: "PDF, DOC, DOCX",
  },
];

export default function Materials() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchText = searchParams.get("search") || "";

  const storedUser = localStorage.getItem("user");

  let user = {};

  try {
    user = storedUser ? JSON.parse(storedUser) : {};
  } catch {
    user = {};
  }

  const token = localStorage.getItem("token");

  const isAdmin =
    user?.role?.toLowerCase() === "admin";

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [localSearch, setLocalSearch] =
    useState(searchText);

  const [selectedFiles, setSelectedFiles] =
    useState({});

  const [uploadingCategory, setUploadingCategory] =
    useState(null);

  const [uploadProgress, setUploadProgress] =
    useState({});

  const fileInputRefs = useRef({});

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleMaterialSearch = () => {
    navigate(
      `/materials?search=${encodeURIComponent(localSearch)}`
    );
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMaterialSearch();
    }
  };

  const fetchMaterials = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${API_URL}/api/materials/all`
      );

      setFiles(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load materials");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter((file) => {
    if (!localSearch.trim()) return true;

    const keyword = localSearch.toLowerCase();

    return (
      file.category?.toLowerCase().includes(keyword) ||
      file.originalName?.toLowerCase().includes(keyword) ||
      file.fileName?.toLowerCase().includes(keyword)
    );
  });

  const filteredCategories = categories.filter(
    (category) => {
      if (!localSearch.trim()) return true;

      const keyword = localSearch.toLowerCase();

      return (
        category.title
          .toLowerCase()
          .includes(keyword) ||
        category.description
          .toLowerCase()
          .includes(keyword)
      );
    }
  );

  const getFileExtension = (fileName) =>
    fileName.split(".").pop().toLowerCase();
  /* =========================================
   SELECT + VALIDATE FILE
========================================= */

const handleFileSelect = (category, file) => {

  if (!isAdmin) {
    toast.error("Only administrators can upload materials.");
    return;
  }

  if (!file) return;

  const categoryData = categories.find(
    (item) => item.title === category
  );

  if (!categoryData) {
    toast.error("Invalid material category.");
    return;
  }

  const extension = getFileExtension(file.name);

  if (
    !categoryData.allowedExtensions.includes(
      extension
    )
  ) {
    toast.error(
      `Only ${categoryData.formatText} files are allowed.`
    );

    if (fileInputRefs.current[category]) {
      fileInputRefs.current[category].value = "";
    }

    return;
  }

  if (file.size > MAX_FILE_SIZE) {

    toast.error(
      "Maximum file size is 25 MB."
    );

    if (fileInputRefs.current[category]) {
      fileInputRefs.current[category].value = "";
    }

    return;
  }

  setSelectedFiles((prev) => ({
    ...prev,
    [category]: file,
  }));

  setUploadProgress((prev) => ({
    ...prev,
    [category]: 0,
  }));

  toast.success(
    `${file.name} selected successfully.`
  );
};

/* =========================================
   REMOVE FILE
========================================= */

const removeSelectedFile = (category) => {

  setSelectedFiles((prev) => ({
    ...prev,
    [category]: null,
  }));

  setUploadProgress((prev) => ({
    ...prev,
    [category]: 0,
  }));

  if (fileInputRefs.current[category]) {
    fileInputRefs.current[category].value = "";
  }
};

/* =========================================
   UPLOAD FILE
========================================= */

const handleUpload = async (category) => {

  if (!isAdmin) {
    toast.error(
      "Only administrators can upload materials."
    );
    return;
  }

  if (!token) {
    toast.error("Please login again.");
    return;
  }

  const selectedFile = selectedFiles[category];

  if (!selectedFile) {
    toast.warning(
      "Please choose a file first."
    );
    return;
  }

  try {

    setUploadingCategory(category);

    setUploadProgress((prev) => ({
      ...prev,
      [category]: 0,
    }));

    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("category", category);

    await axios.post(
      `${API_URL}/api/materials/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },

        onUploadProgress: (event) => {

          if (!event.total) return;

          const percentage = Math.round(
            (event.loaded * 100) /
              event.total
          );

          setUploadProgress((prev) => ({
            ...prev,
            [category]: percentage,
          }));
        },
      }
    );

    toast.success(
      "Material uploaded successfully."
    );

    setSelectedFiles((prev) => ({
      ...prev,
      [category]: null,
    }));

    if (fileInputRefs.current[category]) {
      fileInputRefs.current[category].value = "";
    }

    await fetchMaterials();

    setTimeout(() => {
      setUploadProgress((prev) => ({
        ...prev,
        [category]: 0,
      }));
    }, 800);

  } catch (error) {

    console.error(error);

    toast.error(
      error.response?.data?.message ||
      "Upload failed."
    );

  } finally {

    setUploadingCategory(null);

  }

};

/* =========================================
   FILE COUNT
========================================= */

const getFileCount = (category) => {

  return filteredFiles.filter(
    (file) => file.category === category
  ).length;

};
/* =========================================
   LOADING SCREEN
========================================= */

if (loading) {
  return (
    <div className="materials-loading">

      <div className="materials-loader"></div>

      <h2>Loading EduVault...</h2>

      <p>Preparing your academic resources</p>

    </div>
  );
}

/* =========================================
   MAIN PAGE
========================================= */

return (

<div className="materials-page">

{/* =====================================
    HERO SECTION
===================================== */}

<section className="materials-hero">

  <div className="materials-hero-content">

    <span className="materials-badge">
      ✨ YOUR DIGITAL ACADEMIC LIBRARY
    </span>

    <h1>
      Explore Your{" "}
      <span>Learning Resources</span>
    </h1>

    <p>
      {isAdmin
        ? "Upload, organize and access all your academic materials from one beautiful and powerful workspace."
        : "Explore and access your academic materials from one beautiful and powerful workspace."}
    </p>

    {isAdmin && (

      <div className="current-role-badge admin-role">

        <FaShieldAlt />

        Administrator Access

      </div>

    )}

    {/* ==========================
        SEARCH BAR
    ========================== */}

    <div className="materials-search">

      <FaSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search categories or files..."
        value={localSearch}
        onChange={(e) =>
          setLocalSearch(e.target.value)
        }
        onKeyDown={handleSearchKeyDown}
      />

      <button
        className="materials-search-btn"
        onClick={handleMaterialSearch}
      >
        Search
      </button>

    </div>

  </div>

  {/* ==========================
      TOTAL FILES CARD
  ========================== */}

  <div className="materials-total-card">

    <div className="total-icon">
      <FaFolderOpen />
    </div>

    <span>Total Resources</span>

    <h2>{filteredFiles.length}</h2>

    <p>
      Files available in EduVault
    </p>

  </div>

</section>

{/* =====================================
    SECTION HEADING
===================================== */}

<div className="materials-section-heading">

  <div>

    <span className="section-label">
      EXPLORE RESOURCES
    </span>

    <h2>
      Choose a Category
    </h2>

    <p>
      {isAdmin
        ? "Select a category to upload or explore your academic materials."
        : "Select a category to explore available academic materials."}
    </p>

  </div>

</div>

{/* =====================================
    CATEGORY GRID START
===================================== */}

<section className="materials-category-grid">

{filteredCategories.length === 0 ? (

<div className="no-category-found">

<FaSearch size={50} />

<h3>No Category Found</h3>

<p>
Try searching another keyword.
</p>

</div>

) : (

filteredCategories.map((category) => {

const selectedFile =
selectedFiles[category.title];

const progress =
uploadProgress[category.title] || 0;

const isUploading =
uploadingCategory === category.title;

return (
  <article
  key={category.title}
  className={`material-category-card ${category.className}`}
>

  <div className="category-decoration"></div>

  {/* =========================
      CARD HEADER
  ========================= */}

  <div className="category-card-top">

    <div className="category-icon">
      {category.icon}
    </div>

    <div className="category-count">

      <strong>
        {getFileCount(category.title)}
      </strong>

      <span>Files</span>

    </div>

  </div>

  {/* =========================
      CARD CONTENT
  ========================= */}

  <div className="category-content">

    <h2>{category.title}</h2>

    <p>{category.description}</p>

  </div>

  {/* =========================
      ADMIN UPLOAD AREA
  ========================= */}

  {isAdmin && (

    <div className="category-upload-area">

      <label className="file-select-box">

        <FaCloudUploadAlt />

        <div>

          <strong>

            {selectedFile
              ? selectedFile.name
              : "Choose a file"}

          </strong>

          <span>

            {selectedFile
              ? "Ready to upload"
              : `Allowed: ${category.formatText}`}

          </span>

        </div>

        <input
          ref={(element) => {
            fileInputRefs.current[
              category.title
            ] = element;
          }}
          type="file"
          accept={category.accept}
          disabled={isUploading}
          onChange={(event) =>
            handleFileSelect(
              category.title,
              event.target.files[0]
            )
          }
        />

      </label>

      {/* =====================
          SELECTED FILE
      ===================== */}

      {selectedFile &&
        !isUploading && (

          <div className="selected-file-info">

            <FaCheckCircle />

            <div>

              <strong>
                {selectedFile.name}
              </strong>

              <span>

                {(
                  selectedFile.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB

              </span>

            </div>

            <button
              type="button"
              onClick={() =>
                removeSelectedFile(
                  category.title
                )
              }
            >
              <FaTimes />
            </button>

          </div>

      )}

      {/* =====================
          PROGRESS BAR
      ===================== */}

      {isUploading && (

        <div className="upload-progress-container">

          <div className="upload-progress-info">

            <span>
              Uploading...
            </span>

            <strong>
              {progress}%
            </strong>

          </div>

          <div className="upload-progress-track">

            <div
              className="upload-progress-bar"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      )}

      {/* =====================
          UPLOAD BUTTON
      ===================== */}

      <button
        className="category-upload-btn"
        onClick={() =>
          handleUpload(category.title)
        }
        disabled={
          isUploading ||
          !selectedFile
        }
      >

        <FaCloudUploadAlt />

        {isUploading
          ? `Uploading ${progress}%`
          : "Upload File"}

      </button>

    </div>

  )}
    {/* =================================
      VIEW MATERIALS BUTTON
  ================================= */}

  <Link
    to={category.route}
    className="view-materials-btn"
  >
    <span>

      <FaFolderOpen />

      View Materials

    </span>

    <FaArrowRight />

  </Link>

</article>

);

})

)}

</section>

{/* =====================================
    SEARCH RESULT MESSAGE
===================================== */}

{localSearch.trim() !== "" && (

  <div className="materials-search-result">

    <p>

      Showing results for{" "}

      <strong>"{localSearch}"</strong>

    </p>

    <button
      className="clear-search-btn"
      onClick={() => {

        setLocalSearch("");

        navigate("/materials");

      }}
    >

      Clear Search

    </button>

  </div>

)}
{/* =====================================
    PAGE FOOTER
===================================== */}

<footer >

  

</footer>

</div>

);

}
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import DashboardCharts from "../components/dashboard/DashboardCharts";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  FiBookOpen,
  FiMessageSquare,
  FiFileText,
  FiTrash2,
  FiSearch,
  FiDownload,
  FiUploadCloud,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiLayers,
} from "react-icons/fi";

import {
  HiOutlinePresentationChartBar,
  HiOutlineBeaker,
  HiOutlineDocumentText,
  HiOutlineSparkles,
} from "react-icons/hi2";

import "./Admin.css";

const API_URL = "https://eduvault-backend-n7na.onrender.com/api";
const RECORDS_PER_PAGE = 5;

function Admin() {
  const navigate = useNavigate();
  // =====================================================
  // STATES
  // =====================================================

  const [files, setFiles] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  const [materialSearch, setMaterialSearch] = useState("");
  const [feedbackSearch, setFeedbackSearch] = useState("");

  const [materialSort, setMaterialSort] = useState("newest");
  const [feedbackSort, setFeedbackSort] = useState("newest");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [materialPage, setMaterialPage] = useState(1);
  const [feedbackPage, setFeedbackPage] = useState(1);

  const [loadingMaterials, setLoadingMaterials] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    fetchFiles();
    fetchFeedbacks();
  }, []);

  // =====================================================
  // FETCH MATERIALS
  // =====================================================

  const fetchFiles = async () => {
    try {
      setLoadingMaterials(true);

      const response = await axios.get(`${API_URL}/materials/all`);

      setFiles(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Materials fetch error:", error);
      toast.error("Failed to load materials");
    } finally {
      setLoadingMaterials(false);
    }
  };

  // =====================================================
  // FETCH FEEDBACK
  // =====================================================

  const fetchFeedbacks = async () => {
    try {
      setLoadingFeedback(true);

      const response = await axios.get(`${API_URL}/feedback`);

      setFeedbacks(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Feedback fetch error:", error);
      toast.error("Failed to load feedback");
    } finally {
      setLoadingFeedback(false);
    }
  };

  // =====================================================
  // DELETE MATERIAL
  // =====================================================

  const deleteMaterial = async (id) => {
    const result = await Swal.fire({
      title: "Delete Material?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/materials/${id}`);

      setFiles((previousFiles) =>
        previousFiles.filter((file) => file._id !== id)
      );

      toast.success("Material deleted successfully");
    } catch (error) {
      console.error("Material delete error:", error);
      toast.error("Failed to delete material");
    }
  };

  // =====================================================
  // DELETE FEEDBACK
  // =====================================================

  const deleteFeedback = async (id) => {
    const result = await Swal.fire({
      title: "Delete Feedback?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_URL}/feedback/${id}`);

      setFeedbacks((previousFeedbacks) =>
        previousFeedbacks.filter(
          (item) => item._id !== id
        )
      );

      toast.success("Feedback deleted successfully");
    } catch (error) {
      console.error("Feedback delete error:", error);
      toast.error("Failed to delete feedback");
    }
  };

  // =====================================================
  // EXPORT MATERIALS TO EXCEL
  // =====================================================

  const exportMaterials = () => {
    if (!files.length) {
      toast.info("No materials available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      files.map((file) => ({
        "File Name": file.fileName || "Untitled",
        Category: file.category || "Unknown",
        Uploaded: new Date(
          file.createdAt ||
            file.uploadDate ||
            Date.now()
        ).toLocaleString(),
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Materials"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "EduVault_Materials.xlsx");
  };

  // =====================================================
  // EXPORT FEEDBACK TO EXCEL
  // =====================================================

  const exportFeedback = () => {
    if (!feedbacks.length) {
      toast.info("No feedback available to export");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(
      feedbacks.map((item) => ({
        Name: item.name || "Unknown",
        Email: item.email || "Unknown",
        Message: item.message || "",
      }))
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Feedback"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "EduVault_Feedback.xlsx");
  };

  // =====================================================
  // EXPORT MATERIALS PDF
  // =====================================================

  const exportMaterialsPDF = () => {
    if (!files.length) {
      toast.info("No materials available to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("EduVault Materials Report", 14, 20);

    autoTable(doc, {
      startY: 30,

      head: [
        ["File Name", "Category", "Uploaded"],
      ],

      body: files.map((file) => [
        file.fileName || "Untitled",
        file.category || "Unknown",
        new Date(
          file.createdAt ||
            file.uploadDate ||
            Date.now()
        ).toLocaleDateString(),
      ]),

      styles: {
        fontSize: 8,
      },

      headStyles: {
        fillColor: [99, 102, 241],
      },
    });

    doc.save("EduVault_Materials.pdf");
  };

  // =====================================================
  // EXPORT FEEDBACK PDF
  // =====================================================

  const exportFeedbackPDF = () => {
    if (!feedbacks.length) {
      toast.info("No feedback available to export");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("EduVault Feedback Report", 14, 20);

    autoTable(doc, {
      startY: 30,

      head: [
        ["Name", "Email", "Message"],
      ],

      body: feedbacks.map((item) => [
        item.name || "Unknown",
        item.email || "Unknown",
        item.message || "",
      ]),

      styles: {
        fontSize: 8,
      },

      headStyles: {
        fillColor: [236, 72, 153],
      },
    });

    doc.save("EduVault_Feedback.pdf");
  };

  // =====================================================
  // MATERIAL COUNTS
  // =====================================================

  const pptCount = files.filter(
    (file) => file.category === "PowerPoint PPTs"
  ).length;

  const notesCount = files.filter(
    (file) => file.category === "Lecture Notes"
  ).length;

  const documentsCount = files.filter(
    (file) => file.category === "Textbook Documents"
  ).length;

  const labCount = files.filter(
    (file) => file.category === "Lab Manual Materials"
  ).length;

  // =====================================================
  // FILTER & SORT MATERIALS
  // =====================================================

  const filteredMaterials = useMemo(() => {
    return [...files]
      .filter((file) => {
        const fileName = (
          file.fileName || ""
        ).toLowerCase();

        const searchMatch = fileName.includes(
          materialSearch.toLowerCase()
        );

        const categoryMatch =
          selectedCategory === "All" ||
          file.category === selectedCategory;

        return searchMatch && categoryMatch;
      })
      .sort((a, b) => {
        const aDate = new Date(
          a.createdAt || a.uploadDate || 0
        );

        const bDate = new Date(
          b.createdAt || b.uploadDate || 0
        );

        const aName = a.fileName || "";
        const bName = b.fileName || "";

        switch (materialSort) {
          case "newest":
            return bDate - aDate;

          case "oldest":
            return aDate - bDate;

          case "az":
            return aName.localeCompare(bName);

          case "za":
            return bName.localeCompare(aName);

          default:
            return 0;
        }
      });
  }, [
    files,
    materialSearch,
    materialSort,
    selectedCategory,
  ]);

  // =====================================================
  // MATERIAL PAGINATION
  // =====================================================

  const totalMaterialPages = Math.ceil(
    filteredMaterials.length / RECORDS_PER_PAGE
  );

  const paginatedMaterials = filteredMaterials.slice(
    (materialPage - 1) * RECORDS_PER_PAGE,
    materialPage * RECORDS_PER_PAGE
  );

  // =====================================================
  // FILTER & SORT FEEDBACK
  // =====================================================

  const filteredFeedback = useMemo(() => {
    const search = feedbackSearch.toLowerCase();

    return [...feedbacks]
      .filter((item) => {
        return (
          (item.name || "")
            .toLowerCase()
            .includes(search) ||
          (item.email || "")
            .toLowerCase()
            .includes(search) ||
          (item.message || "")
            .toLowerCase()
            .includes(search)
        );
      })
      .sort((a, b) => {
        const aDate = new Date(a.createdAt || 0);
        const bDate = new Date(b.createdAt || 0);

        const aName = a.name || "";
        const bName = b.name || "";

        switch (feedbackSort) {
          case "newest":
            return bDate - aDate;

          case "oldest":
            return aDate - bDate;

          case "az":
            return aName.localeCompare(bName);

          case "za":
            return bName.localeCompare(aName);

          default:
            return 0;
        }
      });
  }, [
    feedbacks,
    feedbackSearch,
    feedbackSort,
  ]);

  // =====================================================
  // FEEDBACK PAGINATION
  // =====================================================

  const totalFeedbackPages = Math.ceil(
    filteredFeedback.length / RECORDS_PER_PAGE
  );

  const paginatedFeedback = filteredFeedback.slice(
    (feedbackPage - 1) * RECORDS_PER_PAGE,
    feedbackPage * RECORDS_PER_PAGE
  );

  // =====================================================
  // CATEGORY BADGE
  // =====================================================

  const getCategoryBadge = (category) => {
    switch (category) {
      case "PowerPoint PPTs":
        return (
          <span className="category-badge badge-ppt">
            <HiOutlinePresentationChartBar />
            PPT
          </span>
        );

      case "Lecture Notes":
        return (
          <span className="category-badge badge-notes">
            <FiFileText />
            Notes
          </span>
        );

      case "Textbook Documents":
        return (
          <span className="category-badge badge-documents">
            <HiOutlineDocumentText />
            Document
          </span>
        );

      case "Lab Manual Materials":
        return (
          <span className="category-badge badge-labs">
            <HiOutlineBeaker />
            Lab Manual
          </span>
        );

      default:
        return (
          <span className="category-badge">
            <FiLayers />
            {category || "Other"}
          </span>
        );
    }
  };

  // =====================================================
  // GREETING
  // =====================================================

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <main className="admin-page">

      {/* Decorative Background */}
      <div className="admin-bg-shape shape-one"></div>
      <div className="admin-bg-shape shape-two"></div>
      <div className="admin-bg-shape shape-three"></div>

      <div className="admin-container">

        {/* ================= HEADER ================= */}

        <section className="admin-header">
          <div className="header-shine"></div>

          <div className="header-left">
            <span className="admin-welcome-label">
              <HiOutlineSparkles />
              ADMIN DASHBOARD
            </span>

            <h1>
              {getGreeting()}, Admin
              <span className="wave-hand">👋</span>
            </h1>

            <p>
              Welcome back to <strong>EduVault</strong>.
              Monitor materials, analytics and user
              feedback from one beautiful workspace.
            </p>
          </div>

          <div className="header-right">
            <div className="date-box">
              <FiCalendar />

              <span>
                {new Date().toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </span>
            </div>


            <button
             type="button"
             className="quick-upload-btn"
             onClick={() => navigate("/materials")}
            >
            <FiUploadCloud />
              <span>Upload Material</span>
           </button>
          </div>
        </section>

        {/* ================= STATISTICS ================= */}

        <section className="admin-stats">

          <div className="admin-card card-total">
            <div className="card-glow"></div>

            <div className="card-top">
              <div className="card-icon">
                <FiBookOpen />
              </div>

              <span className="card-mini-label">
                All Files
              </span>
            </div>

            <h2>{files.length}</h2>
            <p>Total Materials</p>

            <div className="card-decoration">
              <FiBookOpen />
            </div>
          </div>

          <div className="admin-card card-feedback">
            <div className="card-glow"></div>

            <div className="card-top">
              <div className="card-icon">
                <FiMessageSquare />
              </div>

              <span className="card-mini-label">
                Messages
              </span>
            </div>

            <h2>{feedbacks.length}</h2>
            <p>Total Feedback</p>

            <div className="card-decoration">
              <FiMessageSquare />
            </div>
          </div>

          <div className="admin-card card-ppt">
            <div className="card-glow"></div>

            <div className="card-top">
              <div className="card-icon">
                <HiOutlinePresentationChartBar />
              </div>

              <span className="card-mini-label">
                Slides
              </span>
            </div>

            <h2>{pptCount}</h2>
            <p>PowerPoint Files</p>

            <div className="card-decoration">
              <HiOutlinePresentationChartBar />
            </div>
          </div>

          <div className="admin-card card-notes">
            <div className="card-glow"></div>

            <div className="card-top">
              <div className="card-icon">
                <FiFileText />
              </div>

              <span className="card-mini-label">
                Study
              </span>
            </div>

            <h2>{notesCount}</h2>
            <p>Lecture Notes</p>

            <div className="card-decoration">
              <FiFileText />
            </div>
          </div>

          <div className="admin-card card-documents">
            <div className="card-glow"></div>

            <div className="card-top">
              <div className="card-icon">
                <HiOutlineDocumentText />
              </div>

              <span className="card-mini-label">
                Documents
              </span>
            </div>

            <h2>{documentsCount}</h2>
            <p>Textbook Documents</p>

            <div className="card-decoration">
              <HiOutlineDocumentText />
            </div>
          </div>

          <div className="admin-card card-labs">
            <div className="card-glow"></div>

            <div className="card-top">
              <div className="card-icon">
                <HiOutlineBeaker />
              </div>

              <span className="card-mini-label">
                Practical
              </span>
            </div>

            <h2>{labCount}</h2>
            <p>Lab Manuals</p>

            <div className="card-decoration">
              <HiOutlineBeaker />
            </div>
          </div>

        </section>

        {/* ================= CHARTS ================= */}

        <section className="dashboard-chart-wrapper">
          <DashboardCharts
            files={files}
            selectedCategory={selectedCategory}
            setSelectedCategory={(category) => {
              setSelectedCategory(category);
              setMaterialPage(1);
            }}
          />
        </section>

        {/* ================= MATERIALS ================= */}

        <section className="admin-data-section materials-section">

          <div className="section-heading">
            <div>
              <span className="section-label">
                RESOURCE MANAGEMENT
              </span>

              <h2>
                <FiBookOpen />
                Uploaded Materials
              </h2>

              <p>
                Search, filter, export and manage all
                uploaded academic resources.
              </p>
            </div>

            <div className="export-buttons">
              <button
                className="export-btn excel-btn"
                onClick={exportMaterials}
              >
                <FiDownload />
                Export Excel
              </button>

              <button
                className="export-btn pdf-btn"
                onClick={exportMaterialsPDF}
              >
                <FiFileText />
                Export PDF
              </button>
            </div>
          </div>

          <div className="active-filter">
            <FiFilter />

            <span>Showing:</span>

            <strong>{selectedCategory}</strong>

            {selectedCategory !== "All" && (
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setMaterialPage(1);
                }}
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="table-controls">
            <div className="search-box">
              <FiSearch />

              <input
                type="text"
                placeholder="Search materials..."
                value={materialSearch}
                onChange={(event) => {
                  setMaterialSearch(event.target.value);
                  setMaterialPage(1);
                }}
              />
            </div>

            <select
              className="admin-sort"
              value={materialSort}
              onChange={(event) => {
                setMaterialSort(event.target.value);
                setMaterialPage(1);
              }}
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="az">
                Name A → Z
              </option>

              <option value="za">
                Name Z → A
              </option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loadingMaterials ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="empty-table-message"
                    >
                      Loading materials...
                    </td>
                  </tr>
                ) : paginatedMaterials.length > 0 ? (
                  paginatedMaterials.map((file) => (
                    <tr key={file._id}>
                      <td>
                        <div className="file-name-cell">
                          <div className="file-mini-icon">
                            <FiFileText />
                          </div>

                          <span>
                            {file.fileName ||
                              "Untitled File"}
                          </span>
                        </div>
                      </td>

                      <td>
                        {getCategoryBadge(
                          file.category
                        )}
                      </td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteMaterial(file._id)
                          }
                        >
                          <FiTrash2 />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="empty-table-message"
                    >
                      No materials found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={materialPage === 1}
              onClick={() =>
                setMaterialPage((page) => page - 1)
              }
            >
              <FiChevronLeft />
              Previous
            </button>

            <span>
              Page <strong>{materialPage}</strong> of{" "}
              <strong>
                {totalMaterialPages || 1}
              </strong>
            </span>

            <button
              disabled={
                totalMaterialPages === 0 ||
                materialPage >= totalMaterialPages
              }
              onClick={() =>
                setMaterialPage((page) => page + 1)
              }
            >
              Next
              <FiChevronRight />
            </button>
          </div>

        </section>

        {/* ================= FEEDBACK ================= */}

        <section className="admin-data-section feedback-section">

          <div className="section-heading">
            <div>
              <span className="section-label pink-label">
                USER COMMUNICATION
              </span>

              <h2>
                <FiMessageSquare />
                User Feedback
              </h2>

              <p>
                Review and manage messages submitted by
                EduVault users.
              </p>
            </div>

            <div className="export-buttons">
              <button
                className="export-btn excel-btn"
                onClick={exportFeedback}
              >
                <FiDownload />
                Export Excel
              </button>

              <button
                className="export-btn pdf-btn"
                onClick={exportFeedbackPDF}
              >
                <FiFileText />
                Export PDF
              </button>
            </div>
          </div>

          <div className="table-controls">
            <div className="search-box">
              <FiSearch />

              <input
                type="text"
                placeholder="Search feedback..."
                value={feedbackSearch}
                onChange={(event) => {
                  setFeedbackSearch(event.target.value);
                  setFeedbackPage(1);
                }}
              />
            </div>

            <select
              className="admin-sort"
              value={feedbackSort}
              onChange={(event) => {
                setFeedbackSort(event.target.value);
                setFeedbackPage(1);
              }}
            >
              <option value="newest">
                Newest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

              <option value="az">
                Name A → Z
              </option>

              <option value="za">
                Name Z → A
              </option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loadingFeedback ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="empty-table-message"
                    >
                      Loading feedback...
                    </td>
                  </tr>
                ) : paginatedFeedback.length > 0 ? (
                  paginatedFeedback.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>
                          {item.name || "Unknown"}
                        </strong>
                      </td>

                      <td>
                        {item.email || "Unknown"}
                      </td>

                      <td className="message-cell">
                        {item.message || "No message"}
                      </td>

                      <td>
                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteFeedback(item._id)
                          }
                        >
                          <FiTrash2 />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="empty-table-message"
                    >
                      No feedback found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={feedbackPage === 1}
              onClick={() =>
                setFeedbackPage((page) => page - 1)
              }
            >
              <FiChevronLeft />
              Previous
            </button>

            <span>
              Page <strong>{feedbackPage}</strong> of{" "}
              <strong>
                {totalFeedbackPages || 1}
              </strong>
            </span>

            <button
              disabled={
                totalFeedbackPages === 0 ||
                feedbackPage >= totalFeedbackPages
              }
              onClick={() =>
                setFeedbackPage((page) => page + 1)
              }
            >
              Next
              <FiChevronRight />
            </button>
          </div>

        </section>

      </div>
    </main>
  );
}

export default Admin;
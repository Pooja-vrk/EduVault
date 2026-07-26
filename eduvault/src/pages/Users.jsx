import { useEffect, useState } from "react";
import axios from "axios";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./Admin.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

function Users() {

  // ==========================
  // STATES
  // ==========================

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);

  const recordsPerPage = 5;

  
  // ==========================
  // LOAD USERS
  // ==========================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================
  // FETCH USERS
  // ==========================

  const fetchUsers = async () => {

    try {

      const token = localStorage.getItem("token");

const res = await axios.get(
   `${API_URL}/users`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      setUsers(res.data || []);

    } catch (err) {

      console.log(err);

      toast.error("Failed to load users.");

    }

  };

  // ==========================
  // DELETE USER
  // ==========================

  const deleteUser = async (id) => {

    // Prevent deleting yourself


  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  if (
    currentUser &&
    (currentUser._id === id || currentUser.id === id)
  ) {
    toast.error("You cannot delete your own account.");
    return;
  }

    const result = await Swal.fire({

      title: "Delete User?",

      text: "This action cannot be undone.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#e53935",

      cancelButtonColor: "#2563eb",

      confirmButtonText: "Delete",

    });

    if (!result.isConfirmed) return;

    try {

      const token = localStorage.getItem("token");

await axios.delete(
   `${API_URL}/users/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      toast.success("User deleted successfully.");

      fetchUsers();

    } catch (err) {

      console.log(err);

      toast.error("Failed to delete user.");

    }

  };

  // ==========================
  // EXPORT EXCEL
  // ==========================

  const exportUsers = () => {

    const worksheet = XLSX.utils.json_to_sheet(

      users.map((user) => ({

        Name: user.name,
StudentID: user.studentId || "-",
Email: user.email || "-",
Role: user.role,

        Registered: new Date(
          user.createdAt
        ).toLocaleString(),

      }))

    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Users"
    );

    const excelBuffer = XLSX.write(workbook, {

      bookType: "xlsx",

      type: "array",

    });

    const blob = new Blob(
      [excelBuffer],
      {
        type: "application/octet-stream",
      }
    );

    saveAs(blob, "EduVault_Users.xlsx");

  };

  // ==========================
  // EXPORT PDF
  // ==========================

  const exportUsersPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text(
      "EduVault Users Report",
      14,
      20
    );

    autoTable(doc, {

      startY: 30,

      head: [[
  "Student ID",
  "Name",
  "Email",
  "Role",
  "Registered"
]],

body: users.map((user) => [
  user.studentId || "-",
  user.name,
  user.email || "-",
  user.role,
  new Date(user.createdAt).toLocaleString(),
]),

    });

    doc.save("EduVault_Users.pdf");

  };
    // ==========================
  // SEARCH + SORT USERS
  // ==========================

  const currentUser = JSON.parse(localStorage.getItem("user"));

const filteredUsers = users
  .filter((user) => {
    // Show only students
    if (user.role !== "student") return false;

    // Hide logged-in user
    if (
      currentUser &&
      (
        currentUser._id === user._id ||
        currentUser.id === user._id ||
        currentUser.email === user.email
      )
    ) {
      return false;
    }

    // Search only by name or student ID
    return (
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.studentId || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  })

    .sort((a, b) => {

      switch (sort) {

        case "newest":

          return (
            new Date(b.createdAt) -
            new Date(a.createdAt)
          );

        case "oldest":

          return (
            new Date(a.createdAt) -
            new Date(b.createdAt)
          );

        case "az":

          return a.name.localeCompare(b.name);

        case "za":

          return b.name.localeCompare(a.name);

        default:

          return 0;

      }

    });

  // ==========================
  // PAGINATION
  // ==========================

  const totalPages = Math.ceil(
    filteredUsers.length / recordsPerPage
  );

  const paginatedUsers = filteredUsers.slice(

    (page - 1) * recordsPerPage,

    page * recordsPerPage

  );

  // ==========================
  // USER STATISTICS
  // ==========================

 const totalStudents = filteredUsers.length;
  // ==========================
  // PAGE STARTS HERE
  // ==========================

    return (
    <div>
      

      <div className="admin-page">

        <h1>👥 User Management</h1>

        {/* ==========================
            Statistics Cards
        ========================== */}

       <div className="admin-stats">
  <div className="admin-card">
    <h2>{totalStudents}</h2>
    <p>Total Students</p>
  </div>
</div>
        {/* ==========================
            Export Buttons
        ========================== */}

      <div className="export-buttons">

  <button
    className="export-btn excel-btn"
    onClick={exportUsers}
  >
    📥 Export Excel
  </button>

  <button
    className="export-btn pdf-btn"
    onClick={exportUsersPDF}
  >
    📄 Export PDF
  </button>

</div>
       {/* ==========================
    Search & Sort
========================== */}

<div className="table-controls">

  <div className="search-box">
    <input
      type="text"
      className="admin-search"
      placeholder="🔍 Search Student..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setPage(1);
      }}
    />
  </div>

  <select
    className="admin-sort"
    value={sort}
    onChange={(e) => setSort(e.target.value)}
  >
    <option value="newest">🆕 Newest First</option>
    <option value="oldest">📅 Oldest First</option>
    <option value="az">🔤 A → Z</option>
    <option value="za">🔠 Z → A</option>
  </select>

</div>

        {/* ==========================
            Users Table
        ========================== */}

        <table className="admin-table">

          <thead>
<tr>
  <th>Student ID</th>
  <th>Name</th>
  <th>Action</th>
</tr>
</thead>
          <tbody>

            {paginatedUsers.length > 0 ? (

              paginatedUsers.map((user) => {

                const currentUser = JSON.parse(
                  localStorage.getItem("user")
                );

                const isCurrentUser =
  currentUser &&
  (
    currentUser._id === user._id ||
    currentUser.id === user._id ||
    currentUser.email === user.email
  );

                return (

                  <tr key={user._id}>

<td>{user.studentId || "-"}</td>

<td>{user.name}</td>

<td>
  <button
    className="delete-btn"
    onClick={() => deleteUser(user._id)}
  >
    🗑 Delete
  </button>
</td>

                  </tr>

                );

              })

            ) : (

              <tr>

                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    fontWeight: "bold"
                  }}
                >
                  🚫 No Users Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

        {/* ==========================
            Pagination
        ========================== */}

        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
          >
            ◀ Previous
          </button>

          <span>

            Page {page} of {totalPages || 1}

          </span>

          <button
            disabled={
              page === totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next ▶
          </button>

        </div>

      </div>

    </div>
  );
}

export default Users;
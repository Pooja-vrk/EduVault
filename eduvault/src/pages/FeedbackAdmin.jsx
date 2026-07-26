import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Sidebar from "../components/layout/Sidebar";


import "./Admin.css";

function FeedbackAdmin() {

  const [feedbacks, setFeedbacks] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const recordsPerPage = 5;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {

    try {

      const res = await axios.get(
        "https://eduvault-backend-n7na.onrender.com/api/feedback"
      );

      setFeedbacks(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  const deleteFeedback = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this feedback?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `https://eduvault-backend-n7na.onrender.com/api/feedback/${id}`
      );

      toast.success("Feedback Deleted");

      fetchFeedbacks();

    } catch (err) {

      console.log(err);

    }

  };
    // ==========================
  // Search
  // ==========================

  const filteredFeedback = feedbacks.filter((item) => {

    return (
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.message
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  });

  // ==========================
  // Pagination
  // ==========================

  const totalPages = Math.ceil(
    filteredFeedback.length / recordsPerPage
  );

  const paginatedFeedback =
    filteredFeedback.slice(
      (page - 1) * recordsPerPage,
      page * recordsPerPage
    );

  return (

    <div>

      <Sidebar />

      <div className="admin-page">

        <h1>💬 Feedback Management</h1>

        <div className="table-controls">

          <input
            type="text"
            className="admin-search"
            placeholder="🔍 Search Feedback..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

        </div>

        <table className="admin-table">

          <thead>

            <tr>

              <th>Name</th>

              <th>Email</th>

              <th>Message</th>

              <th>Date</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {paginatedFeedback.map((item) => (

              <tr key={item._id}>

                <td>{item.name}</td>

                <td>{item.email}</td>

                <td>{item.message}</td>

                <td>
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </td>

                <td>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteFeedback(item._id)
                    }
                  >
                    🗑 Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

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
            Page {page} of{" "}
            {totalPages || 1}
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

export default FeedbackAdmin;
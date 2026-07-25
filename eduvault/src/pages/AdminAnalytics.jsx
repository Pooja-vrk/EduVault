import {
  FaFileAlt,
  FaUsers,
  FaComments,
  FaChartLine,
} from "react-icons/fa";

import "./AdminAnalytics.css";

export default function AdminAnalytics({
  files,
  users,
  feedbacks,
}) {
  const thisMonth = new Date().getMonth();

  const uploadsThisMonth = files.filter(
    (item) =>
      new Date(item.createdAt).getMonth() === thisMonth
  ).length;

  const usersThisMonth = users.filter(
    (item) =>
      new Date(item.createdAt).getMonth() === thisMonth
  ).length;

  const feedbackThisMonth = feedbacks.filter(
    (item) =>
      new Date(item.createdAt).getMonth() === thisMonth
  ).length;

  const categories = {};

  files.forEach((file) => {
    categories[file.category] =
      (categories[file.category] || 0) + 1;
  });

  const topCategory =
    Object.entries(categories).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  return (
    <div className="analytics-grid">

      <div className="analytics-card">

        <FaFileAlt className="analytics-icon blue" />

        <div>

          <h2>{uploadsThisMonth}</h2>

          <p>Uploads This Month</p>

        </div>

      </div>

      <div className="analytics-card">

        <FaUsers className="analytics-icon green" />

        <div>

          <h2>{usersThisMonth}</h2>

          <p>New Users</p>

        </div>

      </div>

      <div className="analytics-card">

        <FaComments className="analytics-icon orange" />

        <div>

          <h2>{feedbackThisMonth}</h2>

          <p>New Feedback</p>

        </div>

      </div>

      <div className="analytics-card">

        <FaChartLine className="analytics-icon purple" />

        <div>

          <h2>{topCategory}</h2>

          <p>Top Category</p>

        </div>

      </div>

    </div>
  );
}
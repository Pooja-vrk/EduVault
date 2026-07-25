import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";
import "./DashboardCharts.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const categoryNames = [
  "PowerPoint PPTs",
  "Lecture Notes",
  "Textbook Documents",
  "Lab Manual Materials",
];

export default function DashboardCharts({
  files = [],
  selectedCategory,
  setSelectedCategory,
}) {
  const ppt = files.filter(
    (file) => file.category === "PowerPoint PPTs"
  ).length;

  const notes = files.filter(
    (file) => file.category === "Lecture Notes"
  ).length;

  const docs = files.filter(
    (file) => file.category === "Textbook Documents"
  ).length;

  const labs = files.filter(
    (file) => file.category === "Lab Manual Materials"
  ).length;

  const values = [ppt, notes, docs, labs];

  const barData = {
    labels: ["PPTs", "Notes", "Documents", "Lab Manuals"],

    datasets: [
      {
        label: "Materials",
        data: values,

        backgroundColor: [
          "rgba(249, 115, 22, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],

        borderColor: [
          "#f97316",
          "#3b82f6",
          "#22c55e",
          "#a855f7",
        ],

        borderWidth: 2,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  };

  const pieData = {
    labels: ["PPTs", "Notes", "Documents", "Lab Manuals"],

    datasets: [
      {
        data: values,

        backgroundColor: [
          "#f97316",
          "#3b82f6",
          "#22c55e",
          "#a855f7",
        ],

        borderColor: "#ffffff",
        borderWidth: 4,
        hoverOffset: 12,
      },
    ],
  };

  const handleChartClick = (_, elements) => {
    if (!elements.length) return;

    const index = elements[0].index;

    setSelectedCategory(categoryNames[index]);
  };

  const commonOptions = {
    responsive: true,

    /* IMPORTANT: prevents huge charts */
    maintainAspectRatio: false,

    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          padding: 18,
          font: {
            size: 12,
            weight: "600",
          },
        },
      },

      tooltip: {
        padding: 12,
        cornerRadius: 10,
      },
    },

    onClick: handleChartClick,
  };

  const barOptions = {
    ...commonOptions,

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },

        grid: {
          color: "rgba(148, 163, 184, 0.15)",
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <section className="dashboard-charts-section">

      {/* BAR CHART */}

      <div className="dashboard-chart-card">

        <div className="chart-card-header">
          <div>
            <span className="chart-small-label">
              RESOURCE ANALYTICS
            </span>

            <h2>📊 Materials by Category</h2>

            <p>
              Click any bar to filter uploaded materials.
            </p>
          </div>
        </div>

        <div className="bar-chart-container">
          <Bar
            data={barData}
            options={barOptions}
          />
        </div>

      </div>

      {/* PIE CHART */}

      <div className="dashboard-chart-card">

        <div className="chart-card-header pie-header">

          <div>
            <span className="chart-small-label">
              DISTRIBUTION
            </span>

            <h2>🥧 Materials Distribution</h2>

            <p>
              View the percentage of each resource type.
            </p>
          </div>

          <button
            type="button"
            className={`show-all-btn ${
              selectedCategory === "All"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setSelectedCategory("All")
            }
          >
            📂 Show All
          </button>

        </div>

        <div className="pie-chart-container">
          <Pie
            data={pieData}
            options={commonOptions}
          />
        </div>

      </div>

    </section>
  );
}
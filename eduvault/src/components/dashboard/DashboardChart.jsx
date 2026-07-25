import "./DashboardChart.css";

export default function DashboardChart({ files = [] }) {

  const notes = files.filter(
    f => f.type?.toLowerCase() === "notes"
  ).length;

  const pdfs = files.filter(
    f => f.type?.toLowerCase() === "pdf"
  ).length;

  const ppts = files.filter(
    f => f.type?.toLowerCase() === "ppt"
  ).length;

  const labs = files.filter(
    f => f.type?.toLowerCase().includes("lab")
  ).length;

  const total =
    files.length || 1;

  return (

    <section className="analytics">

      <div className="analytics-header">

        <h2>📊 Dashboard Analytics</h2>

        <p>Material Distribution</p>

      </div>

      <div className="progress-list">

        <Progress
          title="Notes"
          value={notes}
          total={total}
          color="#2563eb"
        />

        <Progress
          title="PDF Files"
          value={pdfs}
          total={total}
          color="#ef4444"
        />

        <Progress
          title="PPT Files"
          value={ppts}
          total={total}
          color="#8b5cf6"
        />

        <Progress
          title="Lab Manuals"
          value={labs}
          total={total}
          color="#10b981"
        />

      </div>

    </section>

  );

}

function Progress({
  title,
  value,
  total,
  color,
}) {

  const percent =
    Math.round((value / total) * 100);

  return (

    <div className="progress-card">

      <div className="progress-top">

        <span>{title}</span>

        <strong>{value}</strong>

      </div>

      <div className="progress-bar">

        <div
          className="progress-fill"
          style={{
            width: `${percent}%`,
            background: color,
          }}
        ></div>

      </div>

      <small>{percent}% of total materials</small>

    </div>

  );

}
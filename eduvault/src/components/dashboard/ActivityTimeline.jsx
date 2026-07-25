import { FaClock } from "react-icons/fa";

const ActivityTimeline = ({ files = [] }) => {
  const latest = [...files]
    .reverse()
    .slice(0, 5);

  return (
    <div className="widget-card">

      <h2>
        <FaClock /> Recent Activity
      </h2>

      {latest.map((file, index) => (
        <div className="timeline-item" key={file._id || index}>
          <div className="timeline-dot"></div>

          <div>
            <strong>{file.title}</strong>
            <p>{file.subject}</p>
          </div>
        </div>
      ))}

    </div>
  );
};

export default ActivityTimeline;
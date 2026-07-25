import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileAlt,
  FaEye,
  FaDownload,
  FaStar,
} from "react-icons/fa";

import "./RecentUploads.css";

export default function RecentUploads({ files = [] }) {

  const getIcon = (type = "") => {

    switch (type.toLowerCase()) {

      case "pdf":
        return <FaFilePdf className="pdf" />;

      case "ppt":
      case "pptx":
        return <FaFilePowerpoint className="ppt" />;

      case "doc":
      case "docx":
        return <FaFileWord className="doc" />;

      default:
        return <FaFileAlt className="file" />;
    }

  };

  return (

    <section className="recent-section">

      <div className="recent-header">

        <h2>📂 Recent Uploads</h2>

        <span>{files.length} Files</span>

      </div>

      <div className="recent-list">

        {files.slice(0, 6).map((file) => (

          <div className="recent-card" key={file._id}>

            <div className="file-icon">

              {getIcon(file.fileType)}

            </div>

            <div className="file-details">

              <h3>{file.title}</h3>

              <p>{file.subject}</p>

              <small>

                Uploaded by <b>{file.uploadedBy || "Admin"}</b>

              </small>

            </div>

            <div className="file-info">

              <span>

                {new Date(file.createdAt).toLocaleDateString()}

              </span>

              <div className="stats">

                <span>

                  <FaEye />

                  {file.views || 0}

                </span>

                <span>

                  <FaDownload />

                  {file.downloads || 0}

                </span>

              </div>

            </div>

            <button className="favorite-btn">

              <FaStar />

            </button>

          </div>

        ))}

      </div>

    </section>

  );

}
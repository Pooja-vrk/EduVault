import {
  FaFire,
  FaStar,
  FaEye,
  FaDownload,
  FaBookOpen,
} from "react-icons/fa";

import "./TrendingMaterials.css";

export default function TrendingMaterials({ files = [] }) {

  const trending = [...files]
    .sort(
      (a, b) =>
        (b.downloads || 0) -
        (a.downloads || 0)
    )
    .slice(0, 4);

  return (

    <section className="trending-section">

      <div className="trending-header">

        <h2>🔥 Trending Materials</h2>

        <p>Most downloaded resources</p>

      </div>

      <div className="trending-grid">

        {trending.map((file) => (

          <div
            className="trend-card"
            key={file._id}
          >

            <span className="trend-badge">

              🔥 Trending

            </span>

            <div className="trend-icon">

              <FaBookOpen />

            </div>

            <h3>{file.title}</h3>

            <p>{file.subject}</p>

            <div className="rating">

              <FaStar />

              <FaStar />

              <FaStar />

              <FaStar />

              <FaStar />

              <span>5.0</span>

            </div>

            <div className="trend-footer">

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

        ))}

      </div>

    </section>

  );

}
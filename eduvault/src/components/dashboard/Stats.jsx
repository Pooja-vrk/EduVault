import {
  FaBook,
  FaFileAlt,
  FaFilePowerpoint,
  FaDownload,
} from "react-icons/fa";
import "./Stats.css";

export default function Stats({ files = [] }) {

  const notes = files.filter(f => f.type === "Notes").length;
  const ppt = files.filter(f => f.type === "PPT").length;
  const downloads = files.reduce(
    (sum, file) => sum + (file.downloads || 0),
    0
  );

  const cards = [
    {
      icon: <FaBook />,
      number: files.length,
      title: "Total Materials",
      color: "blue",
      growth: "+12%"
    },
    {
      icon: <FaFileAlt />,
      number: notes,
      title: "Notes",
      color: "green",
      growth: "+8%"
    },
    {
      icon: <FaFilePowerpoint />,
      number: ppt,
      title: "Presentations",
      color: "purple",
      growth: "+5%"
    },
    {
      icon: <FaDownload />,
      number: downloads,
      title: "Downloads",
      color: "pink",
      growth: "+18%"
    }
  ];

  return (

    <div className="stats-grid">

      {cards.map((card, index) => (

        <div className={`stat-card ${card.color}`} key={index}>

          <div className="stat-icon">

            {card.icon}

          </div>

          <div className="stat-content">

            <h1>{card.number}</h1>

            <h3>{card.title}</h3>

            <span>{card.growth} this week</span>

          </div>

        </div>

      ))}

    </div>

  );

}
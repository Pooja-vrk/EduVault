import { useEffect, useState } from "react";
import "./About.css";

import {
  FaUniversity,
  FaGraduationCap,
  FaLaptopCode,
  FaBullseye,
  FaBookOpen,
  FaJava,
  FaReact,
  FaCode,
  FaStar,
} from "react-icons/fa";

import swathiImg from "../assets/Swathi.png";
import sanaImg from "../assets/Sana.png";
import poojaImg from "../assets/Pooja.png";

const About = () => {

  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  const team = [

    {
      name: "V. Pooja",
      image: poojaImg,
      college: "Vignan Institute of Technology and Science",
      branch: "Computer Science Engineering",
      year: "3rd Year",
      role: "Frontend Developer",
      goal: "Become a Full Stack MERN Developer",
      skills: ["Java", "React", "Web Development"],
      theme: "pink",
    },

    {
      name: "Swathi Reddy",
      image: swathiImg,
      college: "Vignan Institute of Technology and Science",
      branch: "Computer Science Engineering",
      year: "3rd Year",
      role: "Frontend Developer",
      goal: "Become a Software Engineer",
      skills: ["Java", "React", "Web Development"],
      theme: "orange",
    },

    {
      name: "Sana Afreen",
      image: sanaImg,
      college: "Vignan Institute of Technology and Science",
      branch: "Computer Science Engineering",
      year: "3rd Year",
      role: "Frontend Developer",
      goal: "Become a Full Stack Developer",
      skills: ["Java", "React", "Web Development"],
      theme: "blue",
    },

  ];

  return (

    <div className={`about-container ${show ? "show" : ""}`}>

      <div className="about-content">

        {/* HERO */}

        <section className="about-hero">

          <div className="hero-badge">
            <FaStar />
            EduVault Development Team
          </div>

          <h1 className="hero-title">
            Meet The
            <span> Developers</span>
          </h1>

          <p className="hero-description">

            We are passionate Computer Science students who developed
            EduVault to provide students with one centralized platform
            for learning materials, notes, presentations and academic
            resources.

          </p>

          

        </section>

        {/* TEAM */}

        <section className="team-section">

          <div className="section-header">

            <span>OUR AMAZING TEAM</span>

            <h2>Passionate Developers</h2>

            <p>

              Meet the students behind EduVault who worked together to
              design and develop this Academic Resource Management System.

            </p>

          </div>

          <div className="team-grid">

            {team.map((member) => (

              <div
                className={`team-card ${member.theme}-card`}
                key={member.name}
              >

                <div className="profile-image-wrapper">

                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-image"
                  />

                </div>

                <h2 className="member-name">

                  {member.name}

                </h2>

                <div className="role-badge">

                  <FaLaptopCode />

                  {member.role}

                </div>

                <div className="member-details">

                  <div className="detail-item">

                    <FaUniversity className="detail-icon" />

                    <div>

                      <strong>College</strong>

                      <p>{member.college}</p>

                    </div>

                  </div>

                  <div className="detail-item">

                    <FaGraduationCap className="detail-icon" />

                    <div>

                      <strong>Branch</strong>

                      <p>{member.branch}</p>

                    </div>

                  </div>

                  <div className="detail-item">

                    <FaBookOpen className="detail-icon" />

                    <div>

                      <strong>Year</strong>

                      <p>{member.year}</p>

                    </div>

                  </div>

                </div>

                <h3 className="skills-title">

                  Technical Skills

                </h3>

                <div className="skills">

                  {member.skills.map((skill) => (

                    <span
                      key={skill}
                      className="skill-item"
                    >

                      {skill === "Java" && <FaJava />}

                      {skill === "React" && <FaReact />}

                      {skill === "Web Development" && <FaCode />}

                      {skill}

                    </span>

                  ))}

                </div>

                <div className="goal-box">

                  <FaBullseye />

                  <div>

                    <strong>Career Goal</strong>

                    <p>{member.goal}</p>

                  </div>

                </div>

                
              </div>

            ))}

          </div>

        </section>
                {/* =====================================
                ABOUT PROJECT
        ===================================== */}

        <section className="project-section">

          <div className="project-card">

            <div className="section-header">

              <span>ABOUT EDUVAULT</span>

              <h2>Academic Resource Portal</h2>

              <p>

                EduVault is a modern Academic Resource Management
                System built using the MERN Stack. It enables
                students and faculty members to upload, organize,
                search and access educational resources through
                one centralized digital platform.

              </p>

            </div>

            <div className="project-features">

              <div className="feature-box">

                <h3>📚 Digital Library</h3>

                <p>

                  Store lecture notes, PPTs, PDFs,
                  textbooks and lab manuals securely.

                </p>

              </div>

              <div className="feature-box">

                <h3>☁ Cloud Storage</h3>

                <p>

                  Access materials from anywhere
                  using secure cloud technology.

                </p>

              </div>

              <div className="feature-box">

                <h3>🔒 Secure Access</h3>

                <p>

                  Role based authentication keeps
                  all educational resources protected.

                </p>

              </div>

            </div>

          </div>

        </section>

        

        {/* =====================================
                TECHNOLOGY STACK
        ===================================== */}

        <section className="tech-section">

          <div className="section-header">

            <span>TECH STACK</span>

            <h2>Built With Modern Technologies</h2>

            <p>

              EduVault combines powerful frontend,
              backend and database technologies
              to deliver a modern user experience.

            </p>

          </div>

          <div className="tech-grid">

            <div className="tech-card">

              <h3>⚛ React</h3>

              <p>

                Interactive user interface built
                with reusable React components.

              </p>

            </div>

            <div className="tech-card">

              <h3>🟢 Node.js</h3>

              <p>

                Fast and scalable backend
                runtime environment.

              </p>

            </div>

            <div className="tech-card">

              <h3>🚀 Express.js</h3>

              <p>

                REST APIs for authentication,
                materials and user management.

              </p>

            </div>

            <div className="tech-card">

              <h3>🍃 MongoDB</h3>

              <p>

                Flexible NoSQL database for
                storing all academic resources.

              </p>

            </div>

          </div>

        </section>

        {/* =====================================
                MISSION & VISION
        ===================================== */}

        <section className="mission-section">

          <div className="mission-card">

            <h2>🎯 Our Mission</h2>

            <p>

              To simplify academic resource
              management through an intelligent,
              secure and centralized platform.

            </p>

          </div>

          <div className="mission-card">

            <h2>🚀 Our Vision</h2>

            <p>

              To become one of the most reliable
              educational resource portals for
              colleges and universities.

            </p>

          </div>

        </section>

        {/* =====================================
                FOOTER
        ===================================== */}

        <footer className="about-footer">

      
        </footer>

      </div>

    </div>

  );

};

export default About;
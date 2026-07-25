import "./Footer.css";

const Footer = () => {
  // Gets the current year automatically
  const currentYear = new Date().getFullYear();

  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-content">
        <h2>🎓 EduVault</h2>

        <p>
          Academic Resource Management Portal
        </p>

        <div className="footer-divider"></div>

        <p>
          © {currentYear} EduVault. All Rights Reserved.
        </p>

        <p className="developers">
          Developed with 💗 by{" "}
          <strong>
            Pooja • Swathi Reddy • Sana Afreen
          </strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
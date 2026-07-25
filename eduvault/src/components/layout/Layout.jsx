import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      {/* Decorative background */}
      <div className="layout-background" aria-hidden="true">
        <div className="layout-grid"></div>
        <div className="layout-orb layout-orb-one"></div>
        <div className="layout-orb layout-orb-two"></div>
        <div className="layout-orb layout-orb-three"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Current page */}
      <main className="layout-content">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
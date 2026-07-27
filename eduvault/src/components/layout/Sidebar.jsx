import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
  localStorage.clear();

  navigate("/login", { replace: true });
};
  return (
    <div className="sidebar">

      <h2 className="logo">
        🎓 EduVault
      </h2>

      <ul>

        <li>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            📊 Dashboard
          </NavLink>
        </li>

        <li>
  <NavLink
    to="/admin-profile"
    className={({isActive}) =>
      isActive ? "active" : ""
    }
  >
    👤 Admin Profile
  </NavLink>
</li>

        <li>
          <NavLink
            to="/materials"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            📂 Materials
          </NavLink>
        </li>

        <li>
          <NavLink
           to="/feedback-admin"
           className={({ isActive }) =>
           isActive ? "active" : ""
         }
         >
          💬 Feedback
         </NavLink>
        </li>

        <li>
          <NavLink
            to="/users"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            👥 Users
          </NavLink>
        </li>

        <li
          className="logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </li>

      </ul>

      {user && (
        <div className="sidebar-user">
          <h4>{user.name}</h4>
          <p>{user.role}</p>
        </div>
      )}

    </div>
  );
}

export default Sidebar;
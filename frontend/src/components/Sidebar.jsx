import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";

function Sidebar({ open }) {
  return (
    <div className={`sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-logo">Smart Resume</div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/upload">Upload</NavLink>
        <NavLink to="/history">History</NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
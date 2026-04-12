import "../styles/Header.css";
import logo from "../assets/Logo.png";

function Header({ toggleSidebar }) {
  return (
    <div className="header">
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      <div className="header-title-wrap">
        <span className="header-title">Smart Resume Analyzer</span>
        <img src={logo} alt="logo" className="header-logo" />
      </div>
    </div>
  );
}

export default Header;
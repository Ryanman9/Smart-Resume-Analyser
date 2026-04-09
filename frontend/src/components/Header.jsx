import "../styles/Header.css";
import logo from "../assets/Logo.png";

function Header() {
  return (
    <div className="header">
      <div className="header-inner">
        <img src={logo} alt="logo" className="logo-img" />
        <h1 className="project-name">Smart Resume Analyzer</h1>
      </div>
    </div>
  );
}

export default Header;
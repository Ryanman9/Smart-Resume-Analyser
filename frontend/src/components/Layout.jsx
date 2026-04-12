import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import "../styles/Layout.css";

function Layout() {
  const [open, setOpen] = useState(false);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="app">
      <Sidebar open={open} />

      <div className="main">
        <Header toggleSidebar={toggleSidebar} />
        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
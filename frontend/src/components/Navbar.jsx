import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import {
  FaBoxOpen,
  FaUserCircle,
  FaSignOutAlt,
  FaBarcode,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="glass-panel navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "var(--text-main)",
          }}
        >
          
          IMs
        </Link>

        {/* Hamburger Icon */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Links */}
        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/products" onClick={closeMenu} style={{ fontWeight: 500 }}>
            Inventory
          </Link>
          <Link
            to="/barcode-gen"
            onClick={closeMenu}
            style={{ fontWeight: 500 }}
          >
            Generator
          </Link>
          <Link
            to="/sell"
            onClick={closeMenu}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--primary)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              justifyContent: "center",
            }}
          >
            <FaBarcode /> POS / Sell
          </Link>
          <Link
            to="/scan"
            onClick={closeMenu}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "var(--bg-card)",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              justifyContent: "center",
            }}
          >
            <FaBarcode /> Scan
          </Link>

        </div>

        {/* Desktop User Section */}
        <div
          className="nav-user"
          style={{ display: "flex", alignItems: "center", gap: "1rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaUserCircle size={24} />
            <span>{user.name}</span>
          </div>
          <button
            onClick={logout}
            className="btn"
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              padding: "0.5rem",
            }}
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

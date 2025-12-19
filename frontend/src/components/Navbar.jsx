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


        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>


        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link to="/products" onClick={closeMenu} className="nav-link-item">
            Inventory
          </Link>
          <Link to="/barcode-gen" onClick={closeMenu} className="nav-link-item">
            Generator
          </Link>
          <Link to="/sell" onClick={closeMenu} className="nav-sell-btn">
            <FaBarcode /> POS / Sell
          </Link>
          <Link to="/scan" onClick={closeMenu} className="nav-scan-btn">
            <FaBarcode /> Scan
          </Link>

          <div className="mobile-only-user">
            <div className="user-info">
              <FaUserCircle size={20} />
              <span>{user.name}</span>
            </div>
            <button onClick={logout} className="logout-btn">
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>


        <div className="nav-user">
          <div className="user-info">
            <FaUserCircle size={24} />
            <span>{user.name}</span>
          </div>
          <button onClick={logout} className="logout-btn-desktop">
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

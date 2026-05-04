import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count, bump } = useCart();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (bump > 0) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 320);
      return () => clearTimeout(t);
    }
  }, [bump]);

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "";

  const linkClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <header className="navbar">
      <Link to="/" className="nav-logo"><span>🛍️</span> EStore</Link>
      <nav className="nav-links">
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/catalog" className={linkClass}>Catalog</NavLink>
        {isAuthenticated && <NavLink to="/orders" className={linkClass}>Orders</NavLink>}
        {isAuthenticated && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
      </nav>
      <div className="nav-actions">
        <button className="cart-btn" onClick={() => navigate("/cart")} aria-label="Cart">
          🛒{count > 0 && <span className={`cart-badge${pulse ? " pulse" : ""}`}>{count}</span>}
        </button>
        {isAuthenticated ? (
          <>
            <Link to="/profile" className="nav-avatar" title={`${user.firstName} ${user.lastName}`}>{initials}</Link>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost-white" style={{ padding: "8px 18px" }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: "8px 18px" }}>Register</Link>
          </>
        )}
        <button className="nav-hamburger" onClick={() => setOpen((o) => !o)} aria-label="Menu">☰</button>
      </div>
      {open && (
        <div className="nav-mobile">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/catalog" className={linkClass} onClick={() => setOpen(false)}>Catalog</NavLink>
          {isAuthenticated && <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>Orders</NavLink>}
          {isAuthenticated && <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>Profile</NavLink>}
          {!isAuthenticated && <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Login</NavLink>}
          {!isAuthenticated && <NavLink to="/register" className={linkClass} onClick={() => setOpen(false)}>Register</NavLink>}
        </div>
      )}
    </header>
  );
}

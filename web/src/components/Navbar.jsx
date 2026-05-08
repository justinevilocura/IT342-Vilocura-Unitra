import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const roleId = localStorage.getItem('roleId');
  const userId = localStorage.getItem('userId');

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="navbar">
      <div className="navbar-container">
        <Link to={userId ? "/dashboard" : "/"} className="navbar-logo">
          Unitra
        </Link>
        <div className="navbar-links">
          {userId ? (
            <>
              <Link to="/marketplace" className={`nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`}>Marketplace</Link>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
              <Link to="/community" className={`nav-link ${location.pathname === '/community' ? 'active' : ''}`}>Community</Link>
              <Link to="/bookings" className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}>Bookings</Link>
              {roleId === '3' && (
                <Link to="/admin/pending" className={`nav-link ${location.pathname === '/admin/pending' ? 'active' : ''}`}>Pending Request</Link>
              )}
            </>
          ) : (
            <>
              <a href="/#features" className="nav-link">Features</a>
              <a href="/#how-it-works" className="nav-link">How it Works</a>
              <a href="/#about-us" className="nav-link">About Us</a>
            </>
          )}
        </div>
        <div className="navbar-auth">
          {userId ? (
            <div className="navbar-user-actions">
              <Link to="/profile" className="icon-btn">
                <User size={20} />
              </Link>
              <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link nav-login">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>

    {/* Logout Confirmation Modal */}
    {isLogoutModalOpen && (
      <div className="modal-overlay centered-overlay" style={{ zIndex: 10001 }} onClick={() => setIsLogoutModalOpen(false)}>
        <div className="modal-content logout-popup glass-panel" onClick={e => e.stopPropagation()}>
          <div className="logout-icon-header">
            <LogOut size={32} />
          </div>
          <h2 className="logout-title">LOGOUT</h2>
          <p className="logout-text">Are you sure you want to logout?</p>
          
          <div className="logout-actions-vertical">
            <button className="btn-logout-confirm" onClick={confirmLogout}>SIGN OUT</button>
            <button className="btn-logout-cancel" onClick={() => setIsLogoutModalOpen(false)}>CANCEL</button>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default Navbar;

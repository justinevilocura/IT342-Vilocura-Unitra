import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const roleId = localStorage.getItem('roleId');
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={userId ? "/dashboard" : "/"} className="navbar-logo">
          Unitra
        </Link>
        <div className="navbar-links">
          {userId ? (
            <>
              <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Marketplace</Link>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/community" className="nav-link">Community</Link>
              <Link to="/bookings" className="nav-link">Bookings</Link>
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
            <button onClick={handleLogout} className="btn-primary">Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-link nav-login">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

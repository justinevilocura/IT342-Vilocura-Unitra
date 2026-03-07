import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Unitra
        </Link>
        <div className="navbar-links">
          <Link to="#features" className="nav-link">Features</Link>
          <Link to="#how-it-works" className="nav-link">How it Works</Link>
          <Link to="#about-us" className="nav-link">About Us</Link>
        </div>
        <div className="navbar-auth">
          <Link to="/login" className="nav-link nav-login">Login</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

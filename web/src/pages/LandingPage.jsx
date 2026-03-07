import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <main className="hero-section">
        <div className="hero-content">
          <div className="pill-badge">
            Campus Marketplace &amp; Community Hub
          </div>
          <h1>Unite. Share. Grow Together.</h1>
          <p className="hero-subtitle">
            Unitra connects student entrepreneurs and consumers to share resources, knowledge, and opportunities — accelerating growth through collaboration.
          </p>
          <div className="hero-actions">
            <button className="btn-outline btn-icon">
              Join the Network <ArrowRight size={18} />
            </button>
            <button className="btn-outline">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-image-placeholder">
          img
          {/* A large empty box with an X drawn across it to mimic the mockup wireframe */}
          <svg className="wireframe-cross" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
             <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--border-color)" strokeWidth="1"/>
             <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--border-color)" strokeWidth="1"/>
          </svg>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

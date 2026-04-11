import Navbar from '../components/Navbar';
import { ArrowRight, Sparkles } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Background Mesh Gradients */}
      <div className="mesh-gradient mesh-1"></div>
      <div className="mesh-gradient mesh-2"></div>
      <div className="mesh-gradient mesh-3"></div>

      <Navbar />
      <main className="hero-section">
        <div className="hero-content">
          <div className="pill-badge">
            <Sparkles size={14} className="sparkle-icon" />
            Campus Marketplace &amp; Community Hub
          </div>
          <h1>
            Unite. Share.<br/>
            <span className="text-gradient">Grow Together.</span>
          </h1>
          <p className="hero-subtitle">
            Unitra connects student entrepreneurs and consumers to share resources, knowledge, and opportunities — accelerating growth through collaboration.
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-icon hover-lift">
              Join the Network <ArrowRight size={18} />
            </button>
            <button className="btn-outline">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card visual-card main-card">
            <div className="card-header">
              <div className="dot red"></div>
              <div className="dot yellow"></div>
              <div className="dot green"></div>
            </div>
            <div className="card-body">
              <div className="mock-skeleton title"></div>
              <div className="mock-skeleton line"></div>
              <div className="mock-skeleton line short"></div>
              <div className="mock-analytics">
                 <div className="bar b1"></div>
                 <div className="bar b2"></div>
                 <div className="bar b3"></div>
                 <div className="bar b4"></div>
                 <div className="bar b5"></div>
              </div>
            </div>
          </div>
          <div className="glass-card visual-card floating-card-1">
             <div className="icon-circle">🚀</div>
             <div className="col">
               <span className="small-bold">New SME Partner</span>
               <span className="small-text">Just joined the network</span>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;

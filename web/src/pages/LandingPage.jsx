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

      {/* Features Section */}
      <section id="features" className="section features-section">
        <div className="section-header text-center">
          <h2>Everything You Need to Collaborate</h2>
          <p className="section-subtitle">
            Built for student entrepreneurs who want to grow together
            through shared resources and opportunities.
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card glass-panel">
            <div className="feature-icon">📦</div>
            <h3>Resource Sharing</h3>
            <p>Share equipment, and tools with fellow student entrepreneurs.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">💡</div>
            <h3>Knowledge Exchange</h3>
            <p>Learn from peers, mentors, and industry experts in the community.</p>
          </div>
          <div className="feature-card glass-panel">
            <div className="feature-icon">🤝</div>
            <h3>Collaboration Hub</h3>
            <p>Find partners, suppliers, and customers within the student network.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section how-it-works-section">
        <div className="section-header text-center">
          <span className="section-label">HOW IT WORKS</span>
          <h2>Get started in three simple steps</h2>
        </div>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-circle">1</div>
            <div className="step-content">
              <h4>Sign Up & Verify</h4>
              <p>Create your business profile and get verified in under 24 hours.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-circle">2</div>
            <div className="step-content">
              <h4>Discover Resources</h4>
              <p>Browse available resources, services, and partnership opportunities.</p>
            </div>
          </div>
          <div className="step-connector"></div>
          <div className="step-item">
            <div className="step-circle">3</div>
            <div className="step-content">
              <h4>Grow Together</h4>
              <p>Scale your operations with shared resources and collective purchasing power.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="section about-section">
        <div className="about-content">
          <span className="section-label">ABOUT US</span>
          <h2>Empowering Student Entrepreneurs</h2>
          <p>
            At Unitra, we are dedicated to supporting student entrepreneurs who are eager to turn their business ideas into reality. As students navigate the challenges of starting and growing a business, Unitra provides them with a centralized platform to access resources, connect with like-minded individuals, and exchange services. Whether you are looking for affordable equipment, office space, or collaboration opportunities, Unitra is here to make business ownership more accessible to students across campuses.
          </p>
        </div>
        <div className="about-visual">
          <div className="glass-panel image-placeholder">
            <span>img</span>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Unitra. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

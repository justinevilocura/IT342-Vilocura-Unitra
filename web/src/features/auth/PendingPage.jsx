import { Link } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import './PendingPage.css';

const PendingPage = () => {
  const handleBackToLogin = () => {
    localStorage.clear();
  };

  return (
    <div className="pending-container">
      <div className="pending-card">
        <div className="pending-icon-wrapper">
          <div className="pending-icon-glow"></div>
          <Clock size={56} strokeWidth={1.5} />
        </div>
        
        <h1 className="pending-title">Application Pending</h1>
        
        <p className="pending-description">
          Your Student Entrepreneur application is under review. 
          An Admin will approve or decline your request shortly.
        </p>
        
        <Link to="/login" className="back-to-login" onClick={handleBackToLogin}>
          <ArrowLeft size={20} /> Back to Login
        </Link>
      </div>
    </div>
  );
};

export default PendingPage;

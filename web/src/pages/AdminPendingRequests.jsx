import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPendingRequests.css';

const AdminPendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem('roleId');
    if (userRole !== '3') {
      navigate('/login');
      return;
    }
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/pending');
      if (response.ok) {
        const data = await response.json();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/${action}/${id}`, {
        method: 'POST'
      });
      if (response.ok) {
        setRequests(requests.filter(req => req.id !== id));
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  return (
    <div className="admin-container">
      {/* Background Gradients like SME POV */}
      <div className="mesh-gradient mesh-1"></div>
      <div className="mesh-gradient mesh-2"></div>

      <div className="admin-header">
        <h1>Admin - Approval Requests</h1>
      </div>

      <div className="requests-table-container">
        {loading ? (
          <div className="loading">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="no-requests">No pending requests at the moment.</div>
        ) : (
          requests.map((req) => (
            <div className="request-card" key={req.id}>
              <div className="column">
                <span className="column-label">FULL NAME</span>
                <span className="column-value">{req.name}</span>
              </div>
              
              <div className="column">
                <span className="column-label">INSTITUTIONAL ACCOUNT</span>
                <a href={`mailto:${req.email}`} className="email-link">{req.email}</a>
              </div>

              <div className="column">
                <span className="column-label">USER TYPE</span>
                <span className="column-value">Student Entrepreneur</span>
              </div>

              <div className="column" style={{ alignItems: 'center' }}>
                <span className="column-label">SCHOOL ID(IMG)</span>
                <div className="download-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </div>
              </div>

              <div className="actions-area">
                <button className="btn-action approve" onClick={() => handleAction(req.id, 'approve')}>
                  <span className="icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span> 
                  Approve
                </button>
                <button className="btn-action decline" onClick={() => handleAction(req.id, 'decline')}>
                  <span className="icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </span>
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPendingRequests;

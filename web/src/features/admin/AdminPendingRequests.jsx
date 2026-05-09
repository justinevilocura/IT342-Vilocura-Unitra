import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Download } from 'lucide-react';
import './AdminPendingRequests.css';

const AdminPendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
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
                <div 
                  className="download-icon" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedImage(req.schoolIdUrl || 'https://via.placeholder.com/400x250/333333/ffffff?text=No+ID+Uploaded')}
                  title="View School ID"
                >
                  <Download size={20} />
                </div>
              </div>

              <div className="actions-area">
                <button className="btn-action approve" onClick={() => handleAction(req.id, 'approve')}>
                  <span className="icon">
                    <Check size={18} strokeWidth={3} />
                  </span> 
                  Approve
                </button>
                <button className="btn-action decline" onClick={() => handleAction(req.id, 'decline')}>
                  <span className="icon">
                    <X size={18} strokeWidth={3} />
                  </span>
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedImage && (
        <div 
          className="modal-overlay centered-overlay" 
          onClick={() => setSelectedImage(null)} 
          style={{ zIndex: 10001, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <div 
            className="modal-content" 
            onClick={e => e.stopPropagation()} 
            style={{ position: 'relative', padding: '12px', background: '#111', borderRadius: '12px', maxWidth: '90%', maxHeight: '90%' }}
          >
            <button 
              onClick={() => setSelectedImage(null)} 
              style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#ff4b4b', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}
            >
              <X size={16} strokeWidth={3} />
            </button>
            <img 
              src={selectedImage} 
              alt="School ID" 
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', display: 'block' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPendingRequests;

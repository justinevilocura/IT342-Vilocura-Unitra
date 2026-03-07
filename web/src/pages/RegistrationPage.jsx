import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import './AuthLayout.css';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('SME'); // 'SME' | 'CONSUMER'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role
        })
      });

      const responseText = await response.text();

      if (response.ok) {
        setStatusMsg({ type: 'success', text: responseText });
        // Optionally navigate to login after a short delay
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setStatusMsg({ type: 'error', text: responseText || 'Registration failed' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error. Make sure the backend is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      {/* Left Pane */}
      <div className="auth-left">
        <div className="auth-brand">
        </div>
        <div className="auth-left-content">
          <h1>Join the Unitra Network</h1>
          <p>
            Create your account and start collaborating with SMEs to share resources and grow together.
          </p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="auth-right">
        <div className="auth-right-container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to home
          </Link>
          
          <div className="auth-form-container" style={{ margin: 'auto 0' }}>
            <h2>Create Account</h2>
            <p className="auth-subtitle">Start your free trial — no credit card required.</p>

            {statusMsg.text && (
              <div className={`status-message ${statusMsg.type}`}>
                {statusMsg.text}
              </div>
            )}

            <form className="auth-form" onSubmit={handleRegister}>
              <label className="form-label">
                Full Name
                <input 
                  type="text" 
                  name="name"
                  className="input-field" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-label">
                Institutional Email
                <input 
                  type="email" 
                  name="email"
                  className="input-field" 
                  placeholder="johndoe@cit.edu" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-label">
                Password
                <input 
                  type="password" 
                  name="password"
                  className="input-field" 
                  placeholder="••••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="role-selector">
                <span className="role-label">I want to be a</span>
                <div className="role-buttons">
                  <button 
                    type="button" 
                    className={`role-btn ${role === 'SME' ? 'active' : ''}`}
                    onClick={() => setRole('SME')}
                  >
                    Student<br/>Entrepreneur
                  </button>
                  <button 
                    type="button" 
                    className={`role-btn ${role === 'CONSUMER' ? 'active' : ''}`}
                    onClick={() => setRole('CONSUMER')}
                  >
                    Consumer
                  </button>
                </div>
              </div>

              {role === 'SME' && (
                <div className="upload-section">
                  <span className="form-label">Upload School ID for verification(b2b)</span>
                  <div className="upload-icon-container">
                    <Download size={20} className="upload-icon" />
                  </div>
                </div>
              )}

              <button type="submit" className="btn-accent" style={{ marginTop: '32px' }} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;

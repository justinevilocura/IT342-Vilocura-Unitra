import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './AuthLayout.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      // The backend @PostMapping("/login") takes @RequestParam for email and password
      const params = new URLSearchParams();
      params.append('email', formData.email);
      params.append('password', formData.password);

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      const responseText = await response.text();

      if (response.ok) {
        setStatusMsg({ type: 'success', text: responseText });
        // Typically you'd store the token/session and redirect to dashboard, here we just show success
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatusMsg({ type: 'error', text: responseText || 'Invalid credentials' });
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
           {/* Empty spacer or logo if needed */}
        </div>
        <div className="auth-left-content">
          <h1>Welcome back to Unitra</h1>
          <p>
            Log in to access your network, manage resources, and connect with SME partners.
          </p>
        </div>
      </div>

      {/* Right Pane */}
      <div className="auth-right">
        <div className="auth-right-container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to home
          </Link>
          
          <div className="auth-form-container">
            <h2>Log in</h2>
            <p className="auth-subtitle">Enter your credentials to access your account.</p>

            {statusMsg.text && (
              <div className={`status-message ${statusMsg.type}`}>
                {statusMsg.text}
              </div>
            )}

            <form className="auth-form" onSubmit={handleLogin}>
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

              <button type="submit" className="btn-accent" style={{ marginTop: '32px' }} disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'LOGIN'}
              </button>
            </form>

            <p className="auth-footer">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

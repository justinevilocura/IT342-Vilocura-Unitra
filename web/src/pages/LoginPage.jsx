import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
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
        setTimeout(() => navigate('/dashboard'), 2000);
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
      <div className="auth-card">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="auth-header">
          <div className="logo-text">
             <Sparkles size={20} style={{ color: "var(--mesh-3)" }} /> Unitra
          </div>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Log in to manage your network and resources.</p>
        </div>

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

          <button type="submit" className="btn-primary block" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

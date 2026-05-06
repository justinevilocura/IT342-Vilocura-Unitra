import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.state?.registered) {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

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

      if (response.ok) {
        const data = await response.json();
        setStatusMsg({ type: 'success', text: data.message });
        localStorage.setItem('userId', data.userId);

        // Handle SME Pending status
        if (data.roleId === 1 && data.status === 'PENDING') {
          setTimeout(() => navigate('/pending'), 2000);
        } else {
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } else {
        const responseText = await response.text();
        setStatusMsg({ type: 'error', text: responseText || 'Invalid credentials' });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Network error. Make sure the backend is running.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-new">
      {/* Left Side */}
      <div className="login-left">
        <div className="welcome-content">
          <h1>
            Welcome back to<br />
            <span className="text-gradient">Unitra</span>
          </h1>
          <p>
            Log in to access your network, manage resources, and connect with fellow student entrepreneurs.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="login-form-container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to home
          </Link>
          
          <div className="form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account.</p>
          </div>

          {statusMsg.text && (
            <div className={`status-message ${statusMsg.type}`}>
              {statusMsg.text}
            </div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Institutional Email</label>
              <input
                type="email"
                name="email"
                placeholder="name@cit.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-login-new" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Login to Account'}
            </button>
          </form>

          <p className="form-footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

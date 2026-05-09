import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, UploadCloud } from 'lucide-react';
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
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Strict regex check for standard valid emails (prevents "user@.com" etc.)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatusMsg({ type: 'error', text: 'Please enter a valid email address (e.g. yourname@domain.com).' });
      return;
    }

    // Only enforce @cit.edu for Entrepreneurs (SME)
    if (role === 'SME' && !formData.email.endsWith('@cit.edu')) {
      setStatusMsg({ type: 'error', text: 'Please use your valid @cit.edu institutional email to register as an Entrepreneur.' });
      return;
    }

    if (role === 'SME' && !file) {
      setStatusMsg({ type: 'error', text: 'Entrepreneurs must upload a valid School ID for verification.' });
      return;
    }

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
        localStorage.setItem('userRole', role); // Save the chosen role to local storage so the dashboard knows!
        setTimeout(() => navigate('/login', { state: { registered: true } }), 2000);
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
    <div className="login-page-new">
      {/* Left Side */}
      <div className="login-left">
        <div className="welcome-content">
          <h1>
            Unite. Share.<br />
            <span className="text-gradient">Grow Together.</span>
          </h1>
          <p>
            Join the campus network where student entrepreneurs share resources, knowledge, and opportunities to accelerate growth through collaboration.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <div className="login-form-container reg-scroll">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to home
          </Link>
          
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Start your journey in the campus marketplace today.</p>
          </div>

          {statusMsg.text && (
            <div className={`status-message ${statusMsg.type}`}>
              {statusMsg.text}
            </div>
          )}

          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>{role === 'SME' ? 'Institutional Email' : 'Email Address'}</label>
              <input 
                type="email" 
                name="email"
                placeholder={role === 'SME' ? 'johndoe@cit.edu' : 'johndoe@gmail.com'}
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

            <div className="role-selector-new">
               <span className="role-label">I want to join as a...</span>
               <div className="role-btns">
                 <button 
                   type="button" 
                   className={role === 'SME' ? 'active' : ''}
                   onClick={() => setRole('SME')}
                 >
                   Entrepreneur
                 </button>
                 <button 
                   type="button" 
                   className={role === 'CONSUMER' ? 'active' : ''}
                   onClick={() => setRole('CONSUMER')}
                 >
                   Consumer
                 </button>
               </div>
            </div>

            {role === 'SME' && (
              <div className="upload-section-new">
                <label>Verification (School ID)</label>
                <div className="upload-box" onClick={() => document.getElementById('file-up').click()}>
                   <UploadCloud size={20} />
                   <span>{file ? file.name : "Click to upload your ID"}</span>
                   <input 
                     type="file" 
                     id="file-up"
                     style={{ display: 'none' }} 
                     onChange={handleFileChange}
                     accept="image/*,.pdf"
                   />
                </div>
              </div>
            )}

            <button type="submit" className="btn-login-new" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <p className="form-footer">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;

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

    if (!formData.email.endsWith('@cit.edu')) {
      setStatusMsg({ type: 'error', text: 'Please use your valid @cit.edu institutional email to register.' });
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
      <div className="auth-card reg-card">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <div className="auth-header">
          <div className="logo-text">
             <Sparkles size={20} style={{ color: "var(--mesh-2)" }} /> Unitra
          </div>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join the network to collaborate and grow together.</p>
        </div>

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

          <div className="role-selector-wrapper">
             <span className="role-label">I want to be a...</span>
             <div className="role-toggle">
               <button 
                 type="button" 
                 className={`toggle-btn ${role === 'SME' ? 'active' : ''}`}
                 onClick={() => setRole('SME')}
               >
                 Entrepreneur
               </button>
               <button 
                 type="button" 
                 className={`toggle-btn ${role === 'CONSUMER' ? 'active' : ''}`}
                 onClick={() => setRole('CONSUMER')}
               >
                 Consumer
               </button>
             </div>
          </div>

          {role === 'SME' && (
            <div className="upload-section">
              <span className="upload-text">Upload School ID for verification (B2B)</span>
              <label className="upload-dropzone" htmlFor="school-id-upload">
                 <UploadCloud size={24} className="upload-icon-cloud" />
                 <span style={{ textAlign: 'center' }}>
                   {file ? file.name : "Click to upload or drag and drop"}
                 </span>
                 <input 
                   type="file" 
                   id="school-id-upload" 
                   style={{ display: 'none' }} 
                   onChange={handleFileChange}
                   accept="image/*,.pdf"
                 />
              </label>
            </div>
          )}

          <button type="submit" className="btn-primary block" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegistrationPage;

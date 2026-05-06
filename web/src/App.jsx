import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import Dashboard from './pages/Dashboard';
import PendingPage from './pages/PendingPage';
import AdminPendingRequests from './pages/AdminPendingRequests';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/admin/pending" element={<AdminPendingRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

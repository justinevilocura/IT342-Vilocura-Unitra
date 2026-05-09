import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage';
import LoginPage from './features/auth/LoginPage';
import RegistrationPage from './features/auth/RegistrationPage';
import Dashboard from './features/dashboard/DashboardPage';
import MarketplacePage from './features/marketplace/MarketplacePage';
import PendingPage from './features/auth/PendingPage';
import AdminPendingRequests from './features/admin/AdminPendingRequests';
import CommunityPage from './features/community/CommunityPage';
import ProfilePage from './features/profile/ProfilePage';
import BookingsPage from './features/bookings/BookingsPage';
import Navbar from './features/common/components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const hideNavbar = ['/login', '/register', '/pending'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/admin/pending" element={<AdminPendingRequests />} />
      </Routes>
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Package, 
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const userId = localStorage.getItem('userId');
  const roleId = parseInt(localStorage.getItem('roleId'));
  
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeListings: 0,
    pendingRequests: 0,
    completedTransactions: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [marketplaceUpdates, setMarketplaceUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [productsRes, receivedRes, sentRes] = await Promise.all([
        fetch('http://localhost:8080/api/products'),
        fetch(`http://localhost:8080/api/bookings/received/${userId}`),
        fetch(`http://localhost:8080/api/bookings/sent/${userId}`)
      ]);

      if (productsRes.ok && receivedRes.ok && sentRes.ok) {
        const allProducts = await productsRes.json();
        const receivedBookings = await receivedRes.json();
        const sentRequests = await sentRes.json();

        // 1. My Listings
        const userListings = allProducts.filter(p => parseInt(p.userId) === parseInt(userId));
        setMyListings(userListings.slice(0, 3));

        // 2. Recent Marketplace Updates
        const recentUpdates = [...allProducts].sort((a, b) => b.id - a.id).slice(0, 4);
        setMarketplaceUpdates(recentUpdates);

        // 3. Recent Bookings (Combined sent and received)
        const combinedBookings = [...receivedBookings, ...sentRequests]
          .sort((a, b) => b.id - a.id)
          .slice(0, 3);
        setRecentBookings(combinedBookings);

        // 4. Statistics
        const pending = receivedBookings.filter(b => b.status === 'PENDING').length + 
                        sentRequests.filter(b => b.status === 'PENDING').length;
        
        const completed = receivedBookings.filter(b => b.status === 'COMPLETED').length + 
                          sentRequests.filter(b => b.status === 'COMPLETED').length;
        
        setStats({
          totalBookings: receivedBookings.length + sentRequests.length,
          activeListings: userListings.length,
          pendingRequests: pending,
          completedTransactions: completed
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Mesh Backgrounds */}
      <div className="mesh-gradient mesh-1" style={{ opacity: 0.1 }}></div>
      <div className="mesh-gradient mesh-2" style={{ opacity: 0.1 }}></div>

      <main className="dashboard-main">
        <header className="page-header">
          <div className="header-text">
            <h1>Dashboard</h1>
            <p className="subtitle">Welcome back! Here's what's happening with your account.</p>
          </div>
        </header>

        {loading ? (
          <div className="loading-state glass-panel">
            <Clock className="animate-spin" />
            <p>Gathering your activity data...</p>
          </div>
        ) : (
          <>
            <div className={`dashboard-grid ${roleId !== 1 ? 'consumer-grid' : ''}`}>
              {/* My Bookings Card */}
              <section className="dashboard-card glass-panel">
                <div className="card-header">
                  <div className="header-icon"><Calendar size={20} /></div>
                  <div className="header-title">
                    <h3>My Bookings</h3>
                    <p>Your recent booking requests</p>
                  </div>
                  <Link to="/bookings" className="view-all-link"><ArrowRight size={18} /></Link>
                </div>
                <div className="card-content-list">
                  {recentBookings.length === 0 ? (
                    <div className="empty-state">No bookings yet</div>
                  ) : (
                    recentBookings.map(booking => (
                      <div key={booking.id} className="list-item">
                        <div className="item-info">
                          <span className="item-name">{booking.productTitle || 'Booking Request'}</span>
                          <span className={`item-status status-${booking.status.toLowerCase()}`}>{booking.status}</span>
                        </div>
                        <span className="item-date">{new Date(booking.createdAt).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* My Listings Card - ONLY for SMEs */}
              {roleId === 1 && (
                <section className="dashboard-card glass-panel">
                  <div className="card-header">
                    <div className="header-icon"><Package size={20} /></div>
                    <div className="header-title">
                      <h3>My Listings</h3>
                      <p>Your active marketplace items</p>
                    </div>
                    <Link to="/marketplace" className="view-all-link"><ArrowRight size={18} /></Link>
                  </div>
                  <div className="card-content-list">
                    {myListings.length === 0 ? (
                      <div className="empty-state">No listings yet</div>
                    ) : (
                      myListings.map(item => (
                        <div key={item.id} className="list-item">
                          <div className="item-info">
                            <span className="item-name">{item.title}</span>
                            <span className="item-category">{item.category}</span>
                          </div>
                          <span className="item-price">₱{item.price}</span>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              )}

              {/* Marketplace Updates Card */}
              <section className="dashboard-card glass-panel">
                <div className="card-header">
                  <div className="header-icon"><TrendingUp size={20} /></div>
                  <div className="header-title">
                    <h3>Marketplace Updates</h3>
                    <p>Recently listed items</p>
                  </div>
                </div>
                <div className="card-content-list">
                  {marketplaceUpdates.map(item => (
                    <div key={item.id} className="update-item">
                      <div className="update-bar"></div>
                      <div className="update-info">
                        <span className="update-title">{item.title}</span>
                        <span className="update-meta">
                          {item.listingType}: {item.listingType === 'For Sale' ? `₱${item.price}` : 'Exchange'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Activity Summary Section */}
            <section className="activity-summary glass-panel">
              <div className="section-header">
                <h3>Activity Summary</h3>
                <p>Quick overview of your account activity</p>
              </div>
              <div className={`summary-grid ${roleId !== 1 ? 'consumer-summary' : ''}`}>
                <div className="summary-box">
                  <span className="summary-value">{stats.totalBookings}</span>
                  <span className="summary-label">Total Bookings</span>
                </div>
                {roleId === 1 && (
                  <div className="summary-box">
                    <span className="summary-value">{stats.activeListings}</span>
                    <span className="summary-label">Active Listings</span>
                  </div>
                )}
                <div className="summary-box">
                  <span className="summary-value">{stats.pendingRequests}</span>
                  <span className="summary-label">Pending Booking Requests</span>
                </div>
                <div className="summary-box">
                  <span className="summary-value">{stats.completedTransactions}</span>
                  <span className="summary-label">Completed Transactions</span>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

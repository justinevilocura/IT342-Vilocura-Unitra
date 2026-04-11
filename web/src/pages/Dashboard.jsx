import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, MapPin, Calendar, CheckCircle2, ChevronDown } from 'lucide-react';
import './Dashboard.css';

const mockItems = [
  {
    id: 1,
    type: 'BUY',
    title: 'Vanity Table with Mirror',
    seller: 'Seller123',
    description: 'This needs to a fully white furnished vanity table with a mirror.',
    budget: '₱100',
    location: 'IT Park Cebu City',
    date: '2/28/2026',
    available: true,
  },
  {
    id: 2,
    type: 'SALE',
    title: 'Green Comfy Couch',
    seller: 'JohnDoeFurniture',
    description: 'Just need to sell this ASAP. Moving out tomorrow.',
    price: '₱600',
    location: 'Puntra Princesa',
    date: '2/27/2026',
    available: true,
  },
  {
    id: 3,
    type: 'SWAP',
    title: 'Timeless Watch',
    seller: 'JaneSmith',
    description: 'RFS: not that needed anymore.\nLooking for: Iphone 15 Pro Max',
    lookingFor: 'Iphone 15 Pro Max',
    location: 'Talisay City',
    date: '2/05/2026',
    available: true,
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const handleLogout = () => {
    // In a real app, you'd clear specific tokens/context here
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Dynamic Background */}
      <div className="mesh-gradient mesh-1" style={{opacity: 0.15}}></div>
      <div className="mesh-gradient mesh-3" style={{opacity: 0.1}}></div>

      {/* Dashboard Top Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-container">
           <Link to="/dashboard" className="brand-logo text-gradient">Unitra</Link>
           
           <div className="nav-tabs">
              <span className="tab active">Marketplace</span>
              <span className="tab">Dashboard</span>
              <span className="tab">Community</span>
              <span className="tab">Bookings</span>
           </div>

           <div className="nav-actions">
              <button className="icon-btn"><User size={20} /></button>
              <button className="icon-btn logout-btn" onClick={handleLogout} title="Log Out"><LogOut size={20} /></button>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="dashboard-main">
        
        {/* Header Area */}
        <header className="page-header">
           <div className="header-text">
             <h1>Marketplace</h1>
             <p className="subtitle">Buy, sell, or swap equipment and services</p>
           </div>
           <button className="btn-outline">Add Listing</button>
        </header>

        {/* Filters and Search Bar Glass Panel */}
        <div className="glass-panel filter-bar">
           <div className="search-wrapper">
             <Search size={20} className="search-icon" />
             <input type="text" className="search-input" placeholder="Search Items..." />
           </div>
           
           <div className="filter-controls">
              <div className="filter-group">
                 <span className="filter-label">Type</span>
                 <div className="pill-group">
                    {['All', 'For Sale', 'Swap', 'Wanted'].map((filter) => (
                      <button 
                        key={filter}
                        className={`pill-btn ${activeFilter === filter ? 'active' : ''}`}
                        onClick={() => setActiveFilter(filter)}
                      >
                        {filter}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="filter-group ml-auto">
                 <span className="filter-label">Category</span>
                 <button className="category-dropdown">
                    All Categories <ChevronDown size={16} />
                 </button>
              </div>
           </div>
        </div>

        {/* Marketplace Grid */}
        <div className="items-grid">
           {mockItems.map((item) => (
             <div className="item-card glass-panel hover-lift" key={item.id}>
                <div className="card-image-placeholder">
                   <div className="skeleton-img">IMG</div>
                </div>
                
                <div className="card-content">
                  <div className="card-top-row">
                    <span className={`tag tag-${item.type.toLowerCase()}`}>{item.type}</span>
                    {item.available && <span className="tag-available">Available</span>}
                  </div>

                  <h3 className="item-title">{item.title}</h3>
                  <div className="seller-info">
                     <CheckCircle2 size={14} className="verified-icon" /> {item.seller}
                  </div>

                  <p className="item-desc">{item.description}</p>
                  
                  <div className="item-price">
                     {item.price ? `Price: ${item.price}` : `Budget: ${item.budget || 'N/A'}`}
                  </div>

                  <div className="item-meta">
                     <span className="meta-item"><MapPin size={14}/> {item.location}</span>
                     <span className="meta-item"><Calendar size={14}/> {item.date}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-outline outline-sm">View Details</button>
                  <button className="btn-primary btn-sm">Book Now</button>
                </div>
             </div>
           ))}
        </div>

      </main>
    </div>
  );
};

export default Dashboard;

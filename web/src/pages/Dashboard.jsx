import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, MapPin, Calendar, CheckCircle2, ChevronDown, Plus, X } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [items, setItems] = useState([]);
  
  // Retrieve role from LocalStorage (we will save this during registration)
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole') || 'SME');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    listingType: 'For Sale',
    category: '',
    title: '',
    description: '',
    price: '',
    name: '',
    company: '',
    location: '',
    imageData: ''
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageData: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchListings = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/products');
      if(res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

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
           
           <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
             {/* The Actual Conditional Render */}
             {userRole === 'SME' && (
               <button className="btn-primary" style={{display: 'flex', alignItems: 'center', gap: '6px'}} onClick={() => setIsModalOpen(true)}>
                 <Plus size={18} /> Add Listing
               </button>
             )}
           </div>
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
           {items.map((item) => (
             <div className="item-card glass-panel hover-lift" key={item.id}>
                {item.imageData ? (
                  <img src={item.imageData} alt={item.title} className="card-image" />
                ) : (
                  <div className="card-image-placeholder">
                    <div className="img-cross"></div>
                    <span>IMG</span>
                  </div>
                )}
                
                <div className="card-content">
                  <div className="card-top-row">
                    <span className={`tag tag-${(item.listingType || '').toLowerCase().replace(' ', '-')}`}>
                      {item.listingType}
                    </span>
                    <span className="tag-available">Available</span>
                  </div>

                  <h3 className="item-title">{item.title}</h3>
                  <div className="seller-info">
                     <CheckCircle2 size={14} className="verified-icon" /> {item.companyName || item.name || `User ID ${item.userId}`}
                  </div>

                  <p className="item-desc">{item.description}</p>
                  
                  <div className="item-price">
                     Price: ₱{item.price}
                  </div>

                  <div className="item-meta">
                     <span className="meta-item"><MapPin size={14}/> {item.location}</span>
                     <span className="meta-item"><Calendar size={14}/> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-outline outline-sm">View Details</button>
                  <button className="btn-primary btn-sm">Book Now</button>
                </div>
             </div>
           ))}
        </div>

      {/* Create New Listing Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Create New Listing</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            
            <form className="modal-form">
              <div className="form-group">
                <label>Listing Type</label>
                <div className="radio-group-vertical">
                  <label className="radio-classic">
                    <input type="radio" name="listingType" value="For Sale" checked={formData.listingType === 'For Sale'} onChange={(e) => setFormData({...formData, listingType: e.target.value})} /> 
                    Sale
                  </label>
                  <label className="radio-classic">
                    <input type="radio" name="listingType" value="For Swap" checked={formData.listingType === 'For Swap'} onChange={(e) => setFormData({...formData, listingType: e.target.value})} /> 
                    Swap
                  </label>
                  <label className="radio-classic">
                    <input type="radio" name="listingType" value="Looking to Buy" checked={formData.listingType === 'Looking to Buy'} onChange={(e) => setFormData({...formData, listingType: e.target.value})} /> 
                    Wanted
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select className="form-input custom-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="" disabled>Select a category</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Tools">Tools</option>
                  <option value="Services">Services</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-input" placeholder="Enter item title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}/>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" placeholder="Describe your item in details..." rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
              </div>

              <div className="form-group">
                <label>Price / Value</label>
                <input type="text" className="form-input" placeholder="Enter amount in PHP" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}/>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>Your Name</label>
                  <input type="text" className="form-input" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                </div>
                <div className="form-group half">
                  <label>Company</label>
                  <input type="text" className="form-input" placeholder="Enter company name" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}/>
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input type="text" className="form-input" placeholder="City, State" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}/>
              </div>

              <div className="form-group">
                <label>Upload Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
                  {formData.imageData && (
                    <img src={formData.imageData} alt="Preview" style={{ height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                  )}
                </div>
              </div>

              <div className="modal-actions-centered">
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="button" className="btn-primary" onClick={async () => { 
                   try {
                     const payload = {
                       ...formData,
                       userId: localStorage.getItem('userId') || 1, // fallback to avoid constraint errors
                       price: parseFloat(formData.price.replace(/[^0-9.]/g, '')) || 0
                     };
                     const res = await fetch('http://localhost:8080/api/products', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify(payload)
                     });
                     if (res.ok) {
                       setIsModalOpen(false);
                       setFormData({ listingType: 'For Sale', category: '', title: '', description: '', price: '', name: '', company: '', location: '', imageData: '' });
                       fetchListings(); // automatically refresh the board
                     } else {
                       const errorText = await res.text();
                       alert('Error saving listing: ' + errorText);
                       console.error("Backend error:", errorText);
                     }
                   } catch (e) {
                     console.error("Error creating listing", e);
                   }
                }}>Create Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      </main>
    </div>
  );
};

export default Dashboard;

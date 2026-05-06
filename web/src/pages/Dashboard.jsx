import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, MapPin, Calendar, CheckCircle2, ChevronDown, Plus, X, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Retrieve role from LocalStorage
  const [roleId, setRoleId] = useState(parseInt(localStorage.getItem('roleId')) || 1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');
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
      if (res.ok) {
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

  const filteredItems = items.filter(item => {
    // 1. Type Filter Logic
    let matchesType = true;
    if (activeFilter === 'For Sale') matchesType = item.listingType === 'For Sale';
    else if (activeFilter === 'Swap') matchesType = item.listingType === 'For Swap';
    else if (activeFilter === 'Wanted') matchesType = item.listingType === 'Looking to Buy';

    // 2. Category Filter Logic
    let matchesCategory = true;
    if (activeCategory !== 'All') matchesCategory = item.category === activeCategory;

    // 3. Search Query Logic
    const matchesSearch = 
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className="dashboard-layout">
      {/* Dynamic Background */}
      <div className="mesh-gradient mesh-1" style={{ opacity: 0.15 }}></div>
      <div className="mesh-gradient mesh-3" style={{ opacity: 0.1 }}></div>

      <div className="mesh-gradient mesh-3" style={{ opacity: 0.1 }}></div>

      {/* Main Content Area */}
      <main className="dashboard-main">

        {/* Header Area */}
        <header className="page-header">
          <div className="header-text">
            <h1>Marketplace</h1>
            <p className="subtitle">Buy, sell, or swap equipment and services</p>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* The Actual Conditional Render */}
            {roleId === 1 && (
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsModalOpen(true)}>
                <Plus size={18} /> Add Listing
              </button>
            )}
          </div>
        </header>

        {/* Filters and Search Bar Glass Panel */}
        <div className="glass-panel filter-bar">
          <div className="search-wrapper">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search Items..." 
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <span className="filter-label">Type</span>
              <div className="pill-group">
                {['All', 'For Sale', 'Swap', 'Wanted'].map((filter) => (
                  <button
                    key={filter}
                    className={`pill-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group ml-auto">
              <span className="filter-label">Category</span>
              <select 
                className="category-select-ui" 
                value={activeCategory}
                onChange={(e) => { setActiveCategory(e.target.value); setCurrentPage(1); }}
              >
                <option value="All">All Categories</option>
                <option value="Equipment">Equipment</option>
                <option value="Tools">Tools</option>
                <option value="Services">Services</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="items-grid">
          {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item) => (
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
                  <span className="meta-item"><MapPin size={14} /> {item.location}</span>
                  <span className="meta-item"><Calendar size={14} /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}</span>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-outline outline-sm">View Details</button>
                <button className="btn-primary btn-sm">Book Now</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {filteredItems.length > itemsPerPage && (
          <div className="pagination-container">
            <button 
              className="pagination-arrow" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button 
                    key={pageNum}
                    className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              className={`pagination-arrow`}
              disabled={currentPage >= Math.ceil(filteredItems.length / itemsPerPage)}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Create New Listing Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">Create New Listing</h2>
                <button className="close-btn" onClick={() => { setIsModalOpen(false); setModalError(''); }}><X size={24} /></button>
              </div>

              {modalError && (
                <div className="modal-error-banner">
                  {modalError}
                </div>
              )}

              <form className="modal-form">
                <div className="form-group">
                  <label>Listing Type</label>
                  <div className="radio-group-vertical">
                    <label className="radio-classic">
                      <input type="radio" name="listingType" value="For Sale" checked={formData.listingType === 'For Sale'} onChange={(e) => setFormData({ ...formData, listingType: e.target.value })} />
                      Sale
                    </label>
                    <label className="radio-classic">
                      <input type="radio" name="listingType" value="For Swap" checked={formData.listingType === 'For Swap'} onChange={(e) => setFormData({ ...formData, listingType: e.target.value })} />
                      Swap
                    </label>
                    <label className="radio-classic">
                      <input type="radio" name="listingType" value="Looking to Buy" checked={formData.listingType === 'Looking to Buy'} onChange={(e) => setFormData({ ...formData, listingType: e.target.value })} />
                      Wanted
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input custom-select" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option value="" disabled>Select a category</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Tools">Tools</option>
                    <option value="Services">Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input type="text" className="form-input" placeholder="Enter item title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-input" placeholder="Describe your item in details..." rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                </div>

                <div className="form-group">
                  <label>Price / Value (₱)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    placeholder="Enter amount" 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label>Your Name</label>
                    <input type="text" className="form-input" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="form-group half">
                    <label>Company</label>
                    <input type="text" className="form-input" placeholder="Enter company name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input type="text" className="form-input" placeholder="City, State" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Product Image</label>
                  <div className="custom-upload-box" onClick={() => document.getElementById('product-image-up').click()}>
                    <Upload size={20} />
                    <span>{formData.imageData ? "Image Selected (Click to change)" : "Select image of your product"}</span>
                    <input 
                      type="file" 
                      id="product-image-up"
                      style={{ display: 'none' }} 
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </div>
                  {formData.imageData && (
                    <div className="preview-container">
                      <img src={formData.imageData} alt="Preview" className="upload-preview" />
                    </div>
                  )}
                </div>

                <div className="modal-actions-centered">
                  <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="button" className="btn-primary" onClick={async () => {
                    // Validation: Check if all required fields are filled
                    const requiredFields = ['category', 'title', 'description', 'price', 'name', 'company', 'location', 'imageData'];
                    const missingFields = requiredFields.filter(field => !formData[field]);
                    
                    if (missingFields.length > 0) {
                      setModalError('Please fill out all fields and upload an image.');
                      return;
                    }

                    if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
                      setModalError('Please enter a valid numeric price.');
                      return;
                    }

                    setModalError(''); // Clear error before submission

                    try {
                      const payload = {
                        ...formData,
                        userId: localStorage.getItem('userId') || 1, // fallback to avoid constraint errors
                        price: parseFloat(formData.price)
                      };
                      const res = await fetch('http://localhost:8080/api/products', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      if (res.ok) {
                        setIsModalOpen(false);
                        setModalError('');
                        setFormData({ listingType: 'For Sale', category: '', title: '', description: '', price: '', name: '', company: '', location: '', imageData: '' });
                        fetchListings(); // automatically refresh the board
                      } else {
                        const errorText = await res.text();
                        setModalError('Error saving listing: ' + errorText);
                        console.error("Backend error:", errorText);
                      }
                    } catch (e) {
                      setModalError('Network error. Please try again.');
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

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, MapPin, Calendar, CheckCircle2, ChevronDown, Plus, X, Upload, ChevronLeft, ChevronRight, Star, AlertTriangle } from 'lucide-react';
import './MarketplacePage.css';

const MarketplacePage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Retrieve role and user info from LocalStorage
  const [roleId, setRoleId] = useState(parseInt(localStorage.getItem('roleId')) || 1);
  const userId = localStorage.getItem('userId');

  // Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactionType, setTransactionType] = useState('MEETUP');
  const [meetupLocation, setMeetupLocation] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isSelfBookingModalOpen, setIsSelfBookingModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const openBooking = (item) => {
    if (parseInt(item.userId) === parseInt(userId)) {
      setIsSelfBookingModalOpen(true);
      return;
    }
    setBookingItem(item);
    setIsBookingOpen(true);
    setIsDetailsOpen(false);
    setCurrentMonth(new Date());
    setStartDate(null);
    setEndDate(null);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const openDetails = (item) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth.setMonth(currentMonth.getMonth() + offset));
    setCurrentMonth(new Date(newMonth));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate > startDate) {
      setEndDate(clickedDate);
    } else {
      setStartDate(clickedDate);
    }
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    // Correct first day offset (Monday start)
    const offset = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < offset; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      let className = "day";
      if (startDate && date.toDateString() === startDate.toDateString()) className += " selected";
      if (endDate && date.toDateString() === endDate.toDateString()) className += " selected";
      if (startDate && endDate && date > startDate && date < endDate) className += " in-range";

      days.push(
        <div key={d} className={className} onClick={() => handleDateClick(d)}>
          {d}
        </div>
      );
    }
    return days;
  };
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // 0. Availability Filter: Only show products that are not Sold
    const isNotSold = item.status !== 'Sold';

    return isNotSold && matchesType && matchesCategory && matchesSearch;
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
                <option value="Office & Business Supplies">Office & Business Supplies</option>
                <option value="Electronics & Tech">Electronics & Tech</option>
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Health & Beauty">Health & Beauty</option>
                <option value="Home & Lifestyle">Home & Lifestyle</option>
                <option value="Automotive & Transport">Automotive & Transport</option>
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
                  <span className={`status-tag status-${(item.status || 'Available').toLowerCase()}`}>
                    {item.status || 'Available'}
                  </span>
                </div>

                <h3 className="item-title">{item.title}</h3>
                <div className="seller-info">
                  <CheckCircle2 size={14} className="verified-icon" /> Seller
                </div>

                <p className="item-desc">
                  {item.description && item.description.startsWith('[')
                    ? item.description.substring(item.description.indexOf(']') + 1).trim()
                    : item.description}
                </p>

                <div className="item-price">
                  {item.listingType === 'For Sale' ? (
                    <div className="swap-details">
                      <span className="swap-label">Price:</span>
                      <span className="swap-requirement-text">₱{item.price}</span>
                    </div>
                  ) : (
                    <div className="swap-details">
                      <span className="swap-label">
                        {item.listingType === 'For Swap' ? 'Swapping for: ' : 'Looking for: '}
                      </span>
                      <span className="swap-requirement-text">
                        {item.description && item.description.includes(':')
                          ? item.description.substring(item.description.indexOf(':') + 1, item.description.indexOf(']')).trim()
                          : 'Specific Item'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="item-meta">
                  <span className="meta-item"><MapPin size={14} /> {item.location}</span>
                  <span className="meta-item"><Calendar size={14} /> {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}</span>
                </div>
              </div>

              <div className="card-actions">
                <button className="btn-outline outline-sm" onClick={() => openDetails(item)}>View Details</button>
                <button
                  className={`btn-primary btn-sm ${item.status && item.status !== 'Available' ? 'btn-disabled' : ''}`}
                  onClick={() => (!item.status || item.status === 'Available') ? openBooking(item) : null}
                  disabled={item.status && item.status !== 'Available'}
                >
                  {(!item.status || item.status === 'Available') ? 'Book Now' : item.status}
                </button>
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

      </main>

      {/* View Details Modal */}
      {isDetailsOpen && selectedItem && (
        <div className="modal-overlay centered-overlay" onClick={() => setIsDetailsOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()} style={{ background: '#ffffff', color: '#000000', borderRadius: '24px', maxWidth: '500px', width: '90%', padding: '0', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div className="details-header" style={{ padding: '24px 32px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="details-title" style={{ margin: '0', fontSize: '1.5rem', fontWeight: '800', color: '#000' }}>{selectedItem.title}</h2>
              <button className="details-close-btn" onClick={() => setIsDetailsOpen(false)} style={{ background: '#f5f5f5', border: 'none', color: '#666', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div className="details-body" style={{ padding: '32px' }}>

              <div className="details-tags" style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <span className={`tag tag-${(selectedItem.listingType || '').toLowerCase().replace(' ', '-')}`} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
                  {selectedItem.listingType}
                </span>
                <span className={`status-tag status-${(selectedItem.status || 'Available').toLowerCase()}`} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '700' }}>
                  {selectedItem.status || 'Available'}
                </span>
                <span className="tag-category-outline" style={{ background: '#f5f5f5', color: '#666', border: '1px solid #eee', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem' }}>{selectedItem.category}</span>
              </div>

              <div className="details-meta-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                <div className="meta-info-item" style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Star size={16} /> Seller</div>
                <div className="meta-info-item" style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><MapPin size={16} /> {selectedItem.location}</div>
                <div className="meta-info-item" style={{ color: '#666', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}><Calendar size={16} /> Posted {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleDateString() : 'Just now'}</div>
              </div>

              <div style={{ height: '1px', background: '#eee', margin: '24px 0' }}></div>

              <div className="details-section">
                <h3 className="section-label" style={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: '800' }}>Description</h3>
                <p className="section-text" style={{ color: '#333', lineHeight: '1.6', margin: '0' }}>
                  {selectedItem.description && selectedItem.description.startsWith('[')
                    ? selectedItem.description.substring(selectedItem.description.indexOf(']') + 1).trim()
                    : selectedItem.description}
                </p>
              </div>

              <div style={{ height: '1px', background: '#eee', margin: '24px 0' }}></div>

              <div className="details-section">
                <h3 className="section-label" style={{ color: '#999', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', fontWeight: '800' }}>
                  {selectedItem.listingType === 'For Sale' ? 'Price / Value' :
                    selectedItem.listingType === 'For Swap' ? 'Swapping For' :
                      'Budget'}
                </h3>
                <div className="details-price-value" style={{ marginTop: '12px' }}>
                  {selectedItem.listingType === 'For Sale' ? (
                    <span className="swap-requirement-text" style={{ color: '#000000', fontSize: '2.5rem', fontWeight: '800', display: 'block' }}>₱{selectedItem.price}</span>
                  ) : (
                    <span className="swap-requirement-text" style={{ color: '#000000', fontSize: '2.5rem', fontWeight: '800', display: 'block' }}>
                      {selectedItem.description && selectedItem.description.includes(':') && selectedItem.description.includes(']')
                        ? selectedItem.description.substring(selectedItem.description.indexOf(':') + 1, selectedItem.description.indexOf(']')).trim()
                        : (selectedItem.price && selectedItem.price !== 0 ? `₱${selectedItem.price}` : 'Specific Item / Exchange')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="details-footer" style={{ padding: '24px 32px', background: '#f9f9f9', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
              <button className="btn-outline" onClick={() => setIsDetailsOpen(false)} style={{ borderRadius: '12px', padding: '10px 20px', border: '1px solid #ddd', color: '#666', background: '#fff' }}>Close</button>
              {parseInt(selectedItem.userId) === parseInt(userId) ? (
                <div className="own-listing-notice" style={{ background: '#f5f5f5', color: '#999', padding: '10px 20px', borderRadius: '12px', fontWeight: '700' }}>
                  This is your listing
                </div>
              ) : (
                <button
                  className={`btn-primary ${selectedItem.status && selectedItem.status !== 'Available' ? 'btn-disabled' : ''}`}
                  onClick={() => (!selectedItem.status || selectedItem.status === 'Available') ? openBooking(selectedItem) : null}
                  style={{ borderRadius: '12px', padding: '10px 30px', background: (!selectedItem.status || selectedItem.status === 'Available') ? '#000' : '#ccc', color: '#fff', fontWeight: '800', border: 'none', cursor: (!selectedItem.status || selectedItem.status === 'Available') ? 'pointer' : 'not-allowed' }}
                  disabled={selectedItem.status && selectedItem.status !== 'Available'}
                >
                  {(!selectedItem.status || selectedItem.status === 'Available') ? 'Request Booking' : `Currently ${selectedItem.status}`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Booking Modal */}
      {isBookingOpen && bookingItem && (
        <div className="modal-overlay centered-overlay" onClick={() => setIsBookingOpen(false)}>
          <div className="modal-content booking-popup" onClick={e => e.stopPropagation()}>
            <div className="booking-header">
              <div className="booking-title-row">
                <h2 className="booking-title">Request Booking</h2>
                <button className="details-close-btn" onClick={() => setIsBookingOpen(false)}><X size={20} /></button>
              </div>
              <p className="booking-subtitle">Book "{bookingItem.title}" for the selected dates</p>
            </div>
            <div className="booking-body">
              {/* Start Date Section */}
              <div className="date-section">
                <label className="section-label">Start Date</label>
                <div className="date-display-box">
                  <Calendar size={16} /> <span>{startDate ? startDate.toLocaleDateString() : "Select start date"}</span>
                </div>
                <div className="calendar-widget">
                  <div className="calendar-header">
                    <span>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</span>
                    <div className="calendar-nav">
                      <ChevronLeft size={14} onClick={() => changeMonth(-1)} style={{ cursor: 'pointer' }} />
                      <ChevronRight size={14} onClick={() => changeMonth(1)} style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                  <div className="calendar-grid">
                    <div className="day-name">Mo</div><div className="day-name">Tu</div><div className="day-name">We</div><div className="day-name">Th</div><div className="day-name">Fr</div><div className="day-name">Sa</div><div className="day-name">Su</div>
                    {renderCalendarDays()}
                  </div>
                </div>
              </div>

              {/* End Date Section */}
              <div className="date-section">
                <label className="section-label">End Date</label>
                <div className="date-display-box">
                  <Calendar size={16} /> <span>{endDate ? endDate.toLocaleDateString() : "Select end date"}</span>
                </div>
              </div>



              <div className="transaction-section">
                <label className="section-label">Transaction Mode</label>
                <div className="transaction-modes">
                  <label className={`mode-option ${transactionType === 'MEETUP' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="transactionType"
                      value="MEETUP"
                      checked={transactionType === 'MEETUP'}
                      onChange={(e) => setTransactionType(e.target.value)}
                    />
                    <span>Meetup</span>
                  </label>
                  <label className={`mode-option ${transactionType === 'DELIVERY' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="transactionType"
                      value="DELIVERY"
                      checked={transactionType === 'DELIVERY'}
                      onChange={(e) => setTransactionType(e.target.value)}
                    />
                    <span>Delivery</span>
                  </label>
                </div>
              </div>

              {transactionType === 'MEETUP' ? (
                <div className="form-group">
                  <label className="section-label">Meetup Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter specific meetup location"
                    value={meetupLocation}
                    onChange={(e) => setMeetupLocation(e.target.value)}
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label className="section-label">Delivery Address</label>
                  <textarea
                    className="booking-textarea"
                    placeholder="Enter your complete delivery address"
                    rows="3"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  ></textarea>
                </div>
              )}
            </div>

            <div className="booking-footer">
              <button className="btn-outline" onClick={() => setIsBookingOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={async () => {
                if (!startDate || !endDate) {
                  alert("Please select both start and end dates.");
                  return;
                }

                if (transactionType === 'MEETUP' && !meetupLocation) {
                  alert("Please provide a meetup location.");
                  return;
                }

                if (transactionType === 'DELIVERY' && !deliveryAddress) {
                  alert("Please provide a delivery address.");
                  return;
                }

                try {

                  const response = await fetch('http://localhost:8080/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      productId: bookingItem.id,
                      consumerId: parseInt(localStorage.getItem('userId')),
                      startDate: startDate.toISOString().split('T')[0],
                      endDate: endDate.toISOString().split('T')[0],

                      transactionType: transactionType,
                      meetupLocation: transactionType === 'MEETUP' ? meetupLocation : null,
                      deliveryAddress: transactionType === 'DELIVERY' ? deliveryAddress : null,
                      status: 'PENDING'
                    })
                  });

                  if (response.ok) {
                    setIsBookingOpen(false);
                    setIsSuccessModalOpen(true);
                    setStartDate(null);
                    setEndDate(null);
                    setMeetupLocation('');
                    setDeliveryAddress('');
                  } else {
                    const errorText = await response.text();
                    console.error("Server error during booking:", errorText);
                    if (errorText.includes("own listing")) {
                      setIsSelfBookingModalOpen(true);
                      setIsBookingOpen(false);
                    } else {
                      alert('Failed to submit booking: ' + errorText);
                    }
                  }
                } catch (error) {
                  console.error("Network error during booking:", error);
                  alert('Network error. Please try again.');
                }
              }}>Request Booking</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Booking Modal */}
      {isSuccessModalOpen && (
        <div className="modal-overlay centered-overlay" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="modal-content success-popup glass-panel" onClick={e => e.stopPropagation()}>
            <div className="success-icon-wrapper">
              <div className="success-icon-bg">
                <CheckCircle2 size={48} color="#22c55e" />
              </div>
              <div className="success-glow"></div>
            </div>

            <h2 className="success-title">Booking Requested!</h2>
            <p className="success-description">
              Your request for <strong>{bookingItem?.title}</strong> has been sent to the SME.
              You'll be notified once they finalize the schedule.
            </p>

            <div className="success-actions">
              <button className="btn-secondary-outline" onClick={() => setIsSuccessModalOpen(false)}>
                Back to Marketplace
              </button>
              <button className="btn-primary-success" onClick={() => navigate('/bookings')}>
                View My Bookings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Listing Modal */}
      {isModalOpen && (
        <div className="modal-overlay centered-overlay" onClick={() => { setIsModalOpen(false); setModalError(''); }}>
          <div className="modal-content add-listing-popup" onClick={e => e.stopPropagation()}>
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
                  <option value="Office & Business Supplies">Office & Business Supplies</option>
                  <option value="Electronics & Tech">Electronics & Tech</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Health & Beauty">Health & Beauty</option>
                  <option value="Home & Lifestyle">Home & Lifestyle</option>
                  <option value="Automotive & Transport">Automotive & Transport</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-input" placeholder="Enter item title" maxLength="100" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" placeholder="Describe your item in details..." rows="3" maxLength="1000" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
              </div>

              <div className="form-group">
                <label>
                  {formData.listingType === 'For Sale' ? 'Price / Value (₱)' :
                    formData.listingType === 'For Swap' ? 'Swapping For' :
                      'Looking For'}
                </label>
                <input
                  type={formData.listingType === 'For Sale' ? 'number' : 'text'}
                  className="form-input"
                  placeholder={
                    formData.listingType === 'For Sale' ? 'Enter amount' :
                      formData.listingType === 'For Swap' ? 'What are you looking to swap with?' :
                        'What are you looking for?'
                  }
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  min={formData.listingType === 'For Sale' ? "0" : undefined}
                  step={formData.listingType === 'For Sale' ? "0.01" : undefined}
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
                <button type="button" className="btn-outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancel</button>
                <button type="button" className="btn-primary" disabled={isSubmitting} onClick={async () => {
                  // Validation: Check if all required fields are filled
                  const requiredFields = ['category', 'title', 'description', 'price', 'name', 'company', 'location', 'imageData'];
                  const missingFields = requiredFields.filter(field => !formData[field]);

                  if (missingFields.length > 0) {
                    setModalError('Please fill out all fields and upload an image.');
                    return;
                  }

                  if (formData.title.trim().length < 3) {
                    setModalError('Title must be at least 3 characters long.');
                    return;
                  }

                  if (formData.description.trim().length < 20) {
                    setModalError('Description must be at least 20 characters long.');
                    return;
                  }

                  if (formData.location.trim().length < 3) {
                    setModalError('Please provide a valid location.');
                    return;
                  }

                  if (formData.listingType === 'For Sale' && (isNaN(formData.price) || parseFloat(formData.price) <= 0)) {
                    setModalError('For Sale items must have a valid price strictly greater than 0.');
                    return;
                  }

                  // DUPLICATION CHECK: Prevent user from listing the same product twice
                  const isDuplicate = items.some(item =>
                    item.title.trim().toLowerCase() === formData.title.trim().toLowerCase() &&
                    item.category === formData.category &&
                    parseInt(item.userId) === parseInt(userId)
                  );

                  if (isDuplicate) {
                    setModalError('Duplicate Error: You already have an active listing for this product in the ' + formData.category + ' category.');
                    return;
                  }

                  setModalError(''); // Clear error before submission
                  setIsSubmitting(true); // Disable button to prevent double-clicks

                  try {
                    const payload = {
                      ...formData,
                      userId: localStorage.getItem('userId') || 1, // fallback to avoid constraint errors
                      price: formData.listingType === 'For Sale' ? parseFloat(formData.price) : 0,
                      description: formData.listingType === 'For Sale' ? formData.description : `[${formData.listingType === 'For Swap' ? 'SWAP' : 'WANTED'}: ${formData.price}] ${formData.description}`
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
                      // Add a small delay to allow DB to propagate before fetching
                      setTimeout(() => {
                        fetchListings();
                        setIsSubmitting(false);
                      }, 500);
                    } else {
                      const errorText = await res.text();
                      setModalError('Error saving listing: ' + errorText);
                      console.error("Backend error:", errorText);
                      setIsSubmitting(false);
                    }
                  } catch (e) {
                    setModalError('Network error. Please try again.');
                    console.error("Error creating listing", e);
                    setIsSubmitting(false);
                  }
                }}>{isSubmitting ? 'Creating...' : 'Create Listing'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSelfBookingModalOpen && (
        <div className="modal-overlay centered-overlay" onClick={() => setIsSelfBookingModalOpen(false)}>
          <div className="modal-content self-booking-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon-wrapper">
              <AlertTriangle size={32} color="#ef4444" />
            </div>
            <h2 className="confirm-title">Invalid Action</h2>
            <p className="confirm-text">You cannot book your own listing. Please browse other marketplace items for transactions.</p>
            <div className="confirm-actions">
              <button className="btn-primary" style={{ width: '100%' }} onClick={() => setIsSelfBookingModalOpen(false)}>Got it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;

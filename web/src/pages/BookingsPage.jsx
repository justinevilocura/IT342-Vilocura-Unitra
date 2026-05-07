import React, { useState, useEffect } from 'react';
import { Calendar, User, Package, Check, X, Clock, ChevronLeft, ChevronRight, Star, MapPin, AlertTriangle } from 'lucide-react';
import './BookingsPage.css';

const BookingsPage = () => {
  const roleId = parseInt(localStorage.getItem('roleId'));
  const userId = localStorage.getItem('userId');
  
  const [activeTab, setActiveTab] = useState((roleId === 1 || roleId === 3) ? 'received' : 'sent');
  const [receivedBookings, setReceivedBookings] = useState([]);
  const [sentBookings, setSentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Modal State
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const handleViewListing = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/products/${productId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedProduct(data);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleCancelBooking = (id) => {
    setBookingToCancel(id);
    setIsCancelModalOpen(true);
  };

  const confirmCancellation = async () => {
    if (bookingToCancel) {
      await handleUpdateStatus(bookingToCancel, 'CANCELLED');
      setIsCancelModalOpen(false);
      setBookingToCancel(null);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllBookings();
    }
  }, [userId]);

  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch(`http://localhost:8080/api/bookings/received/${userId}`),
        fetch(`http://localhost:8080/api/bookings/sent/${userId}`)
      ]);
      
      if (receivedRes.ok) setReceivedBookings(await receivedRes.json());
      if (sentRes.ok) setSentBookings(await sentRes.json());
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchAllBookings();
      }
    } catch (error) { console.error(error); }
  };

  const currentBookings = activeTab === 'received' ? receivedBookings : sentBookings;
  const paginatedBookings = currentBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(currentBookings.length / itemsPerPage);

  return (
    <div className="bookings-layout">
      {/* Mesh Backgrounds */}
      <div className="mesh-gradient mesh-1" style={{ opacity: 0.15 }}></div>
      <div className="mesh-gradient mesh-3" style={{ opacity: 0.1 }}></div>

      <main className="bookings-main">
        <header className="page-header">
          <div className="header-text">
            <h1>My Bookings</h1>
            <p className="subtitle">Manage your marketplace requests and schedule</p>
          </div>
        </header>

        <div className="bookings-tabs-container glass-panel">
          {(roleId === 1 || roleId === 3) && (
            <button 
              className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
              onClick={() => { setActiveTab('received'); setCurrentPage(1); }}
            >
              Received Bookings ({receivedBookings.length})
            </button>
          )}
          <button 
            className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
            onClick={() => { setActiveTab('sent'); setCurrentPage(1); }}
          >
            Sent Requests ({sentBookings.length})
          </button>
        </div>

        <div className="bookings-content">
          {loading ? (
            <div className="status-message">Loading bookings...</div>
          ) : currentBookings.length === 0 ? (
            <div className="status-message">No {activeTab} bookings found.</div>
          ) : (
            <>
              <div className="bookings-grid">
                {paginatedBookings.map((booking) => (
                  <div key={booking.id} className={`booking-card glass-panel hover-lift ${booking.status === 'CANCELLED' ? 'cancelled-card' : ''}`}>
                    <div className="booking-card-top">
                      <div className="booking-main-info">
                        <div className="title-row">
                          <h3 className="booking-product-title">{booking.productTitle || booking.title || 'Untitled Product'}</h3>
                          <span className="category-badge">{booking.category || 'N/A'}</span>
                        </div>
                        <p className="booking-user-info">
                          <User size={14} style={{ marginRight: '6px' }} />
                          {activeTab === 'received' 
                            ? `From: ${booking.consumerName || 'Customer'}` 
                            : `To: ${booking.sellerName || 'Owner'}`}
                        </p>
                      </div>
                      <span className={`status-badge status-${(booking.status || 'pending').toLowerCase()}`}>
                        <span className="status-dot"></span> {booking.status}
                      </span>
                    </div>

                    <div className="booking-grid">
                      <div className="grid-col">
                        <div className="grid-item">
                          <span className="grid-label">Proposed Start:</span>
                          <span className="grid-value">{booking.startDate}</span>
                        </div>
                        <div className="grid-item">
                          <span className="grid-label">Proposed End:</span>
                          <span className="grid-value">{booking.endDate}</span>
                        </div>
                      </div>
                      <div className="grid-col">
                        <div className="grid-item">
                          <span className="grid-label">Listing Type:</span>
                          <span className="grid-value type-highlight">{booking.listingType || 'N/A'}</span>
                        </div>
                        <div className="grid-item">
                          <span className="grid-label">Created:</span>
                          <span className="grid-value">{booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    {booking.message && (
                      <div className="booking-message-box">
                        <span className="message-label">Message:</span> {booking.message}
                      </div>
                    )}

                    {booking.status === 'PENDING' ? (
                      <div className="booking-card-actions">
                        {activeTab === 'received' ? (
                          <>
                            <button className="action-btn btn-accept" onClick={() => handleUpdateStatus(booking.id, 'ACCEPTED')}>
                              <Check size={16} /> Accept
                            </button>
                            <button className="action-btn btn-decline" onClick={() => handleUpdateStatus(booking.id, 'REJECTED')}>
                              <X size={16} /> Decline
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="action-btn btn-view" onClick={() => handleViewListing(booking.productId)}>
                              View Listing
                            </button>
                            <button className="action-btn btn-cancel" onClick={() => handleCancelBooking(booking.id)}>
                              Cancel Booking
                            </button>
                          </>
                        )}
                      </div>
                    ) : booking.status === 'CANCELLED' ? (
                      <div className="booking-card-actions cancelled-notice">
                        <span className="status-message-text">
                          {activeTab === 'received' ? 'Request has been cancelled by the sender' : 'Booking Cancelled'}
                        </span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {currentBookings.length > itemsPerPage && (
                <div className="pagination-container">
                  <button
                    className="pagination-arrow"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="pagination-numbers">
                    {Array.from({ length: totalPages }, (_, i) => {
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
                    className="pagination-arrow"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* View Details Modal (Reused from Marketplace) */}
      {isDetailsOpen && selectedProduct && (
        <div className="modal-overlay centered-overlay" onClick={() => setIsDetailsOpen(false)}>
          <div className="modal-content details-modal" onClick={e => e.stopPropagation()}>
            <div className="details-header">
              <h2 className="details-title">{selectedProduct.title}</h2>
              <button className="details-close-btn" onClick={() => setIsDetailsOpen(false)}><X size={20} /></button>
            </div>
            <div className="details-body">
              <div className="details-tags">
                <span className={`tag tag-${(selectedProduct.listingType || '').toLowerCase().replace(' ', '-')}`}>
                  {selectedProduct.listingType}
                </span>
                <span className="tag-available">Available</span>
                <span className="tag-category-outline">{selectedProduct.category}</span>
              </div>

              <div className="details-meta-list">
                <div className="meta-info-item">
                  <Star size={16} /> {selectedProduct.name || 'Seller'}
                </div>
                <div className="meta-info-item">
                  <MapPin size={16} /> {selectedProduct.location}
                </div>
                <div className="meta-info-item">
                  <Calendar size={16} /> Posted {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>

              <div className="details-divider"></div>

              <div className="details-section">
                <h3 className="section-label">Description</h3>
                <p className="section-text">
                  {selectedProduct.description && selectedProduct.description.startsWith('[') 
                    ? selectedProduct.description.substring(selectedProduct.description.indexOf(']') + 1).trim() 
                    : selectedProduct.description}
                </p>
              </div>

              <div className="details-divider"></div>

              <div className="details-pricing-section">
                <h3 className="section-label">
                  {selectedProduct.listingType === 'For Sale' ? 'Price / Value' : 
                   selectedProduct.listingType === 'For Swap' ? 'Swapping For' : 
                   'Budget'}
                </h3>
                <div className="details-price-value">
                  {selectedProduct.listingType === 'For Sale' ? `₱${selectedProduct.price}` : 
                   selectedProduct.description && selectedProduct.description.includes(':') 
                    ? selectedProduct.description.substring(selectedProduct.description.indexOf(':') + 1, selectedProduct.description.indexOf(']')).trim()
                    : selectedProduct.price}
                </div>
              </div>
            </div>
            <div className="details-footer">
              <button className="btn-outline" style={{ width: '100%' }} onClick={() => setIsDetailsOpen(false)}>Close Details</button>
            </div>
          </div>
        </div>
      )}
      {/* Cancel Confirmation Modal */}
      {isCancelModalOpen && (
        <div className="modal-overlay centered-overlay" onClick={() => setIsCancelModalOpen(false)}>
          <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon-wrapper">
              <AlertTriangle size={32} color="#ef4444" />
            </div>
            <h2 className="confirm-title">Cancel Booking?</h2>
            <p className="confirm-text">Are you sure you want to cancel this booking request? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-outline" onClick={() => setIsCancelModalOpen(false)}>No, Keep Booking</button>
              <button className="btn-primary btn-destructive" onClick={confirmCancellation}>Yes, Cancel Booking</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;

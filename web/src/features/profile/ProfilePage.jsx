import React, { useState, useEffect } from 'react';
import { User, Upload, CheckCircle2, Edit2 } from 'lucide-react';
import './ProfilePage.css';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    displayName: '',
    tagline: '',
    bio: '',
    companyName: '',
    industry: '',
    businessDescription: '',
    streetAddress: '',
    city: '',
    province: '',
    contactPhone: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [originalAvatar, setOriginalAvatar] = useState(null);
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [businessError, setBusinessError] = useState('');

  // Role check - 1 for SME, 2 for Consumer (assumed), 3 for Admin
  const roleId = parseInt(localStorage.getItem('roleId')) || 2; // Defaulting to consumer if not set for safety
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/api/users/${userId}`)
        .then(res => res.json())
        .then(data => {
          const loadedData = {
            displayName: data.name || '',
            tagline: data.tagline || '',
            bio: data.bio || '',
            companyName: data.companyName || '',
            industry: data.industry || '',
            businessDescription: data.businessDescription || '',
            streetAddress: data.streetAddress || '',
            city: data.city || '',
            province: data.province || '',
            contactPhone: data.contactPhone || ''
          };
          setFormData(loadedData);
          setOriginalData(loadedData);
          if (data.avatarData) {
            setAvatar(data.avatarData);
            setOriginalAvatar(data.avatarData);
          }
        })
        .catch(err => console.error("Error fetching profile", err));
    }
  }, [userId]);

  const saveProfile = async (section) => {
    try {
      if (section === 'profile') {
        setProfileError('');
        if (!formData.displayName || formData.displayName.trim().length < 2 || formData.displayName.trim().length > 30) {
          setProfileError('Display Name must be between 2 and 30 characters.');
          return;
        }
        if (formData.tagline && formData.tagline.length > 60) {
          setProfileError('Tagline cannot exceed 60 characters.');
          return;
        }
        if (formData.bio && formData.bio.length > 300) {
          setProfileError('Personal Bio cannot exceed 300 characters.');
          return;
        }
      }

      if (section === 'business') {
        setBusinessError('');
        if (!formData.companyName || formData.companyName.trim().length < 2) {
          setBusinessError('Company Name must be at least 2 characters long.');
          return;
        }
        if (!formData.industry) {
          setBusinessError('Please select an Industry.');
          return;
        }
        if (!formData.businessDescription || formData.businessDescription.trim().length < 20) {
          setBusinessError('Business Description must be at least 20 characters long.');
          return;
        }
        if (/\d/.test(formData.city) || /\d/.test(formData.province)) {
          setBusinessError('City and Province should only contain letters and spaces.');
          return;
        }
        const phoneRegex = /^09\d{9}$/;
        if (!phoneRegex.test(formData.contactPhone)) {
          setBusinessError('Contact Phone must be a valid 11-digit number starting with 09 (e.g. 09123456789).');
          return;
        }
      }

      const payload = {
        name: formData.displayName,
        tagline: formData.tagline,
        bio: formData.bio,
        avatarData: avatar,
        companyName: formData.companyName,
        industry: formData.industry,
        businessDescription: formData.businessDescription,
        streetAddress: formData.streetAddress,
        city: formData.city,
        province: formData.province,
        contactPhone: formData.contactPhone
      };
      const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setOriginalData({ ...formData });
        setOriginalAvatar(avatar);
        if (section === 'avatar') setIsEditingAvatar(false);
        if (section === 'profile') setIsEditingProfile(false);
        if (section === 'business') setIsEditingBusiness(false);
      } else {
        const errorText = await res.text();
        console.error("Failed to save profile:", errorText);
        alert(`Failed to save! Server returned ${res.status}: ${errorText}`);
      }
    } catch (err) {
      console.error("Error saving profile", err);
    }
  };

  const handleCancel = (section) => {
    setFormData({ ...originalData });
    setAvatar(originalAvatar);
    if (section === 'avatar') setIsEditingAvatar(false);
    if (section === 'profile') {
      setIsEditingProfile(false);
      setProfileError('');
    }
    if (section === 'business') {
      setIsEditingBusiness(false);
      setBusinessError('');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        setIsEditingAvatar(true); // Trigger edit mode so Save/Cancel appear
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-layout">
      {/* Background elements */}
      <div className="mesh-gradient mesh-1" style={{ opacity: 0.15 }}></div>
      <div className="mesh-gradient mesh-3" style={{ opacity: 0.1 }}></div>

      <main className="profile-main">
        <div className="profile-container glass-panel">

          <aside className="profile-sidebar">
            <button
              className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Customization
            </button>
            {/* Only show Business Profile tab for SMEs (roleId === 1) */}
            {roleId === 1 && (
              <button
                className={`sidebar-tab ${activeTab === 'business' ? 'active' : ''}`}
                onClick={() => setActiveTab('business')}
              >
                Business Profile
              </button>
            )}
          </aside>

          <section className="profile-content-area">
            {activeTab === 'profile' && (
              <>
                <div className="profile-header">
                  <h2>Profile Customization</h2>
                  <p>Personalize your individual user account. Update your display name, add a captivating tagline, and share your professional bio.</p>
                </div>

                <div className="profile-cards-grid">
                  {/* Avatar Card */}
                  <div className="profile-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0 }}>Your Avatar</h3>
                      {!isEditingAvatar && (
                        <button className="icon-btn" onClick={() => setIsEditingAvatar(true)}>
                          <Edit2 size={18} />
                        </button>
                      )}
                    </div>
                    <p className="card-subtitle">Make a great first impression.</p>

                    <div className="avatar-section">
                      <div className="avatar-preview">
                        {avatar ? (
                          <img src={avatar} alt="Avatar Preview" />
                        ) : (
                          <User size={64} className="default-avatar-icon" />
                        )}
                      </div>

                      {isEditingAvatar && (
                        <button
                          className="btn-outline avatar-btn"
                          onClick={() => document.getElementById('avatar-upload').click()}
                        >
                          <Upload size={16} /> Change Avatar
                        </button>
                      )}
                      <input
                        type="file"
                        id="avatar-upload"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      
                      {isEditingAvatar && (
                        <div className="form-actions" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}>
                          <button type="button" className="btn-outline" onClick={() => handleCancel('avatar')}>Cancel</button>
                          <button type="button" className="btn-primary" onClick={() => saveProfile('avatar')}>Save Changes</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details Card */}
                  <div className="profile-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0 }}>Profile Details</h3>
                      {!isEditingProfile && (
                        <button className="icon-btn" onClick={() => setIsEditingProfile(true)}>
                          <Edit2 size={18} />
                        </button>
                      )}
                    </div>
                    <p className="card-subtitle">Update your public display name, professional tagline, and personal biography.</p>

                    <form className="profile-form">
                      {profileError && (
                        <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(255, 68, 68, 0.2)' }}>
                          {profileError}
                        </div>
                      )}
                      <div className="form-group">
                        <label>Display Name</label>
                        <input
                          type="text"
                          className={`form-input ${!isEditingProfile ? 'read-only' : ''}`}
                          placeholder="Enter Your Name..."
                          value={formData.displayName}
                          onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                          readOnly={!isEditingProfile}
                        />
                      </div>

                      <div className="form-group">
                        <label>Tagline</label>
                        <input
                          type="text"
                          className={`form-input ${!isEditingProfile ? 'read-only' : ''}`}
                          placeholder="Enter Your Tagline..."
                          value={formData.tagline}
                          onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                          readOnly={!isEditingProfile}
                        />
                      </div>

                      <div className="form-group">
                        <label>Personal Bio</label>
                        <textarea
                          className={`form-textarea ${!isEditingProfile ? 'read-only' : ''}`}
                          placeholder="Enter Your Personal Bio..."
                          rows="4"
                          value={formData.bio}
                          onChange={e => setFormData({ ...formData, bio: e.target.value })}
                          readOnly={!isEditingProfile}
                        ></textarea>
                      </div>

                      {isEditingProfile && (
                        <div className="form-actions">
                          <button type="button" className="btn-outline" onClick={() => handleCancel('profile')}>Cancel</button>
                          <button type="button" className="btn-primary" onClick={() => saveProfile('profile')}>Save Changes</button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'business' && (
              <>
                <div className="profile-header">
                  <h2>Manage Your Business Profile</h2>
                  <p>Establish and refine your business's presence on Unitra. Provide comprehensive details to build trust and visibility with potential customers.</p>
                </div>

                <div className="profile-card" style={{ maxWidth: '800px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0 }}>Business Details</h3>
                    {!isEditingBusiness && (
                      <button className="icon-btn" onClick={() => setIsEditingBusiness(true)}>
                        <Edit2 size={18} />
                      </button>
                    )}
                  </div>
                  <p className="card-subtitle">Provide core information about your business.</p>

                  <form className="profile-form">
                    {businessError && (
                      <div style={{ backgroundColor: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid rgba(255, 68, 68, 0.2)' }}>
                        {businessError}
                      </div>
                    )}
                    <div className="form-row">
                      <div className="form-group half">
                        <label>Company Name</label>
                        <input
                          type="text"
                          className={`form-input ${!isEditingBusiness ? 'read-only' : ''}`}
                          placeholder="Enter Company Name"
                          value={formData.companyName || ''}
                          onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                          readOnly={!isEditingBusiness}
                        />
                      </div>
                      <div className="form-group half">
                        <label>Industry</label>
                        <select
                          className={`form-input ${!isEditingBusiness ? 'read-only' : ''}`}
                          value={formData.industry || ''}
                          onChange={e => setFormData({ ...formData, industry: e.target.value })}
                          disabled={!isEditingBusiness}
                          style={!isEditingBusiness ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                        >
                          <option value="" disabled>Select your Industry</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Digital Services">Digital Services</option>
                          <option value="Apparel & Fashion">Apparel & Fashion</option>
                          <option value="Tutoring & Academics">Tutoring & Academics</option>
                          <option value="Arts & Crafts">Arts & Crafts</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Business Description</label>
                      <textarea
                        className={`form-textarea ${!isEditingBusiness ? 'read-only' : ''}`}
                        placeholder="Enter Business Description...."
                        rows="4"
                        value={formData.businessDescription || ''}
                        onChange={e => setFormData({ ...formData, businessDescription: e.target.value })}
                        readOnly={!isEditingBusiness}
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        className={`form-input ${!isEditingBusiness ? 'read-only' : ''}`}
                        placeholder="Enter your street address"
                        value={formData.streetAddress || ''}
                        onChange={e => setFormData({ ...formData, streetAddress: e.target.value })}
                        readOnly={!isEditingBusiness}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group half">
                        <label>City</label>
                        <input
                          type="text"
                          className={`form-input ${!isEditingBusiness ? 'read-only' : ''}`}
                          placeholder="Your City"
                          value={formData.city || ''}
                          onChange={e => setFormData({ ...formData, city: e.target.value })}
                          readOnly={!isEditingBusiness}
                        />
                      </div>
                      <div className="form-group half">
                        <label>Province</label>
                        <input
                          type="text"
                          className={`form-input ${!isEditingBusiness ? 'read-only' : ''}`}
                          placeholder="Your Province"
                          value={formData.province || ''}
                          onChange={e => setFormData({ ...formData, province: e.target.value })}
                          readOnly={!isEditingBusiness}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Contact Phone</label>
                      <input
                        type="text"
                        className={`form-input ${!isEditingBusiness ? 'read-only' : ''}`}
                        placeholder="Enter your Contact Number"
                        value={formData.contactPhone || ''}
                        onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                        readOnly={!isEditingBusiness}
                      />
                    </div>

                    {isEditingBusiness && (
                      <div className="form-actions" style={{ marginTop: '32px' }}>
                        <button type="button" className="btn-outline" onClick={() => handleCancel('business')}>Cancel</button>
                        <button type="button" className="btn-primary" onClick={() => saveProfile('business')}>Save Changes</button>
                      </div>
                    )}
                  </form>
                </div>
              </>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;

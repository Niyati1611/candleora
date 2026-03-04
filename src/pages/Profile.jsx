import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { api } from '../services/api'
import './Profile.css'

export default function Profile() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, token, logout } = useAuth()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState('personal')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Profile data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    shipping_address: '',
    profile_photo: ''
  })
  
  // Orders data
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  
  // Wishlist data
  const [wishlist, setWishlist] = useState([])
  const [loadingWishlist, setLoadingWishlist] = useState(false)

  useEffect(() => {
    if (!user || !token) {
      navigate('/login')
      return
    }
    loadProfile()
    
    // Check for tab parameter in URL
    const tab = searchParams.get('tab')
    if (tab === 'wishlist' || tab === 'orders' || tab === 'personal') {
      setActiveTab(tab)
      if (tab === 'orders') {
        loadOrders()
      } else if (tab === 'wishlist') {
        loadWishlist()
      }
    }
  }, [user, token, navigate, searchParams])

  const loadProfile = async () => {
    try {
      const data = await api.getProfile()
      setProfile({
        name: data.name || '',
        email: data.email || '',
        shipping_address: data.shipping_address || '',
        profile_photo: data.profile_photo || ''
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const updated = await api.updateProfile(profile)
      setProfile({
        name: updated.name || '',
        email: updated.email || '',
        shipping_address: updated.shipping_address || '',
        profile_photo: updated.profile_photo || ''
      })
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setSaving(false)
    }
  }

  const loadOrders = async () => {
    setLoadingOrders(true)
    try {
      const data = await api.getUserOrders()
      setOrders(data || [])
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  const loadWishlist = async () => {
    setLoadingWishlist(true)
    try {
      const data = await api.getWishlist()
      setWishlist(data || [])
    } catch (error) {
      console.error('Failed to load wishlist:', error)
    } finally {
      setLoadingWishlist(false)
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'orders' && orders.length === 0) {
      loadOrders()
    }
    if (tab === 'wishlist' && wishlist.length === 0) {
      loadWishlist()
    }
  }

  const handleAddToCart = (product) => {
    addToCart({
      id: product.product_id,
      name: product.name,
      price: product.discount_price || product.price,
      image_url: product.image_url
    })
  }

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api.removeFromWishlist(productId)
      setWishlist(wishlist.filter(item => item.product_id !== productId))
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const handleReorder = (order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        addToCart({
          id: item.product_id,
          quantity: item.quantity
        })
      })
      navigate('/cart')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="profile-loading">Loading profile...</div>
  }

  return (
<div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1 className="profile-title">My Profile</h1>
          <button className="logout-btn" onClick={handleLogout}>
             Logout
          </button>
        </div>
        
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabChange('personal')}
          >
            👤 Personal Information
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            🛒 Order History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => handleTabChange('wishlist')}
          >
            ❤️ Wishlist
          </button>
        </div>

        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="tab-content">
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label>Profile Photo</label>
                <div className="profile-photo-section">
                  {profile.profile_photo ? (
                    <img src={profile.profile_photo} alt="Profile" className="profile-photo-preview" />
                  ) : (
                    <div className="profile-photo-placeholder">👤</div>
                  )}
                  <input
                    type="text"
                    placeholder="Enter image URL for profile photo"
                    value={profile.profile_photo}
                    onChange={(e) => setProfile({ ...profile, profile_photo: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="form-input"
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profile.email}
                  className="form-input"
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>

              <div className="form-group">
                <label>Shipping Address</label>
                <textarea
                  value={profile.shipping_address}
                  onChange={(e) => setProfile({ ...profile, shipping_address: e.target.value })}
                  className="form-input"
                  rows="4"
                  placeholder="Enter your shipping address"
                />
              </div>

              {message.text && (
                <div className={`message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'orders' && (
          <div className="tab-content">
            {loadingOrders ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <p>You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/shop')} className="shop-btn">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-id">Order #{order.id}</div>
                      <div className={`order-status status-${order.status}`}>
                        {order.status}
                      </div>
                    </div>
                    <div className="order-details">
                      <p><strong>Date:</strong> {formatDate(order.created_at)}</p>
                      <p><strong>Total:</strong> ₹{parseFloat(order.total_amount).toFixed(2)}</p>
                      <p><strong>Items:</strong> {order.items?.length || 0}</p>
                    </div>
                    <div className="order-items">
                      {order.items && order.items.map((item, idx) => (
                        <span key={idx} className="item-badge">
                          x{item.quantity}
                        </span>
                      ))}
                    </div>
                    <button 
                      className="reorder-btn"
                      onClick={() => handleReorder(order)}
                    >
                      🔄 Reorder
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="tab-content">
            {loadingWishlist ? (
              <div className="loading">Loading wishlist...</div>
            ) : wishlist.length === 0 ? (
              <div className="empty-state">
                <p>Your wishlist is empty.</p>
                <button onClick={() => navigate('/shop')} className="shop-btn">
                  Browse Candles
                </button>
              </div>
            ) : (
              <div className="wishlist-grid">
                {wishlist.map((item) => (
                  <div key={item.id} className="wishlist-item">
                    <div className="wishlist-image">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} />
                      ) : (
                        <div className="no-image">🕯️</div>
                      )}
                    </div>
                    <div className="wishlist-info">
                      <h3>{item.name}</h3>
                      <p className="wishlist-category">{item.category}</p>
                      <p className="wishlist-price">
                        {item.discount_price ? (
                          <>
                            <span className="original-price">₹{parseFloat(item.price).toFixed(2)}</span>
                            <span className="sale-price">₹{parseFloat(item.discount_price).toFixed(2)}</span>
                          </>
                        ) : (
                          <span>₹{parseFloat(item.price).toFixed(2)}</span>
                        )}
                      </p>
                    </div>
                    <div className="wishlist-actions">
                      <button 
                        className="add-cart-btn"
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveFromWishlist(item.product_id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

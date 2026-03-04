import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import './Checkout.css'

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Store the cart data for order success screen
  const [placedOrderItems, setPlacedOrderItems] = useState([])
  const [placedOrderSubtotal, setPlacedOrderSubtotal] = useState(0)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (formData.pincode.length < 6) {
      newErrors.pincode = 'Pincode must be at least 6 digits'
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact Number is required'
    } else if (formData.contactNumber.length < 10) {
      newErrors.contactNumber = 'Contact Number must be at least 10 digits'
    }
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card Number is required'
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card Number must be 16 digits'
    }
    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry Date is required'
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Expiry Date must be MM/YY format'
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required'
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      navigate('/login')
      return
    }

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      const orderData = {
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.contactNumber,
        customer_address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}`,
        total_amount: getTotalPrice(),
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      }

      await api.createOrder(orderData)

      // Store cart items & subtotal before clearing
      setPlacedOrderItems([...cartItems])
      setPlacedOrderSubtotal(getTotalPrice())

      clearCart()
      setIsProcessing(false)
      setOrderPlaced(true)
    } catch (error) {
      setIsProcessing(false)
      setErrors({ submit: error.message })
      console.error('Order creation failed:', error)
    }
  }

  // Empty cart view
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Please add items to your cart before checkout</p>
          <button onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    )
  }

  // Order success view
  if (orderPlaced) {
    const tax = placedOrderSubtotal * 0.1
    const total = placedOrderSubtotal + tax

    return (
      <div className="checkout-page">
        <div className="order-success">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <div className="order-details">
            <p>Thank you for your purchase! Your order has been confirmed.</p>
            <p>Order Summary:</p>
            <ul className="order-items-list">
              {placedOrderItems.map(item => (
                <li key={item.id}>
                  {item.quantity}x {item.name} - ₹{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
            <div className="order-total">
              <strong>Total Amount: ₹{total.toFixed(2)}</strong>
            </div>
            <p className="delivery-info">
              Your order will be delivered within 3-5 business days to your provided address.
            </p>
          </div>
          <div className="action-buttons">
            <button className="continue-btn" onClick={() => navigate('/shop')}>
              Continue Shopping
            </button>
            <button className="home-btn" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Checkout form view
  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
      </div>

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          {/* Shipping Information */}
          <section className="form-section">
            <h2>Shipping Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={errors.fullName ? 'error' : ''}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? 'error' : ''}
                placeholder="Enter your street address"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={errors.city ? 'error' : ''}
                  placeholder="Enter city"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'error' : ''}
                  placeholder="Enter state"
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={errors.pincode ? 'error' : ''}
                  placeholder="Enter pincode"
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={errors.contactNumber ? 'error' : ''}
                placeholder="Enter your contact number"
              />
              {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
            </div>
          </section>

          {/* Payment Information */}
          <section className="form-section">
            <h2>Payment Information</h2>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number *</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '')
                  const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim()
                  handleInputChange({ target: { name: 'cardNumber', value: formattedValue } })
                }}
                className={errors.cardNumber ? 'error' : ''}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
              />
              {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date *</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4)
                    }
                    handleInputChange({ target: { name: 'expiryDate', value } })
                  }}
                  className={errors.expiryDate ? 'error' : ''}
                  placeholder="MM/YY"
                  maxLength="5"
                />
                {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV *</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    handleInputChange({ target: { name: 'cvv', value: value.slice(0, 3) } })
                  }}
                  className={errors.cvv ? 'error' : ''}
                  placeholder="123"
                  maxLength="3"
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
              </div>
            </div>

            <div className="payment-note">
              <p>💳 This is a demo payment. Use any valid card format (numbers 1-9, minimum length as indicated).</p>
            </div>
          </section>

          <button type="submit" className="submit-btn" disabled={isProcessing}>
            {isProcessing ? 'Processing Payment...' : 'Place Order'}
          </button>
        </form>

        {/* Order Summary */}
        <aside className="order-summary-sidebar">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-name">
                  <span>{item.name}</span>
                  <span className="summary-item-qty">x{item.quantity}</span>
                </div>
                <span className="summary-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>₹{(getTotalPrice() * 0.1).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{(getTotalPrice() * 1.1).toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

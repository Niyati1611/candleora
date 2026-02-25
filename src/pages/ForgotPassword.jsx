import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './Checkout.css'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    const validation = validateAll({ email })
    setErrors(validation)
    
    if (Object.keys(validation).length > 0) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMessage(data.message)
        setEmail('')
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateAll = ({ email }) => {
    const e = {}
    if (!email || email.trim() === '') e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format'
    return e
  }

  const clearFieldError = (field) => {
    if (!errors[field]) return
    setErrors((prev) => {
      const copy = { ...prev }
      delete copy[field]
      return copy
    })
  }

  return (
    <div className="checkout-page">
      
      {/* Header Section */}
      <div className="checkout-header">
        <h1>Reset Password</h1>
      </div>

      {/* Container: Centered specifically for Forgot Password */}
      <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', gridTemplateColumns: 'unset' }}>
        
        {/* Form Card */}
        <form className="checkout-form" onSubmit={handleSubmit} style={{ maxWidth: '450px', width: '100%', margin: '0 15px' }}>
          
          <div className="form-section" style={{ marginBottom: 0 }}>
            <h2 style={{ borderBottom: 'none', fontSize: '20px', marginBottom: '20px' }}>Forgot your password?</h2>
            
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px', lineHeight: '1.5' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
            
            {/* Success Message */}
            {successMessage && (
              <div style={{ 
                backgroundColor: '#d1fae5', 
                color: '#065f46', 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '20px', 
                fontSize: '13px',
                border: '1px solid #34d399'
              }}>
                {successMessage}
              </div>
            )}

            {/* Global Error Message */}
            {error && (
              <div style={{ 
                backgroundColor: '#fef3c7', 
                color: '#d97706', 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '20px', 
                fontSize: '13px',
                border: '1px solid #fcd34d'
              }}>
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => { 
                  setEmail(e.target.value); 
                  clearFieldError('email'); 
                  setError(''); 
                  setSuccessMessage('');
                }} 
                className={errors.email ? 'error' : ''}
                placeholder="name@example.com"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {/* Submit Button */}
            <button 
              className="submit-btn" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            {/* Back to Login */}
            <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#666' }}>
              Remember your password?{' '}
              <Link to="/login" style={{ color: '#8b7d6b', fontWeight: 600, textDecoration: 'none' }}>
                Sign In
              </Link>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

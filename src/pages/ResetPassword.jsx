import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import './Checkout.css'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [isValidToken, setIsValidToken] = useState(true)

  useEffect(() => {
    if (!token) {
      setIsValidToken(false)
      setError('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validation = validateAll({ password, confirmPassword })
    setErrors(validation)
    
    if (Object.keys(validation).length > 0) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Failed to reset password. Please try again.')
      }
    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateAll = ({ password, confirmPassword }) => {
    const e = {}
    if (!password) e.password = 'Password is required'
    else if (password.length < 6) e.password = 'Password must be at least 6 characters'
    
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match'
    
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

  if (success) {
    return (
      <div className="checkout-page">
        <div className="checkout-header">
          <h1>Password Reset</h1>
        </div>
        <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', gridTemplateColumns: 'unset' }}>
          <div className="checkout-form" style={{ maxWidth: '450px', width: '100%', margin: '0 15px', textAlign: 'center' }}>
            <div style={{ padding: '40px 20px' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                backgroundColor: '#d1fae5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px'
              }}>
                <span style={{ fontSize: '30px' }}>✓</span>
              </div>
              <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Password Reset Successfully!</h2>
              <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px', lineHeight: '1.5' }}>
                Your password has been changed. You can now log in with your new password.
              </p>
              <Link 
                to="/login" 
                className="submit-btn" 
                style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 30px' }}
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      
      {/* Header Section */}
      <div className="checkout-header">
        <h1>Reset Password</h1>
      </div>

      {/* Container: Centered specifically for Reset Password */}
      <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', gridTemplateColumns: 'unset' }}>
        
        {/* Form Card */}
        <form className="checkout-form" onSubmit={handleSubmit} style={{ maxWidth: '450px', width: '100%', margin: '0 15px' }}>
          
          <div className="form-section" style={{ marginBottom: 0 }}>
            <h2 style={{ borderBottom: 'none', fontSize: '20px', marginBottom: '20px' }}>Create New Password</h2>
            
            <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px', lineHeight: '1.5' }}>
              Enter a new password for your account.
            </p>
            
            {/* Invalid Token Error */}
            {!isValidToken && (
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

            {/* Global Error Message */}
            {error && isValidToken && (
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

            {/* Password Input */}
            {isValidToken && (
              <>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => { 
                      setPassword(e.target.value); 
                      clearFieldError('password'); 
                      setError(''); 
                    }} 
                    className={errors.password ? 'error' : ''}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  {errors.password && <div className="error-message">{errors.password}</div>}
                </div>

                {/* Confirm Password Input */}
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => { 
                      setConfirmPassword(e.target.value); 
                      clearFieldError('confirmPassword'); 
                      setError(''); 
                    }} 
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                </div>

                {/* Submit Button */}
                <button 
                  className="submit-btn" 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}

            {/* Back to Login */}
            <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: '#666' }}>
              <Link to="/login" style={{ color: '#8b7d6b', fontWeight: 600, textDecoration: 'none' }}>
                Back to Login
              </Link>
            </div>

          </div>
        </form>
      </div>
    </div>
  )
}

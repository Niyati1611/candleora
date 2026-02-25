// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import './Checkout.css'

// export default function Login() {
//   const navigate = useNavigate()
//   const { login } = useAuth()
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [error, setError] = useState('')
//   const [errors, setErrors] = useState({})

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     const validation = validateAll({ email, password })
//     setErrors(validation)
//     if (Object.keys(validation).length) return

//     try {

      // Try backend auth if available
      // const res = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // })

      // if (res.ok) {
      //   const data = await res.json()
      //   login(data.user || { email }, data.token || null)
      //   navigate('/')
      //   return
      // }
      // if (res.status === 404) {
      //   setError('Email not registered')
      //   return
      // }
      // if (res.status === 401) {
      //   setError('Incorrect password')
      //   return
      // }

      // try to read backend message
      // try {
      //   const body = await res.json()
      //   if (body && body.message) {
      //     setError(body.message)
      //     return
      //   }
      // } catch (e) {

        // ignore
      // }

      // Fallback: create a secure random token and local session
    //   
    
      // network error: fallback to secure token
  //     const fallbackToken = generateSecureToken()
  //     login({ name: email.split('@')[0], email }, fallbackToken)
  //     navigate('/')
  //   }
  // }

//   const validateAll = ({ email, password }) => {
//     const e = {}
//     if (!email || email.trim() === '') e.email = 'Email is required'
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email must be a valid email address'

//     if (!password) e.password = 'Password is required'
//     return e
//   }

//   const clearFieldError = (field) => {
//     if (!errors[field]) return
//     setErrors((prev) => {
//       const copy = { ...prev }
//       delete copy[field]
//       return copy
//     })
//   }

//   const generateSecureToken = () => {
//     try {
//       const arr = new Uint8Array(32)
//       window.crypto.getRandomValues(arr)
//       return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('')
//     } catch (e) {
//       return 'local-token-' + Date.now()
//     }
//   }

//   return (
//     <div className="checkout-page">    
//       <div className="checkout-container" style={{ maxWidth: 480 }}>
//          <h2>Login</h2>
//         <form className="checkout-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Email</label>
//             <input value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }} />
//             {errors.email && <div className="error-message">{errors.email}</div>}
//           </div>
//           <div className="form-group">
//             <label>Password</label>
//             <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError('password') }} />
//             {errors.password && <div className="error-message">{errors.password}</div>}
//           </div>
//           {error && <div className="error-message">{error}</div>}
//           <button className="submit-btn" type="submit">Login</button>
//           <button type="button" className="continue-btn" onClick={() => navigate('/register')}>Create account</button>
//         </form>
//       </div>
//     </div>
//   )
// }

import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Checkout.css' // Ye wahi CSS hai jo tumne diya tha

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const validation = validateAll({ email, password })
    setErrors(validation)
    
    if (Object.keys(validation).length > 0) {
      setIsLoading(false)
      return
    }

    try {
      // API Call
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        const data = await res.json()
        login(data.user || { email }, data.token || null)
        navigate('/')
        return
      }

      // Error Handling
      if (res.status === 404) {
        setError('Email is not registered.')
      } else if (res.status === 401) {
        setError('Incorrect password.')
      } else {
        try {
          const body = await res.json()
          setError(body.message || 'Login failed')
        } catch (err) {
          setError('Something went wrong.')
        }
      }

    } catch (err) {
      // Fallback: Network error par local session create karein
      console.log("Network error, using fallback login")
      const fallbackToken = generateSecureToken()
      login({ name: email.split('@')[0], email }, fallbackToken)
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  const validateAll = ({ email, password }) => {
    const e = {}
    if (!email || email.trim() === '') e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format'

    if (!password) e.password = 'Password is required'
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

  const generateSecureToken = () => {
    try {
      const arr = new Uint8Array(32)
      window.crypto.getRandomValues(arr)
      return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('')
    } catch (e) {
      return 'local-token-' + Date.now()
    }
  }

  return (
    <div className="checkout-page">
      
      {/* Header Section */}
      <div className="checkout-header">
        <h1>Welcome Back</h1>
      </div>

      {/* Container: Centered specifically for Login */}
      <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', gridTemplateColumns: 'unset' }}>
        
        {/* Login Form Card */}
        <form className="checkout-form" onSubmit={handleSubmit} style={{ maxWidth: '450px', width: '100%', margin: '0 15px' }}>
          
          <div className="form-section" style={{ marginBottom: 0 }}>
            <h2 style={{ borderBottom: 'none', fontSize: '20px', marginBottom: '30px' }}>Sign in to your account</h2>
            
            {/* Global Error Message */}
            {error && (
              <div style={{ 
                backgroundColor: '#fce7f3', 
                color: '#be185d', 
                padding: '12px', 
                borderRadius: '12px', 
                marginBottom: '20px', 
                fontSize: '13px',
                border: '2px solid #f9a8d4'
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
                  setError(''); // Clear global error on type
                }} 
                className={errors.email ? 'error' : ''}
                placeholder="name@example.com"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {/* Password Input */}
            <div className="form-group">
              <label>Password</label>
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
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            {/* Forgot Password Link (UX Improvement) */}
            <div style={{ textAlign: 'right', marginBottom: '25px' }}>
              <button 
                type="button" 
                onClick={() => navigate('/forgot-password')} // Assume route exists
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#7a5980', 
                  fontSize: '13px', 
                  cursor: 'pointer', 
                  textDecoration: 'underline',
                  fontWeight: 500
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button 
              className="submit-btn" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Login'}
            </button>

            {/* Divider */}
            <div style={{ textAlign: 'center', margin: '25px 0', position: 'relative' }}>
              <span style={{ background: 'white', padding: '0 10px', color: '#999', fontSize: '12px' }}>OR</span>
            </div>

            {/* Create Account Button */}
            <button 
              type="button" 
              className="home-btn" 
              style={{ width: '100%', display: 'block', textAlign: 'center' }}
              onClick={() => navigate('/register')}
            >
              Create New Account
            </button>

          </div>
        </form>
      </div>
    </div>
  )
}
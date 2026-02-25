// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'
// import './Checkout.css'

// export default function Register() {
//   const navigate = useNavigate()
//   const { register } = useAuth()
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirm, setConfirm] = useState('')
//   const [error, setError] = useState('')
//   const [errors, setErrors] = useState({})

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError('')
//     const validation = validateAll({ name, email, password, confirm })
//     setErrors(validation)
//     if (Object.keys(validation).length) return

//     try {
//       const res = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password })
//       })

//       const data = await res.json()

//       if (!res.ok) {
//         // 👇 Backend error show karse (e.g. Email already registered)
//         setError(data.message || 'This Email is already registered')
//         return
//       }

//       register(data.user, data.token)
//       navigate('/')

//     } catch (err) {
//       setError('Something went wrong. Please try again.')
//     }
//   }

//   const validateAll = ({ name, email, password, confirm }) => {
//     const e = {}
//     if (!name || name.trim() === '') e.name = 'Name is required'
//     else if (name.trim().length < 3) e.name = 'Name must be at least 3 characters'

//     if (!email || email.trim() === '') e.email = 'Email is required'
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email must be a valid email address'

//     if (!password) e.password = 'Password is required'
//     else {
//       const pwErrors = []
//       if (password.length < 8) pwErrors.push('minimum 8 characters')
//       if (!/[A-Z]/.test(password)) pwErrors.push('1 uppercase letter')
//       if (!/[a-z]/.test(password)) pwErrors.push('1 lowercase letter')
//       if (!/[0-9]/.test(password)) pwErrors.push('1 number')
//       if (pwErrors.length) e.password = `Password must contain: ${pwErrors.join(', ')}`
//     }

//     if (!confirm) e.confirm = 'Confirm Password is required'
//     else if (password && confirm !== password) e.confirm = 'Confirm Password must match Password'

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

//   return (
//     <div className="checkout-page">
//       <div className="checkout-container" style={{ maxWidth: 600 }}>
//         <h2>Create Account</h2>
//         <form className="checkout-form" onSubmit={handleSubmit}>
//           <div className="form-group">
//             <label>Name</label>
//             <input
//               value={name}
//               onChange={(e) => {
//                 setName(e.target.value)
//                 clearFieldError('name')
//               }}
//             />
//             {errors.name && <div className="error-message">{errors.name}</div>}
//           </div>

//           <div className="form-group">
//             <label>Email</label>
//             <input
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value)
//                 clearFieldError('email')
//               }}
//             />
//             {errors.email && <div className="error-message">{errors.email}</div>}
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value)
//                 clearFieldError('password')
//               }}
//             />
//             {errors.password && <div className="error-message">{errors.password}</div>}
//           </div>

//           <div className="form-group">
//             <label>Confirm Password</label>
//             <input
//               type="password"
//               value={confirm}
//               onChange={(e) => {
//                 setConfirm(e.target.value)
//                 clearFieldError('confirm')
//               }}
//             />
//             {errors.confirm && <div className="error-message">{errors.confirm}</div>}
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button className="submit-btn" type="submit">
//             Create Account
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }



import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Checkout.css'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear specific field error when typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    // Clear global error
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    const validationErrors = validateAll(formData)
    setErrors(validationErrors)
    
    if (Object.keys(validationErrors).length > 0) return

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.')
        setIsLoading(false)
        return
      }

      register(data.user, data.token)
      navigate('/')

    } catch (err) {
      setError('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateAll = ({ name, email, password, confirm }) => {
    const e = {}
    
    // Name Validation
    if (!name || name.trim() === '') e.name = 'Full Name is required'
    else if (name.trim().length < 3) e.name = 'Name must be at least 3 characters'

    // Email Validation
    if (!email || email.trim() === '') e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format'

    // Password Validation
    if (!password) {
      e.password = 'Password is required'
    } else {
      const requirements = []
      if (password.length < 8) requirements.push('8+ chars')
      if (!/[A-Z]/.test(password)) requirements.push('1 uppercase')
      if (!/[0-9]/.test(password)) requirements.push('1 number')
      
      if (requirements.length > 0) {
        e.password = `Password must have: ${requirements.join(', ')}`
      }
    }

    // Confirm Password
    if (!confirm) e.confirm = 'Please confirm your password'
    else if (password !== confirm) e.confirm = 'Passwords do not match'

    return e
  }

  return (
    <div className="checkout-page">
      
      {/* Header */}
      <div className="checkout-header">
        <h1>Create Account</h1>
      </div>

      {/* Centered Container */}
      <div className="checkout-container" style={{ display: 'flex', justifyContent: 'center', gridTemplateColumns: 'unset' }}>
        
        <form className="checkout-form" onSubmit={handleSubmit} style={{ maxWidth: '480px', width: '100%', margin: '0 15px' }}>
          
          <div className="form-section" style={{ marginBottom: 0, paddingBottom: '0' }}>
            <h2 style={{ borderBottom: 'none', marginBottom: '30px', fontSize: '20px' }}>Join our community</h2>

            {/* Global Error Message Box */}
            {error && (
              <div style={{ 
                backgroundColor: '#fef3c7', 
                color: '#d97706', 
                padding: '12px', 
                borderRadius: '4px', 
                marginBottom: '20px', 
                fontSize: '13px',
                border: '1px solid #fcd34d',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            {/* Name Field */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="John Doe"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="name@example.com"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                name="confirm"
                type="password"
                value={formData.confirm}
                onChange={handleChange}
                className={errors.confirm ? 'error' : ''}
                placeholder="••••••••"
              />
              {errors.confirm && <div className="error-message">{errors.confirm}</div>}
            </div>

            {/* Submit Button */}
            <button 
              className="submit-btn" 
              type="submit" 
              disabled={isLoading}
              style={{ marginTop: '10px' }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div style={{ textAlign: 'center', margin: '25px 0', position: 'relative' }}>
              <span style={{ background: 'white', padding: '0 10px', color: '#999', fontSize: '12px' }}>OR</span>
            </div>

            {/* Login Link */}
            <div style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
              Already have an account?{' '}
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
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendPasswordResetEmail, sendPasswordResetConfirmation } from '../services/emailService.js'

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password required' })

    const existing = await User.getByEmail(email)
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const id = await User.create(name, email, password)
    const user = await User.getById(id)

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({ message: 'User registered', user: { id: user.id, name: user.name, email: user.email }, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

    const user = await User.getByEmail(email)
    if (!user) return res.status(404).json({ error: 'Email not registered' })

    const ok = await User.verifyPassword(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'Incorrect password' })

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const me = async (req, res) => {
  try {
    const user = await User.getById(req.user.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const listUsers = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 10;

    const result = await User.listPaginated(page, limit);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Forgot Password - Send reset link to email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    
    if (!email) return res.status(400).json({ error: 'Email is required' })
    
    const user = await User.getByEmail(email)
    
    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' })
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    
    // Set expiration to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    
    // Save token to database
    await User.createResetToken(user.id, resetToken, expiresAt)
    
    // Send reset email
    const emailResult = await sendPasswordResetEmail(user.email, resetToken, user.name)
    
    if (!emailResult.success) {
      console.error('Failed to send password reset email:', emailResult.message)
    }
    
    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' })
  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ error: 'An error occurred. Please try again later.' })
  }
}

// Reset Password - Using the token from email
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' })
    }
    
    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }
    
    // Find valid token
    const resetToken = await User.getResetToken(token)
    
    if (!resetToken) {
      return res.status(400).json({ error: 'Invalid or expired reset token' })
    }
    
    // Get user
    const user = await User.getById(resetToken.user_id)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    // Update password
    await User.updatePassword(user.id, newPassword)
    
    // Delete used token
    await User.deleteResetToken(token)
    
    // Send confirmation email
    await sendPasswordResetConfirmation(user.email, user.name)
    
    res.json({ message: 'Password has been reset successfully' })
  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ error: 'An error occurred. Please try again later.' })
  }
}

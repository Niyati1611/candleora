import User from '../models/User.js'

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const profile = await User.getFullProfileById(userId)
    
    if (!profile) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(profile)
  } catch (error) {
    console.error('❌ Error in getProfile:', error)
    res.status(500).json({ error: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id
    const { name, shipping_address, profile_photo } = req.body
    
    const updatedProfile = await User.updateProfile(userId, {
      name,
      shipping_address,
      profile_photo
    })
    
    res.json(updatedProfile)
  } catch (error) {
    console.error('❌ Error in updateProfile:', error)
    res.status(500).json({ error: error.message })
  }
}

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id
    const orders = await User.getOrdersByUser(userId)
    res.json(orders)
  } catch (error) {
    console.error('❌ Error in getUserOrders:', error)
    res.status(500).json({ error: error.message })
  }
}

import Wishlist from '../models/Wishlist.js'

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const wishlist = await Wishlist.getByUser(userId)
    res.json(wishlist)
  } catch (error) {
    console.error('❌ Error in getWishlist:', error)
    res.status(500).json({ error: error.message })
  }
}

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id } = req.body
    
    if (!product_id) {
      return res.status(400).json({ error: 'Product ID is required' })
    }
    
    await Wishlist.add(userId, product_id)
    res.json({ message: 'Added to wishlist', product_id })
  } catch (error) {
    console.error('❌ Error in addToWishlist:', error)
    res.status(500).json({ error: error.message })
  }
}

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id } = req.params
    
    const success = await Wishlist.remove(userId, product_id)
    
    if (!success) {
      return res.status(404).json({ error: 'Item not found in wishlist' })
    }
    
    res.json({ message: 'Removed from wishlist' })
  } catch (error) {
    console.error('❌ Error in removeFromWishlist:', error)
    res.status(500).json({ error: error.message })
  }
}

export const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const { product_id } = req.params
    
    const isInWishlist = await Wishlist.check(userId, product_id)
    res.json({ isInWishlist })
  } catch (error) {
    console.error('❌ Error in checkWishlist:', error)
    res.status(500).json({ error: error.message })
  }
}

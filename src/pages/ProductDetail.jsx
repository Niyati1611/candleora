import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ProductDetail.css'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [filters, setFilters] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use api.js which handles image URL conversion
        const productData = await api.getProductById(id)
        
        const filtersRes = await fetch(`http://localhost:5000/api/filters`)
        const filtersData = await filtersRes.json()
        
        if (productData.error) {
          console.error('Product error:', productData.error)
        } else {
          setProduct(productData)
          // Check if product is in wishlist
          if (user) {
            try {
              const wishlistRes = await api.checkWishlist(productData.id)
              setIsInWishlist(wishlistRes.inWishlist || false)
            } catch (e) {
              console.log('Could not check wishlist')
            }
          }
        }
        setFilters(filtersData.filters || [])

        // Use api.js which handles image URL conversion
        const allProductsData = await api.getProducts()
        setRelatedProducts(allProductsData || [])
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  const getFilterDisplayValue = (filterKey, value) => {
    const filter = filters.find(f => f.key === filterKey)
    if (!filter || !filter.values) return null
    const filterValue = filter.values.find(v => v.value === value)
    return filterValue ? { filterName: filter.name, valueName: filterValue.value } : null
  }

  const getFilterDisplayInfo = () => {
    if (!product || !product.filter_selections) return []
    try {
      const selections = typeof product.filter_selections === 'string' 
        ? JSON.parse(product.filter_selections) 
        : product.filter_selections
      if (!selections) return []
      
      return Object.entries(selections).map(([filterKey, value]) => {
        const result = getFilterDisplayValue(filterKey, value)
        return result || { filterName: filterKey.charAt(0).toUpperCase() + filterKey.slice(1), valueName: value }
      })
    } catch (e) {
      console.error('Error parsing filter_selections:', e)
      return []
    }
  }

  const filterDisplayInfo = getFilterDisplayInfo()

  const handleAddToCart = () => {
    addToCart(product, quantity)
    alert(`Added ${quantity} "${product.name}" to cart!`)
    setQuantity(1)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/checkout')
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      alert('Please login to add items to your wishlist')
      navigate('/login')
      return
    }
    
    setWishlistLoading(true)
    try {
      if (isInWishlist) {
        await api.removeFromWishlist(product.id)
        setIsInWishlist(false)
        alert('Removed from wishlist!')
      } else {
        await api.addToWishlist(product.id)
        setIsInWishlist(true)
        alert('Added to wishlist!')
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      alert('Failed to update wishlist')
    } finally {
      setWishlistLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="product-detail">
        <div className="product-not-found">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="product-detail">
        <div className="product-not-found">
          <p>Product not found</p>
          <button onClick={() => navigate('/shop')}>Back to Shop</button>
        </div>
      </div>
    )
  }

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <a href="/" onClick={() => navigate('/')}>Home</a>
        <span> / </span>
        <a href="/shop" onClick={() => navigate('/shop')}>Shop</a>
        <span> / </span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Left - Image */}
        <div className="product-detail-image">
          <div className="image-wrapper">
            <div className="product-large-image">
              {product.image_url ? <img src={product.image_url} alt={product.name} style={{maxWidth: '100%'}} /> : 'No Image'}
            </div>
          </div>
        </div>

        {/* Right - Details */}
        <div className="product-detail-info">
          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-price">₹{product.price}</div>

          <p className="detail-description">{product.description}</p>

          {/* Product Specifications - Dynamic Filter Selections */}
          <div className="detail-specs">
            {filterDisplayInfo.length > 0 ? (
              filterDisplayInfo.map((item, index) => (
                <div className="spec-item" key={index}>
                  <span className="spec-label">{item.filterName}:</span>
                  <span className="spec-value">{item.valueName}</span>
                </div>
              ))
            ) : (
              <>
                <div className="spec-item">
                  <span className="spec-label">Category:</span>
                  <span className="spec-value">{product.category || 'N/A'}</span>
                </div>
              </>
            )}
          </div>

          {/* Add to Cart */}
          <div className="add-to-cart-section">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            <button className="add-to-cart-large" onClick={handleAddToCart}>
              🛒 Add to Cart
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
            <button 
              className={`wishlist-btn ${isInWishlist ? 'in-wishlist' : ''}`}
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {isInWishlist ? '❤️' : '🤍'} {wishlistLoading ? '...' : (isInWishlist ? 'In Wishlist' : 'Add to Wishlist')}
            </button>
          </div>

          {/* Additional Info */}
          <div className="detail-additional">
            {product.weight && (
              <div className="info-box">
                <span className="info-label">Weight:</span>
                <span className="info-value">{product.weight}</span>
              </div>
            )}
            {product.burningTime && (
              <div className="info-box">
                <span className="info-label">Burning Time:</span>
                <span className="info-value">{product.burningTime}</span>
              </div>
            )}
          </div>

          {/* Ingredients */}
          {product.ingredients && (
            <div className="detail-section">
              <h3>Ingredients</h3>
              <p>{product.ingredients}</p>
            </div>
          )}
        </div>
      </div>

      {/* Dimensions Section */}
      {product.dimensions && (
        <div className="product-detail-full">
          <div className="dimensions-section">
            <h2>Dimensions</h2>
            <p>{product.dimensions}</p>
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="related-products">
        <h2>You May Also Like</h2>
        <div className="related-grid">
          {relatedProducts
            .filter(p => p.id !== product.id && p.category === product.category)
            .slice(0, 3)
            .map(relatedProduct => (
              <div
                key={relatedProduct.id}
                className="related-item"
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
              >
                <div className="related-image">🕯️</div>
                <h4>{relatedProduct.name}</h4>
                <p>₹{relatedProduct.price}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

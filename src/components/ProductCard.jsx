import React, { useState } from 'react'
import './ProductCard.css'

export default function ProductCard({ 
  product,
  onAddToCart,
  onQuickView,
  showNewBadge = false,
  showDiscount = false
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  // Handle multiple images
  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
      ? [product.image_url] 
      : ['🕯️']
  
  const handleMouseEnter = () => {
    if (images.length > 1) {
      setIsHovered(true)
      setCurrentImageIndex(1)
    }
  }
  
  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(0)
  }
  
  // Calculate discount percentage
  const hasDiscount = product.discount_price && product.discount_price < product.price
  const discountPercent = hasDiscount 
    ? Math.round((1 - product.discount_price / product.price) * 100) 
    : 0
  
  return (
    <div className="product-card">
      {/* New Badge */}
      {showNewBadge && (
        <div className="product-badge">New</div>
      )}
      
      {/* Discount Badge */}
      {hasDiscount && showDiscount && (
        <div className="discount-badge">-{discountPercent}%</div>
      )}
      
      {/* Product Image with Hover Effect */}
      <div 
        className="product-image-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="product-image">
          {typeof images[currentImageIndex] === 'string' && images[currentImageIndex].startsWith('http') ? (
            <img 
              src={images[currentImageIndex]} 
              alt={product.name}
              loading="lazy"
            />
          ) : (
            images[currentImageIndex]
          )}
        </div>
        
        {/* Quick View Overlay */}
        <div className="product-overlay">
          <button 
            className="quick-view-btn"
            onClick={() => onQuickView && onQuickView(product)}
          >
            Quick View
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-price-container">
          {hasDiscount ? (
            <>
              <span className="original-price">${parseFloat(product.price).toFixed(2)}</span>
              <span className="discount-price">${parseFloat(product.discount_price).toFixed(2)}</span>
            </>
          ) : (
            <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button 
          className="add-to-cart-btn"
          onClick={() => onAddToCart && onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}

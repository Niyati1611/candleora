import React, { useState, useEffect } from 'react'
import './NewArrivals.css'
import ProductCard from './ProductCard'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

export default function NewArrivals() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [countdown, setCountdown] = useState(null)
  const { addToCart } = useCart()
  const navigate = useNavigate()
  
  const productsToShow = 5 // Show 5-6 products in carousel

  useEffect(() => {
    fetchNewArrivals()
  }, [])

  const fetchNewArrivals = async () => {
    try {
      setLoading(true)
      // Try to get products marked as new arrivals first
      let data = await api.getNewArrivals()
      
      // If no marked products, get recently added (auto-detect)
      if (!data || data.length === 0) {
        data = await api.getRecentlyAdded(30) // Last 30 days
      }
      
      if (data && data.length > 0) {
        setProducts(data)
        // Set up countdown if there's an expiration date
        if (data[0].new_arrival_expires_at) {
          setupCountdown(data[0].new_arrival_expires_at)
        }
      }
    } catch (err) {
      setError(err.message)
      console.error('Failed to fetch new arrivals:', err)
    } finally {
      setLoading(false)
    }
  }

  const setupCountdown = (expiresAt) => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt) - new Date()
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      }
      return null
    }
    setCountdown(calculateTimeLeft())
    
    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft())
    }, 1000)
    
    return () => clearInterval(timer)
  }

  const handleNext = () => {
    setCurrentIndex(prev => 
      prev + productsToShow >= products.length ? 0 : prev + 1
    )
  }

  const handlePrev = () => {
    setCurrentIndex(prev => 
      prev - productsToShow < 0 
        ? Math.max(0, products.length - productsToShow) 
        : prev - productsToShow
    )
  }

  const handleAddToCart = (product) => {
    // Image URL is already converted to absolute by api.js
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image: product.image_url || '🕯️'
    }, 1)
    alert(`Added "${product.name}" to cart!`)
  }

  const handleQuickView = (product) => {
    navigate(`/product/${product.id}`)
  }

  const handleViewAll = () => {
    navigate('/shop')
  }

  if (loading) {
    return (
      <section className="new-arrivals-section">
        <div className="container">
          <p className="loading-text">Loading new arrivals...</p>
        </div>
      </section>
    )
  }

  if (error || products.length === 0) {
    return null // Don't show section if no products
  }

  const visibleProducts = products.slice(currentIndex, currentIndex + productsToShow)

  return (
    <section className="new-arrivals-section">
      <div className="container">
        {/* Section Header */}
        <div className="new-arrivals-header">
          <div className="header-left">
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">Check out our latest candle collections</p>
          </div>
          <button className="view-all-btn" onClick={handleViewAll}>
            View All
          </button>
        </div>

        {/* Countdown Timer */}
        {countdown && (
          <div className="countdown-timer">
            <span className="countdown-label">Limited Offer Ends In:</span>
            <div className="countdown-values">
              <div className="countdown-item">
                <span className="countdown-number">{countdown.days}</span>
                <span className="countdown-unit">Days</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.hours}</span>
                <span className="countdown-unit">Hours</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.minutes}</span>
                <span className="countdown-unit">Min</span>
              </div>
              <div className="countdown-item">
                <span className="countdown-number">{countdown.seconds}</span>
                <span className="countdown-unit">Sec</span>
              </div>
            </div>
          </div>
        )}

        {/* Carousel */}
        <div className="new-arrivals-carousel">
          <button className="carousel-nav prev" onClick={handlePrev}>
            ‹
          </button>
          
          <div className="carousel-products">
            {visibleProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onQuickView={handleQuickView}
                showNewBadge={product.is_new_arrival}
                showDiscount={true}
              />
            ))}
          </div>
          
          <button className="carousel-nav next" onClick={handleNext}>
            ›
          </button>
        </div>

        {/* Mobile View All */}
        <div className="mobile-view-all">
          <button className="view-all-btn-mobile" onClick={handleViewAll}>
            View All New Arrivals
          </button>
        </div>
      </div>
    </section>
  )
}

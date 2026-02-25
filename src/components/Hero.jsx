import React from 'react'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <div className="hero-image-box">
            <div className="hero-image">
              <span className="image-icon">🕯️</span>
            </div>
          </div>
        </div>
        
        <div className="hero-right">
          <h2 className="hero-subtitle">Also shop our</h2>
          <h1 className="hero-title">WILD ONE</h1>
          <p className="hero-description">
            This beautiful home fragrance captures the essence of nature's wildest spaces with notes of amber and cedarwood.
          </p>
          <button className="hero-btn">SHOP NOW</button>
        </div>
      </div>
    </section>
  )
}

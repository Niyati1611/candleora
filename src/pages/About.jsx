import React from 'react'
import { useNavigate } from 'react-router-dom'
import './About.css'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="about">
      <section className="about-header">
        <h1>About Candle.ora</h1>
        <p>Crafting moments of tranquility and elegance since 2020</p>
      </section>

      <section className="about-story">
        <div className="story-container">
          <div className="story-image">
            <span className="story-icon">🕯️</span>
          </div>
          <div className="story-content">
            <h2>Our Story</h2>
            <p>
              Candle.ora was born from a simple belief: that the right ambiance can transform any space. 
              Founded in 2020, we started with a passion for creating premium, hand-crafted candles using 
              only the finest natural ingredients.
            </p>
            <p>
              Each candle is carefully formulated with sustainable soy wax and premium fragrance oils, 
              ensuring a clean burn and an unforgettable scent experience. Our commitment to quality 
              extends beyond the product—it's woven into every aspect of our business.
            </p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">♻️</div>
            <h3>Sustainability</h3>
            <p>
              We're committed to environmental responsibility. Our candles use eco-friendly materials 
              and recyclable packaging.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">✨</div>
            <h3>Quality</h3>
            <p>
              Every candle is crafted with meticulous attention to detail, using premium ingredients 
              sourced responsibly.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">❤️</div>
            <h3>Mindfulness</h3>
            <p>
              We believe in creating spaces for calm and reflection, helping you find peace in your 
              daily rituals.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🌿</div>
            <h3>Authenticity</h3>
            <p>
              We stay true to our craft, never compromising on quality for the sake of profit. 
              Authenticity is at our core.
            </p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Meet Our Founder</h2>
        <div className="founder-card">
          <div className="founder-image">👩‍💼</div>
          <div className="founder-info">
            <h3>Sarah Mitchell</h3>
            <p className="founder-title">Founder & Creative Director</p>
            <p>
              With a background in aromatherapy and sustainable design, Sarah founded Candle.ora 
              to bring the therapeutic benefits of quality fragrances to homes everywhere. Her vision 
              is to create a community that celebrates mindfulness, sustainability, and the simple joy 
              of a beautiful-smelling home.
            </p>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="stat-item">
          <h3>5M+</h3>
          <p>Customers Worldwide</p>
        </div>
        <div className="stat-item">
          <h3>100%</h3>
          <p>Natural Ingredients</p>
        </div>
        <div className="stat-item">
          <h3>50+</h3>
          <p>Unique Fragrances</p>
        </div>
        <div className="stat-item">
          <h3>4.8★</h3>
          <p>Average Rating</p>
        </div>
      </section>

      <section className="about-cta">
        <h2>Ready to Transform Your Space?</h2>
        <p>Discover our collection of premium candles crafted with care and passion.</p>
        <button className="cta-button" onClick={() => navigate('/shop')}>
          Explore Our Collection
        </button>
      </section>
    </div>
  )
}

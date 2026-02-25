import React from 'react'
import { useNavigate } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>SHOP</h4>
          <ul>
            <li><a href="/shop" onClick={() => navigate('/shop')}>Candles</a></li>
            <li><a href="#diffusers">Diffusers</a></li>
            <li><a href="#bestsellers">Bestsellers</a></li>
            <li><a href="#new">New Arrivals</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>ABOUT</h4>
          <ul>
            <li><a href="/about" onClick={() => navigate('/about')}>About Us</a></li>
            <li><a href="#sustainability">Sustainability</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#press">Press</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>CUSTOMER CARE</h4>
          <ul>
            <li><a href="/contact" onClick={() => navigate('/contact')}>Contact Us</a></li>
            <li><a href="#returns">Returns</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>FOLLOW</h4>
          <div className="social-links">
            <a href="#facebook" title="Facebook">f</a>
            <a href="#instagram" title="Instagram">📷</a>
            <a href="#twitter" title="Twitter">𝕏</a>
            <a href="#pinterest" title="Pinterest">P</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

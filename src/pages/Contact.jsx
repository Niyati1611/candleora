import React, { useState } from 'react'
import './Contact.css'
import { api } from '../services/api'

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    // enforce numeric-only for phone
    if (name === 'phone') {
      const cleaned = value.replace(/[^0-9]/g, '')
      setFormData(prev => ({ ...prev, [name]: cleaned }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // validate
    const errs = {}
    if (!formData.fullName || !formData.fullName.trim()) errs.fullName = 'Full name is required'
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Valid email is required'
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) errs.phone = 'Phone must be 10-15 digits'
    if (!formData.message || !formData.message.trim()) errs.message = 'Message is required'

    setErrors(errs)
    if (Object.keys(errs).length) {
      setSubmitStatus('error')
      return
    }

    setSubmitStatus('pending')
    api.submitContact({ fullName: formData.fullName.trim(), email: formData.email.trim(), phone: formData.phone.trim(), message: formData.message.trim() })
      .then(() => {
        setSubmitStatus('success')
        setFormData({ fullName: '', email: '', phone: '', message: '' })
        setTimeout(() => setSubmitStatus(null), 4000)
      })
      .catch((err) => {
        setSubmitStatus('error')
        setErrors({ form: err.message })
      })
  }

  return (
    <div className="contact">
      <section className="contact-header">
        <h1>Get In Touch</h1>
        <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      </section>

      <section className="contact-container">
        <div className="contact-info">
          <h2>Contact Information</h2>

          <div className="info-item">
            <h3>📍 Address</h3>
            <p>
              Candle.ora Headquarters<br />
              123 Artisan Lane<br />
              Creative City, ST 12345<br />
              United States
            </p>
          </div>

          <div className="info-item">
            <h3>📞 Phone</h3>
            <p>
              <a href="tel:+1234567890">(123) 456-7890</a><br />
              Monday - Friday, 9am - 6pm EST
            </p>
          </div>

          <div className="info-item">
            <h3>✉️ Email</h3>
            <p>
              <a href="mailto:hello@candleora.com">hello@candleora.com</a><br />
              We typically respond within 24 hours
            </p>
          </div>

          <div className="info-item">
            <h3>🕒 Business Hours</h3>
            <p>
              Monday - Friday: 9:00 AM - 6:00 PM EST<br />
              Saturday: 10:00 AM - 4:00 PM EST<br />
              Sunday: Closed
            </p>
          </div>

          <div className="social-connect">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#facebook" title="Facebook">f</a>
              <a href="#instagram" title="Instagram">📷</a>
              <a href="#twitter" title="Twitter">𝕏</a>
              <a href="#pinterest" title="Pinterest">P</a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send Us a Message</h2>

          {submitStatus === 'success' && (
            <div className="form-message success">
              ✓ Thank you! We've received your message and will get back to you soon.
            </div>
          )}

          {submitStatus === 'pending' && (
            <div className="form-message pending">Sending…</div>
          )}

          {submitStatus === 'error' && errors.form && (
            <div className="form-message error">× {errors.form}</div>
          )}

          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.fullName && <div className="field-error">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Digits only, 10-15 chars"
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              placeholder="Tell us what's on your mind..."
            />
            {errors.message && <div className="field-error">{errors.message}</div>}
          </div>

          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </section>

      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>What is your return policy?</h3>
            <p>
              We offer a 30-day money-back guarantee on all our candles. If you're not completely 
              satisfied, simply return your unused candle for a full refund.
            </p>
          </div>

          <div className="faq-item">
            <h3>Do you ship internationally?</h3>
            <p>
              Yes! We currently ship to over 50 countries worldwide. Shipping costs and times vary 
              by location. Contact us for more information about international orders.
            </p>
          </div>

          <div className="faq-item">
            <h3>Are your candles eco-friendly?</h3>
            <p>
              Absolutely! All our candles are made with 100% natural soy wax, sustainable packaging, 
              and eco-friendly materials. We're committed to protecting the environment.
            </p>
          </div>

          <div className="faq-item">
            <h3>How long do candles last?</h3>
            <p>
              Most of our candles burn for 35-50 hours depending on the size and how often you use them. 
              Proper candle care, such as trimming the wick, can extend their lifespan.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

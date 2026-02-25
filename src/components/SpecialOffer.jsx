import React, { useState } from 'react'
import './SpecialOffer.css'

export default function SpecialOffer() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Thank you for subscribing with: ${email}`)
    setEmail('')
  }

  // return (
  //   // <section className="special-offer">
  //   //   <div className="offer-content">
  //   //     <h2 className="offer-title">SPECIAL OFFER</h2>
  //   //     <p className="offer-description">
  //   //       Join our exclusive community and get 10% off your first order
  //   //     </p>
        
  //   //     <form className="offer-form" onSubmit={handleSubmit}>
  //   //       <input
  //   //         type="email"
  //   //         placeholder="Enter your email"
  //   //         value={email}
  //   //         onChange={(e) => setEmail(e.target.value)}
  //   //         required
  //   //       />
  //   //       <button type="submit" className="offer-btn">SUBSCRIBE</button>
  //   //     </form>
  //   //   </div>
  //   // </section>
  // )
}

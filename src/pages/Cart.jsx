import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Cart.css'

export default function Cart() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCart()
  const { user } = useAuth()   // 👈 Login user check

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <a href="/shop" className="back-link" onClick={() => navigate('/shop')}>← Continue Shopping</a>
      </div>

      <div className="cart-container">
        {cartItems.length > 0 ? (
          <>
            <div className="cart-items-section">
              <h2>Items in Cart ({getTotalItems()})</h2>
              <div className="cart-items">
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">{item.image}</div>
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p className="item-meta">
                        <span>{item.fragrance}</span> • <span>{item.size}</span>
                      </p>
                      <p className="item-price">${item.price}</p>
                    </div>
                    <div className="item-quantity">
                      <label htmlFor={`qty-${item.id}`}>Qty:</label>
                      <div className="quantity-control">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input
                          id={`qty-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-subtotal">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <aside className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-content">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                </div>

                {/* 👇 Login check added here */}
                <button
                  className="checkout-btn"
                  onClick={() => {
                    if (!user) {
                      navigate('/login')
                    } else {
                      navigate('/checkout')
                    }
                  }}
                >
                  Proceed to Checkout
                </button>

                <button
                  className="continue-shopping-btn"
                  onClick={() => navigate('/shop')}
                >
                  Continue Shopping
                </button>
              </div>
            </aside>
          </>
        ) : (
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some beautiful candles to get started!</p>
            <button
              className="shop-btn"
              onClick={() => navigate('/shop')}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


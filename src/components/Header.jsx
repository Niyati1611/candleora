import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const [siteTitle, setSiteTitle] = useState("candle");
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    api
      .getSettings()
      .then((data) => {
        if (!mounted) return;
        if (data && data.site_title) setSiteTitle(data.site_title);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch wishlist count when user is logged in
  useEffect(() => {
    if (user) {
      api.getWishlist().then(data => {
        setWishlistCount(data.length || 0);
      }).catch(() => {
        setWishlistCount(0);
      });
    } else {
      setWishlistCount(0);
    }
  }, [user]);

  const handleNavClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsCategoryOpen(false);
  };

  const cartCount = getTotalItems();

  return (
    <header className="header">
      <nav className="navbar">
        {/* Centered logo */}
        <div className="logo" onClick={() => handleNavClick("/")}>
          <h1>{siteTitle}</h1>
        </div>

        {/* Navigation menu */}
        <ul className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          {/* Home link added here */}
          <li>
            <a href="/" onClick={() => handleNavClick("/")}>
              HOME
            </a>
          </li>

          <li
            className="dropdown"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <span
              className="dropbtn"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && setIsCategoryOpen(!isCategoryOpen)
              }
            >
              SHOP BY CATEGORY ▼
            </span>
            {isCategoryOpen && (
              <ul className="dropdown-content">
                <li>
                  <a
                    href="/category1"
                    onClick={() => handleNavClick("/category1")}
                  >
                    Category 1
                  </a>
                </li>
                <li>
                  <a
                    href="/category2"
                    onClick={() => handleNavClick("/category2")}
                  >
                    Category 2
                  </a>
                </li>
                <li>
                  <a
                    href="/category3"
                    onClick={() => handleNavClick("/category3")}
                  >
                    Category 3
                  </a>
                </li>
              </ul>
            )}
          </li>
          <li>
            <a href="/shop" onClick={() => handleNavClick("/shop")}>
              SHOP ALL
            </a>
          </li>

          {/* About Us link added here */}
          <li>
            <a href="/about" onClick={() => handleNavClick("/about")}>
              ABOUT US
            </a>
          </li>

          <li>
            <a href="/contact" onClick={() => handleNavClick("/contact")}>
              CONTACT US
            </a>
          </li>
        </ul>

        {/* Right icons */}
        <div className="nav-right">
          {/* Wishlist Button */}
          <button
            className="nav-icon wishlist-icon"
            onClick={() => handleNavClick("/profile?tab=wishlist")}
            title="My Wishlist"
            style={{ position: 'relative' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            {wishlistCount > 0 && (
              <span className="cart-badge" style={{ background: '#e74c3c' }}>
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            className="nav-icon cart-icon"
            onClick={() => handleNavClick("/cart")}
            title="View Cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {user ? (
            <button
              className="nav-icon user-icon"
              title="Profile"
              onClick={() => handleNavClick("/profile")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          ) : (
            <button
              className="nav-icon user-icon"
              onClick={() => handleNavClick("/login")}
              title="Login / Register"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          )}
        </div>

        {/* Hamburger menu for mobile */}
        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </nav>
    </header>
  );
}

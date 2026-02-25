import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Shop.css'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Shop() {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [openDropdown, setOpenDropdown] = useState(null)
  const [productsData, setProductsData] = useState([])
  const [filtersData, setFiltersData] = useState([])
  const [selectedFilters, setSelectedFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [totalProductCount, setTotalProductCount] = useState([])
  const [wishlistProducts, setWishlistProducts] = useState([])

  // Fetch products from backend
  useEffect(() => {
    fetchProducts()
    fetchFilters()
    fetchWishlist()
  }, [])

  const fetchProducts = async () => {
    try {
      const products = await api.getProducts()
      setProductsData(products)
      setTotalProductCount(products.length)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const res = await api.getFilters()
      const filters = Array.isArray(res.filters) ? res.filters : []
      setFiltersData(filters)
      // Initialize selected filters for each filter key
      const initialSelected = {}
      filters.forEach(f => {
        initialSelected[f.key] = 'all'
      })
      setSelectedFilters(initialSelected)
    } catch (err) {
      console.error('Error fetching filters:', err)
    }
  }

  const fetchWishlist = async () => {
    if (user) {
      try {
        const wishlist = await api.getWishlist()
        setWishlistProducts(wishlist.map(item => item.product_id))
      } catch (err) {
        setWishlistProducts([])
      }
    }
  }

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      alert('Please login to add items to your wishlist')
      navigate('/login')
      return
    }
    
    try {
      if (wishlistProducts.includes(productId)) {
        await api.removeFromWishlist(productId)
        setWishlistProducts(prev => prev.filter(id => id !== productId))
        alert('Removed from wishlist!')
      } else {
        await api.addToWishlist(productId)
        setWishlistProducts(prev => [...prev, productId])
        alert('Added to wishlist!')
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      alert('Failed to update wishlist')
    }
  }

  // Transform backend products to match frontend format
  const transformedProducts = productsData.map(p => {
    // Parse filter_selections JSON if it exists and is not null
    let filterSelections = {};
    try {
      if (p.filter_selections && p.filter_selections !== null) {
        const parsed = typeof p.filter_selections === 'string' 
          ? JSON.parse(p.filter_selections) 
          : p.filter_selections;
        filterSelections = parsed || {};
      }
    } catch (e) {
      console.error('Error parsing filter_selections:', e);
      filterSelections = {};
    }

    return {
      id: p.id,
      name: p.name,
      price: parseFloat(p.price) || 0,
      image: '🕯️',
      fragrance: p.category || 'General',
      description: p.description || '',
      size: filterSelections?.size || 'medium',
      type: filterSelections?.type || 'jar',
      // Store parsed filter_selections for filtering
      filterSelections,
      // Store all filter values from product data
      ...p
    };
  })

  // Get filter options from backend filters
  const getFilterOptions = (filterKey) => {
    const f = filtersData.find(x => x.key === filterKey)
    if (f && Array.isArray(f.values) && f.values.length > 0) {
      return ['all', ...f.values.map(v => v.value)]
    }
    return ['all']
  }

  // Handle filter selection change
  const handleFilterChange = (filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }))
  }

  // Get all enabled filter keys from backend
  const enabledFilters = filtersData.filter(f => f.enabled)

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return transformedProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.fragrance && product.fragrance.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // Check all enabled filters
      const matchesFilters = enabledFilters.every(filter => {
        const selectedValue = selectedFilters[filter.key]
        if (selectedValue === 'all') return true
        
        // Get the product value for this filter key from filterSelections
        const productValue = product.filterSelections?.[filter.key] || ''
        return productValue === selectedValue
      })

      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesFilters && matchesPrice
    })
  }, [searchTerm, selectedFilters, priceRange, transformedProducts, enabledFilters])

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('')
    setPriceRange([0, 100])
    setOpenDropdown(null)
    const reset = {}
    enabledFilters.forEach(f => {
      reset[f.key] = 'all'
    })
    setSelectedFilters(reset)
  }

  return (
    <div className="shop">
      {/* Search Bar */}
      <div className="shop-header">
        <h1>Shop Our Candles</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search candles by name or fragrance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="shop-container">
        {/* Filters Sidebar with Dropdowns */}
        <aside className="filters-sidebar">
          <h2>Filters</h2>

          {/* Dynamic Filters from Backend */}
          {enabledFilters.map(filter => (
            <div className="filter-group" key={filter.id}>
              <button
                className="filter-toggle"
                onClick={() => setOpenDropdown(openDropdown === filter.key ? null : filter.key)}
              >
                <span>{filter.name}</span>
                <span className={`toggle-icon ${openDropdown === filter.key ? 'open' : ''}`}>▼</span>
              </button>
              {openDropdown === filter.key && (
                <div className="filter-options">
                  {getFilterOptions(filter.key).map(option => (
                    <label key={option} className="filter-option">
                      <input
                        type="radio"
                        name={filter.key}
                        value={option}
                        checked={selectedFilters[filter.key] === option}
                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                      />
                      <span className="filter-label">{option === 'all' ? 'All' : option.charAt(0).toUpperCase() + option.slice(1)}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Price Filter (always available) */}
          <div className="filter-group">
            <button
              className="filter-toggle"
              onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
            >
              <span>Price Range</span>
              <span className={`toggle-icon ${openDropdown === 'price' ? 'open' : ''}`}>▼</span>
            </button>
            {openDropdown === 'price' && (
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="price-slider"
                />
                <div className="price-display">
                  ${priceRange[0]} - ${priceRange[1]}
                </div>
              </div>
            )}
          </div>

          {/* Reset Filters */}
          <button
            className="reset-filters"
            onClick={resetFilters}
          >
            Reset Filters
          </button>
        </aside>

        {/* Products Grid */}
        <main className="products-section">
          <div className="products-header">
            <div className="products-count">
              Total Products: <strong>{totalProductCount}</strong>
              {filteredProducts.length !== totalProductCount && (
                <span> | Showing: {filteredProducts.length}</span>
              )}
            </div>
            {loading && <p className="loading-text">Loading products...</p>}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-item">
                  <div className="product-image-container">
                    <div className="product-image">{product.image}</div>
                    {/* Wishlist Button */}
                    <button
                      className={`wishlist-btn ${wishlistProducts.includes(product.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToWishlist(product.id)
                      }}
                      title={wishlistProducts.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        fontSize: '18px',
                        zIndex: 5
                      }}
                    >
                      {wishlistProducts.includes(product.id) ? '❤️' : '🤍'}
                    </button>
                    <div className="product-overlay">
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
<div className="product-details">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="product-info-row">
                      {/* Show all filter selections dynamically */}
                      {product.filterSelections && Object.keys(product.filterSelections).length > 0 ? (
                        Object.entries(product.filterSelections).map(([key, value], idx) => (
                          <span key={idx} className="product-fragrance" style={{ textTransform: 'capitalize' }}>
                            {value}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="product-fragrance">{product.fragrance}</span>
                          <span className="product-size">{product.size}</span>
                        </>
                      )}
                    </div>
                    <p className="product-short-desc">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">${product.price}</span>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => {
                          addToCart(product, 1)
                          alert(`Added "${product.name}" to cart!`)
                        }}
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

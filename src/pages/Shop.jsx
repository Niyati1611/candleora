import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Shop.css'
import { api } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const SHOP_STATE_KEY = 'shop_page_state'

const getSavedShopState = () => {
  try {
    const raw = localStorage.getItem(SHOP_STATE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch (e) {
    return {}
  }
}

export default function Shop() {
  const savedState = getSavedShopState()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState(savedState.searchTerm || '')
  const [productsData, setProductsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalProductCount, setTotalProductCount] = useState([])
  const [wishlistProducts, setWishlistProducts] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('')
  const [cartMessage, setCartMessage] = useState('')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  
  // Read category from URL query and fetch products when it changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
      setCategoryFilter(category);
    } else {
      setCategoryFilter('');
    }
  }, [window.location.search]);

  // Fetch products when categoryFilter changes
  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(
    Number.isInteger(savedState.currentPage) && savedState.currentPage > 0 ? savedState.currentPage : 1
  )
  const itemsPerPage = 12

  // Filter states
  const [filters, setFilters] = useState([])
  const [selectedFilters, setSelectedFilters] = useState(
    savedState.selectedFilters && typeof savedState.selectedFilters === 'object' ? savedState.selectedFilters : {}
  )
  const [openFilters, setOpenFilters] = useState({})

  // Fetch products and filters from backend
  useEffect(() => {
    fetchProducts()
    fetchFilters()
  }, [])

  useEffect(() => {
    fetchWishlist()
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem(
        SHOP_STATE_KEY,
        JSON.stringify({
          searchTerm,
          selectedFilters,
          currentPage,
        })
      )
    } catch (e) {
      // ignore storage write errors
    }
  }, [searchTerm, selectedFilters, currentPage])

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedFilters])

  useEffect(() => {
    if (!isMobileFiltersOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileFiltersOpen])

  const fetchProducts = async () => {
    try {
      const products = await api.getProducts()
      let filtered = products;
      if (categoryFilter) {
        filtered = products.filter(p => p.category === categoryFilter || p.name === categoryFilter);
      }
      setProductsData(filtered)
      setTotalProductCount(filtered.length)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching products:', error)
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const filtersData = await api.getFilters()
      if (filtersData && filtersData.filters) {
        setFilters(filtersData.filters)
      }
    } catch (error) {
      console.error('Error fetching filters:', error)
    }
  }

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistProducts([])
      return
    }
    try {
      const wishlist = await api.getWishlist()
      setWishlistProducts(wishlist.map(item => item.product_id))
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    }
  }

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      navigate('/login')
      return
    }
    try {
      if (wishlistProducts.includes(productId)) {
        await api.removeFromWishlist(productId)
        setWishlistProducts(prev => prev.filter(id => id !== productId))
      } else {
        await api.addToWishlist(productId)
        setWishlistProducts(prev => [...prev, productId])
      }
    } catch (error) {
      console.error('Wishlist error:', error)
    }
  }

  // Toggle filter dropdown
  const toggleFilter = (filterId) => {
    setOpenFilters(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }))
  }

  // Handle filter checkbox change
  const handleFilterChange = (filterId, value) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[filterId] || []
      if (currentFilters.includes(value)) {
        return {
          ...prev,
          [filterId]: currentFilters.filter(v => v !== value)
        }
      } else {
        return {
          ...prev,
          [filterId]: [...currentFilters, value]
        }
      }
    })
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedFilters({})
    setSearchTerm('')
    setCurrentPage(1)
  }

  // Transform backend products to match frontend format
  const transformedProducts = productsData.map(p => {
    let filterSelections = p.filter_selections
    if (typeof p.filter_selections === 'string') {
      try {
        filterSelections = JSON.parse(p.filter_selections)
      } catch (e) {
        filterSelections = {}
      }
    }
    
    return {
      id: p.id,
      name: p.name,
      price: parseFloat(p.price) || 0,
      image: p.image_url || '🕯️',
      fragrance: p.category || 'General',
      description: p.description || '',
      filterSelections: filterSelections || {}
    }
  })

  // Filter and search products with filter selections
  const filteredProducts = useMemo(() => {
    return transformedProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (product.fragrance && product.fragrance.toLowerCase().includes(searchTerm.toLowerCase()))
      
      let matchesFilters = true
      if (Object.keys(selectedFilters).length > 0) {
        for (const [filterId, selectedValues] of Object.entries(selectedFilters)) {
          if (selectedValues.length > 0) {
            const filter = filters.find(f => f.id === parseInt(filterId))
            if (filter) {
              const productFilterValue = product.filterSelections[filter.key]
              const hasMatch = selectedValues.some(val => 
                productFilterValue && productFilterValue.toLowerCase() === val.toLowerCase()
              )
              if (!hasMatch) {
                matchesFilters = false
                break
              }
            }
          }
        }
      }
      
      return matchesSearch && matchesFilters
    })
  }, [searchTerm, transformedProducts, selectedFilters, filters])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Previous button
    pages.push(
      <button 
        key="prev" 
        className="pagination-btn"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {'< Prev'}
      </button>
    )

    // First page
    if (startPage > 1) {
      pages.push(
        <button key={1} className="pagination-btn" onClick={() => goToPage(1)}>1</button>
      )
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>)
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => goToPage(i)}
        >
          {i}
        </button>
      )
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>)
      }
      pages.push(
        <button key={totalPages} className="pagination-btn" onClick={() => goToPage(totalPages)}>
          {totalPages}
        </button>
      )
    }

    // Next button
    pages.push(
      <button 
        key="next" 
        className="pagination-btn"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {'Next >'}
      </button>
    )

    return (
      <div className="pagination">
        {pages}
      </div>
    )
  }

  return (
    <div className="shop">
      {/* Search Bar */}
      <div className="shop-header">
        <h1>Shop Our Candles</h1>
        {cartMessage && (
          <div className="cart-success-message">
            {cartMessage}
          </div>
        )}
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
        <button
          type="button"
          className="mobile-filter-btn"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          Filter Products
        </button>
      </div>

      <div className="shop-container">
        {isMobileFiltersOpen && (
          <div
            className="filters-overlay"
            onClick={() => setIsMobileFiltersOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* Filters Sidebar */}
        <aside className={`filters-sidebar ${isMobileFiltersOpen ? 'active' : ''}`}>
          <div className="filters-header">
            <h2>Filters</h2>
            <button
              type="button"
              className="filters-close-btn"
              onClick={() => setIsMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              x
            </button>
          </div>
          
          {filters && filters.length > 0 ? (
            filters.map(filter => (
              <div key={filter.id} className="filter-group">
                <button
                  className="filter-toggle"
                  onClick={() => toggleFilter(filter.id)}
                >
                  {filter.name}
                  <span className={`toggle-icon ${openFilters[filter.id] ? 'open' : ''}`}>▼</span>
                </button>
                {openFilters[filter.id] && filter.values && filter.values.length > 0 && (
                  <div className="filter-options">
                    {filter.values.map(value => (
                      <label key={value.id} className="filter-option">
                        <input
                          type="checkbox"
                          checked={selectedFilters[filter.id]?.includes(value.value) || false}
                          onChange={() => handleFilterChange(filter.id, value.value)}
                        />
                        <span className="filter-label">{value.value}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ fontSize: '13px', color: '#888', textAlign: 'center', padding: '20px 0' }}>
              No filters available
            </p>
          )}
          
          <button className="reset-filters" onClick={resetFilters}>
            Reset All Filters
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
            <>
              <div className="products-grid">
                {currentProducts.map(product => (
                  <div 
                    key={product.id} 
                    className="product-item"
                  >
                    <div
                      className="product-image-container"
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="product-image">{product.image}</div>
                      )}
                      <button
                        type="button"
                        className={`wishlist-btn ${wishlistProducts.includes(product.id) ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddToWishlist(product.id)
                        }}
                        aria-label={wishlistProducts.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      >
                        {wishlistProducts.includes(product.id) ? '❤' : '♡'}
                      </button>
                    </div>
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-footer">
                        <span className="product-price">₹{product.price}</span>
                        <button
                          className="add-to-cart-btn"
                          onClick={() => {
                            addToCart(product, 1)
                            setCartMessage(`Added "${product.name}" to cart!`)
                            setTimeout(() => setCartMessage(''), 3000)
                          }}
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {renderPagination()}
            </>
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



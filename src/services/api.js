// src/services/api.js
const API_BASE = 'http://localhost:5000/api';
const BACKEND_ORIGIN = 'http://localhost:5000';

// Helper function to convert relative image URLs to absolute URLs
const convertProductImages = (product) => {
  if (!product) return product;
  
  // Clone the product to avoid mutating the original
  const converted = { ...product };
  
  // Convert image_url if it exists and is a relative path
  if (converted.image_url && typeof converted.image_url === 'string' && converted.image_url.startsWith('/')) {
    converted.image_url = BACKEND_ORIGIN + converted.image_url;
  }
  
  // Convert images array if it exists
  if (converted.images) {
    try {
      let imagesArray;
      if (typeof converted.images === 'string') {
        imagesArray = JSON.parse(converted.images);
      } else if (Array.isArray(converted.images)) {
        imagesArray = converted.images;
      }
      
      if (Array.isArray(imagesArray)) {
        converted.images = imagesArray.map(img => {
          if (img && typeof img === 'string' && img.startsWith('/')) {
            return BACKEND_ORIGIN + img;
          }
          return img;
        });
      }
    } catch (e) {
      // Keep original if parsing fails
    }
  }
  
  return converted;
};

// Helper function to convert array of products
const convertProductsArray = (products) => {
  if (!Array.isArray(products)) return products;
  return products.map(convertProductImages);
};

export const api = {
  // Products
  getProducts: async () => {
    const res = await fetch(`${API_BASE}/products`);
    const products = await res.json();
    return convertProductsArray(products);
  },

  getProductById: async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    const product = await res.json();
    return convertProductImages(product);
  },

  getProductsByCategory: async (category) => {
    const res = await fetch(`${API_BASE}/products/category/${category}`);
    const products = await res.json();
    return convertProductsArray(products);
  },

  // New Arrivals
  getNewArrivals: async () => {
    const res = await fetch(`${API_BASE}/products/new-arrivals`);
    const products = await res.json();
    return convertProductsArray(products);
  },

  getRecentlyAdded: async (days = 30) => {
    const res = await fetch(`${API_BASE}/products/recent?days=${days}`);
    const products = await res.json();
    return convertProductsArray(products);
  },

  // Orders
  createOrder: async (orderData) => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to create order');
    }
    return res.json();
  },

  getOrders: async () => {
    const res = await fetch(`${API_BASE}/orders`);
    return res.json();
  },

  getOrderById: async (id) => {
    const res = await fetch(`${API_BASE}/orders/${id}`);
    if (!res.ok) throw new Error('Order not found');
    return res.json();
  },

  // Banner images (for homepage slider)
  getBanner: async () => {
    const res = await fetch(`${API_BASE}/banner`);
    if (!res.ok) throw new Error('Failed to fetch banner');
    const data = await res.json();
    // Ensure image URLs are absolute (point to backend origin)
    const backendOrigin = new URL(API_BASE).origin; // e.g. http://localhost:5000
    if (data && Array.isArray(data.images)) {
      data.images = data.images.map(img => {
        const url = img.image_url || img.url || '';
        if (url && url.startsWith('/')) img.image_url = backendOrigin + url;
        return img;
      });
    }
    return data;
  },

  // Contact
  submitContact: async ({ fullName, email, phone, message }) => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, phone, message })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to submit contact');
    }
    return res.json();
  },

  getContacts: async (token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/contact`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch contacts');
    }
    return res.json();
  },

  deleteContact: async (id, token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/contact/${id}`, { method: 'DELETE', headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete contact');
    }
    return res.json();
  },

  // Admin Auth
  adminLogin: async (username, password) => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Login failed');
    }
    return res.json();
  },
  // Site settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  updateSettings: async (payload) => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update settings');
    }
    return res.json();
  },

  uploadLogo: async (file) => {
    throw new Error('Logo uploads are not supported');
  }
  ,

// Filters
  getFilters: async () => {
    const res = await fetch(`${API_BASE}/filters`);
    if (!res.ok) throw new Error('Failed to fetch filters');
    return res.json();
  },

  // Filter Admin Methods
  createFilter: async (filterData, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/filters`, {
      method: 'POST',
      headers,
      body: JSON.stringify(filterData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create filter');
    }
    return res.json();
  },

  updateFilter: async (id, filterData, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/filters/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(filterData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update filter');
    }
    return res.json();
  },

  deleteFilter: async (id, token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/filters/${id}`, { method: 'DELETE', headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete filter');
    }
    return res.json();
  },

  createFilterValue: async (filterId, valueData, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/filters/${filterId}/values`, {
      method: 'POST',
      headers,
      body: JSON.stringify(valueData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create filter value');
    }
    return res.json();
  },

  updateFilterValue: async (filterId, valueId, valueData, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/filters/${filterId}/values/${valueId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(valueData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update filter value');
    }
    return res.json();
  },

  deleteFilterValue: async (filterId, valueId, token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API_BASE}/filters/${filterId}/values/${valueId}`, { method: 'DELETE', headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete filter value');
    }
    return res.json();
  },

  // User Profile
  getProfile: async () => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}/user/profile`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch profile');
    }
    return res.json();
  },

  updateProfile: async (userData) => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}/user/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update profile');
    }
    return res.json();
  },

  getUserOrders: async () => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}/user/orders`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch orders');
    }
    return res.json();
  },

  // Wishlist
  getWishlist: async () => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}/wishlist`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch wishlist');
    }
    const wishlist = await res.json();
    // Convert wishlist item image URLs to absolute
    if (Array.isArray(wishlist)) {
      return wishlist.map(item => {
        if (item.image_url && typeof item.image_url === 'string' && item.image_url.startsWith('/')) {
          return { ...item, image_url: BACKEND_ORIGIN + item.image_url };
        }
        return item;
      });
    }
    return wishlist;
  },

  addToWishlist: async (productId) => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ product_id: productId })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to add to wishlist');
    }
    return res.json();
  },

  removeFromWishlist: async (productId) => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}/wishlist/${productId}`, { 
      method: 'DELETE',
      headers 
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to remove from wishlist');
    }
    return res.json();
  },

  checkWishlist: async (productId) => {
    const stored = (() => { try { return localStorage.getItem('auth') } catch(e){return null} })()
    const token = stored ? JSON.parse(stored).token : null
    const headers = {}
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const res = await fetch(`${API_BASE}/wishlist/check/${productId}`, { headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to check wishlist');
    }
    return res.json();
  },
};

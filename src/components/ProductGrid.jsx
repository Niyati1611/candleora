import React, { useState, useEffect } from 'react'
import './ProductGrid.css'
import ProductCard from './ProductCard'
import { api } from '../services/api'

export default function ProductGrid() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await api.getProducts()
        const formattedProducts = data.map(p => ({
          id: p.id,
          title: p.name,
          price: `$${parseFloat(p.price).toFixed(2)}`,
          image: '🕯️'
        }))
        setProducts(formattedProducts)
      } catch (err) {
        setError(err.message)
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) return <section className="product-grid-section"><p>Loading products...</p></section>
  if (error) return <section className="product-grid-section"><p>Error: {error}</p></section>

  // return (
  //   <section className="product-grid-section">
  //     <div className="product-grid-header">
  //       <h2>Bloom & Rudy's Newest Collection</h2>
  //       <p>Handcrafted candles and home fragrances made with natural ingredients</p>
  //     </div>
      
  //     <div className="product-grid">
  //       {products.map(product => (
  //         <ProductCard
  //           key={product.id}
  //           title={product.title}
  //           price={product.price}
  //           image={product.image}
  //         />
  //       ))}
  //     </div>
  //   </section>
  // )
}

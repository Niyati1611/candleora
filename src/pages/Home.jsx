import React from 'react'
import Slideshow from '../components/Slideshow'
import CategoriesSection from '../components/CategoriesSection'
import NewArrivals from '../components/NewArrivals'
import ProductGrid from '../components/ProductGrid'
import SpecialOffer from '../components/SpecialOffer'
import './Home.css'

export default function Home() {
  return (
    <div className="home">
      <Slideshow />
      <NewArrivals />
      <CategoriesSection />
      <ProductGrid />
      <SpecialOffer />
    </div>
  )
}

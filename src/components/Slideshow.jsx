import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Slideshow.css'

// Images
import img1 from '../assets/img1.jpg'
import img2 from '../assets/img2.jpg'
import img3 from '../assets/img3.jpg'

export default function Slideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const [slides, setSlides] = useState([
    {
      id: 1,
      title: 'WILD ONE',
      subtitle: "Discover Nature's Essence",
      description:
        "This beautiful home fragrance captures the essence of nature's wildest spaces with notes of amber and cedarwood.",
      image: img1
    },
    {
      id: 2,
      title: 'LAVENDER DREAMS',
      subtitle: 'Serenity & Relaxation',
      description:
        'Soothing lavender scent perfect for creating a peaceful sanctuary in your home.',
      image: img2
    },
    {
      id: 3,
      title: 'VANILLA BLISS',
      subtitle: 'Warmth & Comfort',
      description:
        'Warm and cozy vanilla fragrance that brings comfort and elegance to any room.',
      image: img3
    }
  ])

  // if backend banner images exist, replace slides
  useEffect(() => {
    let cancelled = false;
    const fetchBanner = async () => {
      try {
        const { api } = await import('../services/api');
        const data = await api.getBanner();
        if (cancelled) return;
        if (data.images && data.images.length) {
          const bannerSlides = data.images.map(img => ({
            id: img.id,
            title: img.text || '',
            subtitle: '',
            description: '',
            image: img.image_url
          }));
          setSlides(bannerSlides);
        }
      } catch (e) {
        // ignore; keep static images
      }
    };

    fetchBanner();

    // refetch when page becomes visible (helps reflect admin uploads without full reload)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchBanner();
    };
    window.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      window.removeEventListener('visibilitychange', onVisibility);
    };
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length)

  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const goToSlide = (index) => setCurrentSlide(index)

  const handleShopNow = () => {
    navigate('/shop')
  }

  return (
    <section className="slideshow-container">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="slide-content">
            <div className="slide-text">
              <h2 className="slide-subtitle">{slide.subtitle}</h2>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-description">{slide.description}</p>
              <button className="shop-now-btn" onClick={handleShopNow}>
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Arrows */}
      <button className="slide-arrow prev-arrow" onClick={prevSlide}>
        ❮
      </button>
      <button className="slide-arrow next-arrow" onClick={nextSlide}>
        ❯
      </button>

      {/* Dots */}
      <div className="slide-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}

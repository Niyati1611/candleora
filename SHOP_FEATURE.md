# Shop Feature Documentation

## Overview
Complete e-commerce shop system for Bloom & Rudy candles with product listing, filtering, search, and detailed product pages.

## Features Implemented

### 1. **Product Listing Page** (`/shop`)
- Display all candles in a responsive grid
- 8 different candle products with varied attributes
- Each product shows:
  - Product image (emoji representation)
  - Product name
  - Fragrance type
  - Size
  - Short description
  - Price
  - Add to Cart button
  - View Details button

### 2. **Advanced Filtering System**
Filter products by:
- **Candle Type**: jar, pillar, votive, tea light, decorative
- **Size**: small, medium, large
- **Fragrance**: lavender, vanilla, rose, ocean, unscented, cinnamon, peppermint
- **Price Range**: $0-$100 with slider control
- **Reset Filters**: Button to clear all filters and search

### 3. **Search Functionality**
- Real-time search by product name
- Search by fragrance type
- Search results update instantly
- Shows product count

### 4. **Product Detail Page** (`/product/:id`)
Comprehensive product information:
- Large product image
- Product title and rating
- Detailed specifications:
  - Color
  - Size
  - Type
  - Fragrance
- Full description
- Dimensions
- Weight
- Burning time
- Ingredients list
- Quantity selector with +/- buttons
- Add to Cart button
- Buy Now button
- Related products recommendations

### 5. **Navigation & Routing**
- React Router setup for seamless page transitions
- Navigation between Home (/), Shop (/shop), and Product Details (/product/:id)
- Breadcrumb navigation on product detail pages
- Header with Shop link

### 6. **Responsive Design**
- **Desktop (1024px+)**: Full 3-column product grid, sidebar filters
- **Tablet (768px-1023px)**: 2-column product grid, sticky sidebar
- **Mobile (480px-767px)**: 2-column grid, mobile-optimized filters
- **Small Mobile (<480px)**: Single column layout, simplified interface

## File Structure

```
src/
├── pages/
│   ├── Home.jsx                 # Home page component
│   ├── Home.css                 # Home page styles
│   ├── Shop.jsx                 # Shop listing page
│   ├── Shop.css                 # Shop page styles
│   ├── ProductDetail.jsx        # Product detail page
│   ├── ProductDetail.css        # Product detail styles
│
├── data/
│   └── productsData.js          # Product database with 8 candles
│
├── components/
│   ├── Header.jsx               # Navigation header with routing
│   ├── Hero.jsx                 # Home hero section
│   ├── ProductGrid.jsx          # Home product showcase
│   ├── SpecialOffer.jsx         # Promotional banner
│   ├── Footer.jsx               # Footer component
│   └── [CSS files]              # Component styles
│
└── App.jsx                      # Main app with React Router
```

## Product Database Schema

Each product contains:
```javascript
{
  id: number,
  name: string,
  category: string,
  type: string,
  size: string,
  price: number,
  image: emoji,
  color: string,
  fragrance: string,
  description: string,
  dimensions: string,
  weight: string,
  burningTime: string,
  ingredients: string,
}
```

## Current Candle Products

1. **Lavender Dreams** - $34.99 (Medium Jar, 35-40hrs)
2. **Vanilla Bliss** - $45.99 (Large Jar, 50-55hrs)
3. **Rose Garden** - $29.99 (Medium Pillar, 30-35hrs)
4. **Ocean Breeze** - $16.99 (Small Votive, 12-15hrs)
5. **Unscented Pure** - $22.99 (Medium Jar, 35-40hrs)
6. **Honey Cinnamon** - $48.99 (Large Jar, 50-55hrs)
7. **Charcoal Tea Light** - $12.99 (Small Tea Light, 6-8hrs)
8. **Peppermint Festive** - $18.99 (Small Votive, 14-18hrs)

## How to Use

### View All Products
1. Click "Shop" in the header navigation
2. Browse all products in the grid
3. Products display with image, name, fragrance, size, and price

### Filter Products
1. Use the filters sidebar on the left
2. Select filter options (type, size, fragrance, price)
3. Products update in real-time
4. Click "Reset Filters" to clear all selections

### Search Products
1. Use the search bar at the top of the shop page
2. Type product name or fragrance type
3. Results update instantly as you type
4. Shows count of matching products

### View Product Details
1. Click "View Details" button on any product card
2. Or hover over product and click the overlay button
3. View full product information:
   - Complete description
   - Specifications (color, size, type, fragrance)
   - Dimensions, weight, burning time
   - Ingredients list
4. Add quantity and add to cart

### Navigation
- Click "Home" to return to homepage
- Click "Shop" to go back to product listing
- Use breadcrumbs on product detail page
- Search results are clickable

## Styling Features

- **Color Scheme**: Warm earth tones (cream, taupe, brown)
- **Typography**: Elegant serif for brand, clean sans-serif for content
- **Responsive**: Mobile-first approach with breakpoints at 768px and 480px
- **Interactive**: Hover effects, smooth transitions, visual feedback
- **Accessibility**: Proper contrast, readable fonts, clear navigation

## Future Enhancements

- Shopping cart persistence (localStorage or backend)
- User accounts and order history
- Payment integration
- Wishlist functionality
- Advanced search filters
- Product recommendations engine
- Promotional codes
- Email notifications

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Notes

- Optimized filtering with useMemo
- Lazy loading ready for future image optimization
- CSS Grid for efficient layouts
- Minimal re-renders with React hooks
